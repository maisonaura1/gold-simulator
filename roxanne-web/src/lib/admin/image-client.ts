/**
 * Browser-side photo preparation for Dashboard → Photos: phones produce huge
 * images, so they are resized to at most 2000 px on the long edge and encoded
 * as WebP (quality 0.85) — or JPEG where the browser can't encode WebP —
 * before being uploaded.
 */

export const MAX_EDGE = 2000
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export interface PreparedImage {
  blob: Blob
  width: number
  height: number
  type: 'image/webp' | 'image/jpeg'
}

type Source = ImageBitmap | HTMLImageElement

async function decode(file: Blob): Promise<{ source: Source; release: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      // Applies the EXIF orientation of phone photos.
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return { source: bitmap, release: () => bitmap.close() }
    } catch {
      // Fall back to <img> decoding below (e.g. older Safari).
    }
  }
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.decoding = 'async'
  img.src = url
  try {
    await img.decode()
  } catch {
    URL.revokeObjectURL(url)
    throw new Error('This file couldn’t be opened as a picture. Please choose a JPG, PNG or WebP photo.')
  }
  return { source: img, release: () => URL.revokeObjectURL(url) }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

async function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  const webp = await toBlob(canvas, 'image/webp', quality)
  if (webp && webp.type === 'image/webp') return webp
  // JPEG has no transparency: paint the page colour behind the photo first.
  const flat = document.createElement('canvas')
  flat.width = canvas.width
  flat.height = canvas.height
  const ctx = flat.getContext('2d')
  if (!ctx) throw new Error('Your browser couldn’t prepare this photo.')
  ctx.fillStyle = '#faf6f0'
  ctx.fillRect(0, 0, flat.width, flat.height)
  ctx.drawImage(canvas, 0, 0)
  const jpeg = await toBlob(flat, 'image/jpeg', quality)
  if (!jpeg) throw new Error('Your browser couldn’t prepare this photo.')
  return jpeg
}

export async function prepareImage(file: Blob): Promise<PreparedImage> {
  const { source, release } = await decode(file)
  try {
    const sourceWidth = source instanceof HTMLImageElement ? source.naturalWidth : source.width
    const sourceHeight = source instanceof HTMLImageElement ? source.naturalHeight : source.height
    if (!sourceWidth || !sourceHeight) throw new Error('This picture seems to be empty. Please choose another one.')

    const scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight))
    const width = Math.max(1, Math.round(sourceWidth * scale))
    const height = Math.max(1, Math.round(sourceHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Your browser couldn’t prepare this photo.')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(source, 0, 0, width, height)

    let blob = await encode(canvas, 0.85)
    for (const quality of [0.75, 0.6]) {
      if (blob.size <= MAX_UPLOAD_BYTES) break
      blob = await encode(canvas, quality)
    }
    if (blob.size > MAX_UPLOAD_BYTES) throw new Error('This photo is too large even after resizing. Please choose another one.')
    return { blob, width, height, type: blob.type === 'image/webp' ? 'image/webp' : 'image/jpeg' }
  } finally {
    release()
  }
}

/** Downloads a picture from a link through the dashboard (see /api/admin/photos/fetch). */
export async function fetchImageFromLink(link: string): Promise<Blob> {
  const res = await fetch(`/api/admin/photos/fetch?url=${encodeURIComponent(link)}`, { cache: 'no-store' })
  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(
      payload?.error ??
        (res.status === 401 ? 'Your session has expired — please reload the page and sign in again.' : 'That image couldn’t be downloaded.'),
    )
  }
  return res.blob()
}

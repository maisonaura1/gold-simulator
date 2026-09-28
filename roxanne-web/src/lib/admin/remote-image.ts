import 'server-only'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { sniffImageType } from '@/lib/data'

/**
 * Downloads an image from a link pasted in Dashboard → Photos so it can be
 * resized in the browser and stored like an upload (the site's security
 * policy doesn't load photos from other websites). Only public https hosts
 * are contacted — never the server's own network.
 */

const MAX_REMOTE_BYTES = 15 * 1024 * 1024
const TIMEOUT_MS = 10_000
const MAX_REDIRECTS = 3

export class RemoteImageError extends Error {}

const DOWNLOAD_FAILED =
  'We couldn’t download that image. Check the link, or save the photo on your device and use “Upload photo” instead.'

function isPrivateIPv4(ip: string): boolean {
  const [a, b] = ip.split('.').map(Number)
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  )
}

function isPrivateIPv6(ip: string): boolean {
  const value = ip.toLowerCase()
  if (value === '::' || value === '::1') return true
  const mapped = value.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return isPrivateIPv4(mapped[1])
  return (
    value.startsWith('::ffff:') || // other IPv4-mapped forms
    value.startsWith('64:ff9b:') || // NAT64
    value.startsWith('2001:db8') || // documentation
    /^f[cd]/.test(value) || // unique local fc00::/7
    /^fe[89ab]/.test(value) || // link-local fe80::/10
    value.startsWith('ff') // multicast
  )
}

async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  if (!host || host === 'localhost' || /\.(localhost|local|internal|lan|home)$/.test(host)) {
    throw new RemoteImageError('That link points to a private address.')
  }
  const version = isIP(host)
  let addresses: { address: string; family: number }[]
  try {
    addresses = version ? [{ address: host, family: version }] : await lookup(host, { all: true, verbatim: true })
  } catch {
    throw new RemoteImageError(DOWNLOAD_FAILED)
  }
  if (addresses.length === 0) throw new RemoteImageError(DOWNLOAD_FAILED)
  for (const { address, family } of addresses) {
    if (family === 4 ? isPrivateIPv4(address) : isPrivateIPv6(address)) {
      throw new RemoteImageError('That link points to a private address.')
    }
  }
}

async function readLimited(res: Response, limit: number): Promise<Buffer> {
  if (!res.body) return Buffer.alloc(0)
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > limit) {
      await reader.cancel().catch(() => {})
      throw new RemoteImageError('That image is too large (over 15 MB). Please choose a smaller one.')
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function fetchRemoteImage(link: string): Promise<{ data: Buffer; contentType: string }> {
  let url: URL
  try {
    url = new URL(link)
  } catch {
    throw new RemoteImageError('Please paste a full link starting with https://')
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (url.protocol !== 'https:') throw new RemoteImageError('Only secure links (starting with https://) can be used.')
    if (url.username || url.password || (url.port && url.port !== '443')) {
      throw new RemoteImageError('That link can’t be used. Please copy the image address again.')
    }
    await assertPublicHost(url.hostname)

    let res: Response
    try {
      res = await fetch(url, {
        redirect: 'manual',
        cache: 'no-store',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8' },
      })
    } catch {
      throw new RemoteImageError(DOWNLOAD_FAILED)
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location')
      if (!location) throw new RemoteImageError(DOWNLOAD_FAILED)
      url = new URL(location, url)
      continue
    }
    if (!res.ok) throw new RemoteImageError(`${DOWNLOAD_FAILED} (The website answered with error ${res.status}.)`)
    if (Number(res.headers.get('content-length') ?? 0) > MAX_REMOTE_BYTES) {
      throw new RemoteImageError('That image is too large (over 15 MB). Please choose a smaller one.')
    }

    const data = await readLimited(res, MAX_REMOTE_BYTES)
    const contentType = sniffImageType(data)
    if (!contentType) {
      throw new RemoteImageError(
        'That link doesn’t lead to a JPG, PNG, WebP or AVIF picture. Tip: right-click the photo and choose “Copy image address”.',
      )
    }
    return { data, contentType }
  }
  throw new RemoteImageError('That link redirects too many times.')
}

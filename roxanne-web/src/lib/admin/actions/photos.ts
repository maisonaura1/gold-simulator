'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import { PHOTO_SLOTS } from '@/content/photos'
import type { PhotoKey } from '@/content/types'
import { assertAdmin } from '@/lib/auth'
import { deleteMedia, getMediaIndex, getSettings, MAX_UPLOAD_BYTES, saveMedia, saveSettings } from '@/lib/data'
import { actionFailure, type ActionResult } from '../types'

const slotSchema = z.enum(Object.keys(PHOTO_SLOTS) as [PhotoKey, ...PhotoKey[]])
const mediaIdSchema = z.string().regex(/^[a-z0-9-]{6,64}$/)

const uploadSchema = z.object({
  slot: slotSchema,
  width: z.coerce.number().int().min(1).max(10_000),
  height: z.coerce.number().int().min(1).max(10_000),
  label: z.string().trim().max(120).catch(''),
})

async function setSlot(slot: PhotoKey, path: string | null): Promise<void> {
  const settings = await getSettings()
  const photos = { ...settings.photos }
  if (path) photos[slot] = path
  else delete photos[slot]
  await saveSettings({ ...settings, photos })
}

/** Stores a photo resized in the browser and uses it for a slot. */
export async function uploadPhoto(formData: FormData): Promise<ActionResult<{ path: string }>> {
  await assertAdmin()
  const parsed = uploadSchema.safeParse({
    slot: formData.get('slot'),
    width: formData.get('width'),
    height: formData.get('height'),
    label: formData.get('label') ?? '',
  })
  const file = formData.get('file')
  if (!parsed.success || !(file instanceof Blob)) return actionFailure('This photo couldn’t be uploaded. Please try again.')
  if (file.size === 0) return actionFailure('This file is empty. Please choose another photo.')
  if (file.size > MAX_UPLOAD_BYTES) return actionFailure('This photo is larger than 5 MB. Please choose a smaller one.')

  try {
    const { slot, width, height, label } = parsed.data
    const item = await saveMedia(Buffer.from(await file.arrayBuffer()), {
      width,
      height,
      label: label || PHOTO_SLOTS[slot].label,
    })
    await setSlot(slot, item.path)
    return { ok: true, path: item.path }
  } catch (err) {
    const message = err instanceof Error && /Unsupported file|larger than/.test(err.message) ? err.message : null
    if (!message) console.error('[dashboard] uploadPhoto failed', err)
    return actionFailure(message ?? 'This photo couldn’t be saved. Please try again.')
  }
}

export async function restoreDefaultPhoto(slot: string): Promise<ActionResult> {
  await assertAdmin()
  const parsed = slotSchema.safeParse(slot)
  if (!parsed.success) return actionFailure('Unknown photo.')
  await setSlot(parsed.data, null)
  return { ok: true }
}

/** Uses a photo from the library for a slot. */
export async function assignLibraryPhoto(slot: string, mediaId: string): Promise<ActionResult> {
  await assertAdmin()
  const parsed = z.object({ slot: slotSchema, mediaId: mediaIdSchema }).safeParse({ slot, mediaId })
  if (!parsed.success) return actionFailure('This photo can’t be used.')
  const item = (await getMediaIndex()).find((media) => media.id === parsed.data.mediaId)
  if (!item) return actionFailure('This photo is no longer in your library.')
  await setSlot(parsed.data.slot, item.path)
  return { ok: true }
}

/** Deletes an uploaded photo — refused while the website still shows it. */
export async function deleteLibraryPhoto(mediaId: string): Promise<ActionResult> {
  await assertAdmin()
  const parsed = mediaIdSchema.safeParse(mediaId)
  if (!parsed.success) return actionFailure('This photo couldn’t be deleted.')
  const [media, settings] = await Promise.all([getMediaIndex(), getSettings()])
  const item = media.find((m) => m.id === parsed.data)
  if (!item) return actionFailure('This photo was already deleted.')
  const usedBy = (Object.entries(settings.photos) as [PhotoKey, string][])
    .filter(([, path]) => path === item.path)
    .map(([key]) => PHOTO_SLOTS[key].label)
  if (usedBy.length) {
    return actionFailure(`This photo is still used on your website (${usedBy.join(', ')}). Replace it there first.`)
  }
  await deleteMedia(item.id)
  refresh()
  return { ok: true }
}

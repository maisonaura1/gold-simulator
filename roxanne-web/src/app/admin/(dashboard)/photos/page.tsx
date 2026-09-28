import type { Metadata } from 'next'
import { PhotoManager, type MediaView, type SlotView } from '@/components/admin/photos/PhotoManager'
import { PageHeader } from '@/components/admin/ui/primitives'
import { PHOTO_SLOTS, resolvePhoto } from '@/content/photos'
import type { PhotoKey } from '@/content/types'
import { requireAdmin } from '@/lib/auth'
import { getMediaIndex, getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Photos' }

/** Hosts next/image may optimize (see images.remotePatterns in next.config.ts). */
const OPTIMIZED_HOSTS = new Set(['d8j0ntlcm91z4.cloudfront.net'])

function canOptimize(src: string): boolean {
  if (src.startsWith('/')) return !src.startsWith('/media/')
  try {
    return OPTIMIZED_HOSTS.has(new URL(src).hostname)
  } catch {
    return false
  }
}

export default async function PhotosPage() {
  await requireAdmin()
  const [settings, media] = await Promise.all([getSettings(), getMediaIndex()])
  const keys = Object.keys(PHOTO_SLOTS) as PhotoKey[]

  const slots: SlotView[] = keys.map((key) => {
    const photo = resolvePhoto(key, settings.photos)
    return {
      key,
      label: PHOTO_SLOTS[key].label,
      hint: PHOTO_SLOTS[key].hint,
      photo: { ...photo, unoptimized: !canOptimize(photo.src) },
    }
  })

  const library: MediaView[] = media.map((item) => ({
    id: item.id,
    path: item.path,
    width: item.width,
    height: item.height,
    bytes: item.bytes,
    createdAt: item.createdAt,
    label: item.label,
    usedBy: keys.filter((key) => settings.photos[key] === item.path).map((key) => PHOTO_SLOTS[key].label),
  }))

  return (
    <div className="space-y-8">
      <PageHeader
        title="Photos"
        description="Replace the pictures of your website. Photos from your phone are resized automatically before they’re uploaded."
      />
      <PhotoManager slots={slots} media={library} />
    </div>
  )
}

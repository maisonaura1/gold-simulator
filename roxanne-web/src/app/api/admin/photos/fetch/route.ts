import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { fetchRemoteImage, RemoteImageError } from '@/lib/admin/remote-image'
import { isSameSiteFetch } from '@/lib/admin/request'
import { isAdmin } from '@/lib/auth'

const linkSchema = z.url({ protocol: /^https$/ }).max(2000)

/**
 * "Use an image link" in Dashboard → Photos: downloads the picture on the
 * server so the browser can resize it and store it like an upload. Nothing is
 * saved here.
 */
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isSameSiteFetch(request)) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const link = linkSchema.safeParse(request.nextUrl.searchParams.get('url') ?? '')
  if (!link.success) {
    return Response.json({ error: 'Please paste a full image link starting with https://' }, { status: 400 })
  }

  try {
    const image = await fetchRemoteImage(link.data)
    return new Response(new Uint8Array(image.data), {
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'",
      },
    })
  } catch (err) {
    const message =
      err instanceof RemoteImageError
        ? err.message
        : 'We couldn’t download that image. Please save it on your device and use “Upload photo” instead.'
    if (!(err instanceof RemoteImageError)) console.error('[dashboard] image link failed', err)
    return Response.json({ error: message }, { status: 422 })
  }
}

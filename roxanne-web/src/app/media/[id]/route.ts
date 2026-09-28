import { getStore } from '@/lib/store'

/** Serves photos uploaded from the dashboard. IDs are random and immutable, so responses cache forever. */
export async function GET(_request: Request, ctx: RouteContext<'/media/[id]'>) {
  const { id } = await ctx.params
  if (!/^[a-z0-9-]{6,64}$/.test(id)) return new Response('Not found', { status: 404 })

  const object = await getStore().getBinary(id)
  if (!object || !object.contentType.startsWith('image/') || object.contentType.includes('svg')) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(new Uint8Array(object.data), {
    headers: {
      'Content-Type': object.contentType,
      'Content-Length': String(object.data.byteLength),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
    },
  })
}

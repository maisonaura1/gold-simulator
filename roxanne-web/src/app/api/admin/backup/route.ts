import { isAdmin } from '@/lib/auth'
import { getMediaIndex, getMessages, getSettings, getTestimonials } from '@/lib/data'
import { getStore } from '@/lib/store'

/**
 * Downloads a JSON backup of everything edited in the dashboard: text changes
 * (only the edited sections), settings, testimonials, messages and the list of
 * uploaded photos. Never includes the password, session or Calendly secrets,
 * nor the image files themselves.
 */
export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const store = getStore()
  const [contentOverrides, settings, testimonials, messages, media] = await Promise.all([
    store.getJSON<Record<string, unknown>>('content'),
    getSettings(),
    getTestimonials(),
    getMessages(),
    getMediaIndex(),
  ])

  const exportedAt = new Date().toISOString()
  const backup = {
    kind: 'roxanne-web-backup',
    version: 1,
    exportedAt,
    storage: store.kind,
    contentOverrides: contentOverrides ?? {},
    settings,
    testimonials,
    messages,
    media,
  }

  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="website-backup-${exportedAt.slice(0, 10)}.json"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

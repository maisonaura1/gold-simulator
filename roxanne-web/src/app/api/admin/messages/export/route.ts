import { toCsv } from '@/lib/admin/csv'
import { sortNewestFirst } from '@/lib/admin/overview'
import { isAdmin } from '@/lib/auth'
import { getMessages } from '@/lib/data'

const STATUS_LABELS = { new: 'New', read: 'Read', replied: 'Replied', archived: 'Archived' } as const
const SOURCE_LABELS = { 'contact-page': 'Contact page', 'freelance-page': 'Freelance page', popup: 'Consultation popup' } as const

/** Downloads every contact message as a CSV file for Excel / Numbers / Google Sheets. */
export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const messages = sortNewestFirst(await getMessages())
  const rows: unknown[][] = [
    ['Received (UTC)', 'Name', 'Email', 'Topic', 'Message', 'Status', 'Sent from'],
    ...messages.map((m) => [
      m.createdAt.replace('T', ' ').slice(0, 16),
      m.name,
      m.email,
      m.topic,
      m.message,
      STATUS_LABELS[m.status] ?? m.status,
      SOURCE_LABELS[m.source] ?? m.source,
    ]),
  ]

  const date = new Date().toISOString().slice(0, 10)
  return new Response(toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="messages-${date}.csv"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

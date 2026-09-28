import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { Inbox } from '@/components/admin/messages/Inbox'
import { PageHeader, buttonStyles } from '@/components/admin/ui/primitives'
import { sortNewestFirst } from '@/lib/admin/overview'
import { requireAdmin } from '@/lib/auth'
import { getMessages } from '@/lib/data'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage({ searchParams }: PageProps<'/admin/messages'>) {
  await requireAdmin()
  const [messages, params] = await Promise.all([getMessages(), searchParams])
  const q = typeof params.q === 'string' ? params.q.slice(0, 200) : ''

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Everything visitors sent you through the forms on your website. Opening a message marks it as read."
        actions={
          messages.length > 0 && (
            <a href="/api/admin/messages/export" download className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
              <Download aria-hidden />
              Export to spreadsheet (CSV)
            </a>
          )
        }
      />
      <Inbox messages={sortNewestFirst(messages)} initialQuery={q} />
    </div>
  )
}

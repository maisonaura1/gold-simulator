import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense, type ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  FileText,
  Images,
  Inbox,
  ListChecks,
  Mail,
  MessageSquareQuote,
  Zap,
} from 'lucide-react'
import { Checklist } from '@/components/admin/overview/Checklist'
import { Greeting } from '@/components/admin/overview/Greeting'
import { RelativeTime } from '@/components/admin/ui/LocalTime'
import { Callout, Card, CardHeader, Skeleton } from '@/components/admin/ui/primitives'
import { getOverview } from '@/lib/admin/overview'
import { requireAdmin } from '@/lib/auth'
import { getCalendlyOverview } from '@/lib/calendly'
import { cn } from '@/lib/cn'

export const metadata: Metadata = { title: 'Overview' }

function KpiCard({
  label,
  value,
  hint,
  href,
  icon,
  highlight = false,
}: {
  label: string
  value: ReactNode
  hint: ReactNode
  href: string
  icon: ReactNode
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col rounded-2xl border p-4 transition-[border-color,box-shadow] sm:p-5',
        highlight
          ? 'border-clay/30 bg-white shadow-[0_12px_30px_-22px_rgb(165_83_58/0.9)] hover:border-clay/60'
          : 'border-line bg-white hover:border-ink/20 hover:shadow-[0_10px_30px_-24px_rgb(31_37_51/0.5)]',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[0.8125rem] leading-snug font-semibold text-ink-soft">{label}</span>
        <span
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4',
            highlight ? 'bg-clay text-white' : 'bg-cream text-clay',
          )}
          aria-hidden
        >
          {icon}
        </span>
      </span>
      <span className="mt-3 font-display text-[2.75rem] leading-none text-ink lining-nums tabular-nums">{value}</span>
      <span className="mt-2 flex items-center gap-1 text-[0.8125rem] text-ink-soft group-hover:text-ink">
        {hint}
        <ArrowRight className="size-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
      </span>
    </Link>
  )
}

async function MeetingsKpi() {
  const calendly = await getCalendlyOverview()
  const icon = <CalendarDays />
  if (calendly.status === 'not-connected') {
    return <KpiCard label="Upcoming meetings" value="—" hint="Connect Calendly to see them" href="/admin/meetings" icon={icon} />
  }
  if (calendly.status === 'error') {
    return <KpiCard label="Upcoming meetings" value="—" hint="Calendly needs attention" href="/admin/meetings" icon={icon} />
  }
  return (
    <KpiCard
      label="Upcoming meetings"
      value={calendly.meetings.length}
      hint="In the next 30 days"
      href="/admin/meetings"
      icon={icon}
    />
  )
}

const QUICK_ACTIONS = [
  { href: '/admin/pages/home', label: 'Edit the home page', icon: FileText },
  { href: '/admin/testimonials?new=1', label: 'Add a testimonial', icon: MessageSquareQuote },
  { href: '/admin/photos', label: 'Change your photos', icon: Images },
  { href: '/admin/messages', label: 'Read your messages', icon: Mail },
]

export default async function OverviewPage() {
  await requireAdmin()
  const { firstName, stats, checklist, latestMessages, ephemeral } = await getOverview()

  return (
    <div className="space-y-8">
      {ephemeral && (
        <Callout tone="warning" title="Changes can’t be saved permanently yet" role="alert">
          This website runs on a host without permanent storage, so edits, messages and photos may disappear after a
          while. Ask your web team to connect an Upstash Redis database (the <code>UPSTASH_REDIS_REST_URL</code> and{' '}
          <code>UPSTASH_REDIS_REST_TOKEN</code> settings described in <code>.env.example</code>).
        </Callout>
      )}

      <header>
        <Greeting firstName={firstName} />
        <p className="mt-2.5 text-[0.9375rem] text-ink-soft">Here’s what’s happening on your website.</p>
      </header>

      <section aria-label="At a glance" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label="New messages"
          value={stats.newMessages}
          hint={stats.newMessages ? 'Waiting for your reply' : 'All caught up'}
          href={stats.newMessages ? '/admin/messages?status=new' : '/admin/messages'}
          icon={<Inbox />}
          highlight={stats.newMessages > 0}
        />
        <KpiCard
          label="Messages this month"
          value={stats.messagesThisMonth}
          hint="From your contact forms"
          href="/admin/messages"
          icon={<Mail />}
        />
        <KpiCard
          label="Published testimonials"
          value={stats.publishedTestimonials}
          hint={stats.publishedTestimonials ? 'Shown on your home page' : 'Add your first one'}
          href="/admin/testimonials"
          icon={<MessageSquareQuote />}
        />
        <Suspense fallback={<Skeleton className="h-full min-h-32 rounded-2xl" />}>
          <MeetingsKpi />
        </Suspense>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="p-5 sm:p-7">
          <CardHeader
            icon={<ListChecks />}
            title="Launch checklist"
            description="A few things that make your website ready for visitors."
          />
          <div className="mt-6">
            <Checklist items={checklist} />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 sm:p-7">
            <CardHeader
              icon={<Inbox />}
              title="Latest messages"
              action={
                latestMessages.length > 0 && (
                  <Link href="/admin/messages" className="text-sm font-semibold text-clay hover:text-clay-dark">
                    See all
                  </Link>
                )
              }
            />
            {latestMessages.length === 0 ? (
              <p className="mt-5 rounded-xl bg-ivory px-4 py-5 text-sm leading-relaxed text-ink-soft">
                No messages yet. When someone writes to you through your website, the message will appear here.
              </p>
            ) : (
              <ul className="mt-4 -mx-2">
                {latestMessages.map((message) => (
                  <li key={message.id}>
                    <Link
                      href={`/admin/messages?id=${message.id}`}
                      className="flex gap-3 rounded-xl px-2 py-3 transition hover:bg-ivory"
                    >
                      <span
                        className={cn(
                          'mt-2 size-2 shrink-0 rounded-full',
                          message.status === 'new' ? 'bg-clay' : 'bg-transparent',
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className={cn('truncate', message.status === 'new' ? 'font-bold text-ink' : 'font-semibold text-ink')}>
                            {message.name}
                          </span>
                          <RelativeTime iso={message.createdAt} className="shrink-0 text-xs text-ink-soft" />
                        </span>
                        {message.topic && <span className="block truncate text-[0.8125rem] font-medium text-clay">{message.topic}</span>}
                        <span className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">{message.excerpt}</span>
                        {message.status === 'new' && <span className="sr-only">(new)</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5 sm:p-7">
            <CardHeader icon={<Zap />} title="Quick actions" />
            <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 text-sm font-semibold text-ink transition hover:border-clay/40 hover:bg-ivory"
                  >
                    <Icon className="size-4 text-clay" aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
              <li className="sm:col-span-2">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 text-sm font-semibold text-ink transition hover:border-clay/40 hover:bg-ivory"
                >
                  <ArrowUpRight className="size-4 text-clay" aria-hidden />
                  View your website
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

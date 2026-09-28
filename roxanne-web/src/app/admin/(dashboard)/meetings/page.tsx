import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CalendarCheck, CalendarClock, CalendarDays, CalendarPlus, Clock, Link2, PlugZap } from 'lucide-react'
import { ConnectForm, DisconnectButton, UseSchedulingLinkButton } from '@/components/admin/meetings/CalendlyConnect'
import { MeetingsList } from '@/components/admin/meetings/MeetingsList'
import { CopyButton } from '@/components/admin/ui/CopyButton'
import { AdminButtonLink, Callout, Card, CardHeader, PageHeader } from '@/components/admin/ui/primitives'
import { requireAdmin } from '@/lib/auth'
import { getCalendlyOverview } from '@/lib/calendly'
import { getSettings } from '@/lib/data'

export const metadata: Metadata = { title: 'Meetings' }

const CALENDLY_LINKS = [
  {
    href: 'https://calendly.com/app/scheduled_events/user/me',
    label: 'Scheduled meetings',
    hint: 'Past and upcoming bookings',
    icon: CalendarCheck,
  },
  {
    href: 'https://calendly.com/app/availability/schedules',
    label: 'Availability',
    hint: 'The hours people can book',
    icon: Clock,
  },
  {
    href: 'https://calendly.com/event_types/user/me',
    label: 'Event types',
    hint: 'Consultation length, questions…',
    icon: CalendarPlus,
  },
]

const TOKEN_PAGE = 'https://calendly.com/integrations/api_webhooks'

function ConnectSteps() {
  return (
    <ol className="space-y-3 text-sm leading-relaxed text-ink-soft">
      {[
        <>
          Open{' '}
          <a href={TOKEN_PAGE} target="_blank" rel="noopener noreferrer" className="font-semibold text-clay underline-offset-4 hover:underline">
            Calendly → Integrations → API and webhooks
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </>,
        <>Click “Get a token now” (or “Generate new token”), name it “Website” and copy it.</>,
        <>Paste it into the token box — that’s it.</>,
      ].map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-cream text-xs font-bold text-clay" aria-hidden>
            {i + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}

export default async function MeetingsPage() {
  await requireAdmin()
  const [settings, calendly] = await Promise.all([getSettings(), getCalendlyOverview()])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Meetings"
        description="Your consultations and lessons booked through Calendly."
        actions={
          <AdminButtonLink href="https://calendly.com/app/scheduled_events/user/me" variant="secondary" size="sm">
            Open Calendly
            <ArrowUpRight aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </AdminButtonLink>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="p-5 sm:p-7">
          <CardHeader
            icon={<CalendarDays />}
            title="Upcoming meetings"
            description={
              calendly.status === 'connected' ? 'The next 30 days, soonest first.' : 'See your bookings here without opening Calendly.'
            }
          />
          <div className="mt-6">
            {calendly.status === 'connected' && <MeetingsList meetings={calendly.meetings} />}

            {calendly.status === 'not-connected' && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <p className="font-semibold text-ink">Connect your Calendly account</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    It takes about a minute and only needs to be done once.
                  </p>
                  <div className="mt-5">
                    <ConnectSteps />
                  </div>
                </div>
                <div className="rounded-2xl bg-ivory p-5">
                  <ConnectForm />
                </div>
              </div>
            )}

            {calendly.status === 'error' && (
              <div className="space-y-6">
                <Callout tone="warning" title="Your meetings can’t be shown right now" role="alert">
                  {calendly.message}
                </Callout>
                {calendly.kind === 'invalid-token' || calendly.kind === 'forbidden' ? (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      {calendly.source === 'env' && (
                        <p className="text-sm leading-relaxed text-ink-soft">
                          The current token comes from the server setting <code>CALENDLY_TOKEN</code>. A token pasted here
                          will be used instead.
                        </p>
                      )}
                      <ConnectSteps />
                    </div>
                    <div className="rounded-2xl bg-ivory p-5">
                      <ConnectForm reconnect />
                    </div>
                  </div>
                ) : (
                  <AdminButtonLink href="/admin/meetings" variant="secondary" size="sm">
                    Try again
                  </AdminButtonLink>
                )}
              </div>
            )}
          </div>
        </Card>

        <aside className="space-y-6">
          <Card className="p-5 sm:p-6" aria-labelledby="booking-link-title">
            <CardHeader id="booking-link-title" icon={<Link2 />} title="Your booking link" />
            {settings.calendlyUrl ? (
              <>
                <p className="mt-4 rounded-xl bg-ivory px-3.5 py-3 font-mono text-[0.8125rem] break-all text-ink">
                  {settings.calendlyUrl}
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">
                  Visitors use this link to book a free consultation from your website.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <CopyButton text={settings.calendlyUrl} label="Copy link" copiedMessage="Booking link copied." />
                  <AdminButtonLink href={settings.calendlyUrl} size="sm" variant="secondary">
                    Open
                    <ArrowUpRight aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </AdminButtonLink>
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
                <p>No booking link yet, so visitors can’t book online from your website.</p>
                {calendly.status === 'connected' && calendly.user.schedulingUrl.startsWith('https://calendly.com/') && (
                  <UseSchedulingLinkButton url={calendly.user.schedulingUrl} />
                )}
                <p>
                  <Link href="/admin/settings#booking" className="font-semibold text-clay underline-offset-4 hover:underline">
                    Add it in Settings
                  </Link>
                </p>
              </div>
            )}
          </Card>

          <Card className="p-5 sm:p-6" aria-labelledby="calendly-shortcuts-title">
            <CardHeader id="calendly-shortcuts-title" icon={<CalendarClock />} title="In Calendly" />
            <ul className="mt-4 -mx-2">
              {CALENDLY_LINKS.map(({ href, label, hint, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-ivory"
                  >
                    <Icon className="size-4 shrink-0 text-clay" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{label}</span>
                      <span className="block text-[0.8125rem] text-ink-soft">{hint}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-ink-soft group-hover:text-ink" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>

          {calendly.status !== 'not-connected' && (
            <Card className="p-5 sm:p-6" aria-labelledby="calendly-connection-title">
              <CardHeader id="calendly-connection-title" icon={<PlugZap />} title="Connection" />
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {calendly.status === 'connected' ? (
                  <>
                    Connected as <strong className="text-ink">{calendly.user.name}</strong>
                    {calendly.source === 'env' && ' through the server setting CALENDLY_TOKEN'}.
                  </>
                ) : calendly.source === 'env' ? (
                  'Using the token from the server setting CALENDLY_TOKEN.'
                ) : (
                  'A token is saved, but Calendly isn’t answering as expected.'
                )}
              </p>
              {calendly.source === 'dashboard' && (
                <div className="mt-4">
                  <DisconnectButton />
                </div>
              )}
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}

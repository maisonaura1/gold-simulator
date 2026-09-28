'use client'

import { CalendarX, ChevronDown, Clock, MapPin, Phone, Video } from 'lucide-react'
import { useMemo, useSyncExternalStore } from 'react'
import type { CalendlyMeeting } from '@/lib/calendly'
import { cn } from '@/lib/cn'
import { useTimeZone } from '../ui/LocalTime'
import { Badge, EmptyState } from '../ui/primitives'

const LOCATION_LABELS: Record<string, string> = {
  zoom_conference: 'Zoom',
  google_conference: 'Google Meet',
  microsoft_teams_conference: 'Microsoft Teams',
  webex_conference: 'Webex',
  gotomeeting: 'GoTo Meeting',
  physical: 'In person',
  outbound_call: 'Phone call — you call them',
  inbound_call: 'Phone call — they call you',
  ask_invitee: 'Location chosen by the client',
  custom: 'Location',
}

const noopSubscribe = () => () => {}

function dayKey(iso: string, timeZone: string) {
  // en-CA formats as YYYY-MM-DD, handy for grouping and comparing days.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso))
}

function time(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone, hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
}

function dayLabel(iso: string, timeZone: string, today: string, tomorrow: string) {
  const key = dayKey(iso, timeZone)
  if (key === today) return 'Today'
  if (key === tomorrow) return 'Tomorrow'
  return new Intl.DateTimeFormat('en-GB', { timeZone, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso))
}

function LocationLine({ location }: { location: CalendlyMeeting['location'] }) {
  const label = location.type ? (LOCATION_LABELS[location.type] ?? 'Location') : null
  if (!label && !location.details) return null
  const Icon = location.joinUrl || location.type?.endsWith('conference') ? Video : location.type?.includes('call') ? Phone : MapPin
  return (
    <p className="flex items-start gap-2 text-sm text-ink-soft">
      <Icon className="mt-0.5 size-4 shrink-0 text-clay" aria-hidden />
      <span className="[overflow-wrap:anywhere]">
        {label}
        {location.details && !location.joinUrl && <>: {location.details}</>}
      </span>
    </p>
  )
}

export function MeetingsList({ meetings }: { meetings: CalendlyMeeting[] }) {
  const viewerZone = useTimeZone()
  const timeZone = viewerZone ?? 'UTC'
  // Minute-precision "now" on the client only (server render uses no "now").
  const now = useSyncExternalStore(
    noopSubscribe,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => 0,
  )

  const groups = useMemo(() => {
    const map = new Map<string, CalendlyMeeting[]>()
    for (const meeting of meetings) {
      const key = dayKey(meeting.startTime, timeZone)
      map.set(key, [...(map.get(key) ?? []), meeting])
    }
    return [...map.entries()]
  }, [meetings, timeZone])

  if (meetings.length === 0) {
    return (
      <EmptyState icon={<CalendarX />} title="No meetings in the next 30 days">
        When someone books a consultation or a lesson through Calendly, it will appear here.
      </EmptyState>
    )
  }

  const today = now ? dayKey(new Date(now).toISOString(), timeZone) : ''
  const tomorrow = now ? dayKey(new Date(now + 86_400_000).toISOString(), timeZone) : ''

  return (
    <div className="space-y-8">
      {viewerZone && (
        <p className="text-[0.8125rem] text-ink-soft">
          Times are shown in your time zone ({viewerZone.replace(/_/g, ' ')}).
        </p>
      )}
      {groups.map(([key, items]) => (
        <section key={key} aria-labelledby={`day-${key}`}>
          <h3 id={`day-${key}`} className="font-sans text-xs font-bold tracking-[0.18em] text-ink-soft uppercase">
            {dayLabel(items[0].startTime, timeZone, today, tomorrow)}
          </h3>
          <ul className="mt-3 space-y-3">
            {items.map((meeting) => {
              const live = now > 0 && new Date(meeting.startTime).getTime() <= now && now < new Date(meeting.endTime).getTime()
              const invitee = meeting.invitees[0]
              return (
                <li
                  key={meeting.id}
                  className={cn(
                    'rounded-2xl border bg-white p-4 sm:p-5',
                    live ? 'border-clay/50 shadow-[0_12px_30px_-22px_rgb(165_83_58/0.9)]' : 'border-line',
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex shrink-0 items-center gap-2 sm:w-32 sm:flex-col sm:items-start sm:gap-1">
                      <span className="flex items-center gap-1.5 font-display text-2xl leading-none text-ink">
                        <Clock className="size-4 text-clay sm:hidden" aria-hidden />
                        {time(meeting.startTime, timeZone)}
                      </span>
                      <span className="text-[0.8125rem] text-ink-soft">to {time(meeting.endTime, timeZone)}</span>
                      {live && <Badge tone="clay">Happening now</Badge>}
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="font-semibold text-ink">{meeting.name}</p>
                      {invitee ? (
                        <p className="text-sm text-ink">
                          with <span className="font-semibold">{invitee.name || 'your client'}</span>
                          {invitee.email && (
                            <>
                              {' · '}
                              <a href={`mailto:${invitee.email}`} className="break-all text-clay underline-offset-4 hover:underline">
                                {invitee.email}
                              </a>
                            </>
                          )}
                          {meeting.invitees.length > 1 && (
                            <span className="text-ink-soft"> and {meeting.invitees.length - 1} more</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-ink-soft">
                          {meeting.inviteesUnavailable ? 'The guest’s details couldn’t be loaded.' : 'No guest details.'}
                        </p>
                      )}
                      <LocationLine location={meeting.location} />

                      {invitee && invitee.questionsAndAnswers.length > 0 && (
                        <details className="group rounded-xl bg-ivory px-4 py-3 text-sm">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                            Answers from the booking form
                            <ChevronDown className="size-4 text-ink-soft transition-transform group-open:rotate-180" aria-hidden />
                          </summary>
                          <dl className="mt-3 space-y-3">
                            {invitee.questionsAndAnswers.map((qa, i) => (
                              <div key={i}>
                                <dt className="text-ink-soft">{qa.question}</dt>
                                <dd className="mt-0.5 whitespace-pre-wrap text-ink [overflow-wrap:anywhere]">{qa.answer}</dd>
                              </div>
                            ))}
                          </dl>
                        </details>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {meeting.location.joinUrl && (
                          <a
                            href={meeting.location.joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center gap-2 rounded-full bg-clay px-4 text-sm font-semibold text-white transition hover:bg-clay-dark"
                          >
                            <Video className="size-4" aria-hidden />
                            Join meeting
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        )}
                        {invitee?.rescheduleUrl && (
                          <a
                            href={invitee.rescheduleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-ink/25"
                          >
                            Reschedule
                            <span className="sr-only">(opens Calendly in a new tab)</span>
                          </a>
                        )}
                        {invitee?.cancelUrl && (
                          <a
                            href={invitee.cancelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center rounded-full border border-clay/25 bg-white px-4 text-sm font-semibold text-clay-dark transition hover:border-clay-dark"
                          >
                            Cancel
                            <span className="sr-only">(opens Calendly in a new tab)</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

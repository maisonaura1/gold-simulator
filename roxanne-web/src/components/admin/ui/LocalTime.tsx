'use client'

import { useSyncExternalStore } from 'react'
import { formatDate, relativeTime, type DateStyle } from '@/lib/admin/format'

const noopSubscribe = () => () => {}

/**
 * Renders a date in the viewer's own time zone. The server doesn't know it,
 * so the first render uses UTC and the browser swaps in local time right
 * after hydration (without a mismatch warning).
 */
export function LocalTime({ iso, format = 'datetime', className }: { iso: string; format?: DateStyle; className?: string }) {
  const text = useSyncExternalStore(
    noopSubscribe,
    () => formatDate(iso, format),
    () => formatDate(iso, format, 'UTC'),
  )
  return (
    <time dateTime={iso} className={className}>
      {text}
    </time>
  )
}

/** "2 hours ago" with the full local date as a tooltip. */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const text = useSyncExternalStore(
    noopSubscribe,
    () => relativeTime(iso, Math.floor(Date.now() / 60_000) * 60_000),
    () => formatDate(iso, 'short', 'UTC'),
  )
  const title = useSyncExternalStore(
    noopSubscribe,
    () => formatDate(iso, 'datetime'),
    () => undefined,
  )
  return (
    <time dateTime={iso} title={title} className={className}>
      {text}
    </time>
  )
}

/** The viewer's time zone name, e.g. "Europe/Paris" (null during server render). */
export function useTimeZone(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => null,
  )
}

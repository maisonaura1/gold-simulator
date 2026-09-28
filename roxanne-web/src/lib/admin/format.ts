export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

/** "3 hours ago", "yesterday", "in 2 days" — relative to `now`. */
export function relativeTime(iso: string, now: number): string {
  const seconds = (new Date(iso).getTime() - now) / 1000
  if (!Number.isFinite(seconds)) return ''
  if (Math.abs(seconds) < 60) return 'just now'
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit)
  }
  return format.format(Math.round(seconds / 60), 'minute')
}

export type DateStyle = 'date' | 'datetime' | 'time' | 'weekday' | 'short'

const DATE_OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  date: { day: 'numeric', month: 'long', year: 'numeric' },
  datetime: { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' },
  time: { hour: 'numeric', minute: '2-digit' },
  weekday: { weekday: 'long', day: 'numeric', month: 'long' },
  short: { day: 'numeric', month: 'short' },
}

/** Formats a date in the given time zone (the viewer's when omitted). */
export function formatDate(iso: string, style: DateStyle, timeZone?: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', { ...DATE_OPTIONS[style], ...(timeZone ? { timeZone } : {}) }).format(date)
}

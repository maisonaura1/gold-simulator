'use client'

import { CalendarDays } from 'lucide-react'
import { useState } from 'react'
import { CalendlyFrame } from './CalendlyFrame'

/** "See available times" → loads the Calendly calendar in place (privacy-friendly, nothing loads before the click). */
export function InlineScheduler({ url, buttonLabel, privacyNote }: { url: string; buttonLabel: string; privacyNote: string }) {
  const [open, setOpen] = useState(false)

  if (open) return <CalendlyFrame url={url} className="mt-6 h-[720px] rounded-[1.25rem] border border-line" />

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 font-semibold text-ivory transition hover:bg-navy-soft"
      >
        <CalendarDays className="size-4" aria-hidden />
        {buttonLabel}
      </button>
      <p className="mt-3 text-xs text-ink-soft">{privacyNote}</p>
    </div>
  )
}

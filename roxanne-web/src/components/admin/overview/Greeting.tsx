'use client'

import { useSyncExternalStore } from 'react'
import { formatDate } from '@/lib/admin/format'

const noopSubscribe = () => () => {}

function partOfDay(hour: number): string {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
}

/** "Good morning, Roxanne" — based on the time on her own device. */
export function Greeting({ firstName }: { firstName: string }) {
  const part = useSyncExternalStore(
    noopSubscribe,
    () => partOfDay(new Date().getHours()),
    () => null,
  )
  const today = useSyncExternalStore(
    noopSubscribe,
    () => formatDate(new Date().toISOString(), 'weekday'),
    () => null,
  )

  return (
    <div>
      <p className="min-h-4 text-xs font-bold tracking-[0.2em] text-clay uppercase">{today ?? ' '}</p>
      <h1 className="mt-2 font-display text-[2.25rem] leading-[1.1] text-ink sm:text-[2.75rem]">
        {part ? `Good ${part}, ${firstName}` : `Welcome back, ${firstName}`}
      </h1>
    </div>
  )
}

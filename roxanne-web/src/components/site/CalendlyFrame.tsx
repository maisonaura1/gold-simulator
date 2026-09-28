'use client'

import { LoaderCircle } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'
import { calendlyEmbedSrc } from '@/lib/site'
import { cn } from '@/lib/cn'

const subscribe = () => () => {}

/** Calendly inline booking page. Rendered only after the visitor asks for it (no third-party cookies before that). */
export function CalendlyFrame({ url, className }: { url: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  const host = useSyncExternalStore(subscribe, () => window.location.hostname, () => '')
  if (!host) return <div className={cn('bg-cream', className)} />

  let src: string
  try {
    src = calendlyEmbedSrc(url, host)
  } catch {
    return null
  }

  return (
    <div className={cn('relative overflow-hidden bg-cream', className)}>
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-ink-soft">
          <LoaderCircle className="size-7 animate-spin text-clay" aria-hidden />
          <span className="sr-only">Loading calendar…</span>
        </div>
      )}
      <iframe
        src={src}
        title="Book a free consultation (Calendly)"
        className="relative size-full border-0"
        onLoad={() => setLoaded(true)}
        allow="payment"
      />
    </div>
  )
}

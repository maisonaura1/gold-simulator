'use client'

import { useEffect, useLayoutEffect, useRef, type ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { inputStyles } from './primitives'

function fit(area: HTMLTextAreaElement) {
  // Hidden (e.g. inside a closed group): nothing to measure yet.
  if (area.offsetWidth === 0) return
  area.style.height = 'auto'
  area.style.height = `${area.scrollHeight + 2}px`
}

/** Textarea that grows with its content (no inner scrollbar for normal texts). */
export function AutoTextarea({ className, value, minRows = 2, ...rest }: ComponentProps<'textarea'> & { minRows?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    if (ref.current) fit(ref.current)
  }, [value])

  // Re-measure when it becomes visible or its width changes (text re-wraps).
  useEffect(() => {
    const area = ref.current
    if (!area || typeof ResizeObserver === 'undefined') return
    let width = area.offsetWidth
    const observer = new ResizeObserver(() => {
      if (area.offsetWidth === width) return
      width = area.offsetWidth
      fit(area)
    })
    observer.observe(area)
    return () => observer.disconnect()
  }, [])

  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      className={cn(inputStyles, 'resize-none overflow-hidden leading-relaxed', className)}
      {...rest}
    />
  )
}

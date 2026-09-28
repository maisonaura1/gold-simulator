'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// Rendered as `as as 'div'`: a plain string tag union, kept narrow so R3F's JSX typings don't widen it.
type Tag = 'div' | 'section' | 'li' | 'article' | 'header' | 'p' | 'span' | 'ul' | 'ol' | 'h2'

/**
 * Marks the element with `data-shown` the first time it scrolls into view.
 * The fade/slide itself is pure CSS (globals.css), so no animation library ships
 * to the browser; content is only hidden once JS is running (`.js` on <html>).
 */
function useRevealOnView() {
  // Typed as a div for JSX purposes; the element may be any tag from `Tag`.
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.dataset.shown = ''
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset.shown = ''
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

interface RevealProps {
  children: ReactNode
  as?: Tag
  delay?: number
  y?: number
  className?: string
  id?: string
}

/** Fades content up as it enters the viewport (once). Honors prefers-reduced-motion. */
export function Reveal({ children, as = 'div', delay = 0, y = 28, className, id }: RevealProps) {
  const ref = useRevealOnView()
  const Component = as as 'div'
  const style = { '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` } as CSSProperties
  return (
    <Component ref={ref} id={id} data-reveal="" className={className} style={style}>
      {children}
    </Component>
  )
}

/** Staggers its direct <RevealItem> children as the group enters the viewport. */
export function RevealGroup({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: Tag }) {
  const ref = useRevealOnView()
  const Component = as as 'div'
  return (
    <Component ref={ref} data-reveal-group="" className={className}>
      {children}
    </Component>
  )
}

export function RevealItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: Tag }) {
  const Component = as as 'div'
  return (
    <Component data-reveal-item="" className={className}>
      {children}
    </Component>
  )
}

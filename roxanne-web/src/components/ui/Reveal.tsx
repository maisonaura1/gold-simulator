'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

// Rendered as `as as 'div'`: a plain string tag union, kept narrow so R3F's JSX typings don't widen it.
type Tag = 'div' | 'section' | 'li' | 'article' | 'header' | 'p' | 'span' | 'ul' | 'ol' | 'h2'

/*
 * One shared, rAF-throttled scroll check reveals every element whose top has
 * passed the reveal line — including elements scrolled past in a single frame
 * (an IntersectionObserver can miss those when frames are slow or the user flicks).
 * The fade/slide itself is pure CSS (globals.css); content is only hidden while
 * JS runs (`.js` on <html>), and each element is marked with `data-shown` once.
 */
const pending = new Set<HTMLElement>()
let frame = 0

function check() {
  frame = 0
  const line = window.innerHeight * 0.92
  for (const el of pending) {
    if (el.getBoundingClientRect().top < line) {
      el.dataset.shown = ''
      pending.delete(el)
    }
  }
  if (pending.size === 0) {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(check)
}

function register(el: HTMLElement) {
  if (pending.size === 0) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  }
  pending.add(el)
  schedule()
}

function useRevealOnView() {
  // Typed as a div for JSX purposes; the element may be any tag from `Tag`.
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || 'shown' in el.dataset) return
    register(el)
    return () => {
      pending.delete(el)
    }
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

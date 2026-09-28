'use client'

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Fraction of the remaining distance covered each frame — a critically damped, spring-like ease. */
const TILT_EASE = 0.14
const GLARE_EASE = 0.1

/**
 * Card that tilts in 3D toward the pointer (mouse/pen only), smoothed per frame,
 * with a soft glare that follows the pointer across the surface.
 * Inert on touch and under prefers-reduced-motion. No animation library needed.
 */
export function TiltCard({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const card = useRef<HTMLDivElement>(null)
  const glare = useRef<HTMLDivElement>(null)
  // Targets (t*) and current values for pointer x/y (-0.5 … 0.5) and hover presence (0 … 1).
  const motion = useRef({ tx: 0, ty: 0, tp: 0, x: 0, y: 0, p: 0, frame: 0 })

  useEffect(() => {
    const state = motion.current
    return () => cancelAnimationFrame(state.frame)
  }, [])

  const step = () => {
    const s = motion.current
    const el = card.current
    if (!el) return
    s.x += (s.tx - s.x) * TILT_EASE
    s.y += (s.ty - s.y) * TILT_EASE
    s.p += (s.tp - s.p) * GLARE_EASE
    el.style.transform = `perspective(900px) rotateX(${(-s.y * max).toFixed(3)}deg) rotateY(${(s.x * max).toFixed(3)}deg)`
    if (glare.current) {
      glare.current.style.opacity = s.p.toFixed(3)
      glare.current.style.setProperty('--glare-x', `${((s.x + 0.5) * 100).toFixed(2)}%`)
      glare.current.style.setProperty('--glare-y', `${((s.y + 0.5) * 100).toFixed(2)}%`)
    }
    const settled = Math.abs(s.tx - s.x) < 0.0005 && Math.abs(s.ty - s.y) < 0.0005 && Math.abs(s.tp - s.p) < 0.002
    if (settled) {
      s.frame = 0
      if (s.tp === 0) el.style.transform = ''
      return
    }
    s.frame = requestAnimationFrame(step)
  }

  const animate = () => {
    if (!motion.current.frame) motion.current.frame = requestAnimationFrame(step)
  }

  const ignored = (event: PointerEvent) =>
    event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (ignored(event)) return
    const rect = event.currentTarget.getBoundingClientRect()
    const s = motion.current
    s.tx = (event.clientX - rect.left) / rect.width - 0.5
    s.ty = (event.clientY - rect.top) / rect.height - 0.5
    s.tp = 1
    animate()
  }

  const enter = (event: PointerEvent<HTMLDivElement>) => {
    if (ignored(event)) return
    // Give the glare the same corners as the card it sits on.
    const inner = event.currentTarget.firstElementChild
    if (glare.current && inner instanceof HTMLElement) glare.current.style.borderRadius = getComputedStyle(inner).borderRadius
    track(event)
  }

  const leave = () => {
    const s = motion.current
    s.tx = 0
    s.ty = 0
    s.tp = 0
    animate()
  }

  return (
    <div
      ref={card}
      className={cn('relative [transform-style:preserve-3d] will-change-transform', className)}
      onPointerEnter={enter}
      onPointerMove={track}
      onPointerLeave={leave}
    >
      {children}
      <div
        ref={glare}
        aria-hidden
        className="pointer-events-none absolute inset-0 [transform:translateZ(1px)] bg-[radial-gradient(circle_at_var(--glare-x,50%)_var(--glare-y,50%),rgb(255_255_255/0.34),rgb(255_255_255/0.1)_26%,rgb(255_255_255/0)_52%,rgb(27_36_54/0.045)_100%)] opacity-0"
      />
    </div>
  )
}

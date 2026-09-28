'use client'

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const TILT_SPRING = { stiffness: 170, damping: 20, mass: 0.6 }
const GLARE_SPRING = { stiffness: 110, damping: 24 }

/**
 * Card that tilts in 3D toward the pointer (mouse/pen only), spring-smoothed,
 * with a soft glare that follows the pointer across the surface.
 * Inert on touch and under prefers-reduced-motion.
 */
export function TiltCard({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const glare = useRef<HTMLDivElement>(null)

  // Pointer position inside the card (-0.5 … 0.5) and hover presence (0 … 1).
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const presence = useMotionValue(0)
  const x = useSpring(pointerX, TILT_SPRING)
  const y = useSpring(pointerY, TILT_SPRING)
  const glareOpacity = useSpring(presence, GLARE_SPRING)

  const rotateX = useTransform(() => -y.get() * max)
  const rotateY = useTransform(() => x.get() * max)
  const glareX = useTransform(x, (v) => `${((v + 0.5) * 100).toFixed(2)}%`)
  const glareY = useTransform(y, (v) => `${((v + 0.5) * 100).toFixed(2)}%`)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.34), rgb(255 255 255 / 0.1) 26%, rgb(255 255 255 / 0) 52%, rgb(27 36 54 / 0.045) 100%)`

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || reduce) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
    presence.set(1)
  }

  const enter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || reduce) return
    // Give the glare the same corners as the card it sits on.
    const card = event.currentTarget.firstElementChild
    if (glare.current && card instanceof HTMLElement) glare.current.style.borderRadius = getComputedStyle(card).borderRadius
    track(event)
  }

  const leave = () => {
    pointerX.set(0)
    pointerY.set(0)
    presence.set(0)
  }

  return (
    <motion.div
      className={cn('relative [transform-style:preserve-3d]', className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerEnter={enter}
      onPointerMove={track}
      onPointerLeave={leave}
    >
      {children}
      <motion.div
        ref={glare}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: glareBackground, opacity: glareOpacity, z: 1 }}
      />
    </motion.div>
  )
}

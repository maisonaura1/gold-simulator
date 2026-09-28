'use client'

import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Card that tilts in 3D toward the pointer (mouse/pen only). */
export function TiltCard({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className={cn('transition-transform duration-500 ease-out-expo [transform-style:preserve-3d] will-change-transform', className)}
      onPointerMove={(e) => {
        if (e.pointerType === 'touch' || !ref.current) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const rect = ref.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        ref.current.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateZ(0)`
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = ''
      }}
    >
      {children}
    </div>
  )
}

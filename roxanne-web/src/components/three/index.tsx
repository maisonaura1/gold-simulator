'use client'

/**
 * Public API of the 3D layer (owned by the 3D/motion workstream).
 * Pages only import from '@/components/three' — keep these signatures stable.
 */
export type Motif = 'business' | 'legal' | 'beginner' | 'speech' | 'freelance' | 'about' | 'contact' | 'courses'

/** Transparent WebGL scene layered over the home hero photo. */
export function Hero3D({ className }: { className?: string }) {
  return <div aria-hidden className={className} />
}

/** Small decorative 3D piece for inner-page heroes (one motif per page). */
export function Motif3D({ motif, className }: { motif: Motif; className?: string }) {
  return <div aria-hidden data-motif={motif} className={className} />
}

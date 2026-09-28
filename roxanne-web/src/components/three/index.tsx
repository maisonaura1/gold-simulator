'use client'

/**
 * Public API of the 3D layer (owned by the 3D/motion workstream).
 * Pages only import from '@/components/three' — keep these signatures stable.
 *
 * This module stays tiny: three.js / R3F live in lazily loaded chunks that are
 * only requested once the element is near the viewport, the page has loaded
 * and the main thread is idle (never competing with the LCP hero photo).
 * Without WebGL 2, with Save-Data, or after a context loss it renders nothing.
 */
import dynamic from 'next/dynamic'
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type Motif = 'business' | 'legal' | 'beginner' | 'speech' | 'freelance' | 'about' | 'contact' | 'courses'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })
const MotifCanvas = dynamic(() => import('./MotifCanvas'), { ssr: false })

/** Transparent WebGL scene layered over the home hero photo. */
export function Hero3D({ className }: { className?: string }) {
  return <Lazy3D className={className} />
}

/** Small decorative 3D piece for inner-page heroes (one motif per page). */
export function Motif3D({ motif, className }: { motif: Motif; className?: string }) {
  return <Lazy3D className={className} motif={motif} />
}

/* ───────────────────────── Environment probes ───────────────────────── */

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const getReducedMotion = () => window.matchMedia(REDUCED_QUERY).matches

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}
const getPageVisible = () => document.visibilityState === 'visible'
const serverFalse = () => false
const serverTrue = () => true

let webglSupport: boolean | undefined

/** WebGL 2 (required by three ≥ r163), and respect the user's Save-Data preference. */
function canRender3D() {
  if (webglSupport !== undefined) return webglSupport
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return (webglSupport = false)
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    webglSupport = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglSupport = false
  }
  return webglSupport
}

/** Run `task` once the page has fully loaded and the main thread is idle. */
function afterLoadAndIdle(task: () => void) {
  let idleId: number | undefined
  let timeoutId: number | undefined
  const schedule = () => {
    if (typeof window.requestIdleCallback === 'function') idleId = window.requestIdleCallback(task, { timeout: 2500 })
    else timeoutId = window.setTimeout(task, 250)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
  return () => {
    window.removeEventListener('load', schedule)
    if (idleId !== undefined) window.cancelIdleCallback(idleId)
    if (timeoutId !== undefined) window.clearTimeout(timeoutId)
  }
}

/* ───────────────────────── Gate ───────────────────────── */

class CanvasBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

type Status = 'waiting' | 'on' | 'off'

function Lazy3D({ className, motif }: { className?: string; motif?: Motif }) {
  const ref = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('waiting')
  const [nearViewport, setNearViewport] = useState(false)
  const [ready, setReady] = useState(false)
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, serverFalse)
  const pageVisible = useSyncExternalStore(subscribeVisibility, getPageVisible, serverTrue)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    let cancelSchedule: (() => void) | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[entries.length - 1].isIntersecting
        setNearViewport(visible)
        if (visible && !cancelSchedule) {
          cancelSchedule = afterLoadAndIdle(() => setStatus(canRender3D() ? 'on' : 'off'))
        }
      },
      { rootMargin: '160px 0px' },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelSchedule?.()
    }
  }, [])

  const handleReady = useCallback(() => setReady(true), [])
  const handleLost = useCallback(() => setStatus('off'), [])

  const bridge = {
    active: nearViewport && pageVisible,
    reduced,
    onReady: handleReady,
    onLost: handleLost,
  }

  return (
    <div ref={ref} aria-hidden className={className} data-motif={motif}>
      {status === 'on' && (
        <CanvasBoundary onError={handleLost}>
          <div
            className={cn(
              'size-full transition-opacity duration-[1600ms] ease-out motion-reduce:transition-none',
              ready ? 'opacity-100' : 'opacity-0',
            )}
          >
            {motif ? <MotifCanvas motif={motif} {...bridge} /> : <HeroCanvas {...bridge} />}
          </div>
        </CanvasBoundary>
      )}
    </div>
  )
}

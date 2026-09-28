'use client'

import './console'
import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { SceneRoot } from './kit'
import { StudioLighting } from './Lighting'
import type { CanvasBridgeProps } from './types'

const GL_OPTIONS = {
  antialias: true,
  alpha: true,
  premultipliedAlpha: true,
  stencil: false,
  powerPreference: 'default' as WebGLPowerPreference,
  // Neutral tone mapping keeps the brand colours (brass, clay, blush) true.
  toneMapping: THREE.NeutralToneMapping,
  toneMappingExposure: 1,
}

// No DOM events are needed (the canvas is pointer-events: none), so skip scroll tracking.
const RESIZE = { scroll: false, debounce: { scroll: 0, resize: 60 } }
const CANVAS_STYLE = { pointerEvents: 'none' } as const

/**
 * R3F forces a context loss when it tears a canvas down. If the GPU already
 * lost the context (the reason we unmount), that call can only fail noisily.
 */
function handleCreated({ gl }: RootState) {
  const forceContextLoss = gl.forceContextLoss.bind(gl)
  gl.forceContextLoss = () => {
    if (!gl.getContext().isContextLost()) forceContextLoss()
  }
}

/**
 * Keeps a `frameloop="demand"` canvas rendering continuously while `active`,
 * and lets it fall completely idle (zero GPU/CPU work) otherwise.
 */
function Ticker({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate)
  const activeRef = useRef(active)
  useEffect(() => {
    activeRef.current = active
    if (active) invalidate()
  }, [active, invalidate])
  useFrame(() => {
    if (activeRef.current) invalidate()
  })
  return null
}

/**
 * Content stays hidden until its shaders are compiled off the main thread
 * (KHR_parallel_shader_compile via compileAsync), so mounting never janks the
 * page; then the first real frame is drawn and the canvas fades in.
 */
function Reveal({ children, onReady }: { children: ReactNode; onReady: () => void }) {
  const gl = useThree((s) => s.gl)
  const get = useThree((s) => s.get)
  const invalidate = useThree((s) => s.invalidate)
  const [shown, setShown] = useState(false)
  const onReadyRef = useRef(onReady)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    let cancelled = false
    const show = () => {
      if (!cancelled) setShown(true)
    }
    const fallback = window.setTimeout(show, 4000)
    const { scene, camera } = get()
    // Without the extension compileAsync would only add a warning; compile on first draw instead.
    if (gl.extensions.has('KHR_parallel_shader_compile')) gl.compileAsync(scene, camera).then(show, show)
    else show()
    return () => {
      cancelled = true
      window.clearTimeout(fallback)
    }
  }, [gl, get])

  useEffect(() => {
    if (!shown) return
    invalidate()
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => onReadyRef.current())
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [shown, invalidate])

  return <group visible={shown}>{children}</group>
}

export function Stage({
  active,
  reduced,
  onReady,
  onLost,
  maxDpr = 1.75,
  children,
}: CanvasBridgeProps & { maxDpr?: number; children: ReactNode }) {
  const [compact] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const [dprCap] = useState(() => Math.max(1, Math.min(window.devicePixelRatio || 1, compact ? 1.5 : maxDpr)))
  const [dpr, setDpr] = useState(dprCap)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onLostRef = useRef(onLost)

  useEffect(() => {
    onLostRef.current = onLost
  }, [onLost])

  // Context loss (GPU reset, too many contexts…) → hand back to the gate, which renders nothing.
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let attached = true
    const handleLost = () => {
      if (attached) onLostRef.current()
    }
    canvas.addEventListener('webglcontextlost', handleLost)
    return () => {
      attached = false
      canvas.removeEventListener('webglcontextlost', handleLost)
    }
  }, [])

  const handlePerformance = useCallback(
    ({ factor }: { factor: number }) => setDpr(Math.round((1 + (dprCap - 1) * factor) * 100) / 100),
    [dprCap],
  )
  const handleFallback = useCallback(() => setDpr(1), [])

  return (
    <Canvas
      ref={canvasRef}
      dpr={dpr}
      frameloop="demand"
      gl={GL_OPTIONS}
      resize={RESIZE}
      style={CANVAS_STYLE}
      onCreated={handleCreated}
    >
      <SceneRoot reduced={reduced} compact={compact}>
        <Ticker active={active && !reduced} />
        {!reduced && (
          <PerformanceMonitor factor={1} step={0.5} flipflops={3} onChange={handlePerformance} onFallback={handleFallback} />
        )}
        <StudioLighting compact={compact} />
        <Reveal onReady={onReady}>{children}</Reveal>
      </SceneRoot>
    </Canvas>
  )
}

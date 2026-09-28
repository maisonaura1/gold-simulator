'use client'

import { useFrame, type RootState } from '@react-three/fiber'
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import * as THREE from 'three'
import { createMaterials, disposeMaterials, type MaterialSet } from './materials'
import { clamp01, easeOutCubic } from './palette'
import { createBrushedTexture, createShadowTexture } from './textures'

export interface SceneFlags {
  /** prefers-reduced-motion: render one still frame, no loop. */
  reduced: boolean
  /** Small screens (< 768px): fewer objects, lighter geometry. */
  compact: boolean
}

interface Kit extends SceneFlags {
  materials: MaterialSet
  shadowMap: THREE.Texture
  /** Shared unit sphere for orbs and dots. */
  sphere: THREE.BufferGeometry
}

interface SceneClock {
  t: number
  dt: number
}

const KitContext = createContext<Kit | null>(null)
const ClockContext = createContext<RefObject<SceneClock> | null>(null)

/**
 * Per-canvas resources and time. The clock only advances while frames are
 * rendered and each step is clamped, so a paused scene (off-screen, hidden tab)
 * resumes exactly where it stopped instead of jumping.
 */
export function SceneRoot({ reduced, compact, children }: SceneFlags & { children: ReactNode }) {
  const [resources] = useState(() => {
    const brushed = createBrushedTexture()
    return {
      brushed,
      shadowMap: createShadowTexture(),
      materials: createMaterials(brushed),
      sphere: new THREE.SphereGeometry(1, compact ? 32 : 48, compact ? 22 : 32),
    }
  })

  useEffect(
    () => () => {
      disposeMaterials(resources.materials)
      resources.brushed.dispose()
      resources.shadowMap.dispose()
      resources.sphere.dispose()
    },
    [resources],
  )

  const clock = useRef<SceneClock>({ t: 0, dt: 0 })
  useFrame((_, delta) => {
    const c = clock.current
    // Clamp long gaps (resume after a pause) without slowing slow devices down.
    c.dt = reduced ? 0 : Math.min(delta, 0.1)
    c.t += c.dt
  }, -1)

  const kit = useMemo<Kit>(
    () => ({ materials: resources.materials, shadowMap: resources.shadowMap, sphere: resources.sphere, reduced, compact }),
    [resources, reduced, compact],
  )

  return (
    <KitContext.Provider value={kit}>
      <ClockContext.Provider value={clock}>{children}</ClockContext.Provider>
    </KitContext.Provider>
  )
}

export function useKit() {
  const kit = useContext(KitContext)
  if (!kit) throw new Error('useKit must be used inside <SceneRoot>')
  return kit
}

/** useFrame driven by the scene clock: `t` is seconds of *visible* animation. */
export function useSceneFrame(callback: (t: number, dt: number, state: RootState) => void) {
  const clock = useContext(ClockContext)
  useFrame((state) => {
    if (!clock) return
    callback(clock.current.t, clock.current.dt, state)
  })
}

/** 0 → 1 entrance curve; always 1 under reduced motion. */
export function intro(t: number, reduced: boolean, delay = 0, duration = 1.4) {
  if (reduced) return 1
  return easeOutCubic(clamp01((t - delay) / duration))
}

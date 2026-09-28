'use client'

import { useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useKit } from '../core/kit'
import { Drift, FitCamera, PointerParallax } from '../core/rig'
import { Bloom } from '../models/Bloom'
import { Orb, type OrbFinish } from '../models/Orb'
import { Scales } from '../models/Scales'

/*
 * "Precision & Voice" — layered over the home hero photo.
 *
 * World units are tied to the photo: the arch is 2 wide × 2.5 tall, centred on
 * the origin, and the canvas (the arch box grown by 14% on every side) spans
 * 2.56 × 3.2. FitCamera maps that box exactly onto the canvas, so the invisible
 * occluder below sits precisely on the photo.
 */
const DESIGN_WIDTH = 2.56
const DESIGN_HEIGHT = 3.2

/**
 * Depth-only arch matching the photo's `.arch` shape: anything behind z = 0
 * (the bloom) is hidden where the photo is, so it appears to rise from behind it.
 */
function ArchOccluder() {
  const [geometry] = useState(() => {
    const corner = 0.012
    const shape = new THREE.Shape()
    shape.moveTo(-1, -1.25 + corner)
    shape.lineTo(-1, 0.25)
    shape.absarc(0, 0.25, 1, Math.PI, 0, true)
    shape.lineTo(1, -1.25 + corner)
    shape.quadraticCurveTo(1, -1.25, 1 - corner, -1.25)
    shape.lineTo(-1 + corner, -1.25)
    shape.quadraticCurveTo(-1, -1.25, -1, -1.25 + corner)
    return new THREE.ShapeGeometry(shape, 48)
  })
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry} renderOrder={-10}>
      <meshBasicMaterial colorWrite={false} />
    </mesh>
  )
}

interface OrbSpec {
  finish: OrbFinish
  radius: number
  position: [number, number, number]
  seed: number
  /** Kept on small screens. */
  essential?: boolean
}

const ORBS: OrbSpec[] = [
  { finish: 'ivory', radius: 0.088, position: [1.12, 0.62, 0.3], seed: 2, essential: true },
  { finish: 'glass', radius: 0.1, position: [0.66, 1.2, 0.45], seed: 3 },
  { finish: 'clay', radius: 0.06, position: [-1.1, -0.3, 0.3], seed: 4, essential: true },
  { finish: 'ivory', radius: 0.045, position: [-0.34, 1.42, 0.35], seed: 5, essential: true },
  { finish: 'champagne', radius: 0.032, position: [1.15, -0.28, 0.4], seed: 6 },
]

/** Camera distance for the 26° fit of DESIGN_HEIGHT (see FitCamera). */
const CAMERA_DISTANCE = DESIGN_HEIGHT / 2 / Math.tan(THREE.MathUtils.degToRad(13))
/** Screen magnification of something at depth z relative to the z = 0 plane. */
const perspective = (z: number) => CAMERA_DISTANCE / (CAMERA_DISTANCE - z)

/**
 * Half-width, in world units, of the part of the canvas that is actually on
 * screen. On phones the canvas (14% wider than the photo on each side) spills
 * past the viewport and is clipped by the section, so the composition pulls in.
 */
function useVisibleHalfWidth() {
  const size = useThree((s) => s.size)
  const viewport = typeof document === 'undefined' ? size.width : document.documentElement.clientWidth
  const overflow = Math.max(0, -size.left, size.left + size.width - viewport)
  return DESIGN_WIDTH / 2 - (overflow / Math.max(1, size.width)) * DESIGN_WIDTH
}

export function HeroScene() {
  const { compact } = useKit()
  const half = useVisibleHalfWidth()
  const tight = half < DESIGN_WIDTH / 2 - 0.05
  const orbs = compact ? ORBS.filter((orb) => orb.essential) : ORBS

  // Scales: keep the near pan (≈0.48 × scale to the right of the stand) on screen.
  const scalesScale = tight ? 0.76 : 0.84
  const scalesX = Math.min(0.72, (half - 0.06) / perspective(0.5) - 0.48 * scalesScale)
  // Bloom: keep its left edge on screen; when pushed right, lift it so it still clears the arch.
  const bloomX = Math.max(-0.8, -(half - 0.05) / perspective(-0.6) + 0.47)
  const bloomY = 1.04 + (bloomX + 0.8) * 0.8

  return (
    <>
      <FitCamera width={DESIGN_WIDTH} height={DESIGN_HEIGHT} fov={26} />
      <ArchOccluder />

      {/* Fluid bloom peeking from behind the upper-left of the arch */}
      <PointerParallax move={0.03} tilt={0.06} position={[bloomX, bloomY, -0.6]}>
        <Drift float={0.03} tilt={0.12} speed={0.55} seed={1}>
          <Bloom radius={0.42} speed={0.9} amplitude={0.11} frequency={0.72} />
        </Drift>
      </PointerParallax>

      {/* Scales of justice straddling the lower-right edge */}
      <PointerParallax move={0.03} tilt={0.16} position={[scalesX, -1.36, 0.3]}>
        {/* YXZ: tilt about the beam's own axis so a balanced beam stays level in 3/4 view */}
        <Scales rotation={[0.16, -0.6, 0, 'YXZ']} scale={scalesScale} />
      </PointerParallax>

      {/* Drifting orbs, clamped inside the visible width */}
      <PointerParallax move={0.07} tilt={0}>
        {orbs.map((orb) => {
          const [x, y, z] = orb.position
          const limit = (half - 0.1) / perspective(z) - orb.radius
          const clampedX = Math.sign(x) * Math.min(Math.abs(x), limit)
          return (
            <Drift key={orb.seed} position={[clampedX, y, z]} float={0.045} tilt={0} speed={0.7} seed={orb.seed}>
              <Orb finish={orb.finish} radius={orb.radius} />
            </Drift>
          )
        })}
      </PointerParallax>
    </>
  )
}

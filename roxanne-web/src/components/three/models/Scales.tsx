'use client'

import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useKit, useSceneFrame } from '../core/kit'
import { damp } from '../core/palette'
import { readPointer } from '../core/pointer'
import { bezier2, disposeGeometries, rodBetween, v2 } from './geometry'

/*
 * Scales of justice, built procedurally (≈1 unit tall, base at y = 0):
 * a lathe-turned stand, a tapered beam on a pivot, and two pans hanging from
 * three fine rods each. Everything is brushed brass / champagne gold.
 */

export const SCALES_PIVOT_Y = 0.84
const BEAM_END_X = 0.413
const HANG = 0.34
const PAN_RADIUS = 0.138
const ROD_SPREAD = 0.118

function standProfile() {
  const points: THREE.Vector2[] = [
    // Foot: a wide disc with softened edges and a small step.
    v2(0, 0),
    v2(0.238, 0),
    v2(0.252, 0.004),
    v2(0.258, 0.014),
    v2(0.258, 0.027),
    v2(0.251, 0.035),
    v2(0.236, 0.039),
    v2(0.204, 0.041),
    v2(0.199, 0.047),
    v2(0.199, 0.055),
    v2(0.192, 0.06),
  ]
  // Ogee sweeping up into the column.
  points.push(...bezier2(v2(0.186, 0.062), v2(0.186, 0.115), v2(0.062, 0.092), v2(0.052, 0.152), 16))
  points.push(
    v2(0.05, 0.158),
    v2(0.058, 0.164),
    v2(0.058, 0.173),
    v2(0.047, 0.179),
    v2(0.03, 0.185),
    v2(0.022, 0.2),
    // Shaft with a mid collar.
    v2(0.019, 0.458),
    v2(0.026, 0.465),
    v2(0.031, 0.474),
    v2(0.026, 0.483),
    v2(0.019, 0.49),
    v2(0.017, 0.758),
    // Capital.
    v2(0.024, 0.77),
    v2(0.033, 0.781),
    v2(0.035, 0.792),
    v2(0.03, 0.8),
    v2(0.018, 0.806),
    // Neck through the pivot, then the finial.
    v2(0.012, 0.812),
    v2(0.012, 0.872),
    v2(0.018, 0.879),
    v2(0.022, 0.891),
    v2(0.02, 0.905),
    v2(0.012, 0.919),
    v2(0.0065, 0.937),
    v2(0.003, 0.955),
    v2(0, 0.963),
  )
  return points
}

function beamProfile() {
  // One half, from the tip to the centre boss (radius, distance from centre).
  const half = [
    v2(0, 0.43),
    v2(0.008, 0.428),
    v2(0.013, 0.421),
    v2(0.0145, 0.413),
    v2(0.012, 0.405),
    v2(0.0075, 0.398),
    v2(0.0085, 0.33),
    v2(0.011, 0.2),
    v2(0.0145, 0.075),
    v2(0.018, 0.042),
    v2(0.024, 0.033),
    v2(0.031, 0.03),
    v2(0.034, 0.02),
  ]
  const lower = half.map((p) => v2(p.x, -p.y))
  const upper = [...half].reverse()
  return [...lower, ...upper]
}

function panProfile() {
  return [
    v2(0, -0.045),
    v2(0.045, -0.043),
    v2(0.085, -0.034),
    v2(0.112, -0.021),
    v2(0.129, -0.008),
    v2(0.136, 0.001),
    v2(PAN_RADIUS, 0.007),
    v2(0.134, 0.009),
    v2(0.127, 0.003),
    v2(0.11, -0.011),
    v2(0.082, -0.023),
    v2(0.043, -0.031),
    v2(0, -0.033),
  ]
}

function buildScalesGeometry(segments: number) {
  const beam = new THREE.LatheGeometry(beamProfile(), Math.round(segments * 0.5))
  beam.rotateZ(-Math.PI / 2)

  const pin = new THREE.CylinderGeometry(0.019, 0.019, 0.074, 24)
  pin.rotateX(Math.PI / 2)

  const ring = new THREE.TorusGeometry(0.012, 0.0028, 8, 24)

  const top = new THREE.Vector3(0, -0.015, 0)
  const rodParts = [90, 210, 330].map((deg) => {
    const a = THREE.MathUtils.degToRad(deg)
    return rodBetween(top, new THREE.Vector3(Math.cos(a) * ROD_SPREAD, -HANG + 0.006, Math.sin(a) * ROD_SPREAD), 0.0024, 6)
  })
  const rods = mergeGeometries(rodParts)
  for (const part of rodParts) part.dispose()

  const rim = new THREE.TorusGeometry(PAN_RADIUS - 0.002, 0.0036, 8, 64)
  rim.rotateX(Math.PI / 2)
  rim.translate(0, 0.007, 0)

  return {
    stand: new THREE.LatheGeometry(standProfile(), segments),
    beam,
    pin,
    ring,
    rods,
    pan: new THREE.LatheGeometry(panProfile(), segments),
    rim,
  }
}

export function Scales({ swing = 1, ...props }: Omit<ThreeElements['group'], 'ref' | 'children'> & { swing?: number }) {
  const { materials, compact, reduced } = useKit()
  const [geometry] = useState(() => buildScalesGeometry(compact ? 40 : 64))
  useEffect(() => () => disposeGeometries(geometry), [geometry])

  const beam = useRef<THREE.Group>(null)
  const hangers = useRef<(THREE.Group | null)[]>([])
  const lean = useRef(0)

  useSceneFrame((t, dt) => {
    const b = beam.current
    if (!b) return
    // Released slightly off balance, it swings and settles toward equilibrium,
    // then keeps breathing; it also leans a touch toward the pointer.
    const decay = Math.exp(-t / 3.2)
    const settle = reduced ? 0 : 0.2 * swing * decay * Math.cos(1.85 * t)
    const idle = reduced ? 0 : 0.016 * swing * Math.sin(0.55 * t + 0.6)
    lean.current += (-readPointer().x * 0.05 * swing - lean.current) * damp(1.4, dt)
    const theta = settle + idle + lean.current
    b.rotation.z = theta
    // Pans hang plumb (counter-rotated) with a lagging pendulum sway.
    const sway = reduced ? 0 : -0.09 * swing * decay * Math.sin(1.85 * t + 0.7) + 0.01 * Math.sin(0.8 * t + 1.3)
    hangers.current.forEach((hanger, i) => {
      if (!hanger) return
      hanger.rotation.z = -theta + sway * (i === 0 ? 1 : 0.85)
      hanger.rotation.x = reduced ? 0 : 0.012 * Math.sin(0.7 * t + i * 2)
    })
  })

  return (
    <group {...props}>
      <mesh geometry={geometry.stand} material={materials.brass} />
      <group position={[0, SCALES_PIVOT_Y, 0]}>
        <group ref={beam}>
          <mesh geometry={geometry.beam} material={materials.brass} />
          <mesh geometry={geometry.pin} material={materials.champagne} />
          {[-1, 1].map((side, i) => (
            <group key={side} position={[side * BEAM_END_X, -0.024, 0]}>
              <group
                ref={(node) => {
                  hangers.current[i] = node
                }}
              >
                <mesh geometry={geometry.ring} material={materials.champagne} />
                <mesh geometry={geometry.rods} material={materials.brass} />
                <group position={[0, -HANG, 0]}>
                  <mesh geometry={geometry.pan} material={materials.champagne} />
                  <mesh geometry={geometry.rim} material={materials.champagne} />
                </group>
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}

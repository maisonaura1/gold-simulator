'use client'

import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useKit, useSceneFrame } from '../core/kit'
import { PALETTE } from '../core/palette'
import { bezier2, v2 } from './geometry'

/*
 * A 1950s-style studio microphone: a pill-shaped capsule wrapped in a brass
 * grille cage (rings + ribs merged into one mesh) over a navy core, held by a
 * yoke on a slim stand with a turned base. Optional sound-wave arcs pulse out.
 */

const HALF_HEIGHT = 0.31
const RADIUS = 0.2

/** Superellipse profile of the capsule: radius at height y. */
function capsuleRadius(y: number) {
  const k = Math.min(1, Math.abs(y) / HALF_HEIGHT)
  return RADIUS * Math.pow(1 - Math.pow(k, 2.6), 1 / 2.6)
}

function capsuleProfile(inset: number, steps = 28) {
  const points: THREE.Vector2[] = []
  for (let i = 0; i <= steps; i++) {
    const y = -HALF_HEIGHT + (i / steps) * HALF_HEIGHT * 2
    points.push(v2(Math.max(0, capsuleRadius(y) - inset), y))
  }
  return points
}

function buildMicrophone(segments: number) {
  const core = new THREE.LatheGeometry(capsuleProfile(0.014), segments)

  const cageParts: THREE.BufferGeometry[] = []
  for (const y of [-0.26, -0.2, -0.13, -0.065, 0.065, 0.13, 0.2, 0.26]) {
    const ring = new THREE.TorusGeometry(capsuleRadius(y) + 0.002, 0.0042, 6, segments)
    ring.rotateX(Math.PI / 2)
    ring.translate(0, y, 0)
    cageParts.push(ring)
  }
  const ribs = 10
  for (let i = 0; i < ribs; i++) {
    const angle = (i / ribs) * Math.PI * 2
    const points: THREE.Vector3[] = []
    for (let j = 0; j <= 16; j++) {
      const y = -HALF_HEIGHT * 0.97 + (j / 16) * HALF_HEIGHT * 1.94
      const r = capsuleRadius(y) + 0.002
      points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r))
    }
    cageParts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, 0.0036, 5, false))
  }
  const cage = mergeGeometries(cageParts)
  for (const part of cageParts) part.dispose()

  const band = new THREE.TorusGeometry(RADIUS + 0.006, 0.018, 12, segments)
  band.rotateX(Math.PI / 2)

  // Yoke: lower half-ring with pivot knobs.
  const yokeRadius = RADIUS + 0.06
  const yoke = new THREE.TorusGeometry(yokeRadius, 0.014, 10, 48, Math.PI)
  yoke.rotateZ(Math.PI)
  const knob = new THREE.CylinderGeometry(0.028, 0.028, 0.064, 20)
  knob.rotateZ(Math.PI / 2)

  const stemTop = -yokeRadius
  const stem = new THREE.CylinderGeometry(0.018, 0.02, 0.5, 16)
  stem.translate(0, stemTop - 0.25, 0)

  const baseY = stemTop - 0.5
  const baseProfile = [
    v2(0, 0),
    v2(0.25, 0),
    v2(0.262, 0.008),
    v2(0.262, 0.03),
    v2(0.25, 0.04),
    ...bezier2(v2(0.235, 0.042), v2(0.2, 0.1), v2(0.06, 0.07), v2(0.04, 0.13), 12),
    v2(0.03, 0.14),
    v2(0, 0.14),
  ]
  const base = new THREE.LatheGeometry(baseProfile, segments)
  base.translate(0, baseY - 0.13, 0)

  return { core, cage, band, yoke, knob, stem, base, yokeRadius }
}

function buildWaveArc() {
  const arc = 1.05
  const right = new THREE.TorusGeometry(1, 0.011, 6, 40, arc)
  right.rotateZ(-arc / 2)
  const left = right.clone()
  left.rotateZ(Math.PI)
  const merged = mergeGeometries([right, left])
  right.dispose()
  left.dispose()
  return merged
}

export function Microphone({
  waves = true,
  ...props
}: Omit<ThreeElements['group'], 'ref' | 'children'> & { waves?: boolean }) {
  const { materials, compact, reduced } = useKit()
  const [mic] = useState(() => buildMicrophone(compact ? 32 : 56))
  const [wave] = useState(() => (waves ? buildWaveArc() : null))
  const [waveMaterials] = useState(() =>
    [0, 1, 2].map(
      () =>
        new THREE.MeshStandardMaterial({
          color: PALETTE.goldSoft,
          metalness: 0.7,
          roughness: 0.3,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
    ),
  )
  useEffect(
    () => () => {
      for (const geometry of [mic.core, mic.cage, mic.band, mic.yoke, mic.knob, mic.stem, mic.base]) geometry.dispose()
      wave?.dispose()
      for (const material of waveMaterials) material.dispose()
    },
    [mic, wave, waveMaterials],
  )

  const waveRefs = useRef<(THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | null)[]>([])
  useSceneFrame((t) => {
    waveRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const phase = reduced ? [0.18, 0.5, 0.82][i] : (t * 0.32 + i / 3) % 1
      mesh.scale.setScalar(0.34 + phase * 0.62)
      mesh.material.opacity = Math.sin(Math.PI * phase) * 0.85
    })
  })

  const knobX = mic.yokeRadius - 0.018

  return (
    <group {...props}>
      <group rotation={[-0.12, 0, 0]}>
        <mesh geometry={mic.core} material={materials.navy} />
        <mesh geometry={mic.cage} material={materials.champagne} />
        <mesh geometry={mic.band} material={materials.brass} />
        <mesh geometry={mic.knob} material={materials.brass} position={[knobX, 0, 0]} />
        <mesh geometry={mic.knob} material={materials.brass} position={[-knobX, 0, 0]} />
      </group>
      <mesh geometry={mic.yoke} material={materials.brass} />
      <mesh geometry={mic.stem} material={materials.brass} />
      <mesh geometry={mic.base} material={materials.brass} />
      {wave &&
        waveMaterials.map((material, i) => (
          <mesh
            key={i}
            ref={(node) => {
              waveRefs.current[i] = node as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | null
            }}
            geometry={wave}
            material={material}
            renderOrder={3}
          />
        ))}
    </group>
  )
}

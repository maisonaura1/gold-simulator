'use client'

import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { intro, useKit, useSceneFrame } from '../core/kit'
import type { MaterialSet } from '../core/materials'
import { easeOutBack } from '../core/palette'
import { v2 } from './geometry'

/*
 * An elegant growth chart: brass, glass and ceramic bars rising from a round
 * ceramic plate with a brass rim, traced by a fine champagne trend line.
 */

type Finish = keyof MaterialSet

const BAR_SIZE = 0.14
const PLATE_TOP = 0.05

interface Bar {
  x: number
  height: number
  finish: Finish
}

const FULL: Bar[] = [
  { x: -0.4, height: 0.3, finish: 'ivory' },
  { x: -0.2, height: 0.46, finish: 'glass' },
  { x: 0, height: 0.62, finish: 'brass' },
  { x: 0.2, height: 0.8, finish: 'glass' },
  { x: 0.4, height: 1.0, finish: 'brass' },
]

const MINI: Bar[] = [
  { x: -0.2, height: 0.36, finish: 'ivory' },
  { x: 0, height: 0.58, finish: 'glass' },
  { x: 0.2, height: 0.84, finish: 'brass' },
]

function buildChart(bars: Bar[], withTrend: boolean, segments: number) {
  const plateRadius = withTrend ? 0.6 : 0.36
  const plate = new THREE.LatheGeometry(
    [v2(0, 0), v2(plateRadius - 0.02, 0), v2(plateRadius, 0.01), v2(plateRadius, 0.036), v2(plateRadius - 0.014, PLATE_TOP), v2(0, PLATE_TOP)],
    segments,
  )
  const rim = new THREE.TorusGeometry(plateRadius + 0.004, 0.009, 10, segments)
  rim.rotateX(Math.PI / 2)
  rim.translate(0, 0.024, 0)

  const barGeometries = bars.map((bar) => {
    const g = new RoundedBoxGeometry(BAR_SIZE, bar.height, BAR_SIZE, 3, 0.026)
    g.translate(0, bar.height / 2, 0)
    return g
  })

  let trend: THREE.TubeGeometry | null = null
  let arrow: THREE.ConeGeometry | null = null
  let arrowTransform: { position: THREE.Vector3; quaternion: THREE.Quaternion } | null = null
  if (withTrend) {
    const points = [
      new THREE.Vector3(-0.56, PLATE_TOP + 0.16, 0.02),
      ...bars.map((bar, i) => new THREE.Vector3(bar.x, PLATE_TOP + bar.height + 0.11 + (i === bars.length - 1 ? 0.02 : 0), 0.02)),
      new THREE.Vector3(0.58, PLATE_TOP + 1.3, 0.02),
    ]
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
    trend = new THREE.TubeGeometry(curve, 120, 0.008, 8, false)
    arrow = new THREE.ConeGeometry(0.028, 0.08, 16)
    const tangent = curve.getTangentAt(1)
    arrowTransform = {
      position: curve.getPointAt(1).add(tangent.clone().multiplyScalar(0.03)),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent),
    }
  }

  return { plate, rim, barGeometries, trend, arrow, arrowTransform }
}

export function GrowthChart({
  mini = false,
  spin = true,
  ...props
}: Omit<ThreeElements['group'], 'ref' | 'children'> & { mini?: boolean; spin?: boolean }) {
  const { materials, reduced, compact } = useKit()
  const bars = mini ? MINI : FULL
  const [chart] = useState(() => buildChart(bars, !mini, compact ? 40 : 64))
  useEffect(
    () => () => {
      chart.plate.dispose()
      chart.rim.dispose()
      chart.barGeometries.forEach((g) => g.dispose())
      chart.trend?.dispose()
      chart.arrow?.dispose()
    },
    [chart],
  )

  const root = useRef<THREE.Group>(null)
  const barRefs = useRef<(THREE.Mesh | null)[]>([])
  const trendRef = useRef<THREE.Mesh>(null)
  const arrowRef = useRef<THREE.Mesh>(null)

  useSceneFrame((t) => {
    if (root.current && spin) root.current.rotation.y = reduced ? -0.42 : -0.42 + Math.sin(t * 0.32) * 0.42
    barRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const p = reduced ? 1 : easeOutBack(Math.min(1, Math.max(0, (t - 0.25 - i * 0.14) / 1.1)))
      mesh.scale.y = Math.max(0.001, p)
    })
    const trendProgress = intro(t, reduced, 0.9, 1.6)
    const trend = trendRef.current
    if (trend) {
      const count = trend.geometry.index?.count ?? 0
      // Draw whole rings of the tube (8 radial segments × 6 indices).
      trend.geometry.setDrawRange(0, Math.floor((count * trendProgress) / 48) * 48)
    }
    if (arrowRef.current) arrowRef.current.scale.setScalar(Math.max(0.001, intro(t, reduced, 2.3, 0.6)))
  })

  return (
    <group {...props}>
      <group ref={root}>
        <mesh geometry={chart.plate} material={materials.ivory} />
        <mesh geometry={chart.rim} material={materials.brass} />
        {bars.map((bar, i) => (
          <mesh
            key={bar.x}
            ref={(node) => {
              barRefs.current[i] = node
            }}
            geometry={chart.barGeometries[i]}
            material={materials[bar.finish]}
            position={[bar.x, PLATE_TOP, 0]}
            renderOrder={bar.finish === 'glass' ? 2 : 0}
          />
        ))}
        {chart.trend && <mesh ref={trendRef} geometry={chart.trend} material={materials.champagne} />}
        {chart.arrow && chart.arrowTransform && (
          <mesh
            ref={arrowRef}
            geometry={chart.arrow}
            material={materials.champagne}
            position={chart.arrowTransform.position}
            quaternion={chart.arrowTransform.quaternion}
          />
        )}
      </group>
    </group>
  )
}

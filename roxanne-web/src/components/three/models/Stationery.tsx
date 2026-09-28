'use client'

import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { useKit } from '../core/kit'
import { createDocumentTexture } from '../core/textures'
import { v2 } from './geometry'

type GroupProps = Omit<ThreeElements['group'], 'ref' | 'children'>

/* ───────────────────────── Paper sheet ───────────────────────── */

/** Depth of the sheet's gentle curl at x (edges fall back). */
export function sheetCurl(x: number, width: number, curl = 0.035) {
  const u = x / (width / 2)
  return -curl * u * u
}

/** A softly curled sheet of paper with a painted document on it. */
export function PaperSheet({
  width = 0.62,
  height = 0.86,
  variant = 'contract',
  curl = 0.035,
  ...props
}: GroupProps & { width?: number; height?: number; variant?: 'contract' | 'letter' | 'plain'; curl?: number }) {
  const { compact } = useKit()
  const [sheet] = useState(() => {
    const geometry = new THREE.PlaneGeometry(width, height, compact ? 8 : 18, 1)
    const position = geometry.attributes.position
    for (let i = 0; i < position.count; i++) {
      position.setZ(i, sheetCurl(position.getX(i), width, curl))
    }
    geometry.computeVertexNormals()
    const map = createDocumentTexture(variant)
    const material = new THREE.MeshStandardMaterial({ map, roughness: 0.86, envMapIntensity: 0.95, side: THREE.DoubleSide })
    return { geometry, map, material }
  })
  useEffect(
    () => () => {
      sheet.geometry.dispose()
      sheet.map.dispose()
      sheet.material.dispose()
    },
    [sheet],
  )
  return (
    <group {...props}>
      <mesh geometry={sheet.geometry} material={sheet.material} />
    </group>
  )
}

/* ───────────────────────── Envelope ───────────────────────── */

/** A sealed envelope: paper body, a flap folded slightly forward, a clay wax seal. */
export function Envelope(props: GroupProps) {
  const { materials } = useKit()
  const [geometry] = useState(() => {
    const w = 0.56
    const h = 0.38
    const body = new RoundedBoxGeometry(w, h, 0.014, 2, 0.006)
    const flapShape = new THREE.Shape()
    flapShape.moveTo(-w / 2 + 0.006, 0)
    flapShape.lineTo(w / 2 - 0.006, 0)
    flapShape.lineTo(0, -h / 2 - 0.03)
    flapShape.closePath()
    const flap = new THREE.ShapeGeometry(flapShape)
    // Hinge on the top edge, tip lifted toward the viewer.
    flap.rotateX(-0.16)
    flap.translate(0, h / 2 - 0.006, 0.0085)
    const seal = new THREE.CylinderGeometry(0.036, 0.038, 0.014, 28)
    seal.rotateX(Math.PI / 2)
    seal.translate(0, -0.03 + 0.004, 0.042)
    return { body, flap, seal }
  })
  useEffect(
    () => () => {
      geometry.body.dispose()
      geometry.flap.dispose()
      geometry.seal.dispose()
    },
    [geometry],
  )
  return (
    <group {...props}>
      <mesh geometry={geometry.body} material={materials.paper} />
      <mesh geometry={geometry.flap} material={materials.paperBlush} />
      <mesh geometry={geometry.seal} material={materials.clay} />
    </group>
  )
}

/* ───────────────────────── Paperclip ───────────────────────── */

/**
 * A Gem clip as one brass wire (TubeGeometry along a hand-built path). The
 * connecting bend sits over the paper's edge: the inner tongue runs behind
 * the sheet (z < 0), the outer loop in front (z > 0).
 */
function paperclipCurve() {
  const points: THREE.Vector3[] = []
  const back = -0.011
  const front = 0.011
  const line = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, n = 8) => {
    for (let i = points.length ? 1 : 0; i <= n; i++) {
      const t = i / n
      points.push(new THREE.Vector3(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z0 + (z1 - z0) * t))
    }
  }
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number, z0: number, z1: number, n = 14) => {
    for (let i = 1; i <= n; i++) {
      const t = i / n
      const a = a0 + (a1 - a0) * t
      points.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z0 + (z1 - z0) * t))
    }
  }
  line(-0.028, -0.06, -0.028, -0.11, back, back)
  arc(0, -0.11, 0.028, Math.PI, Math.PI * 2, back, back)
  line(0.028, -0.11, 0.028, 0.1, back, back)
  arc(-0.01, 0.1, 0.038, 0, Math.PI, back, front)
  line(-0.048, 0.1, -0.048, -0.15, front, front)
  arc(0, -0.15, 0.048, Math.PI, Math.PI * 2, front, front)
  line(0.048, -0.15, 0.048, 0.06, front, front)
  return new THREE.CatmullRomCurve3(points, false, 'centripetal')
}

export function Paperclip(props: GroupProps) {
  const { materials, compact } = useKit()
  const [geometry] = useState(() => new THREE.TubeGeometry(paperclipCurve(), compact ? 90 : 180, 0.0058, compact ? 5 : 8, false))
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <group {...props}>
      <mesh geometry={geometry} material={materials.brass} />
    </group>
  )
}

/* ───────────────────────── Fountain pen ───────────────────────── */

function buildPen(segments: number) {
  const body = new THREE.LatheGeometry(
    [
      v2(0, -0.36),
      v2(0.019, -0.36),
      v2(0.022, -0.33),
      v2(0.026, -0.25),
      v2(0.029, -0.205),
      v2(0.034, -0.196),
      v2(0.036, -0.17),
      v2(0.036, 0.3),
      v2(0.034, 0.4),
      v2(0.03, 0.46),
      v2(0.02, 0.49),
      v2(0, 0.5),
    ],
    segments,
  )

  const ringA = new THREE.TorusGeometry(0.0355, 0.0055, 8, segments)
  ringA.rotateX(Math.PI / 2)
  ringA.translate(0, -0.198, 0)
  const ringB = new THREE.TorusGeometry(0.0368, 0.0048, 8, segments)
  ringB.rotateX(Math.PI / 2)
  ringB.translate(0, 0.28, 0)

  const clipCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.46, 0.028),
    new THREE.Vector3(0, 0.43, 0.043),
    new THREE.Vector3(0, 0.32, 0.047),
    new THREE.Vector3(0, 0.2, 0.045),
  ])
  const clip = new THREE.TubeGeometry(clipCurve, 24, 0.0062, 6, false)
  const clipBall = new THREE.SphereGeometry(0.011, 12, 8)
  clipBall.translate(0, 0.2, 0.045)
  const jewel = new THREE.SphereGeometry(0.012, 16, 10)
  jewel.translate(0, 0.5, 0)

  // Nib: a flattened cone with a hint of shoulder.
  const nib = new THREE.ConeGeometry(0.021, 0.16, 24, 1)
  nib.rotateX(Math.PI)
  nib.scale(1, 1, 0.42)
  nib.translate(0, -0.44, 0)

  return { body, ringA, ringB, clip, clipBall, jewel, nib }
}

export function FountainPen(props: GroupProps) {
  const { materials, compact } = useKit()
  const [pen] = useState(() => buildPen(compact ? 24 : 40))
  useEffect(
    () => () => {
      for (const geometry of Object.values(pen)) geometry.dispose()
    },
    [pen],
  )
  return (
    <group {...props}>
      <mesh geometry={pen.body} material={materials.navy} />
      <mesh geometry={pen.ringA} material={materials.champagne} />
      <mesh geometry={pen.ringB} material={materials.champagne} />
      <mesh geometry={pen.clip} material={materials.champagne} />
      <mesh geometry={pen.clipBall} material={materials.champagne} />
      <mesh geometry={pen.jewel} material={materials.champagne} />
      <mesh geometry={pen.nib} material={materials.champagne} />
    </group>
  )
}

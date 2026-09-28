'use client'

import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { useKit } from '../core/kit'
import type { MaterialSet } from '../core/materials'

/*
 * Glyphs drawn by hand as THREE.Shape paths (cap height 1, baseline 0) in a
 * high-contrast serif spirit echoing Cormorant — no font files involved.
 */

export type Glyph = 'A' | 'B' | 'C'

function glyphA() {
  const s = new THREE.Shape()
  s.moveTo(-0.52, 0)
  s.lineTo(-0.18, 0)
  s.lineTo(-0.18, 0.045)
  s.lineTo(-0.3, 0.045) // thin left leg, inner edge ↑
  s.lineTo(-0.21, 0.27)
  s.lineTo(0.16, 0.27) // crossbar underside
  s.lineTo(0.25, 0.045) // thick right leg, inner edge ↓
  s.lineTo(0.16, 0.045)
  s.lineTo(0.16, 0)
  s.lineTo(0.54, 0)
  s.lineTo(0.54, 0.045)
  s.lineTo(0.44, 0.045)
  s.lineTo(0.06, 1) // right outer edge to the apex
  s.lineTo(-0.05, 1)
  s.lineTo(-0.4, 0.045) // left outer edge
  s.lineTo(-0.52, 0.045)
  s.closePath()

  const counter = new THREE.Path()
  counter.moveTo(-0.175, 0.36)
  counter.lineTo(-0.025, 0.736)
  counter.lineTo(0.125, 0.36)
  counter.closePath()
  s.holes.push(counter)
  return s
}

function glyphB() {
  const s = new THREE.Shape()
  s.moveTo(-0.38, 0)
  s.lineTo(0.12, 0)
  s.bezierCurveTo(0.34, 0, 0.45, 0.1, 0.45, 0.27)
  s.bezierCurveTo(0.45, 0.43, 0.33, 0.53, 0.15, 0.545)
  s.bezierCurveTo(0.3, 0.57, 0.38, 0.66, 0.38, 0.77)
  s.bezierCurveTo(0.38, 0.92, 0.27, 1, 0.08, 1)
  s.lineTo(-0.38, 1)
  s.lineTo(-0.38, 0.955)
  s.lineTo(-0.28, 0.955)
  s.lineTo(-0.28, 0.045)
  s.lineTo(-0.38, 0.045)
  s.closePath()

  const upper = new THREE.Path()
  upper.moveTo(-0.1, 0.6)
  upper.lineTo(0.07, 0.6)
  upper.bezierCurveTo(0.18, 0.6, 0.23, 0.67, 0.23, 0.755)
  upper.bezierCurveTo(0.23, 0.85, 0.18, 0.905, 0.06, 0.905)
  upper.lineTo(-0.1, 0.905)
  upper.closePath()

  const lower = new THREE.Path()
  lower.moveTo(-0.1, 0.095)
  lower.lineTo(0.1, 0.095)
  lower.bezierCurveTo(0.23, 0.095, 0.29, 0.17, 0.29, 0.28)
  lower.bezierCurveTo(0.29, 0.4, 0.22, 0.47, 0.1, 0.47)
  lower.lineTo(-0.1, 0.47)
  lower.closePath()

  s.holes.push(upper, lower)
  return s
}

function glyphC() {
  const deg = THREE.MathUtils.degToRad
  const cx = 0.02
  const cy = 0.5
  const s = new THREE.Shape()
  s.moveTo(cx + 0.46 * Math.cos(deg(40)), cy + 0.5 * Math.sin(deg(40)))
  s.absellipse(cx, cy, 0.46, 0.5, deg(40), deg(320), false, 0) // outer stroke, thick at the left
  s.absellipse(cx, cy, 0.3, 0.39, deg(314), deg(46), true, 0) // inner stroke back
  s.closePath()
  return s
}

const GLYPHS: Record<Glyph, () => THREE.Shape> = { A: glyphA, B: glyphB, C: glyphC }

export function buildGlyphGeometry(glyph: Glyph, capHeight: number, curveSegments = 18) {
  const geometry = new THREE.ExtrudeGeometry(GLYPHS[glyph](), {
    depth: 0.09,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.022,
    bevelSegments: 3,
    curveSegments,
  })
  geometry.center()
  geometry.scale(capHeight, capHeight, capHeight)
  return geometry
}

const TILE = 0.62
const TILE_DEPTH = 0.16

export function LetterTile({
  glyph,
  tile,
  letter,
  size = 1,
  ...props
}: Omit<ThreeElements['group'], 'ref' | 'children'> & {
  glyph: Glyph
  tile: keyof MaterialSet
  letter: keyof MaterialSet
  size?: number
}) {
  const { materials, compact } = useKit()
  const [geometry] = useState(() => ({
    tile: new RoundedBoxGeometry(TILE, TILE, TILE_DEPTH, compact ? 3 : 5, 0.075),
    glyph: buildGlyphGeometry(glyph, 0.36, compact ? 10 : 18),
  }))
  useEffect(
    () => () => {
      geometry.tile.dispose()
      geometry.glyph.dispose()
    },
    [geometry],
  )

  return (
    <group scale={size} {...props}>
      <mesh geometry={geometry.tile} material={materials[tile]} />
      <mesh geometry={geometry.glyph} material={materials[letter]} position={[0, 0, TILE_DEPTH / 2 + 0.012]} />
    </group>
  )
}

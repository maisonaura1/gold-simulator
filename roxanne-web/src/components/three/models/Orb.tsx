'use client'

import type { ThreeElements } from '@react-three/fiber'
import { useKit } from '../core/kit'
import type { MaterialSet } from '../core/materials'

export type OrbFinish = keyof MaterialSet

/** A small sphere in one of the shared finishes (ivory ceramic, clay, glass, brass…). */
export function Orb({
  finish,
  radius,
  ...props
}: Omit<ThreeElements['mesh'], 'ref' | 'children' | 'geometry' | 'material'> & { finish: OrbFinish; radius: number }) {
  const { materials, sphere } = useKit()
  return <mesh geometry={sphere} material={materials[finish]} scale={radius} renderOrder={finish === 'glass' ? 2 : 0} {...props} />
}

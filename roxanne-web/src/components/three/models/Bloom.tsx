'use client'

import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useKit, useSceneFrame } from '../core/kit'
import { BloomMaterial, type BloomOptions } from '../core/materials'

type MeshProps = Omit<ThreeElements['mesh'], 'ref' | 'children' | 'geometry' | 'material'>

/** The pearlescent "fluid bloom" — the brand's organic motif. */
export function Bloom({
  radius = 1,
  speed = 1,
  colorA,
  colorB,
  amplitude,
  frequency,
  ...props
}: MeshProps & BloomOptions & { radius?: number; speed?: number }) {
  const { compact } = useKit()
  const [material] = useState(() => new BloomMaterial({ colorA, colorB, amplitude, frequency }))
  const [geometry] = useState(() => new THREE.SphereGeometry(1, compact ? 72 : 128, compact ? 54 : 96))
  useEffect(
    () => () => {
      material.dispose()
      geometry.dispose()
    },
    [material, geometry],
  )

  const mesh = useRef<THREE.Mesh<THREE.SphereGeometry, BloomMaterial>>(null)
  useSceneFrame((t) => {
    if (mesh.current) mesh.current.material.bloom.uTime.value = t * speed
  })

  return <mesh ref={mesh} geometry={geometry} material={material} scale={radius} {...props} />
}

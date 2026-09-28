'use client'

import { useThree, type ThreeElements } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import * as THREE from 'three'
import { useKit, useSceneFrame } from './kit'
import { damp } from './palette'
import { canUsePointerParallax, readPointer, subscribePointer } from './pointer'

type GroupProps = Omit<ThreeElements['group'], 'ref' | 'children'>

/**
 * Perspective camera that always "contains" a design box of `width × height`
 * world units (centred on the origin, on the z = 0 plane) whatever the canvas
 * aspect, so compositions line up with the HTML they decorate.
 */
export function FitCamera({ width, height, fov = 28, elevation = 0 }: { width: number; height: number; fov?: number; elevation?: number }) {
  const set = useThree((s) => s.set)
  const size = useThree((s) => s.size)
  const ref = useRef<THREE.PerspectiveCamera>(null)

  const aspect = size.width / Math.max(1, size.height)
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(fov) / 2)
  const distance = Math.max(height / 2 / tanHalf, width / 2 / (tanHalf * aspect))

  useLayoutEffect(() => {
    if (ref.current) set({ camera: ref.current })
  }, [set])

  useLayoutEffect(() => {
    ref.current?.updateProjectionMatrix()
  })

  return (
    <perspectiveCamera
      ref={ref}
      fov={fov}
      aspect={aspect}
      near={0.1}
      far={distance * 8}
      position={[0, Math.sin(elevation) * distance, Math.cos(elevation) * distance]}
      rotation={[-elevation, 0, 0]}
    />
  )
}

/**
 * Idle floating (a deterministic take on drei's <Float>): driven by the scene
 * clock so it pauses cleanly, and seeded so the reduced-motion still is stable.
 */
export function Drift({
  children,
  speed = 1,
  float = 0.05,
  tilt = 0.08,
  seed = 0,
  innerRef,
  ...props
}: GroupProps & {
  children: ReactNode
  speed?: number
  float?: number
  tilt?: number
  seed?: number
  innerRef?: RefObject<THREE.Group | null>
}) {
  const local = useRef<THREE.Group>(null)
  const ref = innerRef ?? local

  useSceneFrame((t) => {
    const g = ref.current
    if (!g) return
    const s = t * speed + seed * 7.31
    g.position.y = Math.sin(s * 0.8) * float
    g.rotation.x = Math.cos(s * 0.5) * tilt * 0.7
    g.rotation.y = Math.sin(s * 0.4) * tilt
    g.rotation.z = Math.sin(s * 0.63) * tilt * 0.45
  })

  return (
    <group {...props}>
      <group ref={ref}>{children}</group>
    </group>
  )
}

/**
 * Subtle parallax toward the window pointer (fine pointers only). The canvas
 * itself never receives pointer events.
 */
export function PointerParallax({
  children,
  move = 0.05,
  tilt = 0.1,
  ...props
}: GroupProps & { children: ReactNode; move?: number; tilt?: number }) {
  const ref = useRef<THREE.Group>(null)
  const smooth = useRef({ x: 0, y: 0 })
  const { reduced } = useKit()

  useEffect(() => {
    if (reduced || !canUsePointerParallax()) return
    return subscribePointer()
  }, [reduced])

  useSceneFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const p = readPointer()
    const s = smooth.current
    const k = damp(2.2, dt)
    s.x += (p.x - s.x) * k
    s.y += (p.y - s.y) * k
    g.position.x = s.x * move
    g.position.y = s.y * move
    g.rotation.y = s.x * tilt
    g.rotation.x = -s.y * tilt * 0.6
  })

  return (
    <group {...props}>
      <group ref={ref}>{children}</group>
    </group>
  )
}

/**
 * Soft contact shadow on an implied floor (a horizontal plane, so it reads
 * correctly from elevated cameras). When `follow` points at a floating group
 * it shrinks and fades as that group rises.
 */
export function ShadowBlob({
  width = 1,
  depth = 1,
  opacity = 0.45,
  follow,
  ...props
}: GroupProps & { width?: number; depth?: number; opacity?: number; follow?: RefObject<THREE.Object3D | null> }) {
  const { shadowMap } = useKit()
  const mesh = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null)

  useSceneFrame(() => {
    const m = mesh.current
    const target = follow?.current
    if (!m || !target) return
    const k = 1 - THREE.MathUtils.clamp(target.position.y * 2.2, -0.25, 0.5)
    m.scale.set(width * k, depth * k, 1)
    m.material.opacity = opacity * k
  })

  return (
    <group {...props}>
      <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} scale={[width, depth, 1]} renderOrder={-2}>
        <planeGeometry />
        <meshBasicMaterial map={shadowMap} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

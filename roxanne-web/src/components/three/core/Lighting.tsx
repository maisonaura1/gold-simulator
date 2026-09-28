'use client'

import { Lightformer } from '@react-three/drei'
import { createPortal, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'

/*
 * Fully procedural image-based lighting. Lightformers (emissive cards) and a
 * warm gradient dome are rendered once into a small HDR cube map that becomes
 * `scene.environment`. No HDR files, presets or network requests.
 *
 * (drei's <Environment> does the same job but statically bundles the HDR/EXR
 * and gain-map loaders; this keeps the 3D chunk lean.)
 */

function bakeCubeMap(gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.CubeCamera) {
  const autoClear = gl.autoClear
  gl.autoClear = true
  camera.update(gl, scene)
  gl.autoClear = autoClear
}

function applyEnvironment(scene: THREE.Scene, texture: THREE.Texture) {
  const previous = scene.environment
  scene.environment = texture
  return () => {
    scene.environment = previous
  }
}

function LightformerEnvironment({ resolution = 128, children }: { resolution?: number; children: ReactNode }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const invalidate = useThree((s) => s.invalidate)
  const [virtualScene] = useState(() => new THREE.Scene())
  const [target] = useState(() => new THREE.WebGLCubeRenderTarget(resolution, { type: THREE.HalfFloatType }))
  const cubeCamera = useRef<THREE.CubeCamera>(null)

  useLayoutEffect(() => {
    if (!cubeCamera.current) return
    bakeCubeMap(gl, virtualScene, cubeCamera.current)
    const restore = applyEnvironment(scene, target.texture)
    invalidate()
    return restore
  }, [gl, scene, virtualScene, target, invalidate])

  useEffect(() => () => target.dispose(), [target])

  return createPortal(
    <>
      {children}
      <cubeCamera ref={cubeCamera} args={[0.1, 100, target]} />
    </>,
    virtualScene,
  )
}

/** Warm studio dome: ivory sky, tan horizon, deep aubergine floor (gives brass its contrast). */
function Dome() {
  const [geometry] = useState(() => {
    const g = new THREE.SphereGeometry(40, 32, 24)
    const position = g.attributes.position
    const colors = new Float32Array(position.count * 3)
    const top = new THREE.Color('#fff4e9').multiplyScalar(0.95)
    const horizon = new THREE.Color('#dfc1a8').multiplyScalar(0.8)
    const floor = new THREE.Color('#2c2432').multiplyScalar(0.42)
    const c = new THREE.Color()
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i) / 40
      // Dark only close to the floor: enough contrast for turned brass without
      // turning flat metal faces (seen from slightly above) bronze.
      if (y >= 0) c.copy(horizon).lerp(top, Math.pow(y, 0.65))
      else c.copy(horizon).lerp(floor, Math.pow(-y, 1.5))
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  })
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

export function StudioLighting({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <LightformerEnvironment resolution={compact ? 64 : 128}>
        <Dome />
        {/* Key softbox, upper left */}
        <Lightformer form="rect" color="#fff5ea" intensity={3.2} position={[-3, 4.5, 4]} scale={[6, 3, 1]} target={[0, 0, 0]} />
        {/* Tall strip right — long vertical highlights on turned brass */}
        <Lightformer form="rect" color="#ffffff" intensity={2.6} position={[5.5, 1, 1.5]} scale={[1, 8, 1]} target={[0, 0, 0]} />
        {/* Softer strip left/back */}
        <Lightformer form="rect" color="#ffe6d8" intensity={1.3} position={[-5.5, 0.5, -2]} scale={[1, 7, 1]} target={[0, 0, 0]} />
        {/* Blush bounce from below */}
        <Lightformer form="rect" color="#f0b49b" intensity={0.9} position={[0, -5, 2.5]} scale={[10, 3, 1]} target={[0, 0, 0]} />
        {/* Ring catch-light for spheres */}
        <Lightformer form="ring" color="#fffaf3" intensity={1.8} position={[1.8, 2.6, 6]} scale={2.4} target={[0, 0, 0]} />
        {/* Broad front fill behind the viewer: lifts paper and camera-facing metal */}
        <Lightformer form="rect" color="#fff3ea" intensity={0.9} position={[-0.5, 0.4, 9]} scale={[9, 5, 1]} target={[0, 0, 0]} />
      </LightformerEnvironment>
      {/* Diffuse-only lift for paper and ceramics (metals take their look from the environment) */}
      <hemisphereLight args={['#fff5ec', '#7a5d52', 0.85]} />
      <directionalLight position={[-3, 5, 5]} intensity={1.6} color="#fff1e2" />
      <directionalLight position={[4, 2.5, -4]} intensity={0.9} color="#ffd6c2" />
    </>
  )
}

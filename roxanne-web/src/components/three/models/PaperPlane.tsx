'use client'

import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useKit, useSceneFrame } from '../core/kit'
import type { MaterialSet } from '../core/materials'

type GroupProps = Omit<ThreeElements['group'], 'ref' | 'children'>

/**
 * A folded dart: wings with a crease, and a keel, as flat-shaded facets
 * (non-indexed triangles so every fold catches the light on its own).
 */
function buildPlane() {
  const nose = [0.52, 0, 0]
  const tail = [-0.42, 0, 0]
  // The keel is a thin V (two panels), never two coplanar faces.
  const keelL = [-0.4, -0.14, 0.014]
  const keelR = [-0.4, -0.14, -0.014]
  // Wings rise from the centre fold (dihedral) with a second crease.
  const tipL = [-0.47, 0.12, 0.35]
  const tipR = [-0.47, 0.12, -0.35]
  const creaseL = [-0.45, 0.018, 0.12]
  const creaseR = [-0.45, 0.018, -0.12]
  const triangles = [
    // Wings (paper; their underside is tinted by the material)…
    [nose, tail, creaseL],
    [nose, creaseL, tipL],
    [nose, creaseR, tail],
    [nose, tipR, creaseR],
    // …and the keel panels in blush.
    [nose, tail, keelL],
    [nose, keelR, tail],
  ]
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(triangles.flat(2), 3))
  geometry.computeVertexNormals()
  geometry.addGroup(0, 12, 0)
  geometry.addGroup(12, 6, 1)
  return geometry
}

export function PaperPlane(props: GroupProps) {
  const { materials } = useKit()
  const [geometry] = useState(buildPlane)
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <group {...props}>
      <mesh geometry={geometry} material={[materials.paper, materials.paperBlush]} />
    </group>
  )
}

/**
 * Dots streaming along `points` (from the far end to the plane), shrinking and
 * fading toward the far end — one instanced draw call.
 */
export function DottedTrail({
  points,
  count = 30,
  radius = 0.018,
  speed = 0.045,
  finish = 'clay',
  ...props
}: GroupProps & { points: [number, number, number][]; count?: number; radius?: number; speed?: number; finish?: keyof MaterialSet }) {
  const { materials, sphere, reduced } = useKit()
  const [curve] = useState(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'centripetal'))
  const mesh = useRef<THREE.InstancedMesh>(null)
  const scratch = useRef({ matrix: new THREE.Matrix4(), position: new THREE.Vector3(), scale: new THREE.Vector3(), quaternion: new THREE.Quaternion() })

  useSceneFrame((t) => {
    const m = mesh.current
    if (!m) return
    const { matrix, position, scale, quaternion } = scratch.current
    for (let i = 0; i < count; i++) {
      // u = 1 at the plane; dots drift away from it toward u = 0.
      const u = reduced ? i / count : (((i / count - t * speed) % 1) + 1) % 1
      curve.getPointAt(u, position)
      const fadeIn = THREE.MathUtils.smoothstep(u, 0, 0.18)
      const fadeOut = 1 - THREE.MathUtils.smoothstep(u, 0.94, 1)
      const s = radius * (0.35 + 0.65 * u) * fadeIn * fadeOut
      scale.setScalar(Math.max(s, 0.0001))
      matrix.compose(position, quaternion, scale)
      m.setMatrixAt(i, matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group {...props}>
      <instancedMesh ref={mesh} args={[sphere, materials[finish], count]} frustumCulled={false} />
    </group>
  )
}

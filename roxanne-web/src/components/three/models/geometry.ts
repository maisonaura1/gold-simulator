import * as THREE from 'three'

/** Shorthand for lathe profile points: (radius, height). */
export const v2 = (x: number, y: number) => new THREE.Vector2(x, y)

/** Samples a cubic Bézier into profile points (first point included). */
export function bezier2(a: THREE.Vector2, b: THREE.Vector2, c: THREE.Vector2, d: THREE.Vector2, steps = 12) {
  return new THREE.CubicBezierCurve(a, b, c, d).getPoints(steps)
}

/** Thin cylinder between two points (for rods, pins, stems). */
export function rodBetween(from: THREE.Vector3, to: THREE.Vector3, radius: number, radialSegments = 8) {
  const length = from.distanceTo(to)
  const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, true)
  geometry.translate(0, length / 2, 0)
  const direction = to.clone().sub(from).normalize()
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction))
  geometry.translate(from.x, from.y, from.z)
  return geometry
}

/** Dispose every BufferGeometry found in a (flat) record. */
export function disposeGeometries(record: Record<string, THREE.BufferGeometry>) {
  for (const geometry of Object.values(record)) geometry.dispose()
}

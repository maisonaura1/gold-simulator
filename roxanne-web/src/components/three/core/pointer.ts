/**
 * One shared, passive window listener for pointer parallax. The hero canvas is
 * `pointer-events: none`, so we track the whole window instead of the canvas.
 * Values are normalised to [-1, 1] around the viewport centre (y up).
 */
const pointer = { x: 0, y: 0 }
let subscribers = 0

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = 1 - (event.clientY / window.innerHeight) * 2
}

/** Only fine pointers that can hover get parallax (no effect on touch). */
export function canUsePointerParallax() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function subscribePointer() {
  if (subscribers++ === 0) window.addEventListener('pointermove', onPointerMove, { passive: true })
  return () => {
    if (--subscribers === 0) {
      window.removeEventListener('pointermove', onPointerMove)
      pointer.x = 0
      pointer.y = 0
    }
  }
}

export function readPointer(): Readonly<{ x: number; y: number }> {
  return pointer
}

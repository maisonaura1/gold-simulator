'use client'

import { Stage } from './core/Stage'
import type { CanvasBridgeProps } from './core/types'
import { HeroScene } from './scenes/HeroScene'

/** Lazily loaded (see ./index.tsx) — pulls three.js into its own chunk. */
export default function HeroCanvas(props: CanvasBridgeProps) {
  return (
    <Stage {...props} maxDpr={1.75}>
      <HeroScene />
    </Stage>
  )
}

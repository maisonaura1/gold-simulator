'use client'

import { Stage } from './core/Stage'
import type { CanvasBridgeProps, Motif } from './core/types'
import { MotifScene } from './scenes/MotifScene'

/** Lazily loaded (see ./index.tsx) — one light scene per inner-page motif. */
export default function MotifCanvas({ motif, ...props }: CanvasBridgeProps & { motif: Motif }) {
  return (
    <Stage {...props} maxDpr={1.75}>
      <MotifScene motif={motif} />
    </Stage>
  )
}

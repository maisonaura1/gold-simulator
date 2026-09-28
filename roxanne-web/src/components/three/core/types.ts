import type { Motif } from '../index'

export type { Motif }

/** Props the light gate in `../index.tsx` hands to the lazily loaded canvases. */
export interface CanvasBridgeProps {
  /** Near the viewport and the tab is visible — animate. */
  active: boolean
  /** prefers-reduced-motion: render a single still frame. */
  reduced: boolean
  /** First frame with content has been presented (used to fade the canvas in). */
  onReady: () => void
  /** WebGL context lost or unusable — the gate unmounts the canvas. */
  onLost: () => void
}

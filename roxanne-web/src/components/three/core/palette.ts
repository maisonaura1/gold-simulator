/** Brand palette (mirrors the Tailwind tokens in globals.css). */
export const PALETTE = {
  ivory: '#faf6f0',
  cream: '#f4ece2',
  blush: '#ebd8cc',
  sand: '#e4d5c3',
  clay: '#a5533a',
  claySoft: '#c98a70',
  navy: '#1b2436',
  ink: '#1f2533',
  sage: '#6f7f68',
  gold: '#b08d57',
  goldSoft: '#d8c19a',
} as const

/** Small deterministic PRNG (mulberry32) so every render — and the reduced-motion still — is identical. */
export function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const easeOutCubic = (v: number) => 1 - Math.pow(1 - clamp01(v), 3)
export const easeInOutSine = (v: number) => -(Math.cos(Math.PI * clamp01(v)) - 1) / 2
export const easeOutBack = (v: number) => {
  const c1 = 1.2
  const c3 = c1 + 1
  const x = clamp01(v)
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

/** Frame-rate independent exponential smoothing factor. */
export const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt)

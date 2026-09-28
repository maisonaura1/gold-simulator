import * as THREE from 'three'
import { PALETTE, seeded } from './palette'

/*
 * Every texture is painted at runtime on a small 2D canvas — no image files,
 * nothing fetched over the network (CSP allows 'self' only).
 */

function canvas2d(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')
  return { canvas, ctx }
}

/**
 * Roughness map with fine parallel streaks. On lathe-turned parts (UV u runs
 * around the axis) the streaks become concentric, like machined brass.
 */
export function createBrushedTexture(size = 256) {
  const { canvas, ctx } = canvas2d(size, size)
  ctx.fillStyle = 'rgb(214,214,214)'
  ctx.fillRect(0, 0, size, size)
  const rand = seeded(11)
  for (let i = 0; i < size * 3; i++) {
    const v = Math.round(150 + rand() * 105)
    ctx.fillStyle = `rgba(${v},${v},${v},${(0.25 + rand() * 0.55).toFixed(2)})`
    ctx.fillRect(0, rand() * size, size, rand() < 0.85 ? 1 : 2)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.NoColorSpace
  texture.anisotropy = 4
  return texture
}

/** Soft radial blob used as a cheap contact shadow under floating objects. */
export function createShadowTexture(size = 128) {
  const { canvas, ctx } = canvas2d(size, size)
  const c = size / 2
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c)
  gradient.addColorStop(0, 'rgba(31,37,51,0.62)')
  gradient.addColorStop(0.35, 'rgba(31,37,51,0.34)')
  gradient.addColorStop(0.7, 'rgba(31,37,51,0.08)')
  gradient.addColorStop(1, 'rgba(31,37,51,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * A sheet of paper: warm off-white with ruled "text" lines, a heading and a
 * signature flourish. Painted with shapes only — no fonts are needed.
 */
export function createDocumentTexture(variant: 'contract' | 'letter' | 'plain' = 'contract') {
  const width = 360
  const height = 500
  const { canvas, ctx } = canvas2d(width, height)
  const rand = seeded(variant === 'contract' ? 3 : variant === 'letter' ? 5 : 9)

  // Paper with a whisper of warmth towards the edges.
  const paper = ctx.createLinearGradient(0, 0, width, height)
  paper.addColorStop(0, '#fffdf9')
  paper.addColorStop(1, '#f6efe5')
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, width, height)

  // Fibres.
  for (let i = 0; i < 420; i++) {
    ctx.fillStyle = `rgba(120,96,70,${(rand() * 0.035).toFixed(3)})`
    ctx.fillRect(rand() * width, rand() * height, 1 + rand() * 3, 1)
  }

  if (variant === 'plain') {
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  }

  const margin = 40
  const bar = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color
    if (typeof ctx.roundRect !== 'function') {
      ctx.fillRect(x, y, w, h)
      return
    }
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, h / 2)
    ctx.fill()
  }

  // Heading.
  bar(margin, 44, variant === 'contract' ? 150 : 110, 11, 'rgba(27,36,54,0.78)')
  bar(margin, 66, 90, 6, 'rgba(165,83,58,0.75)')
  ctx.fillStyle = 'rgba(176,141,87,0.55)'
  ctx.fillRect(margin, 88, width - margin * 2, 1.5)

  // Body copy.
  let y = 112
  const lines = variant === 'contract' ? 17 : 13
  for (let i = 0; i < lines; i++) {
    const paragraphEnd = i % 5 === 4
    const w = (width - margin * 2) * (paragraphEnd ? 0.45 + rand() * 0.2 : 0.86 + rand() * 0.14)
    bar(margin, y, w, 5, 'rgba(31,37,51,0.22)')
    y += paragraphEnd ? 26 : 17
  }

  // Signature flourish.
  ctx.strokeStyle = 'rgba(27,36,54,0.7)'
  ctx.lineWidth = 2.2
  ctx.lineCap = 'round'
  ctx.beginPath()
  const sx = margin + 6
  const sy = height - 62
  ctx.moveTo(sx, sy)
  ctx.bezierCurveTo(sx + 18, sy - 30, sx + 30, sy + 12, sx + 44, sy - 8)
  ctx.bezierCurveTo(sx + 58, sy - 26, sx + 64, sy + 8, sx + 84, sy - 4)
  ctx.bezierCurveTo(sx + 98, sy - 12, sx + 110, sy + 2, sx + 128, sy - 6)
  ctx.stroke()
  ctx.fillStyle = 'rgba(31,37,51,0.25)'
  ctx.fillRect(margin, height - 44, 150, 1.5)

  if (variant === 'contract') {
    // Wax seal in terracotta.
    const cx = width - margin - 34
    const cy = height - 66
    ctx.fillStyle = PALETTE.clay
    ctx.beginPath()
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2
      const r = 30 + (i % 2 === 0 ? 2.5 : -1)
      if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
      else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    }
    ctx.fill()
    ctx.strokeStyle = 'rgba(250,246,240,0.55)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(cx, cy, 20, 0, Math.PI * 2)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

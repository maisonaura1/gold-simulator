import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const FONT_DIR = join(process.cwd(), 'src/assets/fonts')

/** Cormorant Garamond (woff — Satori can't read woff2) for generated images. */
export async function loadOgFonts() {
  const [regular, italic, semibold] = await Promise.all([
    readFile(join(FONT_DIR, 'cormorant-garamond-latin-500-normal.woff')),
    readFile(join(FONT_DIR, 'cormorant-garamond-latin-500-italic.woff')),
    readFile(join(FONT_DIR, 'cormorant-garamond-latin-600-normal.woff')),
  ])
  return [
    { name: 'Cormorant', data: regular, weight: 500 as const, style: 'normal' as const },
    { name: 'Cormorant', data: italic, weight: 500 as const, style: 'italic' as const },
    { name: 'Cormorant', data: semibold, weight: 600 as const, style: 'normal' as const },
  ]
}

/** The arch logo mark as an SVG element Satori can render. */
export function ArchMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={(size * 40) / 32} viewBox="0 0 32 40">
      <path d="M4 38V16a12 12 0 0 1 24 0v22" fill="none" stroke={color} strokeWidth="2.2" />
      <path d="M9 38V17a7 7 0 0 1 14 0v21" fill="none" stroke={color} strokeWidth="1.3" opacity="0.5" />
      <circle cx="16" cy="25" r="3" fill={color} />
    </svg>
  )
}

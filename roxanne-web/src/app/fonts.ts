import localFont from 'next/font/local'

// Self-hosted from npm (@fontsource) so builds never depend on a font CDN.
// Only the faces the design uses are preloaded: Cormorant 500 (regular + italic) and Manrope (variable).
export const display = localFont({
  variable: '--font-cormorant',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  src: [
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
  ],
})

export const sans = localFont({
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
  src: [
    { path: '../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', weight: '200 800', style: 'normal' },
  ],
})

import type { Metadata, Viewport } from 'next'
import { display, sans } from './fonts'
import { siteUrl } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  applicationName: 'RoxanneAlexia Language Coach',
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: '#faf6f0',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-dvh bg-ivory text-ink antialiased">{children}</body>
    </html>
  )
}

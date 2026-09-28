import type { Metadata, Viewport } from 'next'
import { display, sans } from './fonts'
import { siteUrl } from '@/lib/site'
import './globals.css'

// Safety net: a production build without a real public URL must never be indexed with localhost canonicals.
const unconfiguredProduction = process.env.NODE_ENV === 'production' && siteUrl().includes('localhost')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'RoxanneAlexia Language Coach — Law & Business English', template: '%s | RoxanneAlexia' },
  description: 'Expert online English language courses for adults in business, law, and finance.',
  applicationName: 'RoxanneAlexia Language Coach',
  formatDetection: { telephone: false, email: false, address: false },
  ...(unconfiguredProduction ? { robots: { index: false, follow: false } } : {}),
}

export const viewport: Viewport = {
  themeColor: '#faf6f0',
  width: 'device-width',
  initialScale: 1,
}

/** Runs before first paint: lets CSS hide scroll-reveal content only when JavaScript is available. */
const JS_FLAG = "document.documentElement.classList.add('js')"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the inline script adds the `js` class before React hydrates.
    <html lang="en" className={`${display.variable} ${sans.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="min-h-dvh bg-ivory text-ink antialiased">{children}</body>
    </html>
  )
}

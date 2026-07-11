import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://goldtrader.app'),
  title: 'GoldTrader — XAUUSD Trading Simulator',
  description: 'Practice gold spot trading on real XAUUSD data. Risk calculator, Trader Score, equity curve and replay — without risking real capital.',
  keywords: 'gold trading simulator, XAUUSD practice, trading education, prop firm preparation, risk management, FTMO',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'GoldTrader — XAUUSD Trading Simulator',
    description: 'Practice on real gold spot data. Build discipline. Track your Trader Score.',
    type: 'website',
    siteName: 'GoldTrader',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoldTrader — XAUUSD Trading Simulator',
    description: 'Practice gold trading. Build real discipline. Trader Score, equity curve, 8 timeframes.',
  },
};

// Viewport must be a separate export in Next.js 14 — not inside metadata
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07080b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

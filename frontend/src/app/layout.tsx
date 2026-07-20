import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://goldtradermt.app'),
  title: 'GoldTrader MT — XAUUSD Simulator | Practice Prop Firm Challenges',
  description: 'Would you pass the FTMO or Funded Next challenge? Practice on real XAUUSD data, master drawdown and consistency score — without risking real capital.',
  keywords: 'gold trading simulator, XAUUSD practice, prop firm challenge, FTMO prep, Funded Next, trading education, risk management, gold spot simulator, trader score',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'GoldTrader MT — XAUUSD Simulator',
    description: 'Would you pass the challenge? Practice on real gold data. Drawdown, consistency, Trader Score — zero capital at risk.',
    type: 'website',
    url: 'https://goldtradermt.app',
    siteName: 'GoldTrader MT',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoldTrader MT — XAUUSD Simulator',
    description: 'Would you pass the FTMO challenge? Practice on real XAUUSD data. 20 free simulations, zero capital at risk.',
    site: '@goldtradermt',
  },
  alternates: {
    canonical: 'https://goldtradermt.app',
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
      <body className="h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

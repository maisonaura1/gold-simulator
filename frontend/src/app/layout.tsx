import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://goldtradermt.app'),
  title: 'GoldTrader MT — XAUUSD Simulator | Practica Prop Firm Challenges',
  description: '¿Pasarías el challenge de FTMO o Funded Next? Practica en datos reales de XAUUSD, controla drawdown y consistency score — sin arriesgar capital real.',
  keywords: 'gold trading simulator, XAUUSD practice, prop firm challenge, FTMO prep, trading education, risk management, simulador oro, Funded Next',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'GoldTrader MT — XAUUSD Simulator',
    description: '¿Pasarías el challenge? Practica en datos reales de oro. Drawdown, consistency, Trader Score — sin capital real.',
    type: 'website',
    url: 'https://goldtradermt.app',
    siteName: 'GoldTrader MT',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoldTrader MT — XAUUSD Simulator',
    description: '¿Pasarías el challenge de FTMO? Practica en datos reales XAUUSD. 20 simulaciones gratis.',
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

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://goldtrader.app'),
  title: 'GoldTrader — XAUUSD Trading Simulator',
  description: 'Practice gold spot trading on real XAUUSD data. Risk calculator, Trader Score, equity curve and replay — without risking real capital.',
  keywords: 'gold trading simulator, XAUUSD practice, trading education, prop firm preparation, risk management, FTMO',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#07080b" />
      </head>
      <body className="h-full overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

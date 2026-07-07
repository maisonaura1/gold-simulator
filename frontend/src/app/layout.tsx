import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoldTrader — XAUUSD Trading Simulator',
  description: 'Practice gold spot trading on real XAUUSD data. Risk calculator, Trader Score, equity curve and replay — without risking real capital.',
  keywords: 'gold trading simulator, XAUUSD practice, trading education, prop firm preparation, risk management, FTMO',
  openGraph: {
    title: 'GoldTrader — XAUUSD Trading Simulator',
    description: 'Practice on real gold spot data. Build discipline. Track your progress.',
    type: 'website',
  },
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

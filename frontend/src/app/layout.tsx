import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoldTrader MT — XAUUSD Simulator',
  description: 'Simulador profesional de trading de oro estilo MetaTrader',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

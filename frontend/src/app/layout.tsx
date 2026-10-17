import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CatalogProvider } from '@/components/academy/CatalogProvider';
import { buildCatalog } from '@/lib/academy';

const catalog = buildCatalog();

const SITE = 'https://goldtradermt.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'GoldTrader MT — Aprende a operar oro y practica sin riesgo',
    template: '%s · GoldTrader MT',
  },
  description:
    'Academia de trading de oro (XAU/USD) en español con simulador de datos reales. Aprende paso a paso, practica cada lección y mide tu progreso sin arriesgar dinero.',
  keywords:
    'academia trading oro, aprender trading, XAUUSD, simulador trading, gestión del riesgo, análisis técnico, curso trading español',
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'GoldTrader' },
  openGraph: {
    title: 'GoldTrader MT — Academia de trading de oro',
    description: 'Aprende a operar oro paso a paso y practica cada lección en un simulador con datos reales.',
    type: 'website',
    url: SITE,
    siteName: 'GoldTrader MT',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoldTrader MT — Academia de trading de oro',
    description: 'Aprende, practica y mide tu progreso sin arriesgar dinero.',
  },
  alternates: { canonical: SITE },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#08090c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <CatalogProvider catalog={catalog}>{children}</CatalogProvider>
      </body>
    </html>
  );
}

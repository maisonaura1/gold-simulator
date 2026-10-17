import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TradeScreen } from './TradeScreen';

export const metadata: Metadata = { title: 'Simulador' };

export default function TradePage() {
  return (
    <AppShell fullBleed>
      <Suspense>
        <TradeScreen />
      </Suspense>
    </AppShell>
  );
}

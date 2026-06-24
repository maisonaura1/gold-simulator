'use client';
import { AppShell }          from '@/components/layout/AppShell';
import { PriceChart }        from '@/components/charts/PriceChart';
import { usePricesStore }    from '@/store/prices.store';
import { useReplay }         from '@/hooks/useReplay';
import { useOpenTradeLines } from '@/hooks/useOpenTradeLines';

function DashboardInner() {
  const allCandles = usePricesStore((s) => s.candles);
  useReplay(allCandles);
  useOpenTradeLines();
  return (
    <div className="h-full w-full flex flex-col">
      <PriceChart />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardInner />
    </AppShell>
  );
}

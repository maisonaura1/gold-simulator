'use client';
import { useState } from 'react';
import { AppShell }              from '@/components/layout/AppShell';
import { PriceChart }            from '@/components/charts/PriceChart';
import { OrderTicket }           from '@/components/trade/OrderTicket';
import { SimulationResultPanel } from '@/components/trade/SimulationResult';
import { usePricesStore }        from '@/store/prices.store';
import { useReplay }             from '@/hooks/useReplay';
import { useOpenTradeLines }     from '@/hooks/useOpenTradeLines';
import type { SimulationResult } from '@/types';

function TradeInner() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const allCandles = usePricesStore((s) => s.candles);

  useReplay(allCandles);
  useOpenTradeLines();

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <PriceChart />
      </div>
      <OrderTicket onResult={setResult} />
      {result && <SimulationResultPanel result={result} onClose={() => setResult(null)} />}
    </div>
  );
}

export default function TradePage() {
  return (
    <AppShell>
      <TradeInner />
    </AppShell>
  );
}

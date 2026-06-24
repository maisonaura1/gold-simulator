'use client';
import { useEffect } from 'react';
import { useChartLines } from '@/store/chart-lines.store';
import { useTrades }     from '@/hooks/useTrades';

/** Mantiene sincronizadas las líneas de trades abiertos en el gráfico */
export function useOpenTradeLines() {
  const { openTrades } = useTrades();
  const { setOpenLines } = useChartLines();

  useEffect(() => {
    setOpenLines(
      openTrades.map((t) => ({
        id:         t.id,
        type:       t.type,
        entryPrice: t.entryPrice,
        sl:         t.sl,
        tp:         t.tp,
      })),
    );
  }, [openTrades, setOpenLines]);
}

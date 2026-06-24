'use client';
import { useEffect, useRef } from 'react';
import { useChartStore } from '@/store/chart.store';
import { usePricesStore } from '@/store/prices.store';
import type { PriceTick } from '@/types';

/**
 * Modo replay: reproduce candles históricas una por una como si fueran en vivo.
 * Cuando se activa, guarda las candles actuales y las reproduce desde el inicio.
 * Cuando se desactiva, restaura todas las candles.
 */
export function useReplay(allCandles: PriceTick[]) {
  const { replayMode, replaySpeed } = useChartStore();
  const { setCandles }              = usePricesStore();

  const indexRef    = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!replayMode) {
      // Restore full candles when replay stops
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCandles(allCandles);
      return;
    }

    // Start replay from 50 candles back so user sees history
    const startIdx = Math.max(0, allCandles.length - 200);
    indexRef.current = startIdx + 50;

    // Show initial slice
    setCandles(allCandles.slice(startIdx, indexRef.current));

    intervalRef.current = setInterval(() => {
      if (indexRef.current >= allCandles.length) {
        // Loop back
        indexRef.current = startIdx + 50;
        setCandles(allCandles.slice(startIdx, indexRef.current));
        return;
      }
      indexRef.current++;
      setCandles(allCandles.slice(startIdx, indexRef.current));
    }, replaySpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [replayMode, replaySpeed, allCandles, setCandles]);
}

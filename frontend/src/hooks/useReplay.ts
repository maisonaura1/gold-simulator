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

  // Keep a ref so the effect can read the latest candles without re-triggering
  const sourceRef   = useRef(allCandles);
  useEffect(() => { sourceRef.current = allCandles; }, [allCandles]);

  // Full history captured when replay starts: while replaying, the store (and
  // so allCandles) only holds the replayed slice
  const snapshotRef = useRef<PriceTick[] | null>(null);
  const indexRef    = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!replayMode) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (snapshotRef.current) {
        setCandles(snapshotRef.current);
        snapshotRef.current = null;
      }
      return;
    }

    // Speed changes re-run this effect: keep replaying the original snapshot
    const src = snapshotRef.current ?? sourceRef.current;
    snapshotRef.current = src;

    const startIdx = Math.max(0, src.length - 200);
    indexRef.current = startIdx + 50;
    setCandles(src.slice(startIdx, indexRef.current));

    intervalRef.current = setInterval(() => {
      if (indexRef.current >= src.length) {
        indexRef.current = startIdx + 50;
        setCandles(src.slice(startIdx, indexRef.current));
        return;
      }
      indexRef.current++;
      setCandles(src.slice(startIdx, indexRef.current));
    }, replaySpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayMode, replaySpeed, setCandles]);
}

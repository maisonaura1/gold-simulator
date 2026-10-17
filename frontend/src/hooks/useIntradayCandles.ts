'use client';
import { useEffect, useRef, useState } from 'react';
import { useChartStore, type Timeframe } from '@/store/chart.store';
import { usePricesStore } from '@/store/prices.store';
import type { PriceTick } from '@/types';
import { API_URL } from '@/lib/config';

const INTRADAY: Partial<Record<Timeframe, number>> = { M1: 60_000, M5: 300_000, M15: 900_000 };
const H1 = 3_600_000;

interface CacheEntry {
  candles: PriceTick[];
  synthetic: boolean;
}

/**
 * Elige la fuente de velas según la temporalidad: H1 y superiores usan el histórico
 * del WebSocket; M1/M5/M15 se piden al backend (o a la ruta /api local como respaldo).
 */
export function useIntradayCandles() {
  const timeframe = useChartStore((s) => s.timeframe);
  const replayMode = useChartStore((s) => s.replayMode);
  const h1Candles = usePricesStore((s) => s.h1Candles);
  const [loading, setLoading] = useState(false);
  const [synthetic, setSynthetic] = useState(false);
  const cacheRef = useRef<Partial<Record<Timeframe, CacheEntry>>>({});

  // Temporalidades H1+ : seguir el histórico H1 (salvo en replay, que gestiona sus velas)
  useEffect(() => {
    if (INTRADAY[timeframe] || replayMode) return;
    setSynthetic(false);
    if (h1Candles.length > 0) usePricesStore.getState().setCandles(h1Candles, H1);
  }, [timeframe, h1Candles, replayMode]);

  useEffect(() => {
    const interval = INTRADAY[timeframe];
    if (!interval || useChartStore.getState().replayMode) return;

    const cached = cacheRef.current[timeframe];
    if (cached) {
      usePricesStore.getState().setCandles(cached.candles, interval);
      setSynthetic(cached.synthetic);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const urls = [`${API_URL}/api/prices/intraday?tf=${timeframe}`, `/api/prices/intraday?tf=${timeframe}`];

    (async () => {
      for (const url of urls) {
        try {
          const r = await fetch(url);
          if (!r.ok) continue;
          const data: { candles: PriceTick[]; synthetic?: boolean } = await r.json();
          if (!data.candles?.length) continue;
          const entry = { candles: data.candles, synthetic: !!data.synthetic };
          cacheRef.current[timeframe] = entry;
          if (!cancelled) {
            usePricesStore.getState().setCandles(entry.candles, interval);
            setSynthetic(entry.synthetic);
          }
          return;
        } catch {
          /* probar la siguiente fuente */
        }
      }
    })().finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [timeframe]);

  return { loading, synthetic };
}

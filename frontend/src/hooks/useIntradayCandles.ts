'use client';
import { useEffect, useRef, useState } from 'react';
import { useChartStore, type Timeframe } from '@/store/chart.store';
import { usePricesStore } from '@/store/prices.store';
import type { PriceTick } from '@/types';

const INTRADAY_TFS: Timeframe[] = ['M1', 'M5', 'M15'];

interface CacheEntry {
  candles: PriceTick[];
  synthetic: boolean;
}

export function useIntradayCandles() {
  const timeframe = useChartStore((s) => s.timeframe);
  const { setCandles, h1Candles } = usePricesStore();
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [synthetic, setSynthetic] = useState(false);
  const cacheRef = useRef<Partial<Record<Timeframe, CacheEntry>>>({});

  useEffect(() => {
    if (!INTRADAY_TFS.includes(timeframe)) {
      setSynthetic(false);
      if (h1Candles.length > 0) setCandles(h1Candles);
      return;
    }

    const cached = cacheRef.current[timeframe];
    if (cached) {
      setCandles(cached.candles);
      setSynthetic(cached.synthetic);
      return;
    }

    setLoading(true);
    setError(null);

    // Try backend first (persistent cache across serverless instances), fallback to local API route
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const urls = backendUrl
      ? [`${backendUrl}/api/prices/intraday?tf=${timeframe}`, `/api/prices/intraday?tf=${timeframe}`]
      : [`/api/prices/intraday?tf=${timeframe}`];

    const tryFetch = async () => {
      for (const url of urls) {
        try {
          const r = await fetch(url);
          if (!r.ok) continue;
          const data: { candles: PriceTick[]; error?: string; synthetic?: boolean } = await r.json();
          if (data.error || !data.candles?.length) continue;
          return data;
        } catch { continue; }
      }
      return null;
    };

    tryFetch()
      .then((data) => {
        if (!data) throw new Error('All intraday sources unavailable');
        const entry: CacheEntry = { candles: data.candles, synthetic: data.synthetic ?? false };
        cacheRef.current[timeframe] = entry;
        setCandles(entry.candles);
        setSynthetic(entry.synthetic);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]);

  return { loading, error, synthetic };
}

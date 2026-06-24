'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface PriceStatus {
  symbol:  string;
  price:   number;
  total:   number;   // total candles in backend
  candle?: { time: number; open: number; high: number; low: number; close: number };
}

export function usePriceData() {
  const [status, setStatus] = useState<PriceStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Poll the REST endpoint every 30s to show live price in status bar
    const fetch = async () => {
      try {
        const { data } = await api.get<PriceStatus>('/prices/current');
        setStatus(data);
      } catch {
        // no auth needed for this endpoint, but interceptor may redirect if expired
      }
    };

    fetch();
    const id = setInterval(fetch, 30_000);
    return () => clearInterval(id);
  }, []);

  const forceRefresh = async () => {
    setRefreshing(true);
    try {
      await api.post('/prices/refresh');
      const { data } = await api.get<PriceStatus>('/prices/current');
      setStatus(data);
    } finally {
      setRefreshing(false);
    }
  };

  return { status, refreshing, forceRefresh };
}

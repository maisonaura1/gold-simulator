'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Trade, SimulationResult } from '@/types';

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [openTrades, setOpenTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrades = useCallback(async () => {
    try {
      const [historyRes, openRes] = await Promise.all([
        api.get<Trade[]>('/trades'),
        api.get<Trade[]>('/trades/open'),
      ]);
      setTrades(historyRes.data);
      setOpenTrades(openRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTrades(); }, [fetchTrades]);

  const simulate = async (params: {
    type: 'BUY' | 'SELL';
    lot: number;
    entryPrice: number;
    sl: number;
    tp: number;
    notes?: string;
  }): Promise<{ trade: Trade; simulation: SimulationResult }> => {
    const { data } = await api.post('/trades/simulate', params);
    fetchTrades();
    return data;
  };

  const closeTrade = async (id: string) => {
    await api.patch(`/trades/${id}/close`);
    fetchTrades();
  };

  return { trades, openTrades, loading, simulate, closeTrade, refetch: fetchTrades };
}

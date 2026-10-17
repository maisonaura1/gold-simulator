'use client';
import { api } from '@/lib/api';
import { invalidate, useApi } from '@/hooks/useApi';
import type { SimulationResult, Trade } from '@/types';

export interface SimulateParams {
  type: 'BUY' | 'SELL';
  lot: number;
  entryPrice: number;
  sl: number;
  tp: number;
  notes?: string;
}

export function useTrades() {
  const { data, loading, reload } = useApi<Trade[]>('/trades');
  return { trades: data ?? [], loading, reload };
}

export async function simulateTrade(params: SimulateParams): Promise<{ trade: Trade; simulation: SimulationResult }> {
  const { data } = await api.post<{ trade: Trade; simulation: SimulationResult }>('/trades/simulate', {
    ...params,
    notes: params.notes?.trim() || undefined,
  });
  // Refresca todo lo que depende de las operaciones
  invalidate('/trades', '/account', '/stats', '/stats/daily', '/payments/status');
  void api.post('/missions/evaluate').then(() => invalidate('/missions')).catch(() => null);
  return data;
}

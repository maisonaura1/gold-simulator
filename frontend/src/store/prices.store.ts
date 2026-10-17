'use client';
import { create } from 'zustand';
import type { PriceTick } from '@/types';

const H1 = 3_600_000;

interface PricesState {
  currentPrice: number;
  /** Velas que se muestran (H1 o intradía según la temporalidad). */
  candles: PriceTick[];
  /** Histórico H1 recibido por WebSocket (base para H1/H4/D1/W1). */
  h1Candles: PriceTick[];
  /** Duración de cada vela de `candles` en ms (para agrupar los ticks en directo). */
  interval: number;
  connected: boolean;
  setCandles: (candles: PriceTick[], interval?: number) => void;
  setH1Candles: (candles: PriceTick[]) => void;
  /** Funde un tick en la vela en curso (o abre una nueva si cambia el periodo). */
  applyTick: (tick: PriceTick) => void;
  setConnected: (v: boolean) => void;
}

function merge(list: PriceTick[], tick: PriceTick, interval: number): PriceTick[] {
  if (list.length === 0) return list;
  const bucket = Math.floor(tick.timestamp / interval) * interval;
  const last = list[list.length - 1];
  if (bucket < last.timestamp) return list; // tick antiguo
  if (bucket === last.timestamp) {
    const updated: PriceTick = {
      ...last,
      close: tick.close,
      price: tick.close,
      high: Math.max(last.high, tick.close),
      low: Math.min(last.low, tick.close),
    };
    return [...list.slice(0, -1), updated];
  }
  const open = last.close;
  return [
    ...list,
    { timestamp: bucket, open, close: tick.close, price: tick.close, high: Math.max(open, tick.close), low: Math.min(open, tick.close) },
  ];
}

export const usePricesStore = create<PricesState>((set) => ({
  currentPrice: 0,
  candles: [],
  h1Candles: [],
  interval: H1,
  connected: false,
  setCandles: (candles, interval) =>
    set((s) => ({
      candles,
      interval: interval ?? s.interval,
      currentPrice: s.currentPrice || candles.at(-1)?.close || 0,
    })),
  setH1Candles: (h1Candles) =>
    set((s) => ({ h1Candles, currentPrice: s.currentPrice || h1Candles.at(-1)?.close || 0 })),
  applyTick: (tick) =>
    set((s) => ({
      currentPrice: tick.close,
      h1Candles: merge(s.h1Candles, tick, H1),
      candles: merge(s.candles, tick, s.interval),
    })),
  setConnected: (connected) => set({ connected }),
}));

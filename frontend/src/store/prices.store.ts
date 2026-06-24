'use client';
import { create } from 'zustand';
import type { PriceTick } from '@/types';

interface PricesState {
  currentPrice: number;
  candles: PriceTick[];
  connected: boolean;
  setCurrentPrice: (price: number) => void;
  addCandle: (tick: PriceTick) => void;
  setCandles: (candles: PriceTick[]) => void;
  setConnected: (v: boolean) => void;
}

export const usePricesStore = create<PricesState>((set) => ({
  currentPrice: 0,
  candles: [],
  connected: false,
  setCurrentPrice: (price) => set({ currentPrice: price }),
  addCandle: (tick) =>
    set((state) => ({
      candles: [...state.candles.slice(-499), tick],
      currentPrice: tick.price,
    })),
  setCandles: (candles) => set({ candles }),
  setConnected: (connected) => set({ connected }),
}));

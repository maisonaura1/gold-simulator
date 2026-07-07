'use client';
import { create } from 'zustand';
import type { PriceTick } from '@/types';

interface PricesState {
  currentPrice: number;
  candles: PriceTick[];
  h1Candles: PriceTick[];
  connected: boolean;
  setCurrentPrice: (price: number) => void;
  addCandle: (tick: PriceTick) => void;
  setCandles: (candles: PriceTick[]) => void;
  setH1Candles: (candles: PriceTick[]) => void;
  setConnected: (v: boolean) => void;
}

export const usePricesStore = create<PricesState>((set) => ({
  currentPrice: 0,
  candles: [],
  h1Candles: [],
  connected: false,
  setCurrentPrice: (price) => set({ currentPrice: price }),
  addCandle: (tick) =>
    set((state) => ({
      candles: [...state.candles.slice(-499), tick],
      currentPrice: tick.price,
    })),
  setCandles:   (candles)   => set({ candles }),
  setH1Candles: (h1Candles) => set({ h1Candles, candles: h1Candles }),
  setConnected: (connected) => set({ connected }),
}));

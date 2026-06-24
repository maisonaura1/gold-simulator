'use client';
import { create } from 'zustand';

// Estado compartido entre OrderTicket y PriceChart
export interface ChartLinesState {
  entryPrice: number | null;
  sl:         number | null;
  tp:         number | null;
  tradeType:  'BUY' | 'SELL' | null;
  // Líneas de trades abiertos
  openLines: Array<{
    id:         string;
    type:       'BUY' | 'SELL';
    entryPrice: number;
    sl:         number | null;
    tp:         number | null;
  }>;
  setPreview: (v: Partial<Pick<ChartLinesState, 'entryPrice' | 'sl' | 'tp' | 'tradeType'>>) => void;
  clearPreview: () => void;
  setOpenLines: (lines: ChartLinesState['openLines']) => void;
}

export const useChartLines = create<ChartLinesState>((set) => ({
  entryPrice: null,
  sl:         null,
  tp:         null,
  tradeType:  null,
  openLines:  [],
  setPreview:  (v)     => set((s) => ({ ...s, ...v })),
  clearPreview: ()     => set({ entryPrice: null, sl: null, tp: null, tradeType: null }),
  setOpenLines: (lines) => set({ openLines: lines }),
}));

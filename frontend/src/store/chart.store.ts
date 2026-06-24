'use client';
import { create } from 'zustand';

export type Timeframe = 'M5' | 'M15' | 'H1' | 'H4' | 'D1';

interface ChartState {
  timeframe: Timeframe;
  showMA20: boolean;
  showMA50: boolean;
  showRSI: boolean;
  showBB: boolean;
  replayMode: boolean;
  replaySpeed: number; // ms per candle
  setTimeframe: (tf: Timeframe) => void;
  toggleMA20: () => void;
  toggleMA50: () => void;
  toggleRSI: () => void;
  toggleBB: () => void;
  setReplayMode: (v: boolean) => void;
  setReplaySpeed: (v: number) => void;
}

export const useChartStore = create<ChartState>((set) => ({
  timeframe: 'H1',
  showMA20: true,
  showMA50: true,
  showRSI: false,
  showBB: false,
  replayMode: false,
  replaySpeed: 500,
  setTimeframe: (timeframe) => set({ timeframe }),
  toggleMA20: () => set((s) => ({ showMA20: !s.showMA20 })),
  toggleMA50: () => set((s) => ({ showMA50: !s.showMA50 })),
  toggleRSI:  () => set((s) => ({ showRSI:  !s.showRSI  })),
  toggleBB:   () => set((s) => ({ showBB:   !s.showBB   })),
  setReplayMode:  (replayMode)  => set({ replayMode }),
  setReplaySpeed: (replaySpeed) => set({ replaySpeed }),
}));

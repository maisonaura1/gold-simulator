'use client';
import { create } from 'zustand';

export type Timeframe = 'M1' | 'M5' | 'M15' | 'H1' | 'H4' | 'D1' | 'W1' | 'MN';
export type DrawingTool = 'cursor' | 'hline' | 'trend' | 'rect' | 'fib' | 'eraser';

interface ChartState {
  timeframe: Timeframe;
  showMA20: boolean;
  showMA50: boolean;
  showRSI: boolean;
  showBB: boolean;
  showMACD: boolean;
  showVolume: boolean;
  replayMode: boolean;
  replaySpeed: number;
  drawingTool: DrawingTool;
  drawingColor: string;
  clearDrawingsSignal: number;
  setTimeframe: (tf: Timeframe) => void;
  toggleMA20: () => void;
  toggleMA50: () => void;
  toggleRSI: () => void;
  toggleBB: () => void;
  toggleMACD: () => void;
  toggleVolume: () => void;
  setReplayMode: (v: boolean) => void;
  setReplaySpeed: (v: number) => void;
  setDrawingTool: (t: DrawingTool) => void;
  setDrawingColor: (c: string) => void;
  clearDrawings: () => void;
}

export const useChartStore = create<ChartState>((set) => ({
  timeframe: 'H1',
  showMA20: true,
  showMA50: true,
  showRSI: false,
  showBB: false,
  showMACD: false,
  showVolume: true,
  replayMode: false,
  replaySpeed: 500,
  drawingTool: 'cursor',
  drawingColor: '#c9a84c',
  clearDrawingsSignal: 0,
  setTimeframe:    (timeframe)     => set({ timeframe }),
  toggleMA20:      ()              => set((s) => ({ showMA20:   !s.showMA20   })),
  toggleMA50:      ()              => set((s) => ({ showMA50:   !s.showMA50   })),
  toggleRSI:       ()              => set((s) => ({ showRSI:    !s.showRSI    })),
  toggleBB:        ()              => set((s) => ({ showBB:     !s.showBB     })),
  toggleMACD:      ()              => set((s) => ({ showMACD:   !s.showMACD   })),
  toggleVolume:    ()              => set((s) => ({ showVolume: !s.showVolume })),
  setReplayMode:   (replayMode)    => set({ replayMode }),
  setReplaySpeed:  (replaySpeed)   => set({ replaySpeed }),
  setDrawingTool:  (drawingTool)   => set({ drawingTool }),
  setDrawingColor: (drawingColor)  => set({ drawingColor }),
  clearDrawings:   ()              => set((s) => ({ clearDrawingsSignal: s.clearDrawingsSignal + 1 })),
}));

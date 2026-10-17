'use client';
import { create } from 'zustand';

export type Timeframe = 'M1' | 'M5' | 'M15' | 'H1' | 'H4' | 'D1' | 'W1';
export type DrawingTool = 'cursor' | 'hline' | 'trend' | 'rect' | 'fib' | 'eraser';
export type Indicator = 'ma20' | 'ma50' | 'bb' | 'rsi' | 'macd' | 'volume';

interface ChartState {
  timeframe: Timeframe;
  indicators: Record<Indicator, boolean>;
  drawingTool: DrawingTool;
  clearDrawingsSignal: number;
  /** Replay: se ocultan las velas posteriores a `replayCursor` (índice en el histórico H1). */
  replayMode: boolean;
  replayPlaying: boolean;
  replaySpeed: number;
  replayCursor: number;
  setTimeframe: (tf: Timeframe) => void;
  toggle: (ind: Indicator) => void;
  setDrawingTool: (t: DrawingTool) => void;
  clearDrawings: () => void;
  startReplay: (cursor: number) => void;
  stopReplay: () => void;
  setReplayCursor: (cursor: number) => void;
  setReplayPlaying: (v: boolean) => void;
  setReplaySpeed: (ms: number) => void;
}

export const useChartStore = create<ChartState>((set) => ({
  timeframe: 'H1',
  indicators: { ma20: true, ma50: true, bb: false, rsi: false, macd: false, volume: false },
  drawingTool: 'cursor',
  clearDrawingsSignal: 0,
  replayMode: false,
  replayPlaying: false,
  replaySpeed: 700,
  replayCursor: 0,
  setTimeframe: (timeframe) => set({ timeframe }),
  toggle: (ind) => set((s) => ({ indicators: { ...s.indicators, [ind]: !s.indicators[ind] } })),
  setDrawingTool: (drawingTool) => set({ drawingTool }),
  clearDrawings: () => set((s) => ({ clearDrawingsSignal: s.clearDrawingsSignal + 1 })),
  startReplay: (cursor) => set((s) => ({ replayMode: true, replayPlaying: false, replayCursor: cursor, timeframe: s.timeframe.startsWith('M') ? 'H1' : s.timeframe })),
  stopReplay: () => set({ replayMode: false, replayPlaying: false }),
  setReplayCursor: (replayCursor) => set({ replayCursor }),
  setReplayPlaying: (replayPlaying) => set({ replayPlaying }),
  setReplaySpeed: (replaySpeed) => set({ replaySpeed }),
}));

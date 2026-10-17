import { ColorType, CrosshairMode, LineStyle, type DeepPartial, type ChartOptions } from 'lightweight-charts';

export const CHART = {
  bg: '#0b0c10',
  grid: '#161922',
  text: '#7c8394',
  border: '#1d2029',
  up: '#22c55e',
  down: '#ef4444',
  gold: '#ddb54a',
  ma20: '#e8c765',
  ma50: '#60a5fa',
  bb: '#a78bfa',
};

export function baseOptions(width: number, height: number): DeepPartial<ChartOptions> {
  return {
    width,
    height,
    layout: {
      background: { type: ColorType.Solid, color: CHART.bg },
      textColor: CHART.text,
      fontSize: 11,
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    },
    grid: {
      vertLines: { color: CHART.grid },
      horzLines: { color: CHART.grid },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
      vertLine: { color: '#4b5263', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#262a35' },
      horzLine: { color: '#4b5263', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#262a35' },
    },
    rightPriceScale: { borderColor: CHART.border },
    timeScale: { borderColor: CHART.border, timeVisible: true, secondsVisible: false },
    localization: { locale: 'es-ES', priceFormatter: (p: number) => p.toFixed(2) },
  };
}

export const toTime = (ms: number) => Math.floor(ms / 1000) as unknown as import('lightweight-charts').UTCTimestamp;

// Sincroniza el desplazamiento/zoom del gráfico principal con los paneles RSI/MACD.
type Range = { from: number; to: number } | null;
const listeners = new Set<(r: Range) => void>();
let lastRange: Range = null;

export const rangeBus = {
  emit(r: Range) {
    lastRange = r;
    listeners.forEach((fn) => fn(r));
  },
  subscribe(fn: (r: Range) => void) {
    listeners.add(fn);
    if (lastRange) fn(lastRange);
    return () => listeners.delete(fn);
  },
};

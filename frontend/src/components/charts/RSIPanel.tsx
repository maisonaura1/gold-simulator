'use client';
import { useEffect, useRef } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import { calcRSI } from '@/lib/indicators';
import type { PriceTick } from '@/types';

export function RSIPanel({ candles }: { candles: PriceTick[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef    = useRef<any>(null);
  const ob70Ref      = useRef<any>(null);
  const ob30Ref      = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#0e1118' }, textColor: '#64748b', fontSize: 10, fontFamily: 'Roboto Mono, monospace' },
      grid: { vertLines: { color: '#1c2030' }, horzLines: { color: '#1c2030' } },
      rightPriceScale: { borderColor: '#2e3340', textColor: '#64748b', scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderColor: '#2e3340', timeVisible: true, secondsVisible: false },
      crosshair: { vertLine: { color: '#4a6cf7', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1e2535' }, horzLine: { color: '#4a6cf7', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1e2535' } },
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 120,
    });

    seriesRef.current = chart.addLineSeries({ color: '#33c2ff', lineWidth: 1, priceLineVisible: false, lastValueVisible: true });

    // Overbought / oversold lines
    ob70Ref.current = chart.addLineSeries({ color: '#e84040', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });
    ob30Ref.current = chart.addLineSeries({ color: '#2dcc6f', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    });
    ro.observe(containerRef.current);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || candles.length === 0) return;
    const rsi = calcRSI(candles);
    if (rsi.length === 0) return;

    const toTime = (ts: number) => Math.floor(ts / 1000) as any;

    seriesRef.current.setData(rsi.map((p) => ({ time: toTime(p.time), value: p.value })));

    const first = rsi[0].time;
    const last  = rsi[rsi.length - 1].time;

    ob70Ref.current?.setData([{ time: toTime(first), value: 70 }, { time: toTime(last), value: 70 }]);
    ob30Ref.current?.setData([{ time: toTime(first), value: 30 }, { time: toTime(last), value: 30 }]);

    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  const lastRSI = calcRSI(candles).at(-1)?.value;

  return (
    <div className="flex-1 border-t border-[var(--mt-border)] flex flex-col min-h-[120px] max-h-[140px]">
      <div className="flex items-center gap-3 px-3 py-0.5 bg-[#0e1118] shrink-0" style={{ fontSize: 10 }}>
        <span className="text-[var(--mt-text-dim)]">RSI (14)</span>
        {lastRSI !== undefined && (
          <span className={`font-mono font-bold ${lastRSI >= 70 ? 'text-[var(--mt-red)]' : lastRSI <= 30 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-cyan)]'}`}>
            {lastRSI.toFixed(2)}
          </span>
        )}
        {lastRSI !== undefined && lastRSI >= 70 && <span className="text-[var(--mt-red)]">⚠ Sobrecomprado</span>}
        {lastRSI !== undefined && lastRSI <= 30 && <span className="text-[var(--mt-green)]">⚠ Sobrevendido</span>}
      </div>
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
}

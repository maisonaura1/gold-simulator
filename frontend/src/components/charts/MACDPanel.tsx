'use client';
import { useEffect, useRef } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import { calcMACD } from '@/lib/indicators';
import type { PriceTick } from '@/types';

export function MACDPanel({ candles }: { candles: PriceTick[] }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const chartRef      = useRef<ReturnType<typeof createChart> | null>(null);
  const macdLineRef   = useRef<any>(null);
  const signalLineRef = useRef<any>(null);
  const histRef       = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#0e1118' }, textColor: '#64748b', fontSize: 10, fontFamily: 'Roboto Mono, monospace' },
      grid: { vertLines: { color: '#1c2030' }, horzLines: { color: '#1c2030' } },
      rightPriceScale: { borderColor: '#2e3340', textColor: '#64748b', scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderColor: '#2e3340', timeVisible: true, secondsVisible: false },
      crosshair: {
        vertLine: { color: '#4a6cf7', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1e2535' },
        horzLine: { color: '#4a6cf7', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1e2535' },
      },
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 120,
    });

    histRef.current       = chart.addHistogramSeries({ color: '#2dcc6f', priceLineVisible: false, lastValueVisible: false });
    macdLineRef.current   = chart.addLineSeries({ color: '#f97316', lineWidth: 1, priceLineVisible: false, lastValueVisible: true });
    signalLineRef.current = chart.addLineSeries({ color: '#f0b429', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: true });

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    });
    ro.observe(containerRef.current);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; };
  }, []);

  useEffect(() => {
    if (!macdLineRef.current || candles.length === 0) return;
    const data = calcMACD(candles);
    if (data.length === 0) return;

    const toTime = (ts: number) => Math.floor(ts / 1000) as any;

    macdLineRef.current.setData(data.map((p) => ({ time: toTime(p.time), value: p.macd })));
    signalLineRef.current?.setData(data.map((p) => ({ time: toTime(p.time), value: p.signal })));
    histRef.current?.setData(data.map((p) => ({
      time:  toTime(p.time),
      value: p.histogram,
      color: p.histogram >= 0 ? 'rgba(45,204,111,0.6)' : 'rgba(232,64,64,0.6)',
    })));

    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  const last = calcMACD(candles).at(-1);

  return (
    <div className="flex-1 border-t border-[var(--mt-border)] flex flex-col min-h-[120px] max-h-[140px]">
      <div className="flex items-center gap-3 px-3 py-0.5 bg-[#0e1118] shrink-0" style={{ fontSize: 10 }}>
        <span className="text-[var(--mt-text-dim)]">MACD (12, 26, 9)</span>
        {last && (
          <>
            <span style={{ color: '#f97316' }}>MACD <span className="font-mono">{last.macd.toFixed(2)}</span></span>
            <span style={{ color: '#f0b429' }}>Signal <span className="font-mono">{last.signal.toFixed(2)}</span></span>
            <span className={last.histogram >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'}>
              Hist <span className="font-mono">{last.histogram.toFixed(2)}</span>
            </span>
            {last.macd > last.signal
              ? <span className="text-[var(--mt-green)]">↑ Alcista</span>
              : <span className="text-[var(--mt-red)]">↓ Bajista</span>}
          </>
        )}
      </div>
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
}

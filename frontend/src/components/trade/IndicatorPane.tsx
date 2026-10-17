'use client';
import { useEffect, useRef } from 'react';
import { createChart, LineStyle, type IChartApi, type ISeriesApi } from 'lightweight-charts';
import { calcMACD, calcRSI } from '@/lib/indicators';
import type { PriceTick } from '@/types';
import { CHART, baseOptions, rangeBus, toTime } from './chartTheme';

/** Panel inferior con RSI (14) o MACD (12, 26, 9). */
export function IndicatorPane({ kind, candles }: { kind: 'rsi' | 'macd'; candles: PriceTick[] }) {
  const box = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const s1 = useRef<ISeriesApi<'Line'> | null>(null);
  const s2 = useRef<ISeriesApi<'Line'> | null>(null);
  const hist = useRef<ISeriesApi<'Histogram'> | null>(null);
  const spacer = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!box.current) return;
    const c = createChart(box.current, {
      ...baseOptions(box.current.clientWidth, box.current.clientHeight || 110),
      rightPriceScale: { borderColor: CHART.border, scaleMargins: { top: 0.12, bottom: 0.08 } },
      timeScale: { visible: false },
      handleScroll: false,
      handleScale: false,
    });
    // Serie vacía con todas las velas: alinea los índices con el gráfico principal
    spacer.current = c.addLineSeries({ visible: false, priceLineVisible: false, lastValueVisible: false });
    if (kind === 'rsi') {
      s1.current = c.addLineSeries({ color: '#60a5fa', lineWidth: 2, priceLineVisible: false });
      s1.current.createPriceLine({ price: 70, color: CHART.down, lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: true, title: '' });
      s1.current.createPriceLine({ price: 30, color: CHART.up, lineStyle: LineStyle.Dashed, lineWidth: 1, axisLabelVisible: true, title: '' });
    } else {
      hist.current = c.addHistogramSeries({ priceLineVisible: false, lastValueVisible: false });
      s1.current = c.addLineSeries({ color: '#f97316', lineWidth: 2, priceLineVisible: false });
      s2.current = c.addLineSeries({ color: CHART.ma20, lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false });
    }
    chart.current = c;
    const ro = new ResizeObserver(() => box.current && c.resize(box.current.clientWidth, box.current.clientHeight));
    ro.observe(box.current);
    const unsub = rangeBus.subscribe((r) => {
      if (r) c.timeScale().setVisibleLogicalRange(r);
    });
    return () => {
      unsub();
      ro.disconnect();
      c.remove();
      chart.current = null;
    };
  }, [kind]);

  useEffect(() => {
    if (!chart.current || candles.length === 0) return;
    spacer.current?.setData(candles.map((c) => ({ time: toTime(c.timestamp) })));
    if (kind === 'rsi') {
      s1.current?.setData(calcRSI(candles).map((p) => ({ time: toTime(p.time), value: p.value })));
    } else {
      const d = calcMACD(candles);
      hist.current?.setData(
        d.map((p) => ({ time: toTime(p.time), value: p.histogram, color: p.histogram >= 0 ? 'rgba(34,197,94,0.55)' : 'rgba(239,68,68,0.55)' })),
      );
      s1.current?.setData(d.map((p) => ({ time: toTime(p.time), value: p.macd })));
      s2.current?.setData(d.map((p) => ({ time: toTime(p.time), value: p.signal })));
    }
  }, [candles, kind]);

  const last = kind === 'rsi' ? calcRSI(candles.slice(-200)).at(-1)?.value : undefined;

  return (
    <div className="flex h-[120px] shrink-0 flex-col border-t border-ink-750">
      <div className="flex items-center gap-2 bg-ink-900 px-3 py-1 text-[11px] text-fg-dim">
        <span className="font-semibold text-fg-muted">{kind === 'rsi' ? 'RSI (14)' : 'MACD (12, 26, 9)'}</span>
        {last != null && (
          <span className={last >= 70 ? 'text-red-300' : last <= 30 ? 'text-green-300' : 'text-blue-300'}>
            {last.toFixed(1)} {last >= 70 ? '· sobrecompra' : last <= 30 ? '· sobreventa' : ''}
          </span>
        )}
      </div>
      <div ref={box} className="min-h-0 flex-1" />
    </div>
  );
}

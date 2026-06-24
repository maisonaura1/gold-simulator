'use client';
import { useEffect, useRef } from 'react';
import {
  createChart, ColorType, CrosshairMode, LineStyle,
  IChartApi, ISeriesApi, IPriceLine,
} from 'lightweight-charts';
import { usePricesStore }   from '@/store/prices.store';
import { useChartStore }    from '@/store/chart.store';
import { useChartLines }    from '@/store/chart-lines.store';
import { calcMA, calcBB, calcRSI } from '@/lib/indicators';
import { ChartToolbar }     from './ChartToolbar';
import { RSIPanel }         from './RSIPanel';
import clsx from 'clsx';

const BG       = '#131722';
const GRID     = '#1c2030';
const TEXT     = '#64748b';
const BORDER   = '#2e3340';

export function PriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const candleRef    = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const ma20Ref      = useRef<ISeriesApi<'Line'> | null>(null);
  const ma50Ref      = useRef<ISeriesApi<'Line'> | null>(null);
  const bbUpperRef   = useRef<ISeriesApi<'Line'> | null>(null);
  const bbMidRef     = useRef<ISeriesApi<'Line'> | null>(null);
  const bbLowerRef   = useRef<ISeriesApi<'Line'> | null>(null);

  // Price-line refs — preview (order ticket)
  const lineEntryRef = useRef<IPriceLine | null>(null);
  const lineSlRef    = useRef<IPriceLine | null>(null);
  const lineTpRef    = useRef<IPriceLine | null>(null);
  // Open-trade price lines
  const openLinesRef = useRef<IPriceLine[]>([]);

  const { candles }                         = usePricesStore();
  const { showMA20, showMA50, showRSI, showBB } = useChartStore();
  const { entryPrice, sl, tp, tradeType, openLines } = useChartLines();

  // ── Init chart ────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: BG },
        textColor: TEXT, fontSize: 11,
        fontFamily: 'Roboto Mono, Consolas, monospace',
      },
      grid: {
        vertLines: { color: GRID, style: LineStyle.Solid },
        horzLines: { color: GRID, style: LineStyle.Solid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#4a6cf7', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1e2535' },
        horzLine: { color: '#4a6cf7', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1e2535' },
      },
      rightPriceScale: {
        borderColor: BORDER, textColor: TEXT,
        scaleMargins: { top: 0.06, bottom: 0.25 },
      },
      timeScale: { borderColor: BORDER, timeVisible: true, secondsVisible: false },
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 480,
    });

    candleRef.current = chart.addCandlestickSeries({
      upColor: '#2dcc6f', downColor: '#e84040',
      borderUpColor: '#2dcc6f', borderDownColor: '#e84040',
      wickUpColor: '#2dcc6f', wickDownColor: '#e84040',
    });

    ma20Ref.current = chart.addLineSeries({ color: '#f0b429', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    ma50Ref.current = chart.addLineSeries({ color: '#4a6cf7', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });

    bbUpperRef.current = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });
    bbMidRef.current   = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    bbLowerRef.current = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (containerRef.current)
        chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    });
    ro.observe(containerRef.current);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; };
  }, []);

  // ── Candle + indicator data ───────────────────────────────
  useEffect(() => {
    if (!candleRef.current || candles.length === 0) return;
    const toTime = (ts: number) => Math.floor(ts / 1000) as any;

    candleRef.current.setData(
      candles.map((c) => ({ time: toTime(c.timestamp), open: c.open, high: c.high, low: c.low, close: c.close })),
    );
    ma20Ref.current?.setData(calcMA(candles, 20).map((p) => ({ time: toTime(p.time), value: p.value })));
    ma50Ref.current?.setData(calcMA(candles, 50).map((p) => ({ time: toTime(p.time), value: p.value })));
    const bb = calcBB(candles);
    bbUpperRef.current?.setData(bb.map((p) => ({ time: toTime(p.time), value: p.upper })));
    bbMidRef.current?.setData(  bb.map((p) => ({ time: toTime(p.time), value: p.middle })));
    bbLowerRef.current?.setData(bb.map((p) => ({ time: toTime(p.time), value: p.lower })));
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  // ── Indicator visibility ──────────────────────────────────
  useEffect(() => { ma20Ref.current?.applyOptions({ visible: showMA20 }); }, [showMA20]);
  useEffect(() => { ma50Ref.current?.applyOptions({ visible: showMA50 }); }, [showMA50]);
  useEffect(() => {
    bbUpperRef.current?.applyOptions({ visible: showBB });
    bbMidRef.current?.applyOptions(  { visible: showBB });
    bbLowerRef.current?.applyOptions({ visible: showBB });
  }, [showBB]);

  // ── Preview price lines (OrderTicket → chart) ─────────────
  useEffect(() => {
    const series = candleRef.current;
    if (!series) return;

    // Remove previous preview lines
    if (lineEntryRef.current) { try { series.removePriceLine(lineEntryRef.current); } catch {} lineEntryRef.current = null; }
    if (lineSlRef.current)    { try { series.removePriceLine(lineSlRef.current);    } catch {} lineSlRef.current    = null; }
    if (lineTpRef.current)    { try { series.removePriceLine(lineTpRef.current);    } catch {} lineTpRef.current    = null; }

    if (!entryPrice) return;

    const isBuy = tradeType === 'BUY';

    // Entry line — white dashed
    lineEntryRef.current = series.createPriceLine({
      price:           entryPrice,
      color:           '#c8cdd8',
      lineWidth:       1,
      lineStyle:       LineStyle.Dashed,
      axisLabelVisible: true,
      title:           `ENTRY ${entryPrice.toFixed(2)}`,
    });

    // SL line — red solid
    if (sl && sl > 0) {
      lineSlRef.current = series.createPriceLine({
        price:            sl,
        color:            '#e84040',
        lineWidth:        1,
        lineStyle:        LineStyle.Solid,
        axisLabelVisible: true,
        title:            `SL  ${sl.toFixed(2)}  (${Math.abs(entryPrice - sl).toFixed(2)} pts)`,
      });
    }

    // TP line — green solid
    if (tp && tp > 0) {
      lineTpRef.current = series.createPriceLine({
        price:            tp,
        color:            '#2dcc6f',
        lineWidth:        1,
        lineStyle:        LineStyle.Solid,
        axisLabelVisible: true,
        title:            `TP  ${tp.toFixed(2)}  (${Math.abs(tp - entryPrice).toFixed(2)} pts)`,
      });
    }
  }, [entryPrice, sl, tp, tradeType]);

  // ── Open-trade price lines ────────────────────────────────
  useEffect(() => {
    const series = candleRef.current;
    if (!series) return;

    // Remove old open-trade lines
    openLinesRef.current.forEach((l) => { try { series.removePriceLine(l); } catch {} });
    openLinesRef.current = [];

    openLines.forEach((t) => {
      // Entry
      const entryLine = series.createPriceLine({
        price:            t.entryPrice,
        color:            t.type === 'BUY' ? '#2dcc6f' : '#e84040',
        lineWidth:        1,
        lineStyle:        LineStyle.Dotted,
        axisLabelVisible: true,
        title:            `${t.type} #${t.id.slice(-4)}  ${t.entryPrice.toFixed(2)}`,
      });
      openLinesRef.current.push(entryLine);

      // SL
      if (t.sl) {
        const slLine = series.createPriceLine({
          price:            t.sl,
          color:            '#e84040',
          lineWidth:        1,
          lineStyle:        LineStyle.Dashed,
          axisLabelVisible: false,
          title:            `SL #${t.id.slice(-4)}`,
        });
        openLinesRef.current.push(slLine);
      }

      // TP
      if (t.tp) {
        const tpLine = series.createPriceLine({
          price:            t.tp,
          color:            '#2dcc6f',
          lineWidth:        1,
          lineStyle:        LineStyle.Dashed,
          axisLabelVisible: false,
          title:            `TP #${t.id.slice(-4)}`,
        });
        openLinesRef.current.push(tpLine);
      }
    });
  }, [openLines]);

  const lastCandle = candles.at(-1);
  const ma20Last   = showMA20 ? calcMA(candles, 20).at(-1)?.value : null;
  const ma50Last   = showMA50 ? calcMA(candles, 50).at(-1)?.value : null;

  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
      {/* OHLC info bar */}
      <div
        className="flex items-center gap-3 px-3 py-1 bg-[#0e1118] border-b border-[var(--mt-border)] shrink-0 select-none"
        style={{ fontSize: 11 }}
      >
        <span className="font-bold text-[var(--mt-yellow)]">XAUUSD</span>
        <span className="text-[var(--mt-sep)]">│</span>
        <span className="text-[var(--mt-text-dim)]">O: <span className="font-mono text-[var(--mt-text)]">{lastCandle?.open.toFixed(2) ?? '—'}</span></span>
        <span className="text-[var(--mt-text-dim)]">H: <span className="font-mono text-[var(--mt-green)]">{lastCandle?.high.toFixed(2) ?? '—'}</span></span>
        <span className="text-[var(--mt-text-dim)]">L: <span className="font-mono text-[var(--mt-red)]">{lastCandle?.low.toFixed(2) ?? '—'}</span></span>
        <span className="text-[var(--mt-text-dim)]">C: <span className="font-mono text-[var(--mt-white)]">{lastCandle?.close.toFixed(2) ?? '—'}</span></span>
        {ma20Last && <span className="text-[var(--mt-text-dim)]">MA20: <span className="font-mono" style={{ color: '#f0b429' }}>{ma20Last.toFixed(2)}</span></span>}
        {ma50Last && <span className="text-[var(--mt-text-dim)]">MA50: <span className="font-mono" style={{ color: '#4a6cf7' }}>{ma50Last.toFixed(2)}</span></span>}

        {/* Preview lines legend */}
        {entryPrice && (
          <>
            <span className="text-[var(--mt-sep)]">│</span>
            <span className="text-[var(--mt-text-dim)]">
              {tradeType}{' '}
              <span className="font-mono text-[var(--mt-white)]">{entryPrice.toFixed(2)}</span>
            </span>
            {sl && (
              <span className="text-[var(--mt-text-dim)]">
                SL <span className="font-mono text-[var(--mt-red)]">{sl.toFixed(2)}</span>
              </span>
            )}
            {tp && (
              <span className="text-[var(--mt-text-dim)]">
                TP <span className="font-mono text-[var(--mt-green)]">{tp.toFixed(2)}</span>
              </span>
            )}
          </>
        )}
      </div>

      <ChartToolbar />

      <div ref={containerRef} className={clsx('w-full', showRSI ? 'flex-[3]' : 'flex-1')} />

      {showRSI && <RSIPanel candles={candles} />}
    </div>
  );
}

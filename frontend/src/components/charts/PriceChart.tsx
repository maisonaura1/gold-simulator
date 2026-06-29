'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart, ColorType, CrosshairMode, LineStyle,
  IChartApi, ISeriesApi, IPriceLine,
} from 'lightweight-charts';
import { usePricesStore }   from '@/store/prices.store';
import { useChartStore }    from '@/store/chart.store';
import { useChartLines }    from '@/store/chart-lines.store';
import { calcMA, calcBB, calcRSI, calcMACD } from '@/lib/indicators';
import { ChartToolbar }     from './ChartToolbar';
import { RSIPanel }         from './RSIPanel';
import { MACDPanel }        from './MACDPanel';
import clsx from 'clsx';
import type { PriceTick } from '@/types';

const BG     = '#131722';
const GRID   = '#1c2030';
const TEXT   = '#64748b';
const BORDER = '#2e3340';

interface HoverOHLC { o: number; h: number; l: number; c: number; v?: number; change: number; changePct: number; }

export function PriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const candleRef    = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volRef       = useRef<ISeriesApi<'Histogram'> | null>(null);
  const ma20Ref      = useRef<ISeriesApi<'Line'> | null>(null);
  const ma50Ref      = useRef<ISeriesApi<'Line'> | null>(null);
  const bbUpperRef   = useRef<ISeriesApi<'Line'> | null>(null);
  const bbMidRef     = useRef<ISeriesApi<'Line'> | null>(null);
  const bbLowerRef   = useRef<ISeriesApi<'Line'> | null>(null);

  const lineEntryRef = useRef<IPriceLine | null>(null);
  const lineSlRef    = useRef<IPriceLine | null>(null);
  const lineTpRef    = useRef<IPriceLine | null>(null);
  const openLinesRef = useRef<IPriceLine[]>([]);

  const [hoverOHLC, setHoverOHLC] = useState<HoverOHLC | null>(null);

  const { candles }                              = usePricesStore();
  const { showMA20, showMA50, showRSI, showBB, showMACD, showVolume } = useChartStore();
  const { entryPrice, sl, tp, tradeType, openLines } = useChartLines();

  // candles indexed by unix-second timestamp for crosshair lookup
  const candleMapRef = useRef<Map<number, PriceTick>>(new Map());

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
        scaleMargins: { top: 0.06, bottom: showVolume ? 0.20 : 0.08 },
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

    volRef.current = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'vol',
    });
    chart.priceScale('vol').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    ma20Ref.current = chart.addLineSeries({ color: '#f0b429', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    ma50Ref.current = chart.addLineSeries({ color: '#4a6cf7', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });

    bbUpperRef.current = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });
    bbMidRef.current   = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    bbLowerRef.current = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });

    // OHLCV crosshair overlay
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) { setHoverOHLC(null); return; }
      const ts = Number(param.time);
      const tick = candleMapRef.current.get(ts);
      if (!tick) { setHoverOHLC(null); return; }
      const prev = candleMapRef.current.get(ts - 3600) ?? candleMapRef.current.get(ts - 300);
      const change    = tick.close - (prev?.close ?? tick.open);
      const changePct = prev?.close ? (change / prev.close) * 100 : 0;
      setHoverOHLC({ o: tick.open, h: tick.high, l: tick.low, c: tick.close, v: tick.volume, change, changePct });
    });

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (containerRef.current)
        chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    });
    ro.observe(containerRef.current);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Candle + indicator data ───────────────────────────────
  useEffect(() => {
    if (!candleRef.current || candles.length === 0) return;
    const toTime = (ts: number) => Math.floor(ts / 1000) as any;

    // Build lookup map
    const map = new Map<number, PriceTick>();
    candles.forEach((c) => map.set(Math.floor(c.timestamp / 1000), c));
    candleMapRef.current = map;

    candleRef.current.setData(
      candles.map((c) => ({ time: toTime(c.timestamp), open: c.open, high: c.high, low: c.low, close: c.close })),
    );

    // Volume histogram — synthesize from H-L range if no real volume
    const volData = candles.map((c) => ({
      time:  toTime(c.timestamp),
      value: c.volume ?? Math.round((c.high - c.low) * 1000),
      color: c.close >= c.open ? 'rgba(45,204,111,0.35)' : 'rgba(232,64,64,0.35)',
    }));
    volRef.current?.setData(volData);

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
  useEffect(() => { volRef.current?.applyOptions({ visible: showVolume }); }, [showVolume]);

  // ── Preview price lines (OrderTicket → chart) ─────────────
  useEffect(() => {
    const series = candleRef.current;
    if (!series) return;

    if (lineEntryRef.current) { try { series.removePriceLine(lineEntryRef.current); } catch {} lineEntryRef.current = null; }
    if (lineSlRef.current)    { try { series.removePriceLine(lineSlRef.current);    } catch {} lineSlRef.current    = null; }
    if (lineTpRef.current)    { try { series.removePriceLine(lineTpRef.current);    } catch {} lineTpRef.current    = null; }

    if (!entryPrice) return;

    lineEntryRef.current = series.createPriceLine({
      price: entryPrice, color: '#c8cdd8', lineWidth: 1,
      lineStyle: LineStyle.Dashed, axisLabelVisible: true,
      title: `ENTRY ${entryPrice.toFixed(2)}`,
    });

    if (sl && sl > 0) {
      const dist = Math.abs(entryPrice - sl);
      lineSlRef.current = series.createPriceLine({
        price: sl, color: '#e84040', lineWidth: 1,
        lineStyle: LineStyle.Solid, axisLabelVisible: true,
        title: `SL ${sl.toFixed(2)}  –${dist.toFixed(2)} pts`,
      });
    }

    if (tp && tp > 0) {
      const dist = Math.abs(tp - entryPrice);
      lineTpRef.current = series.createPriceLine({
        price: tp, color: '#2dcc6f', lineWidth: 1,
        lineStyle: LineStyle.Solid, axisLabelVisible: true,
        title: `TP ${tp.toFixed(2)}  +${dist.toFixed(2)} pts`,
      });
    }
  }, [entryPrice, sl, tp, tradeType]);

  // ── Open-trade price lines ────────────────────────────────
  useEffect(() => {
    const series = candleRef.current;
    if (!series) return;

    openLinesRef.current.forEach((l) => { try { series.removePriceLine(l); } catch {} });
    openLinesRef.current = [];

    openLines.forEach((t) => {
      openLinesRef.current.push(series.createPriceLine({
        price: t.entryPrice,
        color: t.type === 'BUY' ? '#2dcc6f' : '#e84040',
        lineWidth: 1, lineStyle: LineStyle.Dotted,
        axisLabelVisible: true,
        title: `${t.type} #${t.id.slice(-4)} ${t.entryPrice.toFixed(2)}`,
      }));
      if (t.sl) openLinesRef.current.push(series.createPriceLine({
        price: t.sl, color: '#e84040', lineWidth: 1,
        lineStyle: LineStyle.Dashed, axisLabelVisible: false,
        title: `SL #${t.id.slice(-4)}`,
      }));
      if (t.tp) openLinesRef.current.push(series.createPriceLine({
        price: t.tp, color: '#2dcc6f', lineWidth: 1,
        lineStyle: LineStyle.Dashed, axisLabelVisible: false,
        title: `TP #${t.id.slice(-4)}`,
      }));
    });
  }, [openLines]);

  const lastCandle = hoverOHLC
    ? { open: hoverOHLC.o, high: hoverOHLC.h, low: hoverOHLC.l, close: hoverOHLC.c, volume: hoverOHLC.v }
    : candles.at(-1);
  const isUp      = (lastCandle?.close ?? 0) >= (lastCandle?.open ?? 0);
  const ma20Last  = showMA20 ? calcMA(candles, 20).at(-1)?.value : null;
  const ma50Last  = showMA50 ? calcMA(candles, 50).at(-1)?.value : null;

  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
      {/* OHLCV info bar */}
      <div
        className="flex items-center gap-3 px-3 py-1 bg-[#0e1118] border-b border-[var(--mt-border)] shrink-0 select-none"
        style={{ fontSize: 11 }}
      >
        <span className="font-bold text-[var(--mt-yellow)]">XAUUSD</span>
        <span className="text-[var(--mt-sep)]">│</span>
        <span className="text-[var(--mt-text-dim)]">O <span className="font-mono text-[var(--mt-text)]">{lastCandle?.open.toFixed(2) ?? '—'}</span></span>
        <span className="text-[var(--mt-text-dim)]">H <span className="font-mono text-[var(--mt-green)]">{lastCandle?.high.toFixed(2) ?? '—'}</span></span>
        <span className="text-[var(--mt-text-dim)]">L <span className="font-mono text-[var(--mt-red)]">{lastCandle?.low.toFixed(2) ?? '—'}</span></span>
        <span className="text-[var(--mt-text-dim)]">C <span className={clsx('font-mono font-semibold', isUp ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>{lastCandle?.close.toFixed(2) ?? '—'}</span></span>
        {hoverOHLC && (
          <span className={clsx('font-mono text-[10px]', hoverOHLC.change >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>
            {hoverOHLC.change >= 0 ? '+' : ''}{hoverOHLC.change.toFixed(2)} ({hoverOHLC.changePct.toFixed(2)}%)
          </span>
        )}
        {lastCandle?.volume && (
          <span className="text-[var(--mt-text-dim)]">Vol <span className="font-mono text-[var(--mt-text)]">{lastCandle.volume.toLocaleString()}</span></span>
        )}
        {ma20Last && <span className="text-[var(--mt-text-dim)]">MA20 <span className="font-mono" style={{ color: '#f0b429' }}>{ma20Last.toFixed(2)}</span></span>}
        {ma50Last && <span className="text-[var(--mt-text-dim)]">MA50 <span className="font-mono" style={{ color: '#4a6cf7' }}>{ma50Last.toFixed(2)}</span></span>}

        {entryPrice && (
          <>
            <span className="text-[var(--mt-sep)]">│</span>
            <span className={clsx('font-mono text-[10px]', tradeType === 'BUY' ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>{tradeType}</span>
            <span className="font-mono text-[var(--mt-white)] text-[10px]">{entryPrice.toFixed(2)}</span>
            {sl  && <span className="font-mono text-[var(--mt-red)]   text-[10px]">SL {sl.toFixed(2)}</span>}
            {tp  && <span className="font-mono text-[var(--mt-green)] text-[10px]">TP {tp.toFixed(2)}</span>}
          </>
        )}
      </div>

      <ChartToolbar />

      <div
        ref={containerRef}
        className={clsx('w-full', (showRSI || showMACD) ? 'flex-[3]' : 'flex-1')}
      />

      {showRSI  && <RSIPanel  candles={candles} />}
      {showMACD && <MACDPanel candles={candles} />}
    </div>
  );
}

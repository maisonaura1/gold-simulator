'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  createChart, ColorType, CrosshairMode, LineStyle,
  IChartApi, ISeriesApi, IPriceLine,
} from 'lightweight-charts';
import { usePricesStore }   from '@/store/prices.store';
import { useChartStore }    from '@/store/chart.store';
import { useChartLines }    from '@/store/chart-lines.store';
import { calcMA, calcBB, calcRSI, calcMACD } from '@/lib/indicators';
import { resampleCandles }  from '@/lib/resample';
import { useIntradayCandles } from '@/hooks/useIntradayCandles';
import { ChartToolbar }     from './ChartToolbar';
import { RSIPanel }         from './RSIPanel';
import { MACDPanel }        from './MACDPanel';
import clsx from 'clsx';
import type { PriceTick } from '@/types';

const BG     = '#07080b';
const GRID   = '#12141c';
const TEXT   = '#6b7385';
const BORDER = '#1d2029';

// ─── Drawing types ────────────────────────────────────────────────────────────

type Pt = { price: number; time: number };

type DrawShape =
  | { id: string; type: 'hline'; price: number; color: string }
  | { id: string; type: 'trend'; p1: Pt; p2: Pt; color: string }
  | { id: string; type: 'rect';  p1: Pt; p2: Pt; color: string }
  | { id: string; type: 'fib';   p1: Pt; p2: Pt; color: string };

function uid() { return Math.random().toString(36).slice(2); }

interface HoverOHLC { o: number; h: number; l: number; c: number; v?: number; change: number; changePct: number; }

// ─── Component ────────────────────────────────────────────────────────────────

export function PriceChart() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const chartRef        = useRef<IChartApi | null>(null);
  const candleRef       = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volRef          = useRef<ISeriesApi<'Histogram'> | null>(null);
  const ma20Ref         = useRef<ISeriesApi<'Line'> | null>(null);
  const ma50Ref         = useRef<ISeriesApi<'Line'> | null>(null);
  const bbUpperRef      = useRef<ISeriesApi<'Line'> | null>(null);
  const bbMidRef        = useRef<ISeriesApi<'Line'> | null>(null);
  const bbLowerRef      = useRef<ISeriesApi<'Line'> | null>(null);
  const lineEntryRef    = useRef<IPriceLine | null>(null);
  const lineSlRef       = useRef<IPriceLine | null>(null);
  const lineTpRef       = useRef<IPriceLine | null>(null);
  const openLinesRef    = useRef<IPriceLine[]>([]);
  const candleMapRef    = useRef<Map<number, PriceTick>>(new Map());

  const [hoverOHLC, setHoverOHLC] = useState<HoverOHLC | null>(null);

  // Drawing state
  const drawingsRef  = useRef<DrawShape[]>([]);
  const [drawings, setDrawings] = useState<DrawShape[]>([]);
  const dragStart    = useRef<{ x: number; y: number; pt: Pt } | null>(null);
  const inProgress   = useRef<DrawShape | null>(null);
  const rafRef       = useRef<number>(0);

  const { loading: intradayLoading, synthetic: intradaySynthetic } = useIntradayCandles();
  const { candles: rawCandles }      = usePricesStore();
  const { showMA20, showMA50, showRSI, showBB, showMACD, showVolume, timeframe, drawingTool, drawingColor, clearDrawingsSignal } = useChartStore();
  const { entryPrice, sl, tp, tradeType, openLines }        = useChartLines();

  // Aggregate candles based on timeframe
  const candles = useMemo(() => resampleCandles(rawCandles, timeframe), [rawCandles, timeframe]);

  // ── Clear all drawings when signal fires ─────────────────────────────────────
  useEffect(() => {
    if (clearDrawingsSignal === 0) return;
    drawingsRef.current = [];
    setDrawings([]);
    inProgress.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [clearDrawingsSignal]);

  // ── Keyboard: Escape exits drawing mode ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') useChartStore.getState().setDrawingTool('cursor');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Init chart ────────────────────────────────────────────────────────────────
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
      handleScroll: true,
      handleScale:  true,
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
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    ma20Ref.current = chart.addLineSeries({ color: '#f0b429', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    ma50Ref.current = chart.addLineSeries({ color: '#4a6cf7', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    bbUpperRef.current = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });
    bbMidRef.current   = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, priceLineVisible: false, lastValueVisible: false });
    bbLowerRef.current = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 1, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false });

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

    // Redraw canvas drawings on scroll/zoom
    chart.timeScale().subscribeVisibleTimeRangeChange(() => scheduleRender());

    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      if (!containerRef.current) return;
      chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      syncCanvas();
      scheduleRender();
    });
    ro.observe(containerRef.current);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Candle + indicator data ───────────────────────────────────────────────────
  useEffect(() => {
    if (!candleRef.current || candles.length === 0) return;
    const toTime = (ts: number) => Math.floor(ts / 1000) as any;

    const map = new Map<number, PriceTick>();
    candles.forEach((c) => map.set(Math.floor(c.timestamp / 1000), c));
    candleMapRef.current = map;

    candleRef.current.setData(
      candles.map((c) => ({ time: toTime(c.timestamp), open: c.open, high: c.high, low: c.low, close: c.close })),
    );

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
    scheduleRender();
  }, [candles]);

  // ── Indicator visibility ──────────────────────────────────────────────────────
  useEffect(() => { ma20Ref.current?.applyOptions({ visible: showMA20 }); }, [showMA20]);
  useEffect(() => { ma50Ref.current?.applyOptions({ visible: showMA50 }); }, [showMA50]);
  useEffect(() => {
    bbUpperRef.current?.applyOptions({ visible: showBB });
    bbMidRef.current?.applyOptions(  { visible: showBB });
    bbLowerRef.current?.applyOptions({ visible: showBB });
  }, [showBB]);
  useEffect(() => { volRef.current?.applyOptions({ visible: showVolume }); }, [showVolume]);

  // ── Preview price lines ───────────────────────────────────────────────────────
  useEffect(() => {
    const series = candleRef.current;
    if (!series) return;
    if (lineEntryRef.current) { try { series.removePriceLine(lineEntryRef.current); } catch {} lineEntryRef.current = null; }
    if (lineSlRef.current)    { try { series.removePriceLine(lineSlRef.current);    } catch {} lineSlRef.current    = null; }
    if (lineTpRef.current)    { try { series.removePriceLine(lineTpRef.current);    } catch {} lineTpRef.current    = null; }
    if (!entryPrice) return;
    lineEntryRef.current = series.createPriceLine({ price: entryPrice, color: '#c8cdd8', lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: `ENTRY ${entryPrice.toFixed(2)}` });
    if (sl && sl > 0) {
      const dist = Math.abs(entryPrice - sl);
      lineSlRef.current = series.createPriceLine({ price: sl, color: '#e84040', lineWidth: 1, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: `SL ${sl.toFixed(2)}  –${dist.toFixed(2)} pts` });
    }
    if (tp && tp > 0) {
      const dist = Math.abs(tp - entryPrice);
      lineTpRef.current = series.createPriceLine({ price: tp, color: '#2dcc6f', lineWidth: 1, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: `TP ${tp.toFixed(2)}  +${dist.toFixed(2)} pts` });
    }
  }, [entryPrice, sl, tp, tradeType]);

  // ── Open-trade price lines ────────────────────────────────────────────────────
  useEffect(() => {
    const series = candleRef.current;
    if (!series) return;
    openLinesRef.current.forEach((l) => { try { series.removePriceLine(l); } catch {} });
    openLinesRef.current = [];
    openLines.forEach((t) => {
      openLinesRef.current.push(series.createPriceLine({ price: t.entryPrice, color: t.type === 'BUY' ? '#2dcc6f' : '#e84040', lineWidth: 1, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: `${t.type} #${t.id.slice(-4)} ${t.entryPrice.toFixed(2)}` }));
      if (t.sl) openLinesRef.current.push(series.createPriceLine({ price: t.sl, color: '#e84040', lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: false, title: `SL #${t.id.slice(-4)}` }));
      if (t.tp) openLinesRef.current.push(series.createPriceLine({ price: t.tp, color: '#2dcc6f', lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: false, title: `TP #${t.id.slice(-4)}` }));
    });
  }, [openLines]);

  // ─── Canvas / Drawing utilities ───────────────────────────────────────────────

  function syncCanvas() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width  = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  function scheduleRender() {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(renderAll);
  }

  const renderAll = useCallback(() => {
    const canvas  = canvasRef.current;
    const chart   = chartRef.current;
    const series  = candleRef.current;
    if (!canvas || !chart || !series) return;

    syncCanvas();
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allShapes = [...drawingsRef.current, ...(inProgress.current ? [inProgress.current] : [])];
    for (const shape of allShapes) renderShape(ctx, chart, series, shape, canvas.width);
  }, []);

  function renderShape(
    ctx: CanvasRenderingContext2D,
    chart: IChartApi,
    series: ISeriesApi<'Candlestick'>,
    shape: DrawShape,
    canvasW: number,
  ) {
    ctx.save();
    ctx.strokeStyle = shape.color;
    ctx.fillStyle   = shape.color;
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([]);
    ctx.font = '9px Roboto Mono, monospace';

    switch (shape.type) {
      case 'hline': {
        const y = series.priceToCoordinate(shape.price);
        if (y == null) break;
        ctx.beginPath();
        ctx.setLineDash([6, 3]);
        ctx.moveTo(0, y);
        ctx.lineTo(canvasW, y);
        ctx.stroke();
        ctx.setLineDash([]);
        // Label badge
        const label = shape.price.toFixed(2);
        const tw = ctx.measureText(label).width + 8;
        ctx.fillStyle = shape.color + 'cc';
        ctx.fillRect(canvasW - tw - 2, y - 8, tw, 14);
        ctx.fillStyle = '#000';
        ctx.fillText(label, canvasW - tw + 2, y + 3);
        break;
      }
      case 'trend': {
        const x1 = chart.timeScale().timeToCoordinate(shape.p1.time as any);
        const y1 = series.priceToCoordinate(shape.p1.price);
        const x2 = chart.timeScale().timeToCoordinate(shape.p2.time as any);
        const y2 = series.priceToCoordinate(shape.p2.price);
        if (x1 == null || y1 == null || x2 == null || y2 == null) break;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        // Extend ray
        const dx = x2 - x1; const dy = y2 - y1;
        if (dx !== 0) {
          const t = (canvasW - x1) / dx;
          ctx.globalAlpha = 0.25;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x1 + dx * t, y1 + dy * t);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.setLineDash([]);
        }
        // Dots at endpoints
        [{ x: x1, y: y1 }, { x: x2, y: y2 }].forEach(({ x, y }) => {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      }
      case 'rect': {
        const x1 = chart.timeScale().timeToCoordinate(shape.p1.time as any);
        const y1 = series.priceToCoordinate(shape.p1.price);
        const x2 = chart.timeScale().timeToCoordinate(shape.p2.time as any);
        const y2 = series.priceToCoordinate(shape.p2.price);
        if (x1 == null || y1 == null || x2 == null || y2 == null) break;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = shape.color;
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        ctx.globalAlpha = 1;
        break;
      }
      case 'fib': {
        const x1 = chart.timeScale().timeToCoordinate(shape.p1.time as any);
        const x2 = chart.timeScale().timeToCoordinate(shape.p2.time as any);
        if (x1 == null || x2 == null) break;
        const pRange = shape.p2.price - shape.p1.price;
        const levels = [
          { r: 0,     c: '#c9a84c' },
          { r: 0.236, c: '#2dcc6f' },
          { r: 0.382, c: '#4a6cf7' },
          { r: 0.5,   c: '#f0b429' },
          { r: 0.618, c: '#8b5cf6' },
          { r: 0.786, c: '#2dcc6f' },
          { r: 1,     c: '#c9a84c' },
        ];
        const lx = Math.min(x1, x2);
        const rx = Math.max(x1, x2);
        levels.forEach(({ r, c }) => {
          const price = shape.p1.price + pRange * r;
          const y = series.priceToCoordinate(price);
          if (y == null) return;
          ctx.strokeStyle = c;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(lx, y);
          ctx.lineTo(rx, y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = c + 'bb';
          const txt = `${(r * 100).toFixed(1)}%  ${price.toFixed(2)}`;
          ctx.fillText(txt, rx + 4, y + 3);
          ctx.globalAlpha = 0.05;
          ctx.fillStyle = c;
          if (r > 0) {
            const prevPrice = shape.p1.price + pRange * (levels[levels.findIndex(l => l.r === r) - 1]?.r ?? 0);
            const prevY = series.priceToCoordinate(prevPrice);
            if (prevY != null) {
              ctx.fillRect(lx, Math.min(y, prevY), rx - lx, Math.abs(y - prevY));
            }
          }
          ctx.globalAlpha = 1;
        });
        break;
      }
    }
    ctx.restore();
  }

  // Re-render on drawings change
  useEffect(() => {
    drawingsRef.current = drawings;
    scheduleRender();
  }, [drawings]);

  // ─── Mouse handlers ───────────────────────────────────────────────────────────

  function canvasPoint(e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number; pt: Pt } | null {
    const canvas = canvasRef.current;
    const chart  = chartRef.current;
    const series = candleRef.current;
    if (!canvas || !chart || !series) return null;

    const rect  = canvas.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const time  = chart.timeScale().coordinateToTime(x);
    const price = series.coordinateToPrice(y);
    if (time == null || price == null) return null;
    return { x, y, pt: { price, time: Number(time) } };
  }

  function hitTest(x: number, y: number): DrawShape | null {
    const chart  = chartRef.current;
    const series = candleRef.current;
    if (!chart || !series) return null;
    const THRESH = 8;

    for (let i = drawings.length - 1; i >= 0; i--) {
      const shape = drawings[i];
      switch (shape.type) {
        case 'hline': {
          const sy = series.priceToCoordinate(shape.price);
          if (sy != null && Math.abs(y - sy) < THRESH) return shape;
          break;
        }
        case 'trend':
        case 'rect':
        case 'fib': {
          const x1 = chart.timeScale().timeToCoordinate(shape.p1.time as any);
          const y1 = series.priceToCoordinate(shape.p1.price);
          const x2 = chart.timeScale().timeToCoordinate(shape.p2.time as any);
          const y2 = series.priceToCoordinate(shape.p2.price);
          if (x1 == null || y1 == null || x2 == null || y2 == null) break;
          if (shape.type === 'trend') {
            const d = pointToSegDist(x, y, x1, y1, x2, y2);
            if (d < THRESH) return shape;
          } else {
            const mx = Math.min(x1, x2); const Mx = Math.max(x1, x2);
            const my = Math.min(y1, y2); const My = Math.max(y1, y2);
            if (x >= mx - THRESH && x <= Mx + THRESH && y >= my - THRESH && y <= My + THRESH) return shape;
          }
          break;
        }
      }
    }
    return null;
  }

  function pointToSegDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
    const dx = bx - ax; const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 === 0) return Math.hypot(px - ax, py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (drawingTool === 'cursor') return;
    const cp = canvasPoint(e);
    if (!cp) return;

    if (drawingTool === 'eraser') {
      const hit = hitTest(cp.x, cp.y);
      if (hit) setDrawings((prev) => prev.filter((d) => d.id !== hit.id));
      return;
    }

    if (drawingTool === 'hline') {
      setDrawings((prev) => [...prev, { id: uid(), type: 'hline', price: cp.pt.price, color: drawingColor }]);
      return;
    }

    // Drag tools: set start point on mousedown, commit on mouseUp
    dragStart.current = { x: cp.x, y: cp.y, pt: cp.pt };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (drawingTool === 'cursor' || drawingTool === 'eraser' || drawingTool === 'hline') return;
    if (!dragStart.current) return;
    const cp = canvasPoint(e);
    if (!cp) return;

    const p1 = dragStart.current.pt;
    const p2 = cp.pt;
    inProgress.current = drawingTool === 'trend'
      ? { id: 'preview', type: 'trend', p1, p2, color: drawingColor + 'aa' }
      : drawingTool === 'fib'
      ? { id: 'preview', type: 'fib', p1, p2, color: drawingColor + 'aa' }
      : { id: 'preview', type: 'rect', p1, p2, color: drawingColor + 'aa' };

    scheduleRender();
  }

  function handleMouseLeave() {
    if (inProgress.current?.id === 'preview' && !dragStart.current) {
      inProgress.current = null;
      scheduleRender();
    }
  }

  function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    if (drawingTool === 'cursor' || drawingTool === 'hline' || drawingTool === 'eraser') return;
    if (!dragStart.current || !inProgress.current) return;
    const cp = canvasPoint(e);
    if (!cp) { dragStart.current = null; inProgress.current = null; scheduleRender(); return; }
    // Require at least 5px drag to commit (avoids accidental single-click shapes)
    const dx = Math.abs(cp.x - dragStart.current.x);
    const dy = Math.abs(cp.y - dragStart.current.y);
    if (dx < 5 && dy < 5) return;
    const p1 = dragStart.current.pt;
    const p2 = cp.pt;
    const shape: DrawShape =
      drawingTool === 'trend' ? { id: uid(), type: 'trend', p1, p2, color: drawingColor }
      : drawingTool === 'fib' ? { id: uid(), type: 'fib',   p1, p2, color: drawingColor }
      :                         { id: uid(), type: 'rect',  p1, p2, color: drawingColor };
    setDrawings((prev) => [...prev, shape]);
    inProgress.current = null;
    dragStart.current  = null;
    scheduleRender();
  }

  // Cursor style
  const cursorStyle: React.CSSProperties = {
    position:      'absolute',
    inset:         0,
    zIndex:        2,
    pointerEvents: drawingTool !== 'cursor' ? 'all' : 'none',
    cursor:
      drawingTool === 'eraser' ? 'cell'
      : drawingTool === 'cursor' ? 'default'
      : 'crosshair',
  };

  // ─── OHLCV bar data ───────────────────────────────────────────────────────────
  const lastCandle = hoverOHLC
    ? { open: hoverOHLC.o, high: hoverOHLC.h, low: hoverOHLC.l, close: hoverOHLC.c, volume: hoverOHLC.v }
    : candles.at(-1);
  const isUp      = (lastCandle?.close ?? 0) >= (lastCandle?.open ?? 0);
  const ma20Last  = showMA20 ? calcMA(candles, 20).at(-1)?.value : null;
  const ma50Last  = showMA50 ? calcMA(candles, 50).at(-1)?.value : null;

  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-hidden">
      {/* OHLCV info bar */}
      <div className="flex items-center gap-3 px-3 py-1 bg-[#0b0d11] border-b border-[#1d2029] shrink-0 select-none overflow-x-auto" style={{ fontSize: 11 }}>
        <span className="font-bold text-[#c9a84c] shrink-0">XAUUSD</span>
        <span className="text-[#1d2029]">│</span>
        <span className="text-[#6b7385] shrink-0">O <span className="font-mono text-[#c8cdd8]">{lastCandle?.open.toFixed(2) ?? '—'}</span></span>
        <span className="text-[#6b7385] shrink-0">H <span className="font-mono text-[#2dcc6f]">{lastCandle?.high.toFixed(2) ?? '—'}</span></span>
        <span className="text-[#6b7385] shrink-0">L <span className="font-mono text-[#e84040]">{lastCandle?.low.toFixed(2) ?? '—'}</span></span>
        <span className="text-[#6b7385] shrink-0">C <span className={clsx('font-mono font-semibold', isUp ? 'text-[#2dcc6f]' : 'text-[#e84040]')}>{lastCandle?.close.toFixed(2) ?? '—'}</span></span>
        {hoverOHLC && (
          <span className={clsx('font-mono text-[10px] shrink-0', hoverOHLC.change >= 0 ? 'text-[#2dcc6f]' : 'text-[#e84040]')}>
            {hoverOHLC.change >= 0 ? '+' : ''}{hoverOHLC.change.toFixed(2)} ({hoverOHLC.changePct.toFixed(2)}%)
          </span>
        )}
        {lastCandle?.volume && (
          <span className="text-[#6b7385] shrink-0">Vol <span className="font-mono text-[#c8cdd8]">{lastCandle.volume.toLocaleString()}</span></span>
        )}
        {ma20Last && <span className="text-[#6b7385] shrink-0">MA20 <span className="font-mono" style={{ color: '#f0b429' }}>{ma20Last.toFixed(2)}</span></span>}
        {ma50Last && <span className="text-[#6b7385] shrink-0">MA50 <span className="font-mono" style={{ color: '#4a6cf7' }}>{ma50Last.toFixed(2)}</span></span>}
        {intradayLoading && <span className="text-[#6b7385] shrink-0 animate-pulse">⟳ loading intraday data…</span>}
        {intradaySynthetic && !intradayLoading && (
          <span className="shrink-0 font-mono" style={{ fontSize: 9, background: '#2c1a00', border: '1px solid #f0b42944', color: '#f0b429', padding: '1px 6px', borderRadius: 3, letterSpacing: 1 }}>
            ⚠ SIMULATED DATA — market data provider unavailable
          </span>
        )}
        {entryPrice && (
          <>
            <span className="text-[#1d2029]">│</span>
            <span className={clsx('font-mono text-[10px] shrink-0', tradeType === 'BUY' ? 'text-[#2dcc6f]' : 'text-[#e84040]')}>{tradeType}</span>
            <span className="font-mono text-[#c8cdd8] text-[10px] shrink-0">{entryPrice.toFixed(2)}</span>
            {sl  && <span className="font-mono text-[#e84040] text-[10px] shrink-0">SL {sl.toFixed(2)}</span>}
            {tp  && <span className="font-mono text-[#2dcc6f] text-[10px] shrink-0">TP {tp.toFixed(2)}</span>}
          </>
        )}
      </div>

      <ChartToolbar />

      {/* Chart + drawing canvas */}
      <div
        className={clsx('relative w-full min-h-0', (showRSI || showMACD) ? 'flex-[3]' : 'flex-1')}
        style={{ overflow: 'hidden' }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        <canvas
          ref={canvasRef}
          style={cursorStyle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {showRSI  && <RSIPanel  candles={candles} />}
      {showMACD && <MACDPanel candles={candles} />}
    </div>
  );
}

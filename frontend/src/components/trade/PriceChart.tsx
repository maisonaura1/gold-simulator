'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createChart, LineStyle, type IChartApi, type IPriceLine, type ISeriesApi } from 'lightweight-charts';
import { usePricesStore } from '@/store/prices.store';
import { useChartStore } from '@/store/chart.store';
import { useChartLines } from '@/store/chart-lines.store';
import { calcBB, calcMA } from '@/lib/indicators';
import { resampleCandles } from '@/lib/resample';
import { useIntradayCandles } from '@/hooks/useIntradayCandles';
import type { PriceTick } from '@/types';
import { CHART, baseOptions, rangeBus, toTime } from './chartTheme';
import { ChartToolbar } from './ChartToolbar';
import { IndicatorPane } from './IndicatorPane';

type Pt = { price: number; time: number };
type Shape =
  | { id: string; type: 'hline'; price: number }
  | { id: string; type: 'trend' | 'rect' | 'fib'; p1: Pt; p2: Pt };

const FIB = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
const uid = () => Math.random().toString(36).slice(2);

/** Ordena por tiempo y elimina velas duplicadas (requisito de lightweight-charts). */
function clean(list: PriceTick[]): PriceTick[] {
  const seen = new Set<number>();
  return [...list]
    .sort((a, b) => a.timestamp - b.timestamp)
    .filter((c) => {
      const t = Math.floor(c.timestamp / 1000);
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });
}

export function PriceChart() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const candleSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volSeries = useRef<ISeriesApi<'Histogram'> | null>(null);
  const ma20 = useRef<ISeriesApi<'Line'> | null>(null);
  const ma50 = useRef<ISeriesApi<'Line'> | null>(null);
  const bbU = useRef<ISeriesApi<'Line'> | null>(null);
  const bbM = useRef<ISeriesApi<'Line'> | null>(null);
  const bbL = useRef<ISeriesApi<'Line'> | null>(null);
  const previewLines = useRef<IPriceLine[]>([]);
  const lastCount = useRef(0);
  const lastTf = useRef<string>('');

  const shapes = useRef<Shape[]>([]);
  const draft = useRef<Shape | null>(null);
  const dragFrom = useRef<{ x: number; y: number; pt: Pt } | null>(null);
  const raf = useRef(0);
  const [, force] = useState(0);

  const { loading, synthetic } = useIntradayCandles();
  const raw = usePricesStore((s) => s.candles);
  const { timeframe, indicators, drawingTool, clearDrawingsSignal } = useChartStore();
  const { entryPrice, sl, tp, tradeType } = useChartLines();

  const candles = useMemo(() => clean(resampleCandles(raw, timeframe)), [raw, timeframe]);
  const [hover, setHover] = useState<PriceTick | null>(null);
  const hoverMap = useRef(new Map<number, PriceTick>());

  // ── Dibujo sobre el canvas ────────────────────────────────────────────────
  const render = useCallback(() => {
    const cv = canvas.current;
    const c = chart.current;
    const s = candleSeries.current;
    const el = box.current;
    if (!cv || !c || !s || !el) return;
    const dpr = window.devicePixelRatio || 1;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (cv.width !== w * dpr || cv.height !== h * dpr) {
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
    }
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const ts = c.timeScale();
    const X = (t: number) => ts.timeToCoordinate(t as never);
    const Y = (p: number) => s.priceToCoordinate(p);

    for (const shape of [...shapes.current, ...(draft.current ? [draft.current] : [])]) {
      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = CHART.gold;
      ctx.fillStyle = CHART.gold;
      ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
      if (shape.type === 'hline') {
        const y = Y(shape.price);
        if (y != null) {
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillText(shape.price.toFixed(2), 8, y - 5);
        }
      } else {
        const x1 = X(shape.p1.time);
        const x2 = X(shape.p2.time);
        const y1 = Y(shape.p1.price);
        const y2 = Y(shape.p2.price);
        if (x1 != null && x2 != null && y1 != null && y2 != null) {
          if (shape.type === 'trend') {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            [[x1, y1], [x2, y2]].forEach(([x, y]) => {
              ctx.beginPath();
              ctx.arc(x, y, 3, 0, Math.PI * 2);
              ctx.fill();
            });
          } else if (shape.type === 'rect') {
            ctx.globalAlpha = 0.12;
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
            ctx.globalAlpha = 1;
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
          } else {
            const left = Math.min(x1, x2);
            const range = shape.p2.price - shape.p1.price;
            FIB.forEach((r) => {
              // 0% en el final del impulso (p2), 100% en el origen (p1)
              const price = shape.p2.price - range * r;
              const y = Y(price);
              if (y == null) return;
              ctx.strokeStyle = r === 0.5 || r === 0.618 ? CHART.gold : '#7c8394';
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(left, y);
              ctx.lineTo(w, y);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.fillStyle = ctx.strokeStyle;
              ctx.fillText(`${(r * 100).toFixed(1)}%  ${price.toFixed(2)}`, left + 4, y - 4);
            });
          }
        }
      }
      ctx.restore();
    }
  }, []);

  const schedule = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(render);
  }, [render]);

  // ── Crear el gráfico ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!box.current) return;
    const el = box.current;
    const c = createChart(el, baseOptions(el.clientWidth, el.clientHeight || 420));
    candleSeries.current = c.addCandlestickSeries({
      upColor: CHART.up,
      downColor: CHART.down,
      borderUpColor: CHART.up,
      borderDownColor: CHART.down,
      wickUpColor: CHART.up,
      wickDownColor: CHART.down,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });
    volSeries.current = c.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'vol', lastValueVisible: false, priceLineVisible: false });
    c.priceScale('vol').applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
    const line = { priceLineVisible: false, lastValueVisible: false, autoscaleInfoProvider: () => null, crosshairMarkerVisible: false };
    ma20.current = c.addLineSeries({ color: CHART.ma20, lineWidth: 2, ...line });
    ma50.current = c.addLineSeries({ color: CHART.ma50, lineWidth: 2, ...line });
    bbU.current = c.addLineSeries({ color: CHART.bb, lineWidth: 1, lineStyle: LineStyle.Dashed, ...line });
    bbM.current = c.addLineSeries({ color: CHART.bb, lineWidth: 1, ...line });
    bbL.current = c.addLineSeries({ color: CHART.bb, lineWidth: 1, lineStyle: LineStyle.Dashed, ...line });

    c.subscribeCrosshairMove((param) => {
      if (!param.time) return setHover(null);
      setHover(hoverMap.current.get(Number(param.time)) ?? null);
    });
    c.timeScale().subscribeVisibleLogicalRangeChange((r) => {
      rangeBus.emit(r ? { from: r.from, to: r.to } : null);
      schedule();
    });

    chart.current = c;
    const ro = new ResizeObserver(() => {
      c.resize(el.clientWidth, el.clientHeight);
      schedule();
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      c.remove();
      chart.current = null;
      lastCount.current = 0;
    };
  }, [schedule]);

  // ── Datos ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const s = candleSeries.current;
    if (!s || candles.length === 0) return;
    hoverMap.current = new Map(candles.map((c) => [Math.floor(c.timestamp / 1000), c]));
    s.setData(candles.map((c) => ({ time: toTime(c.timestamp), open: c.open, high: c.high, low: c.low, close: c.close })));
    volSeries.current?.setData(
      candles.map((c) => ({
        time: toTime(c.timestamp),
        value: c.volume ?? Math.round((c.high - c.low) * 100),
        color: c.close >= c.open ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)',
      })),
    );
    ma20.current?.setData(calcMA(candles, 20).map((p) => ({ time: toTime(p.time), value: p.value })));
    ma50.current?.setData(calcMA(candles, 50).map((p) => ({ time: toTime(p.time), value: p.value })));
    const bb = calcBB(candles);
    bbU.current?.setData(bb.map((p) => ({ time: toTime(p.time), value: p.upper })));
    bbM.current?.setData(bb.map((p) => ({ time: toTime(p.time), value: p.middle })));
    bbL.current?.setData(bb.map((p) => ({ time: toTime(p.time), value: p.lower })));

    // Encuadre inicial al cambiar de temporalidad o al cargar el histórico
    const big = Math.abs(candles.length - lastCount.current) > 5;
    if (lastTf.current !== timeframe || big) {
      const n = candles.length;
      chart.current?.timeScale().setVisibleLogicalRange({ from: Math.max(0, n - 110), to: n + 6 });
      lastTf.current = timeframe;
    }
    lastCount.current = candles.length;
    schedule();
  }, [candles, timeframe, schedule]);

  // ── Visibilidad de indicadores ───────────────────────────────────────────
  useEffect(() => {
    ma20.current?.applyOptions({ visible: indicators.ma20 });
    ma50.current?.applyOptions({ visible: indicators.ma50 });
    [bbU, bbM, bbL].forEach((r) => r.current?.applyOptions({ visible: indicators.bb }));
    volSeries.current?.applyOptions({ visible: indicators.volume });
  }, [indicators]);

  // ── Líneas de la orden que se está preparando ────────────────────────────
  useEffect(() => {
    const s = candleSeries.current;
    if (!s) return;
    previewLines.current.forEach((l) => s.removePriceLine(l));
    previewLines.current = [];
    if (!entryPrice) return;
    const add = (price: number, color: string, title: string, style = LineStyle.Solid) =>
      previewLines.current.push(s.createPriceLine({ price, color, lineWidth: 2, lineStyle: style, axisLabelVisible: true, title }));
    add(entryPrice, '#d7dae2', tradeType === 'SELL' ? 'Venta' : 'Compra', LineStyle.Dashed);
    if (sl) add(sl, CHART.down, 'Stop');
    if (tp) add(tp, CHART.up, 'Objetivo');
  }, [entryPrice, sl, tp, tradeType]);

  // ── Borrar dibujos / salir con Escape ────────────────────────────────────
  useEffect(() => {
    if (!clearDrawingsSignal) return;
    shapes.current = [];
    draft.current = null;
    schedule();
    force((n) => n + 1);
  }, [clearDrawingsSignal, schedule]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && useChartStore.getState().setDrawingTool('cursor');
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Interacción de dibujo (ratón y táctil) ───────────────────────────────
  const toPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = chart.current;
    const s = candleSeries.current;
    if (!c || !s || !canvas.current) return null;
    const r = canvas.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const time = c.timeScale().coordinateToTime(x);
    const price = s.coordinateToPrice(y);
    if (time == null || price == null) return null;
    return { x, y, pt: { time: Number(time), price } };
  };

  const hit = (x: number, y: number): Shape | undefined => {
    const c = chart.current;
    const s = candleSeries.current;
    if (!c || !s) return;
    for (let i = shapes.current.length - 1; i >= 0; i--) {
      const sh = shapes.current[i];
      if (sh.type === 'hline') {
        const sy = s.priceToCoordinate(sh.price);
        if (sy != null && Math.abs(sy - y) < 8) return sh;
        continue;
      }
      const x1 = c.timeScale().timeToCoordinate(sh.p1.time as never);
      const x2 = c.timeScale().timeToCoordinate(sh.p2.time as never);
      const y1 = s.priceToCoordinate(sh.p1.price);
      const y2 = s.priceToCoordinate(sh.p2.price);
      if (x1 == null || x2 == null || y1 == null || y2 == null) continue;
      if (x >= Math.min(x1, x2) - 8 && x <= Math.max(x1, x2) + 8 && y >= Math.min(y1, y2) - 8 && y <= Math.max(y1, y2) + 8) return sh;
    }
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toPoint(e);
    if (!p) return;
    if (drawingTool === 'eraser') {
      const h = hit(p.x, p.y);
      if (h) {
        shapes.current = shapes.current.filter((s) => s.id !== h.id);
        schedule();
      }
      return;
    }
    if (drawingTool === 'hline') {
      shapes.current = [...shapes.current, { id: uid(), type: 'hline', price: p.pt.price }];
      schedule();
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    dragFrom.current = p;
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragFrom.current || (drawingTool !== 'trend' && drawingTool !== 'rect' && drawingTool !== 'fib')) return;
    const p = toPoint(e);
    if (!p) return;
    draft.current = { id: 'draft', type: drawingTool, p1: dragFrom.current.pt, p2: p.pt };
    schedule();
  };

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const from = dragFrom.current;
    dragFrom.current = null;
    const p = toPoint(e);
    if (from && p && draft.current && (Math.abs(p.x - from.x) > 4 || Math.abs(p.y - from.y) > 4)) {
      shapes.current = [...shapes.current, { ...draft.current, id: uid() }];
    }
    draft.current = null;
    schedule();
  };

  const shown = hover ?? candles.at(-1);
  const up = shown ? shown.close >= shown.open : true;
  const drawing = drawingTool !== 'cursor';

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#0b0c10]">
      <ChartToolbar />
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-b border-ink-750 px-3 py-1.5 text-[12px] num">
        <span className="font-semibold text-gold-300">XAU/USD · {timeframe}</span>
        {shown && (
          <>
            <span className="text-fg-dim">
              A <span className="text-fg-muted">{shown.open.toFixed(2)}</span>
            </span>
            <span className="text-fg-dim">
              Máx <span className="text-green-300">{shown.high.toFixed(2)}</span>
            </span>
            <span className="text-fg-dim">
              Mín <span className="text-red-300">{shown.low.toFixed(2)}</span>
            </span>
            <span className="text-fg-dim">
              C <span className={up ? 'text-green-300' : 'text-red-300'}>{shown.close.toFixed(2)}</span>
            </span>
          </>
        )}
        {indicators.ma20 && <span style={{ color: CHART.ma20 }}>MA20</span>}
        {indicators.ma50 && <span style={{ color: CHART.ma50 }}>MA50</span>}
        {indicators.bb && <span style={{ color: CHART.bb }}>Bollinger (20, 2)</span>}
        {loading && <span className="animate-pulse text-fg-dim">Cargando velas…</span>}
        {synthetic && !loading && (
          <span className="rounded-md bg-warn/15 px-2 py-0.5 text-amber-300">Datos de ejemplo: el proveedor de precios no responde</span>
        )}
      </div>
      <div className="relative min-h-0 flex-1">
        <div ref={box} className="absolute inset-0" />
        <canvas
          ref={canvas}
          className="absolute inset-0 z-[2]"
          style={{ pointerEvents: drawing ? 'auto' : 'none', cursor: drawingTool === 'eraser' ? 'cell' : 'crosshair', touchAction: drawing ? 'none' : 'auto' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
        />
        {candles.length === 0 && !loading && (
          <div className="absolute inset-0 z-[3] flex items-center justify-center text-[14px] text-fg-dim">Conectando con el mercado…</div>
        )}
      </div>
      {indicators.rsi && <IndicatorPane kind="rsi" candles={candles} />}
      {indicators.macd && <IndicatorPane kind="macd" candles={candles} />}
    </div>
  );
}

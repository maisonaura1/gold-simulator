'use client';
import clsx from 'clsx';
import { Eraser, History, Minus, MousePointer2, Pause, Play, RectangleHorizontal, SkipForward, Spline, Trash2, TrendingUp, X } from 'lucide-react';
import { useChartStore, type DrawingTool, type Indicator, type Timeframe } from '@/store/chart.store';
import { usePricesStore } from '@/store/prices.store';

const TFS: Timeframe[] = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1', 'W1'];
const INDS: { id: Indicator; label: string }[] = [
  { id: 'ma20', label: 'MA20' },
  { id: 'ma50', label: 'MA50' },
  { id: 'bb', label: 'Bollinger' },
  { id: 'rsi', label: 'RSI' },
  { id: 'macd', label: 'MACD' },
  { id: 'volume', label: 'Volumen' },
];
const TOOLS: { id: DrawingTool; label: string; icon: typeof Minus }[] = [
  { id: 'cursor', label: 'Cursor', icon: MousePointer2 },
  { id: 'hline', label: 'Línea horizontal', icon: Minus },
  { id: 'trend', label: 'Línea de tendencia (arrastra)', icon: TrendingUp },
  { id: 'rect', label: 'Rectángulo / zona (arrastra)', icon: RectangleHorizontal },
  { id: 'fib', label: 'Fibonacci (arrastra del inicio al final del impulso)', icon: Spline },
  { id: 'eraser', label: 'Borrar un dibujo', icon: Eraser },
];
const SPEEDS = [
  { ms: 1200, label: '×1' },
  { ms: 600, label: '×2' },
  { ms: 250, label: '×4' },
];
const dayFmt = new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function Chip({ active, onClick, children, title, disabled }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'flex h-7 shrink-0 items-center gap-1 rounded-lg px-2 text-[12px] font-medium transition disabled:opacity-40',
        active ? 'bg-gold-500/15 text-gold-200' : 'text-fg-dim hover:bg-ink-800 hover:text-fg',
      )}
    >
      {children}
    </button>
  );
}

export function ChartToolbar() {
  const s = useChartStore();
  const h1 = usePricesStore((p) => p.h1Candles);

  const start = (candlesBack: number) => {
    if (h1.length < 50) return;
    s.startReplay(Math.max(50, h1.length - candlesBack));
  };
  const goToDate = (value: string) => {
    if (!value) return;
    const t = new Date(`${value}T00:00:00Z`).getTime();
    const idx = h1.findIndex((c) => c.timestamp >= t);
    if (idx > 0) s.startReplay(Math.max(50, idx));
  };
  const cursorCandle = s.replayMode ? h1[Math.min(s.replayCursor, h1.length) - 1] : undefined;
  const minDate = h1[50] ? new Date(h1[50].timestamp).toISOString().slice(0, 10) : undefined;
  const maxDate = h1.at(-1) ? new Date(h1.at(-1)!.timestamp).toISOString().slice(0, 10) : undefined;

  return (
    <div className="shrink-0 border-b border-ink-750 bg-ink-900">
      <div className="flex items-center gap-1 overflow-x-auto px-2 py-1.5">
        {TFS.map((tf) => (
          <Chip key={tf} active={s.timeframe === tf} disabled={s.replayMode && tf.startsWith('M')} onClick={() => s.setTimeframe(tf)}>
            {tf}
          </Chip>
        ))}
        <span className="mx-1 h-5 w-px shrink-0 bg-ink-700" />
        {INDS.map((i) => (
          <Chip key={i.id} active={s.indicators[i.id]} onClick={() => s.toggle(i.id)}>
            {i.label}
          </Chip>
        ))}
        <span className="mx-1 h-5 w-px shrink-0 bg-ink-700" />
        {TOOLS.map((t) => (
          <Chip key={t.id} title={t.label} active={s.drawingTool === t.id} onClick={() => s.setDrawingTool(t.id)}>
            <t.icon className="h-4 w-4" />
            <span className="sr-only">{t.label}</span>
          </Chip>
        ))}
        <Chip title="Borrar todos los dibujos" onClick={s.clearDrawings}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Borrar todos los dibujos</span>
        </Chip>
        <span className="mx-1 h-5 w-px shrink-0 bg-ink-700" />
        <Chip title="Modo replay: vuelve al pasado y avanza vela a vela" active={s.replayMode} disabled={h1.length < 100} onClick={() => (s.replayMode ? s.stopReplay() : start(240))}>
          <History className="h-4 w-4" /> Replay
        </Chip>
      </div>

      {s.replayMode && (
        <div className="flex flex-wrap items-center gap-2 border-t border-gold-500/20 bg-gold-500/[0.06] px-3 py-1.5 text-[12px]">
          <span className="font-semibold text-gold-200">Replay</span>
          <button
            type="button"
            onClick={() => s.setReplayPlaying(!s.replayPlaying)}
            className="flex h-7 items-center gap-1 rounded-lg bg-gold-500/15 px-2 font-medium text-gold-100 hover:bg-gold-500/25"
          >
            {s.replayPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {s.replayPlaying ? 'Pausa' : 'Reproducir'}
          </button>
          <button
            type="button"
            onClick={() => s.setReplayCursor(Math.min(h1.length, s.replayCursor + 1))}
            className="flex h-7 items-center gap-1 rounded-lg px-2 font-medium text-fg-muted hover:bg-ink-800 hover:text-fg"
          >
            <SkipForward className="h-4 w-4" /> +1 vela
          </button>
          {SPEEDS.map((sp) => (
            <Chip key={sp.ms} active={s.replaySpeed === sp.ms} onClick={() => s.setReplaySpeed(sp.ms)}>
              {sp.label}
            </Chip>
          ))}
          <span className="mx-1 h-5 w-px bg-ink-700" />
          <Chip onClick={() => start(115)}>Hace 1 semana</Chip>
          <Chip onClick={() => start(480)}>Hace 1 mes</Chip>
          <Chip onClick={() => start(50 + Math.floor(Math.random() * Math.max(1, h1.length - 150)))}>Al azar</Chip>
          <label className="flex items-center gap-1 text-fg-dim">
            Ir a
            <input type="date" min={minDate} max={maxDate} onChange={(e) => goToDate(e.target.value)} className="h-7 rounded-lg border border-ink-700 bg-ink-900 px-2 text-[12px] text-fg" />
          </label>
          <span className="ml-auto text-fg-muted num">{cursorCandle ? dayFmt.format(new Date(cursorCandle.timestamp)) : ''}</span>
          <button type="button" onClick={s.stopReplay} className="rounded-lg p-1 text-fg-dim hover:bg-ink-800 hover:text-fg" aria-label="Salir del replay">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

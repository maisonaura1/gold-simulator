'use client';
import { useState, useRef } from 'react';
import clsx from 'clsx';
import { useChartStore, type Timeframe, type DrawingTool } from '@/store/chart.store';
import { usePriceData } from '@/hooks/usePriceData';

// ─── Fixed-position tooltip (avoids toolbar overflow clipping) ────────────────
function CTip({ text, children }: { text: string; children: React.ReactNode }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);

  function handleEnter() {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top - 6 });
  }

  return (
    <>
      <span
        ref={anchorRef}
        style={{ display: 'inline-flex' }}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setPos(null)}
      >
        {children}
      </span>

      {pos && (
        <span style={{
          position: 'fixed', top: pos.y, left: pos.x,
          transform: 'translate(-50%, -100%)',
          background: '#0e1118', border: '1px solid #1d2029',
          padding: '7px 10px', fontSize: 10, color: '#c8cdd8', lineHeight: 1.55,
          whiteSpace: 'normal', width: 210, zIndex: 99999,
          pointerEvents: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
        }}>
          {text}
          <span style={{
            position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
            width: 8, height: 8, background: '#0e1118', border: '1px solid #1d2029',
            borderTop: 'none', borderLeft: 'none', rotate: '45deg',
          }} />
        </span>
      )}
    </>
  );
}

// ─── Timeframes ───────────────────────────────────────────────────────────────

const TF_GROUPS: { label: string; tfs: Timeframe[] }[] = [
  { label: 'Min',   tfs: ['M1', 'M5', 'M15'] },
  { label: 'Hora',  tfs: ['H1', 'H4']         },
  { label: 'Largo', tfs: ['D1', 'W1', 'MN']   },
];

const TF_LABEL: Record<Timeframe, string> = {
  M1: '1m', M5: '5m', M15: '15m',
  H1: '1H', H4: '4H',
  D1: '1D', W1: '1W', MN: '1M',
};

const TF_TIP: Record<Timeframe, string> = {
  M1:  'Velas de 1 minuto (últimos 7 días). Para scalping muy rápido. Mucho ruido — no recomendado para principiantes.',
  M5:  'Velas de 5 minutos (últimos 60 días). Útil para ver movimientos intradía rápidos.',
  M15: 'Velas de 15 minutos (últimos 60 días). Buen equilibrio para ver señales intradía sin tanto ruido.',
  H1:  'Velas de 1 hora. El timeframe más usado por traders retail. Ideal para analizar tendencias del día.',
  H4:  'Velas de 4 horas. Muestra la tendencia de varios días. Úsalo para contexto antes de entrar en H1.',
  D1:  'Velas diarias. Una vela = un día de trading. Perfecto para ver el panorama semanal.',
  W1:  'Velas semanales. Una vela = una semana. Para análisis de largo plazo y niveles clave macro.',
  MN:  'Velas mensuales. Una vela = un mes. Sirve para ver zonas de soporte/resistencia históricas.',
};

const TF_UNAVAILABLE: Timeframe[] = [];

// ─── Drawing tools ────────────────────────────────────────────────────────────

const DRAWING_TOOLS: { tool: DrawingTool; icon: string; title: string }[] = [
  { tool: 'cursor', icon: '↖', title: 'Cursor (normal)' },
  { tool: 'hline',  icon: '─', title: 'Línea horizontal (soporte/resistencia)' },
  { tool: 'trend',  icon: '╱', title: 'Línea de tendencia' },
  { tool: 'rect',   icon: '▭', title: 'Zona / rectángulo' },
  { tool: 'fib',    icon: 'φ', title: 'Fibonacci retracement' },
  { tool: 'eraser', icon: '✕', title: 'Borrar dibujo' },
];

const DRAWING_COLORS = ['#c9a84c', '#2dcc6f', '#e84040', '#4a6cf7', '#f0b429', '#8b5cf6', '#ffffff'];

// ─── Indicator buttons ────────────────────────────────────────────────────────

const INDICATOR_BTNS = [
  { key: 'showMA20'   as const, label: 'MA20', color: '#f0b429', toggle: 'toggleMA20'   as const,
    tip: 'Media Móvil 20 periodos (naranja). Muestra la tendencia promedio de las últimas 20 velas. Si el precio está por encima → tendencia alcista. Si cruza por debajo → posible cambio de tendencia.' },
  { key: 'showMA50'   as const, label: 'MA50', color: '#4a6cf7', toggle: 'toggleMA50'   as const,
    tip: 'Media Móvil 50 periodos (azul). Tendencia de medio plazo. Cuando MA20 cruza por encima de MA50 = señal de compra (Golden Cross). Cuando MA20 cruza por debajo = señal de venta (Death Cross).' },
  { key: 'showBB'     as const, label: 'BB',   color: '#8b5cf6', toggle: 'toggleBB'     as const,
    tip: 'Bandas de Bollinger (morado). Muestran la volatilidad. Las bandas se expanden cuando el mercado es volátil y se contraen cuando está quieto. El precio tiende a rebotar desde los bordes.' },
  { key: 'showRSI'    as const, label: 'RSI',  color: '#22d3ee', toggle: 'toggleRSI'    as const,
    tip: 'RSI (Índice de Fuerza Relativa). Va de 0 a 100. Más de 70 = el mercado está "sobrecomprado" (puede bajar). Menos de 30 = "sobrevendido" (puede subir). Panel separado debajo del gráfico.' },
  { key: 'showMACD'   as const, label: 'MACD', color: '#f97316', toggle: 'toggleMACD'   as const,
    tip: 'MACD (Moving Average Convergence Divergence). Muestra el momentum. Cuando la línea MACD cruza por encima de la señal = posible subida. Por debajo = posible bajada. El histograma muestra la fuerza.' },
  { key: 'showVolume' as const, label: 'Vol',  color: '#6b7385', toggle: 'toggleVolume' as const,
    tip: 'Volumen de operaciones. Las barras muestran cuánto se ha operado en cada vela. Alto volumen en un movimiento = señal más fiable. Bajo volumen = movimiento poco convincente.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ChartToolbar() {
  const store = useChartStore();
  const { status, refreshing, forceRefresh } = usePriceData();

  return (
    <div className="flex flex-col shrink-0 bg-[#0b0d11]" style={{ borderBottom: '1px solid #1d2029' }}>
      {/* ── Row 1: Timeframes + Drawing tools + Indicators ── */}
      <div className="flex items-center gap-0 px-1.5 py-0.5 flex-wrap" style={{ fontSize: 10, minHeight: 28 }}>

        {/* Timeframes */}
        {TF_GROUPS.map((group, gi) => (
          <div key={group.label} className={clsx('flex items-center', gi > 0 && 'ml-0.5')}>
            {gi > 0 && <div className="w-px h-3.5 bg-[#1d2029] mx-1" />}
            {group.tfs.map((tf) => {
              const unavail = TF_UNAVAILABLE.includes(tf);
              return (
                <CTip key={tf} text={TF_TIP[tf]}>
                  <button
                    onClick={() => !unavail && store.setTimeframe(tf)}
                    className={clsx(
                      'px-1.5 py-0.5 font-mono transition-colors rounded-sm',
                      unavail && 'opacity-30 cursor-not-allowed',
                      !unavail && store.timeframe === tf
                        ? 'bg-[#c9a84c] text-black font-bold'
                        : !unavail && 'text-[#6b7385] hover:text-[#c8cdd8] hover:bg-[#1d2029]',
                    )}
                  >
                    {TF_LABEL[tf]}
                  </button>
                </CTip>
              );
            })}
          </div>
        ))}

        <div className="w-px h-3.5 bg-[#1d2029] mx-2" />

        {/* Drawing tools */}
        {DRAWING_TOOLS.map(({ tool, icon, title }) => (
          <CTip key={tool} text={title}>
          <button
            onClick={() => store.setDrawingTool(tool)}
            title={title}
            className={clsx(
              'w-6 h-6 flex items-center justify-center transition-colors rounded-sm mr-0.5',
              store.drawingTool === tool
                ? 'bg-[#c9a84c22] text-[#c9a84c] border border-[#c9a84c66]'
                : 'text-[#6b7385] hover:text-[#c8cdd8] hover:bg-[#1d2029] border border-transparent',
            )}
            style={{ fontFamily: 'monospace' }}
          >
            {icon}
          </button>
          </CTip>
        ))}

        {/* Color picker for drawings */}
        <div className="flex items-center gap-0.5 ml-1">
          {DRAWING_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => store.setDrawingColor(c)}
              title={c}
              className="w-3.5 h-3.5 rounded-full border transition-all"
              style={{
                background: c,
                borderColor: store.drawingColor === c ? '#fff' : 'transparent',
                transform: store.drawingColor === c ? 'scale(1.25)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Clear all drawings */}
        <CTip text="Borrar todos los dibujos del gráfico">
          <button
            onClick={() => store.clearDrawings()}
            className="w-6 h-6 flex items-center justify-center transition-colors rounded-sm ml-1 text-[#6b7385] hover:text-[#e84040] hover:bg-[#1d2029] border border-transparent"
            style={{ fontFamily: 'monospace', fontSize: 11 }}
          >
            🗑
          </button>
        </CTip>

        <div className="w-px h-3.5 bg-[#1d2029] mx-2" />

        {/* Indicators */}
        <div className="flex items-center gap-0.5">
          {INDICATOR_BTNS.map((btn) => {
            const active = store[btn.key] as boolean;
            return (
              <CTip key={btn.key} text={btn.tip}>
                <button
                  onClick={() => store[btn.toggle]()}
                  className={clsx(
                    'px-1.5 py-0.5 border transition-colors rounded-sm',
                    active ? 'bg-white/5 border-current' : 'border-transparent text-[#6b7385] hover:text-[#c8cdd8] hover:bg-[#1d2029]',
                  )}
                  style={{ color: active ? btn.color : undefined }}
                >
                  {btn.label}
                </button>
              </CTip>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Data status */}
        {status && (
          <div className="flex items-center gap-2" style={{ fontSize: 10 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2dcc6f] shrink-0" />
            <span className="text-[#6b7385] hidden sm:inline">
              Yahoo · <span className="font-mono text-[#c8cdd8]">{status.total.toLocaleString()}</span> velas H1
            </span>
            <button
              onClick={forceRefresh}
              disabled={refreshing}
              className="px-1.5 py-0.5 border border-[#1d2029] text-[#6b7385] hover:text-[#c8cdd8] hover:bg-[#1d2029] transition-colors disabled:opacity-40 rounded-sm"
            >
              {refreshing ? '⟳...' : '⟳'}
            </button>
          </div>
        )}

        <div className="w-px h-3.5 bg-[#1d2029] mx-2" />

        {/* Replay */}
        <ReplayControls />
      </div>

      {/* ── Row 2: Drawing mode hint (only when tool active) ── */}
      {store.drawingTool !== 'cursor' && (
        <div
          className="flex items-center justify-between px-3 py-0.5"
          style={{ background: '#c9a84c0d', borderTop: '1px solid #c9a84c22', fontSize: 9 }}
        >
          <span style={{ color: '#c9a84c' }}>
            {store.drawingTool === 'hline'  && '▸ Clic en el gráfico para fijar una línea horizontal'}
            {store.drawingTool === 'trend'  && '▸ Arrastra para trazar la línea de tendencia'}
            {store.drawingTool === 'rect'   && '▸ Arrastra para dibujar la zona'}
            {store.drawingTool === 'fib'    && '▸ Arrastra del máximo al mínimo (o viceversa)'}
            {store.drawingTool === 'eraser' && '▸ Clic sobre un dibujo para eliminarlo'}
          </span>
          <button
            onClick={() => store.setDrawingTool('cursor')}
            className="px-2 py-0.5 rounded-sm"
            style={{ color: '#6b7385', background: '#1d2029' }}
          >
            Salir · Esc
          </button>
        </div>
      )}
    </div>
  );
}

function ReplayControls() {
  const { replayMode, replaySpeed, setReplayMode, setReplaySpeed } = useChartStore();
  return (
    <div className="flex items-center gap-1.5">
      {replayMode && (
        <select
          value={replaySpeed}
          onChange={(e) => setReplaySpeed(Number(e.target.value))}
          className="bg-[#0f1117] border border-[#1d2029] text-[#c8cdd8] px-1 py-0.5 rounded-sm"
          style={{ fontSize: 10 }}
        >
          <option value={2000}>0.5×</option>
          <option value={1000}>1×</option>
          <option value={500}>2×</option>
          <option value={200}>5×</option>
          <option value={100}>10×</option>
        </select>
      )}
      <button
        onClick={() => setReplayMode(!replayMode)}
        className={clsx(
          'flex items-center gap-1 px-2 py-0.5 border transition-colors rounded-sm',
          replayMode
            ? 'border-[#e84040] text-[#e84040] bg-red-500/10'
            : 'border-[#1d2029] text-[#6b7385] hover:text-[#c8cdd8] hover:bg-[#1d2029]',
        )}
        style={{ fontSize: 10 }}
      >
        {replayMode ? '⏹ Stop' : '▶ Replay'}
      </button>
    </div>
  );
}

'use client';
import clsx from 'clsx';
import { useChartStore, type Timeframe } from '@/store/chart.store';
import { usePriceData } from '@/hooks/usePriceData';

const TIMEFRAMES: Timeframe[] = ['M5', 'M15', 'H1', 'H4', 'D1'];

const INDICATOR_BTNS = [
  { key: 'showMA20'   as const, label: 'MA20', color: 'text-[#f0b429]',            toggle: 'toggleMA20'   as const },
  { key: 'showMA50'   as const, label: 'MA50', color: 'text-[#4a6cf7]',            toggle: 'toggleMA50'   as const },
  { key: 'showBB'     as const, label: 'BB',   color: 'text-[#8b5cf6]',            toggle: 'toggleBB'     as const },
  { key: 'showRSI'    as const, label: 'RSI',  color: 'text-[var(--mt-cyan)]',     toggle: 'toggleRSI'    as const },
  { key: 'showMACD'   as const, label: 'MACD', color: 'text-[#f97316]',            toggle: 'toggleMACD'   as const },
  { key: 'showVolume' as const, label: 'Vol',  color: 'text-[var(--mt-text-dim)]', toggle: 'toggleVolume' as const },
];

export function ChartToolbar() {
  const store = useChartStore();
  const { status, refreshing, forceRefresh } = usePriceData();

  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 bg-[#0e1118] border-b border-[var(--mt-border)] shrink-0"
      style={{ fontSize: 10 }}
    >
      {/* Timeframes */}
      <div className="flex items-center gap-0.5 mr-2">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => store.setTimeframe(tf)}
            className={clsx(
              'px-2 py-0.5 transition-colors',
              store.timeframe === tf
                ? 'bg-[var(--mt-blue)] text-white'
                : 'text-[var(--mt-text-dim)] hover:text-[var(--mt-text)] hover:bg-[var(--mt-hover)]',
            )}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-[var(--mt-sep)] mx-1" />

      {/* Indicators */}
      <div className="flex items-center gap-0.5">
        {INDICATOR_BTNS.map((btn) => {
          const active = store[btn.key] as boolean;
          return (
            <button
              key={btn.key}
              onClick={() => store[btn.toggle]()}
              className={clsx(
                'px-2 py-0.5 border transition-colors',
                active
                  ? `border-current ${btn.color} bg-white/5`
                  : 'border-transparent text-[var(--mt-text-dim)] hover:text-[var(--mt-text)] hover:bg-[var(--mt-hover)]',
              )}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-4 bg-[var(--mt-sep)] mx-2" />

      {/* Data source status */}
      {status && (
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--mt-green)]" />
          <span className="text-[var(--mt-text-dim)]">
            Yahoo Finance · <span className="font-mono text-[var(--mt-text)]">{status.total.toLocaleString()} velas</span>
          </span>
          <button
            onClick={forceRefresh}
            disabled={refreshing}
            className="px-1.5 py-0.5 border border-[var(--mt-sep)] text-[var(--mt-text-dim)] hover:text-[var(--mt-text)] hover:bg-[var(--mt-hover)] transition-colors disabled:opacity-40"
          >
            {refreshing ? '⟳ Actualizando...' : '⟳ Actualizar datos'}
          </button>
        </div>
      )}

      <div className="flex-1" />

      {/* Replay */}
      <ReplayControls />
    </div>
  );
}

function ReplayControls() {
  const { replayMode, replaySpeed, setReplayMode, setReplaySpeed } = useChartStore();

  return (
    <div className="flex items-center gap-2">
      {replayMode && (
        <select
          value={replaySpeed}
          onChange={(e) => setReplaySpeed(Number(e.target.value))}
          className="bg-[var(--mt-input)] border border-[var(--mt-border)] text-[var(--mt-text)] px-1 py-0.5"
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
          'flex items-center gap-1 px-2 py-0.5 border transition-colors',
          replayMode
            ? 'border-[var(--mt-red)] text-[var(--mt-red)] bg-red-500/10'
            : 'border-[var(--mt-sep)] text-[var(--mt-text-dim)] hover:text-[var(--mt-text)] hover:bg-[var(--mt-hover)]',
        )}
      >
        {replayMode ? '⏹ Parar replay' : '▶ Replay'}
      </button>
    </div>
  );
}

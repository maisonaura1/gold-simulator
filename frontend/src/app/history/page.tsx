'use client';
import { AppShell } from '@/components/layout/AppShell';
import { useTrades } from '@/hooks/useTrades';
import clsx from 'clsx';

export default function HistoryPage() {
  const { trades, loading } = useTrades();

  const closed = trades.filter((t) => t.status !== 'OPEN');
  const totalPnl = closed.reduce((s, t) => s + (t.resultUsd ?? 0), 0);
  const wins = closed.filter((t) => (t.resultUsd ?? 0) > 0).length;
  const winRate = closed.length > 0 ? ((wins / closed.length) * 100).toFixed(1) : '—';

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-4 py-2 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] shrink-0"
          style={{ fontSize: 11 }}
        >
          <div className="flex items-center gap-6">
            <span className="text-[var(--mt-text-label)] font-medium uppercase tracking-wide">Historial de operaciones</span>
            <span className="text-[var(--mt-text-dim)]">Total: <span className="text-[var(--mt-text)]">{closed.length}</span></span>
            <span className="text-[var(--mt-text-dim)]">Winrate: <span className="text-[var(--mt-cyan)]">{winRate}%</span></span>
            <span className="text-[var(--mt-text-dim)]">P/L Total:
              <span className={clsx('ml-1 font-mono font-bold', totalPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </span>
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {/* Column headers */}
          <div
            className="flex bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] sticky top-0"
            style={{ fontSize: 10 }}
          >
            {['Hora entrada', 'Hora salida', 'Ticket', 'Tipo', 'Lots', 'Símbolo', 'Entrada', 'Salida', 'S/L', 'T/P', 'Riesgo%', 'R/R', 'P/L ($)', 'Estado'].map((col) => (
              <div key={col} className="px-2 py-1.5 text-[var(--mt-text-dim)] font-medium whitespace-nowrap shrink-0 min-w-[70px]">
                {col}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>
              Cargando...
            </div>
          ) : closed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-[var(--mt-text-dim)] gap-2" style={{ fontSize: 11 }}>
              <span style={{ fontSize: 24 }}>📋</span>
              Sin operaciones en el historial. ¡Ve a Simular para empezar!
            </div>
          ) : (
            closed.map((t, i) => (
              <div
                key={t.id}
                className={clsx(
                  'flex border-b border-[var(--mt-border)]/30 hover:bg-[var(--mt-hover)] transition-colors',
                  i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]',
                )}
                style={{ fontSize: 11 }}
              >
                <div className="px-2 py-1.5 font-mono text-[var(--mt-text-dim)] whitespace-nowrap shrink-0 min-w-[70px]">
                  {new Date(t.entryAt).toLocaleString('es', { hour12: false, dateStyle: 'short', timeStyle: 'short' })}
                </div>
                <div className="px-2 py-1.5 font-mono text-[var(--mt-text-dim)] whitespace-nowrap shrink-0 min-w-[70px]">
                  {t.exitAt ? new Date(t.exitAt).toLocaleString('es', { hour12: false, dateStyle: 'short', timeStyle: 'short' }) : '—'}
                </div>
                <div className="px-2 py-1.5 font-mono text-[var(--mt-text-dim)] shrink-0 min-w-[70px]">{t.id.slice(-8)}</div>
                <div className={clsx('px-2 py-1.5 font-bold shrink-0 min-w-[70px]', t.type === 'BUY' ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>{t.type}</div>
                <div className="px-2 py-1.5 font-mono shrink-0 min-w-[70px]">{t.lot.toFixed(2)}</div>
                <div className="px-2 py-1.5 font-medium text-[var(--mt-yellow)] shrink-0 min-w-[70px]">XAUUSD</div>
                <div className="px-2 py-1.5 font-mono shrink-0 min-w-[70px]">{t.entryPrice.toFixed(2)}</div>
                <div className="px-2 py-1.5 font-mono shrink-0 min-w-[70px]">{t.exitPrice?.toFixed(2) ?? '—'}</div>
                <div className="px-2 py-1.5 font-mono text-[var(--mt-red)] shrink-0 min-w-[70px]">{t.sl?.toFixed(2) ?? '—'}</div>
                <div className="px-2 py-1.5 font-mono text-[var(--mt-green)] shrink-0 min-w-[70px]">{t.tp?.toFixed(2) ?? '—'}</div>
                <div className={clsx('px-2 py-1.5 font-mono shrink-0 min-w-[70px]', (t.riskPct ?? 0) > 2 ? 'text-[var(--mt-red)]' : 'text-[var(--mt-green)]')}>
                  {t.riskPct?.toFixed(2) ?? '—'}%
                </div>
                <div className={clsx('px-2 py-1.5 font-mono shrink-0 min-w-[70px]', (t.rrRatio ?? 0) >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]')}>
                  {t.rrRatio?.toFixed(2) ?? '—'}
                </div>
                <div className={clsx('px-2 py-1.5 font-mono font-bold shrink-0 min-w-[70px]', (t.resultUsd ?? 0) >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>
                  {(t.resultUsd ?? 0) >= 0 ? '+' : ''}${(t.resultUsd ?? 0).toFixed(2)}
                </div>
                <div className="px-2 py-1.5 shrink-0 min-w-[70px]">
                  <span className={clsx(
                    'px-1.5 py-0.5 text-[10px] font-medium border',
                    t.status === 'SIMULATED' ? 'border-blue-500/40 text-blue-400 bg-blue-500/10' : 'border-[var(--mt-sep)] text-[var(--mt-text-dim)]',
                  )}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}

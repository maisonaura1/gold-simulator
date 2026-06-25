'use client';
import { AppShell } from '@/components/layout/AppShell';
import { useTrades } from '@/hooks/useTrades';
import { useT } from '@/hooks/useT';
import clsx from 'clsx';

export default function HistoryPage() {
  const { trades, loading } = useTrades();
  const t = useT();

  const closed = trades.filter((tr) => tr.status !== 'OPEN');
  const totalPnl = closed.reduce((s, tr) => s + (tr.resultUsd ?? 0), 0);
  const wins = closed.filter((tr) => (tr.resultUsd ?? 0) > 0).length;
  const winRate = closed.length > 0 ? ((wins / closed.length) * 100).toFixed(1) : '—';

  const COLS = [t.colTime, t.colClose, t.colTicket, t.colType, t.colLots, t.colSymbol, t.colEntry, t.colExit, t.colSL, t.colTP, t.colRisk, t.colRR, t.colPL, t.colStatus];

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div
          className="flex items-center justify-between px-4 py-2 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] shrink-0"
          style={{ fontSize: 11 }}
        >
          <div className="flex items-center gap-6">
            <span className="text-[var(--mt-text-label)] font-medium uppercase tracking-wide">{t.tradeHistory}</span>
            <span className="text-[var(--mt-text-dim)]">{t.total}: <span className="text-[var(--mt-text)]">{closed.length}</span></span>
            <span className="text-[var(--mt-text-dim)]">{t.winrateLabel}: <span className="text-[var(--mt-cyan)]">{winRate}%</span></span>
            <span className="text-[var(--mt-text-dim)]">{t.totalPL}:
              <span className={clsx('ml-1 font-mono font-bold', totalPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </span>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="flex bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] sticky top-0" style={{ fontSize: 10 }}>
            {COLS.map((col) => (
              <div key={col} className="px-2 py-1.5 text-[var(--mt-text-dim)] font-medium whitespace-nowrap shrink-0 min-w-[70px]">
                {col}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>
              {t.loading}
            </div>
          ) : closed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-[var(--mt-text-dim)] gap-2" style={{ fontSize: 11 }}>
              <span style={{ fontSize: 24 }}>📋</span>
              {t.noHistory}
            </div>
          ) : (
            closed.map((tr, i) => (
              <div
                key={tr.id}
                className={clsx(
                  'flex border-b border-[var(--mt-border)]/30 hover:bg-[var(--mt-hover)] transition-colors',
                  i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]',
                )}
                style={{ fontSize: 11 }}
              >
                <div className="px-2 py-1.5 font-mono text-[var(--mt-text-dim)] whitespace-nowrap shrink-0 min-w-[70px]">
                  {new Date(tr.entryAt).toLocaleString('es', { hour12: false, dateStyle: 'short', timeStyle: 'short' })}
                </div>
                <div className="px-2 py-1.5 font-mono text-[var(--mt-text-dim)] whitespace-nowrap shrink-0 min-w-[70px]">
                  {tr.exitAt ? new Date(tr.exitAt).toLocaleString('es', { hour12: false, dateStyle: 'short', timeStyle: 'short' }) : '—'}
                </div>
                <div className="px-2 py-1.5 font-mono text-[var(--mt-text-dim)] shrink-0 min-w-[70px]">{tr.id.slice(-8)}</div>
                <div className={clsx('px-2 py-1.5 font-bold shrink-0 min-w-[70px]', tr.type === 'BUY' ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>{tr.type}</div>
                <div className="px-2 py-1.5 font-mono shrink-0 min-w-[70px]">{tr.lot.toFixed(2)}</div>
                <div className="px-2 py-1.5 font-medium text-[var(--mt-yellow)] shrink-0 min-w-[70px]">XAUUSD</div>
                <div className="px-2 py-1.5 font-mono shrink-0 min-w-[70px]">{tr.entryPrice.toFixed(2)}</div>
                <div className="px-2 py-1.5 font-mono shrink-0 min-w-[70px]">{tr.exitPrice?.toFixed(2) ?? '—'}</div>
                <div className="px-2 py-1.5 font-mono text-[var(--mt-red)] shrink-0 min-w-[70px]">{tr.sl?.toFixed(2) ?? '—'}</div>
                <div className="px-2 py-1.5 font-mono text-[var(--mt-green)] shrink-0 min-w-[70px]">{tr.tp?.toFixed(2) ?? '—'}</div>
                <div className={clsx('px-2 py-1.5 font-mono shrink-0 min-w-[70px]', (tr.riskPct ?? 0) > 2 ? 'text-[var(--mt-red)]' : 'text-[var(--mt-green)]')}>
                  {tr.riskPct?.toFixed(2) ?? '—'}%
                </div>
                <div className={clsx('px-2 py-1.5 font-mono shrink-0 min-w-[70px]', (tr.rrRatio ?? 0) >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]')}>
                  {tr.rrRatio?.toFixed(2) ?? '—'}
                </div>
                <div className={clsx('px-2 py-1.5 font-mono font-bold shrink-0 min-w-[70px]', (tr.resultUsd ?? 0) >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>
                  {(tr.resultUsd ?? 0) >= 0 ? '+' : ''}${(tr.resultUsd ?? 0).toFixed(2)}
                </div>
                <div className="px-2 py-1.5 shrink-0 min-w-[70px]">
                  <span className={clsx(
                    'px-1.5 py-0.5 text-[10px] font-medium border',
                    tr.status === 'SIMULATED' ? 'border-blue-500/40 text-blue-400 bg-blue-500/10' : 'border-[var(--mt-sep)] text-[var(--mt-text-dim)]',
                  )}>
                    {tr.status}
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

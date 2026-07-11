'use client';
import { useTrades } from '@/hooks/useTrades';
import { usePricesStore } from '@/store/prices.store';
import clsx from 'clsx';
import type { Trade } from '@/types';

function TradeCard({ trade, onClose }: { trade: Trade; onClose?: (id: string) => void }) {
  const currentPrice = usePricesStore((s) => s.currentPrice);
  const isOpen = trade.status === 'OPEN';

  const livePnl = isOpen && currentPrice > 0
    ? (trade.type === 'BUY'
        ? (currentPrice - trade.entryPrice)
        : (trade.entryPrice - currentPrice)) * trade.lot * 100
    : null;

  const pnl = livePnl ?? trade.resultUsd ?? null;

  return (
    <div
      style={{
        background: '#12161f',
        border: `1px solid ${isOpen ? '#2e3340' : pnl && pnl > 0 ? '#2dcc6f22' : pnl && pnl < 0 ? '#e8404022' : '#1d2029'}`,
        borderRadius: 10,
        padding: '12px 14px',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="font-bold text-sm"
            style={{ color: trade.type === 'BUY' ? '#2dcc6f' : '#e84040' }}
          >
            {trade.type}
          </span>
          <span style={{ fontSize: 10, color: '#6b7385' }}>#{trade.id.slice(-6)}</span>
          {isOpen && (
            <span
              style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: '#33c2ff',
                background: '#33c2ff15', border: '1px solid #33c2ff33', borderRadius: 3, padding: '1px 5px' }}
            >
              OPEN
            </span>
          )}
        </div>
        {pnl !== null && (
          <span
            className="font-mono font-bold"
            style={{ fontSize: 16, color: pnl >= 0 ? '#2dcc6f' : '#e84040' }}
          >
            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
          </span>
        )}
      </div>

      {/* Details row */}
      <div className="flex items-center justify-between">
        <div style={{ fontSize: 11, color: '#4a5568' }}>
          {trade.lot.toFixed(2)} lot @ {trade.entryPrice.toFixed(2)}
          {trade.sl && <span style={{ color: '#e84040' }}> · SL {trade.sl.toFixed(2)}</span>}
          {trade.tp && <span style={{ color: '#2dcc6f' }}> · TP {trade.tp.toFixed(2)}</span>}
        </div>
        {isOpen && onClose ? (
          <button
            onClick={() => onClose(trade.id)}
            className="px-3 py-1 text-xs font-bold"
            style={{ background: '#7a1a1a', border: '1px solid #8f1f1f', color: '#e84040', borderRadius: 6 }}
          >
            Cerrar
          </button>
        ) : (
          trade.rrRatio !== null && (
            <span
              style={{ fontSize: 10, fontFamily: 'monospace',
                color: (trade.rrRatio ?? 0) >= 2 ? '#2dcc6f' : '#f0b429' }}
            >
              R:R {trade.rrRatio?.toFixed(2) ?? '—'}
            </span>
          )
        )}
      </div>

      {/* Date */}
      <div style={{ fontSize: 9, color: '#2e3340', marginTop: 6 }}>
        {new Date(trade.entryAt).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short', hour12: false })}
        {trade.exitAt && ` → ${new Date(trade.exitAt).toLocaleString('es', { timeStyle: 'short', hour12: false })}`}
      </div>
    </div>
  );
}

export function MobileHistoryPage() {
  const { trades, openTrades, closeTrade } = useTrades();
  const all = [...openTrades, ...trades.filter((t) => t.status !== 'OPEN')];

  if (all.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: '#4a5568' }}>
        <span style={{ fontSize: 32 }}>📋</span>
        <span style={{ fontSize: 13 }}>Aún no tienes operaciones</span>
        <span style={{ fontSize: 11, color: '#2e3340' }}>Abre tu primera orden desde ⚡ Operar</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2" style={{ overscrollBehavior: 'contain' }}>
      {all.map((tr) => (
        <TradeCard
          key={tr.id}
          trade={tr}
          onClose={tr.status === 'OPEN' ? closeTrade : undefined}
        />
      ))}
    </div>
  );
}

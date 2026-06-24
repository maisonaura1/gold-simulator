'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { useTrades } from '@/hooks/useTrades';
import { useAccount } from '@/hooks/useAccount';
import { usePricesStore } from '@/store/prices.store';
import type { Trade } from '@/types';

type Tab = 'trade' | 'history' | 'account';

function PnLCell({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[var(--mt-text-dim)]">—</span>;
  return (
    <span className={value >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'}>
      {value >= 0 ? '+' : ''}{value.toFixed(2)}
    </span>
  );
}

function OpenTradeRow({ trade, onClose }: { trade: Trade; onClose: (id: string) => void }) {
  const price = usePricesStore((s) => s.currentPrice);

  const livePnl =
    price > 0
      ? trade.type === 'BUY'
        ? (price - trade.entryPrice) * trade.lot * 100
        : (trade.entryPrice - price) * trade.lot * 100
      : null;

  return (
    <div className="flex items-center border-b border-[var(--mt-border)]/30 hover:bg-[var(--mt-hover)] transition-colors text-[11px]">
      <div className="w-20 px-2 py-1.5 font-mono text-[var(--mt-text-dim)]">{new Date(trade.entryAt).toLocaleTimeString('es', { hour12: false })}</div>
      <div className="w-16 px-2 py-1.5 font-mono text-[var(--mt-text-dim)]">{trade.id.slice(-6)}</div>
      <div className={clsx('w-14 px-2 py-1.5 font-bold', trade.type === 'BUY' ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>{trade.type}</div>
      <div className="w-14 px-2 py-1.5 font-mono">{trade.lot.toFixed(2)}</div>
      <div className="w-20 px-2 py-1.5 text-[var(--mt-yellow)]">XAUUSD</div>
      <div className="w-20 px-2 py-1.5 font-mono">{trade.entryPrice.toFixed(2)}</div>
      <div className="w-20 px-2 py-1.5 font-mono text-[var(--mt-red)]">{trade.sl?.toFixed(2) ?? '—'}</div>
      <div className="w-20 px-2 py-1.5 font-mono text-[var(--mt-green)]">{trade.tp?.toFixed(2) ?? '—'}</div>
      <div className="w-24 px-2 py-1.5 font-mono"><PnLCell value={livePnl} /></div>
      <div className="px-2 py-1.5">
        <button
          onClick={() => onClose(trade.id)}
          className="px-2 py-0.5 text-[10px] bg-[var(--mt-sell)] hover:bg-[var(--mt-sell-hover)] text-[var(--mt-sell-text)] transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

const COL_HEADERS_OPEN = ['Hora', 'Ticket', 'Tipo', 'Lots', 'Símbolo', 'Entrada', 'S/L', 'T/P', 'P/L vivo', ''];
const COL_HEADERS_HIST = ['Apertura', 'Cierre', 'Ticket', 'Tipo', 'Lots', 'Símbolo', 'Entrada', 'Salida', 'R/R', 'P/L'];

export function TerminalPanel() {
  const [tab, setTab] = useState<Tab>('trade');
  const { openTrades, trades, closeTrade } = useTrades();
  const { account } = useAccount();
  const currentPrice = usePricesStore((s) => s.currentPrice);

  const closed = trades.filter((t) => t.status !== 'OPEN');

  const totalLivePnl = openTrades.reduce((sum, t) => {
    if (currentPrice <= 0) return sum;
    const pnl = t.type === 'BUY'
      ? (currentPrice - t.entryPrice) * t.lot * 100
      : (t.entryPrice - currentPrice) * t.lot * 100;
    return sum + pnl;
  }, 0);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'trade',   label: `Trade (${openTrades.length})` },
    { key: 'history', label: 'Historial' },
    { key: 'account', label: 'Cuenta' },
  ];

  return (
    <div className="flex flex-col h-48 bg-[var(--mt-panel)] border-t border-[var(--mt-border)]">
      {/* Tab bar */}
      <div className="flex items-center bg-[#0e1118] border-b border-[var(--mt-border)] shrink-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx('mt-tab', tab === t.key && 'mt-tab-active')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tab === 'trade' && (
          <>
            <div className="flex bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] sticky top-0">
              {COL_HEADERS_OPEN.map((h) => (
                <div key={h} className="px-2 py-1 text-[10px] text-[var(--mt-text-dim)] font-medium whitespace-nowrap min-w-[60px]">{h}</div>
              ))}
            </div>
            {openTrades.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>
                Sin posiciones abiertas
              </div>
            ) : (
              openTrades.map((t) => <OpenTradeRow key={t.id} trade={t} onClose={closeTrade} />)
            )}
            {openTrades.length > 0 && (
              <div className="flex gap-6 justify-end px-4 py-1.5 bg-[var(--mt-toolbar)] border-t border-[var(--mt-border)] text-[11px] sticky bottom-0">
                <span className="text-[var(--mt-text-dim)]">P/L flotante: <PnLCell value={totalLivePnl} /></span>
                <span className="text-[var(--mt-text-dim)]">Balance: <span className="font-mono text-[var(--mt-white)]">${account?.currentBalance.toFixed(2) ?? '—'}</span></span>
                <span className="text-[var(--mt-text-dim)]">Equity: <span className="font-mono text-[var(--mt-cyan)]">${((account?.currentBalance ?? 0) + totalLivePnl).toFixed(2)}</span></span>
              </div>
            )}
          </>
        )}

        {tab === 'history' && (
          <>
            <div className="flex bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] sticky top-0">
              {COL_HEADERS_HIST.map((h) => (
                <div key={h} className="px-2 py-1 text-[10px] text-[var(--mt-text-dim)] font-medium whitespace-nowrap min-w-[70px]">{h}</div>
              ))}
            </div>
            {closed.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>Sin historial</div>
            ) : closed.slice(0, 30).map((t) => (
              <div key={t.id} className="flex border-b border-[var(--mt-border)]/30 hover:bg-[var(--mt-hover)] text-[11px]">
                <div className="min-w-[70px] px-2 py-1.5 font-mono text-[var(--mt-text-dim)]">{new Date(t.entryAt).toLocaleString('es', { hour12: false, dateStyle: 'short', timeStyle: 'short' })}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono text-[var(--mt-text-dim)]">{t.exitAt ? new Date(t.exitAt).toLocaleString('es', { hour12: false, dateStyle: 'short', timeStyle: 'short' }) : '—'}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono text-[var(--mt-text-dim)]">{t.id.slice(-6)}</div>
                <div className={clsx('min-w-[70px] px-2 py-1.5 font-bold', t.type === 'BUY' ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>{t.type}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono">{t.lot.toFixed(2)}</div>
                <div className="min-w-[70px] px-2 py-1.5 text-[var(--mt-yellow)]">XAUUSD</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono">{t.entryPrice.toFixed(2)}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono">{t.exitPrice?.toFixed(2) ?? '—'}</div>
                <div className={clsx('min-w-[70px] px-2 py-1.5 font-mono', (t.rrRatio ?? 0) >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]')}>{t.rrRatio?.toFixed(2) ?? '—'}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono"><PnLCell value={t.resultUsd} /></div>
              </div>
            ))}
          </>
        )}

        {tab === 'account' && account && (
          <div className="p-4 grid grid-cols-4 gap-3 text-[11px]">
            {[
              { label: 'Balance', value: `$${account.currentBalance.toFixed(2)}`, cls: 'text-[var(--mt-white)]' },
              { label: 'Equity', value: `$${((account.currentBalance) + totalLivePnl).toFixed(2)}`, cls: 'text-[var(--mt-cyan)]' },
              { label: 'P/L Flotante', value: `${totalLivePnl >= 0 ? '+' : ''}$${totalLivePnl.toFixed(2)}`, cls: totalLivePnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]' },
              { label: 'P/L Hoy', value: `${account.dailyPnl >= 0 ? '+' : ''}$${account.dailyPnl.toFixed(2)}`, cls: account.dailyPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]' },
              { label: 'Nivel', value: String(account.level), cls: 'text-[var(--mt-yellow)]' },
              { label: 'XP', value: `${account.xp} pts`, cls: 'text-[var(--mt-yellow)]' },
              { label: 'Balance inicial', value: `$${account.initialBalance.toFixed(2)}`, cls: 'text-[var(--mt-text-dim)]' },
              { label: 'Posiciones abiertas', value: String(openTrades.length), cls: 'text-[var(--mt-text)]' },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-2">
                <div className="text-[var(--mt-text-dim)] text-[10px] mb-0.5">{item.label}</div>
                <div className={`font-mono font-bold text-sm ${item.cls}`}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { terminalTabEvent } from './Navigator';
import { useTrades } from '@/hooks/useTrades';
import { useAccount } from '@/hooks/useAccount';
import { usePricesStore } from '@/store/prices.store';
import { useT } from '@/hooks/useT';
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

function OpenTradeRow({ trade, onClose, closeLabel }: { trade: Trade; onClose: (id: string) => void; closeLabel: string }) {
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
          {closeLabel}
        </button>
      </div>
    </div>
  );
}

export function TerminalPanel() {
  const [tab, setTab] = useState<Tab>('trade');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Tab;
      if (detail) setTab(detail);
    };
    terminalTabEvent?.addEventListener('setTab', handler);
    return () => terminalTabEvent?.removeEventListener('setTab', handler);
  }, []);
  const { openTrades, trades, closeTrade } = useTrades();
  const { account } = useAccount();
  const currentPrice = usePricesStore((s) => s.currentPrice);
  const t = useT();

  const closed = trades.filter((tr) => tr.status !== 'OPEN');

  const totalLivePnl = openTrades.reduce((sum, tr) => {
    if (currentPrice <= 0) return sum;
    const pnl = tr.type === 'BUY'
      ? (currentPrice - tr.entryPrice) * tr.lot * 100
      : (tr.entryPrice - currentPrice) * tr.lot * 100;
    return sum + pnl;
  }, 0);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'trade',   label: t.tradeTab(openTrades.length) },
    { key: 'history', label: t.historyTab },
    { key: 'account', label: t.accountTab },
  ];

  const COL_HEADERS_OPEN = [t.colTime, t.colTicket, t.colType, t.colLots, t.colSymbol, t.colEntry, t.colSL, t.colTP, t.colLivePL, ''];
  const COL_HEADERS_HIST = [t.colOpen, t.colClose, t.colTicket, t.colType, t.colLots, t.colSymbol, t.colEntry, t.colExit, t.colRR, t.colPL];

  return (
    <div className="flex flex-col h-48 bg-[var(--mt-panel)] border-t border-[var(--mt-border)]">
      <div className="flex items-center bg-[#0e1118] border-b border-[var(--mt-border)] shrink-0">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={clsx('mt-tab', tab === tb.key && 'mt-tab-active')}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {tab === 'trade' && (
          <>
            <div className="flex bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] sticky top-0">
              {COL_HEADERS_OPEN.map((h, i) => (
                <div key={i} className="px-2 py-1 text-[10px] text-[var(--mt-text-dim)] font-medium whitespace-nowrap min-w-[60px]">{h}</div>
              ))}
            </div>
            {openTrades.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>
                {t.noOpenPositions}
              </div>
            ) : (
              openTrades.map((tr) => <OpenTradeRow key={tr.id} trade={tr} onClose={closeTrade} closeLabel={t.closeBtn} />)
            )}
            {openTrades.length > 0 && (
              <div className="flex gap-6 justify-end px-4 py-1.5 bg-[var(--mt-toolbar)] border-t border-[var(--mt-border)] text-[11px] sticky bottom-0">
                <span className="text-[var(--mt-text-dim)]">{t.floatingPL}: <PnLCell value={totalLivePnl} /></span>
                <span className="text-[var(--mt-text-dim)]">{t.balance}: <span className="font-mono text-[var(--mt-white)]">${account?.currentBalance.toFixed(2) ?? '—'}</span></span>
                <span className="text-[var(--mt-text-dim)]">{t.equity}: <span className="font-mono text-[var(--mt-cyan)]">${((account?.currentBalance ?? 0) + totalLivePnl).toFixed(2)}</span></span>
              </div>
            )}
          </>
        )}

        {tab === 'history' && (
          <>
            <div className="flex bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] sticky top-0">
              {COL_HEADERS_HIST.map((h, i) => (
                <div key={i} className="px-2 py-1 text-[10px] text-[var(--mt-text-dim)] font-medium whitespace-nowrap min-w-[70px]">{h}</div>
              ))}
            </div>
            {closed.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>{t.noHistory}</div>
            ) : closed.slice(0, 30).map((tr) => (
              <div key={tr.id} className="flex border-b border-[var(--mt-border)]/30 hover:bg-[var(--mt-hover)] text-[11px]">
                <div className="min-w-[70px] px-2 py-1.5 font-mono text-[var(--mt-text-dim)]">{new Date(tr.entryAt).toLocaleString('es', { hour12: false, dateStyle: 'short', timeStyle: 'short' })}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono text-[var(--mt-text-dim)]">{tr.exitAt ? new Date(tr.exitAt).toLocaleString('es', { hour12: false, dateStyle: 'short', timeStyle: 'short' }) : '—'}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono text-[var(--mt-text-dim)]">{tr.id.slice(-6)}</div>
                <div className={clsx('min-w-[70px] px-2 py-1.5 font-bold', tr.type === 'BUY' ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>{tr.type}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono">{tr.lot.toFixed(2)}</div>
                <div className="min-w-[70px] px-2 py-1.5 text-[var(--mt-yellow)]">XAUUSD</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono">{tr.entryPrice.toFixed(2)}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono">{tr.exitPrice?.toFixed(2) ?? '—'}</div>
                <div className={clsx('min-w-[70px] px-2 py-1.5 font-mono', (tr.rrRatio ?? 0) >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]')}>{tr.rrRatio?.toFixed(2) ?? '—'}</div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono"><PnLCell value={tr.resultUsd} /></div>
              </div>
            ))}
          </>
        )}

        {tab === 'account' && account && (
          <div className="p-4 grid grid-cols-4 gap-3 text-[11px]">
            {[
              { label: t.balance,        value: `$${account.currentBalance.toFixed(2)}`,                                       cls: 'text-[var(--mt-white)]' },
              { label: t.equity,         value: `$${(account.currentBalance + totalLivePnl).toFixed(2)}`,                      cls: 'text-[var(--mt-cyan)]' },
              { label: t.floatingPL,     value: `${totalLivePnl >= 0 ? '+' : ''}$${totalLivePnl.toFixed(2)}`,                  cls: totalLivePnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]' },
              { label: t.plToday,        value: `${account.dailyPnl >= 0 ? '+' : ''}$${account.dailyPnl.toFixed(2)}`,         cls: account.dailyPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]' },
              { label: t.level,          value: String(account.level),                                                          cls: 'text-[var(--mt-yellow)]' },
              { label: t.xp,             value: `${account.xp} pts`,                                                           cls: 'text-[var(--mt-yellow)]' },
              { label: t.startingBalance, value: `$${account.initialBalance.toFixed(2)}`,                                      cls: 'text-[var(--mt-text-dim)]' },
              { label: t.openPositions,  value: String(openTrades.length),                                                     cls: 'text-[var(--mt-text)]' },
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

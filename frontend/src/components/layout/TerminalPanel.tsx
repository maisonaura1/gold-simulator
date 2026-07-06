'use client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { terminalTabEvent } from './Navigator';
import { useTrades } from '@/hooks/useTrades';
import { useAccount } from '@/hooks/useAccount';
import { usePricesStore } from '@/store/prices.store';
import { useT } from '@/hooks/useT';
import { TipLabel } from '@/components/ui/Tooltip';
import type { Trade } from '@/types';

type Tab = 'trade' | 'history' | 'account' | 'ftmo';

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

// ─── FTMO Dashboard ───────────────────────────────────────────────────────────

interface FtmoProps {
  initialBalance: number;
  currentBalance: number;
  dailyPnl: number;
  dailyLossUsed: number;
  totalDrawdown: number;
  totalProfit: number;
  dailyPct: number;
  drawdownPct: number;
  profitPct: number;
  ftmoDailyLimit: number;
  ftmoDrawdownLimit: number;
  ftmoProfitTarget: number;
  ftmoStatus: 'ok' | 'warning' | 'danger';
  todayTrades: number;
  todayWinRate: number | null;
  todayRR: number | null;
}

function FtmoMeter({ label, tip, pct, used, limit, reverse }: {
  label: string; tip: string; pct: number; used: number; limit: number; reverse?: boolean;
}) {
  const color = reverse
    ? pct >= 100 ? '#22c55e' : pct >= 60 ? '#4ade80' : '#f59e0b'
    : pct >= 100 ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#22c55e';

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <TipLabel label={label} tip={tip} side="top" />
        <span className="font-mono text-[10px]" style={{ color }}>
          {reverse ? `+$${used.toFixed(0)}` : `-$${used.toFixed(0)}`} / {reverse ? `+$${limit.toFixed(0)}` : `-$${limit.toFixed(0)}`}
        </span>
      </div>
      <div className="h-2.5 bg-[#0e1118] border border-[#2e3340] overflow-hidden">
        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between mt-0.5" style={{ fontSize: 9, color: '#4a5568' }}>
        <span>0%</span>
        <span style={{ color: pct >= 75 ? color : undefined }}>{pct.toFixed(1)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function FtmoDashboard(p: FtmoProps) {
  const t = useT();
  const alertColor = p.ftmoStatus === 'danger' ? '#ef4444' : p.ftmoStatus === 'warning' ? '#f59e0b' : '#22c55e';
  const alertText  = p.ftmoStatus === 'danger' ? t.ftmoStatusDanger
    : p.ftmoStatus === 'warning' ? t.ftmoStatusWarning : t.ftmoStatusOk;

  const tipDaily    = 'Max 5% of initial balance. If exceeded, the FTMO account is frozen until tomorrow.';
  const tipDDwn     = 'Max 10% of initial balance. If account drops more than this, FTMO closes the account permanently.';
  const tipProfit   = 'You need to earn 8% of initial balance to pass FTMO Phase 1. On $10K = +$800.';
  const tipDailyRule  = 'If you lose more than this in a day, the account is suspended.';
  const tipDDwnRule   = 'If the account drops more than 10% total, it is closed permanently.';
  const tipTargetRule = 'Exceeding this threshold while respecting the rules = real funded account.';

  return (
    <div className="p-3 h-full overflow-auto">
      <div className="flex items-center gap-2 px-3 py-1.5 mb-3 border text-[10px] font-medium"
        style={{ borderColor: `${alertColor}40`, background: `${alertColor}10`, color: alertColor }}>
        {alertText}
      </div>

      <div className="flex gap-3 mb-3">
        <FtmoMeter label={t.ftmoDailyLoss}    tip={tipDaily}  pct={p.dailyPct}   used={p.dailyLossUsed} limit={p.ftmoDailyLimit} />
        <FtmoMeter label={t.ftmoTotalDrawdown} tip={tipDDwn}   pct={p.drawdownPct} used={p.totalDrawdown} limit={p.ftmoDrawdownLimit} />
        <FtmoMeter label={t.ftmoProfitTarget}  tip={tipProfit} pct={p.profitPct}  used={p.totalProfit}   limit={p.ftmoProfitTarget} reverse />
      </div>

      <div className="flex gap-2 text-[10px]">
        {[
          { label: t.ftmoCurrentBalance, tip: 'Balance after all closed trades.',                                               value: `$${p.currentBalance.toFixed(2)}`,                              color: '#c8cdd8' },
          { label: t.ftmoPLToday,        tip: 'Sum of results from trades closed today.',                                       value: `${p.dailyPnl >= 0 ? '+' : ''}$${p.dailyPnl.toFixed(2)}`,     color: p.dailyPnl >= 0 ? '#4ade80' : '#f87171' },
          { label: t.ftmoTradesToday,    tip: 'Number of operations closed today.',                                             value: String(p.todayTrades),                                          color: '#60a5fa' },
          { label: t.ftmoWinRateToday,   tip: 'Percentage of winning trades today. With R:R 2:1, you only need 34%.',          value: p.todayWinRate !== null ? `${p.todayWinRate}%` : '—',          color: (p.todayWinRate ?? 0) >= 50 ? '#4ade80' : '#f59e0b' },
          { label: t.ftmoAvgRRToday,     tip: 'Average risk:reward ratio today. Maintaining ≥2:1 guarantees long-term profit.',value: p.todayRR !== null ? `${p.todayRR.toFixed(2)}:1` : '—',       color: (p.todayRR ?? 0) >= 2 ? '#4ade80' : '#f59e0b' },
        ].map((item) => (
          <div key={item.label} className="flex-1 bg-[#0e1118] border border-[#2e3340] p-2">
            <div className="text-[#4a5568] mb-0.5"><TipLabel label={item.label} tip={item.tip} side="bottom" /></div>
            <div className="font-mono font-bold text-[11px]" style={{ color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 border border-[#2e3340] bg-[#0e1118]">
        <div className="px-3 py-1.5 border-b border-[#2e3340] text-[9px] font-medium text-[#4a5568] uppercase tracking-wide">
          {t.ftmoRulesTitle}
        </div>
        <div className="grid grid-cols-3 divide-x divide-[#2e3340] text-[10px]">
          {[
            { rule: t.ftmoDailyRule,    val: `-5% = -$${(p.initialBalance * 0.05).toFixed(0)}`,  ok: p.dailyPct < 100,    tip: tipDailyRule  },
            { rule: t.ftmoDrawdownRule, val: `-10% = -$${(p.initialBalance * 0.10).toFixed(0)}`, ok: p.drawdownPct < 100, tip: tipDDwnRule   },
            { rule: t.ftmoTargetRule,   val: `+8% = +$${(p.initialBalance * 0.08).toFixed(0)}`,  ok: p.profitPct >= 100,  tip: tipTargetRule },
          ].map((item) => (
            <div key={item.rule} className="px-3 py-2">
              <TipLabel label={item.rule} tip={item.tip} side="top" />
              <div className={clsx('font-mono font-bold mt-0.5', item.ok ? 'text-[#4ade80]' : 'text-[#f87171]')} style={{ fontSize: 11 }}>{item.val}</div>
            </div>
          ))}
        </div>
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

  // ── FTMO metrics ──────────────────────────────────────────────────────────
  const initialBalance = account?.initialBalance ?? 10000;
  const currentBalance = account?.currentBalance ?? initialBalance;
  const dailyPnl = account?.dailyPnl ?? 0;

  const ftmoDailyLimit    = initialBalance * 0.05;
  const ftmoDrawdownLimit = initialBalance * 0.10;
  const ftmoProfitTarget  = initialBalance * 0.08;

  const dailyLossUsed     = Math.max(0, -dailyPnl);
  const totalDrawdown     = Math.max(0, initialBalance - currentBalance);
  const totalProfit       = Math.max(0, currentBalance - initialBalance);

  const dailyPct          = Math.min(100, (dailyLossUsed / ftmoDailyLimit) * 100);
  const drawdownPct       = Math.min(100, (totalDrawdown / ftmoDrawdownLimit) * 100);
  const profitPct         = Math.min(100, (totalProfit / ftmoProfitTarget) * 100);

  const todayTrades       = trades.filter((tr) => {
    if (!tr.exitAt) return false;
    const d = new Date(tr.exitAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const todayWins   = todayTrades.filter((tr) => (tr.resultUsd ?? 0) > 0).length;
  const todayWinRate = todayTrades.length > 0 ? Math.round((todayWins / todayTrades.length) * 100) : null;
  const todayRR     = todayTrades.length > 0
    ? todayTrades.reduce((s, tr) => s + (tr.rrRatio ?? 0), 0) / todayTrades.length
    : null;

  const ftmoStatus =
    dailyPct >= 100 || drawdownPct >= 100 ? 'danger'
    : dailyPct >= 75 || drawdownPct >= 75  ? 'warning'
    : 'ok';

  const TABS: { key: Tab; label: string }[] = [
    { key: 'trade',   label: t.tradeTab(openTrades.length) },
    { key: 'history', label: t.historyTab },
    { key: 'account', label: t.accountTab },
    { key: 'ftmo',    label: `🏦 FTMO ${ftmoStatus === 'danger' ? '🔴' : ftmoStatus === 'warning' ? '🟡' : '🟢'}` },
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
                <div className={clsx('min-w-[70px] px-2 py-1.5 font-mono', (tr.rrRatio ?? 0) >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]')}>
                  <TipLabel
                    label={tr.rrRatio?.toFixed(2) ?? '—'}
                    tip={`R:R ${tr.rrRatio?.toFixed(2) ?? '?'}:1 — ${(tr.rrRatio ?? 0) >= 2 ? 'Correcto: ganancia = doble del riesgo asumido.' : 'Bajo: necesitas R:R ≥2:1 para ser rentable a largo plazo.'}`}
                    side="top"
                  />
                </div>
                <div className="min-w-[70px] px-2 py-1.5 font-mono"><PnLCell value={tr.resultUsd} /></div>
              </div>
            ))}
          </>
        )}

        {tab === 'account' && account && (
          <div className="p-4 grid grid-cols-4 gap-3 text-[11px]">
            {[
              { label: t.balance,         tip: t.tipBalance,         value: `$${account.currentBalance.toFixed(2)}`,                                      cls: 'text-[var(--mt-white)]' },
              { label: t.equity,          tip: t.tipEquity,          value: `$${(account.currentBalance + totalLivePnl).toFixed(2)}`,                     cls: 'text-[var(--mt-cyan)]' },
              { label: t.floatingPL,      tip: t.tipFloatingPL,      value: `${totalLivePnl >= 0 ? '+' : ''}$${totalLivePnl.toFixed(2)}`,                 cls: totalLivePnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]' },
              { label: t.plToday,         tip: t.tipPLToday,         value: `${account.dailyPnl >= 0 ? '+' : ''}$${account.dailyPnl.toFixed(2)}`,        cls: account.dailyPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]' },
              { label: t.level,           tip: t.tipLevel,           value: String(account.level),                                                        cls: 'text-[var(--mt-yellow)]' },
              { label: t.xp,              tip: t.tipXP,              value: `${account.xp} pts`,                                                          cls: 'text-[var(--mt-yellow)]' },
              { label: t.startingBalance, tip: t.tipStartingBalance, value: `$${account.initialBalance.toFixed(2)}`,                                      cls: 'text-[var(--mt-text-dim)]' },
              { label: t.openPositions,   tip: t.tipOpenPositions,   value: String(openTrades.length),                                                    cls: 'text-[var(--mt-text)]' },
            ].map((item) => (
              <div key={item.label} className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-2">
                <div className="text-[var(--mt-text-dim)] text-[10px] mb-0.5">
                  <TipLabel label={item.label} tip={item.tip} side="top" />
                </div>
                <div className={`font-mono font-bold text-sm ${item.cls}`}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'ftmo' && (
          <FtmoDashboard
            initialBalance={initialBalance}
            currentBalance={currentBalance}
            dailyPnl={dailyPnl}
            dailyLossUsed={dailyLossUsed}
            totalDrawdown={totalDrawdown}
            totalProfit={totalProfit}
            dailyPct={dailyPct}
            drawdownPct={drawdownPct}
            profitPct={profitPct}
            ftmoDailyLimit={ftmoDailyLimit}
            ftmoDrawdownLimit={ftmoDrawdownLimit}
            ftmoProfitTarget={ftmoProfitTarget}
            ftmoStatus={ftmoStatus}
            todayTrades={todayTrades.length}
            todayWinRate={todayWinRate}
            todayRR={todayRR}
          />
        )}
      </div>
    </div>
  );
}

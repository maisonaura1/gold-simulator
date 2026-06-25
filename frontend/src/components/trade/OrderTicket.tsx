'use client';
import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { usePricesStore }  from '@/store/prices.store';
import { useChartLines }   from '@/store/chart-lines.store';
import { useTrades }       from '@/hooks/useTrades';
import { useAccount }      from '@/hooks/useAccount';
import { useT }            from '@/hooks/useT';
import type { SimulationResult } from '@/types';

interface Props {
  onResult?: (result: SimulationResult) => void;
}

const SPREAD = 0.30;

export function OrderTicket({ onResult }: Props) {
  const { currentPrice }             = usePricesStore();
  const { simulate }                 = useTrades();
  const { account, refetch }         = useAccount();
  const { setPreview, clearPreview } = useChartLines();
  const t                            = useT();

  const bid = currentPrice > 0 ? +(currentPrice - SPREAD / 2).toFixed(2) : 0;
  const ask = currentPrice > 0 ? +(currentPrice + SPREAD / 2).toFixed(2) : 0;

  const [lot,   setLot]   = useState('0.10');
  const [sl,    setSl]    = useState('');
  const [tp,    setTp]    = useState('');
  const [notes, setNotes] = useState('');
  const [hovered, setHovered] = useState<'BUY' | 'SELL' | null>(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<SimulationResult | null>(null);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const entry = hovered === 'BUY' ? ask : hovered === 'SELL' ? bid : currentPrice;
    setPreview({
      entryPrice: entry > 0 ? entry : null,
      sl:         parseFloat(sl)  || null,
      tp:         parseFloat(tp)  || null,
      tradeType:  hovered,
    });
  }, [sl, tp, hovered, ask, bid, currentPrice, setPreview]);

  useEffect(() => () => clearPreview(), [clearPreview]);

  const lotNum  = parseFloat(lot)  || 0;
  const slNum   = parseFloat(sl)   || 0;
  const tpNum   = parseFloat(tp)   || 0;
  const balance = account?.currentBalance ?? 10000;
  const entry   = hovered === 'BUY' ? ask : bid;

  const slDist    = slNum && entry ? Math.abs(entry - slNum) : 0;
  const tpDist    = tpNum && entry ? Math.abs(tpNum - entry) : 0;
  const riskUsd   = slDist * lotNum * 100;
  const rewardUsd = tpDist * lotNum * 100;
  const riskPct   = balance > 0 ? (riskUsd / balance) * 100 : 0;
  const rr        = riskUsd > 0 ? rewardUsd / riskUsd : 0;

  const riskColor =
    riskPct > 3 ? 'text-[var(--mt-red)]' :
    riskPct > 2 ? 'text-[var(--mt-yellow)]' :
                  'text-[var(--mt-green)]';

  const applySuggestion = useCallback((pips: number, direction: 'BUY' | 'SELL') => {
    const base = direction === 'BUY' ? ask : bid;
    if (!base) return;
    setSl((direction === 'BUY' ? base - pips : base + pips).toFixed(2));
    setTp((direction === 'BUY' ? base + pips * 2 : base - pips * 2).toFixed(2));
  }, [ask, bid]);

  const exec = async (type: 'BUY' | 'SELL') => {
    setError('');
    setResult(null);
    if (!slNum || !tpNum) { setError(t.slRequired); return; }
    setLoading(true);
    try {
      const entryPrice = type === 'BUY' ? ask : bid;
      const res = await simulate({ type, lot: lotNum, entryPrice, sl: slNum, tp: tpNum, notes });
      setResult(res.simulation);
      onResult?.(res.simulation);
      refetch();
      clearPreview();
    } catch (e: any) {
      setError(e.response?.data?.message ?? t.simulateError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-[var(--mt-panel)] border-l border-[var(--mt-border)] shrink-0"
      style={{ width: 272 }}
    >
      <div className="mt-panel-header shrink-0">
        <span>{t.orderTicket}</span>
        <span className="text-[var(--mt-yellow)] normal-case tracking-normal font-normal">XAUUSD</span>
      </div>

      <div className="grid grid-cols-2 border-b border-[var(--mt-border)] shrink-0">
        <div
          className={clsx(
            'flex flex-col items-center py-3 border-r border-[var(--mt-border)] cursor-pointer transition-colors select-none',
            hovered === 'SELL' ? 'bg-[var(--mt-sell)]/40' : 'hover:bg-[var(--mt-hover)]',
          )}
          onMouseEnter={() => setHovered('SELL')}
          onMouseLeave={() => setHovered(null)}
        >
          <span className="text-[10px] text-[var(--mt-text-dim)] mb-0.5">Sell Bid</span>
          <span className="font-mono font-bold text-[var(--mt-red)] text-xl tabular-nums">
            {bid > 0 ? bid.toFixed(2) : '——.——'}
          </span>
        </div>
        <div
          className={clsx(
            'flex flex-col items-center py-3 cursor-pointer transition-colors select-none',
            hovered === 'BUY' ? 'bg-[var(--mt-buy)]/40' : 'hover:bg-[var(--mt-hover)]',
          )}
          onMouseEnter={() => setHovered('BUY')}
          onMouseLeave={() => setHovered(null)}
        >
          <span className="text-[10px] text-[var(--mt-text-dim)] mb-0.5">Buy Ask</span>
          <span className="font-mono font-bold text-[var(--mt-green)] text-xl tabular-nums">
            {ask > 0 ? ask.toFixed(2) : '——.——'}
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center py-1 bg-[#0e1118] border-b border-[var(--mt-border)] shrink-0" style={{ fontSize: 10 }}>
        <span className="text-[var(--mt-text-dim)]">Spread: </span>
        <span className="font-mono text-[var(--mt-text)] ml-1">{SPREAD.toFixed(2)}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3" style={{ fontSize: 11 }}>
          {/* Volume */}
          <div>
            <label className="block text-[var(--mt-text-dim)] mb-1">{t.lots}</label>
            <div className="flex gap-1">
              <button
                onClick={() => setLot((v) => Math.max(0.01, +(parseFloat(v) - 0.01).toFixed(2)).toFixed(2))}
                className="mt-btn px-2.5 border border-[var(--mt-sep)] text-sm"
              >−</button>
              <input
                type="number" step="0.01" min="0.01" max="10"
                value={lot} onChange={(e) => setLot(e.target.value)}
                className="mt-input text-center flex-1 font-mono font-bold text-[var(--mt-white)]"
              />
              <button
                onClick={() => setLot((v) => Math.min(10, +(parseFloat(v) + 0.01).toFixed(2)).toFixed(2))}
                className="mt-btn px-2.5 border border-[var(--mt-sep)] text-sm"
              >+</button>
            </div>
            <div className="flex gap-1 mt-1">
              {['0.01','0.05','0.10','0.50','1.00'].map((v) => (
                <button
                  key={v}
                  onClick={() => setLot(v)}
                  className={clsx(
                    'flex-1 py-0.5 text-[10px] border transition-colors',
                    lot === v
                      ? 'border-[var(--mt-blue)] text-[var(--mt-blue)] bg-[var(--mt-blue)]/10'
                      : 'border-[var(--mt-border)] text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)]',
                  )}
                >{v}</button>
              ))}
            </div>
          </div>

          {/* SL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[var(--mt-text-dim)]">{t.stopLoss}</label>
              {slDist > 0 && (
                <span className="font-mono text-[var(--mt-red)] text-[10px]">
                  {slDist.toFixed(2)} pts · ${riskUsd.toFixed(2)}
                </span>
              )}
            </div>
            <input
              type="number" step="0.01" placeholder="0.00"
              value={sl} onChange={(e) => setSl(e.target.value)}
              className="mt-input font-mono text-[var(--mt-red)]"
            />
          </div>

          {/* TP */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[var(--mt-text-dim)]">{t.takeProfit}</label>
              {tpDist > 0 && (
                <span className="font-mono text-[var(--mt-green)] text-[10px]">
                  {tpDist.toFixed(2)} pts · ${rewardUsd.toFixed(2)}
                </span>
              )}
            </div>
            <input
              type="number" step="0.01" placeholder="0.00"
              value={tp} onChange={(e) => setTp(e.target.value)}
              className="mt-input font-mono text-[var(--mt-green)]"
            />
          </div>

          {/* Quick SL/TP */}
          {hovered && (
            <div>
              <div className="text-[var(--mt-text-dim)] mb-1 text-[10px]">{t.quickSL} ({hovered})</div>
              <div className="grid grid-cols-3 gap-1">
                {[10, 20, 30, 50, 80, 100].map((pts) => (
                  <button
                    key={pts}
                    onClick={() => applySuggestion(pts, hovered)}
                    className="py-1 text-[10px] border border-[var(--mt-border)] text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)] hover:text-[var(--mt-text)] transition-colors"
                  >
                    ±{pts} pts
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Risk calculator */}
          <div className="border border-[var(--mt-border)] p-2 space-y-1.5 bg-[var(--mt-bg)]" style={{ fontSize: 10 }}>
            <div className="text-[var(--mt-text-label)] font-medium text-[11px] mb-1">{t.riskCalc}</div>
            {[
              { label: `${t.risk} ($)`,  value: riskUsd   > 0 ? `$${riskUsd.toFixed(2)}`   : '—', cls: riskColor },
              { label: `${t.risk} (%)`,  value: riskPct   > 0 ? `${riskPct.toFixed(2)}%`   : '—', cls: riskColor },
              { label: t.reward,         value: rewardUsd > 0 ? `$${rewardUsd.toFixed(2)}` : '—', cls: 'text-[var(--mt-green)]' },
              { label: t.rrRatio,        value: rr        > 0 ? `${rr.toFixed(2)}:1`        : '—',
                cls: rr >= 2 ? 'text-[var(--mt-green)]' : rr >= 1 ? 'text-[var(--mt-yellow)]' : 'text-[var(--mt-red)]' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between">
                <span className="text-[var(--mt-text-dim)]">{row.label}</span>
                <span className={`font-mono font-bold ${row.cls}`}>{row.value}</span>
              </div>
            ))}
            {riskPct > 2 && (
              <div className="text-[var(--mt-red)] text-[10px] mt-1 pt-1 border-t border-[var(--mt-border)]">
                ⚠ {t.riskPct} &gt; 2%
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[var(--mt-text-dim)] mb-1">{t.notes}</label>
            <input
              type="text" placeholder={t.placeholderNotes}
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="mt-input"
            />
          </div>

          {error && (
            <div className="text-[var(--mt-red)] text-[10px] bg-red-500/10 border border-red-500/20 p-2">
              ⚠ {error}
            </div>
          )}
        </div>
      </div>

      {/* BUY / SELL buttons */}
      <div className="border-t border-[var(--mt-border)] grid grid-cols-2 gap-px bg-[var(--mt-border)] shrink-0">
        <button
          onClick={() => exec('SELL')} disabled={loading}
          onMouseEnter={() => setHovered('SELL')}
          onMouseLeave={() => setHovered(null)}
          className="mt-btn-sell flex flex-col items-center py-3 disabled:opacity-40"
        >
          <span className="text-[10px] opacity-60 mb-0.5">Bid</span>
          <span className="font-mono text-lg tabular-nums">{bid > 0 ? bid.toFixed(2) : '——'}</span>
          <span className="text-xs font-bold tracking-widest mt-0.5">SELL</span>
        </button>
        <button
          onClick={() => exec('BUY')} disabled={loading}
          onMouseEnter={() => setHovered('BUY')}
          onMouseLeave={() => setHovered(null)}
          className="mt-btn-buy flex flex-col items-center py-3 disabled:opacity-40"
        >
          <span className="text-[10px] opacity-60 mb-0.5">Ask</span>
          <span className="font-mono text-lg tabular-nums">{ask > 0 ? ask.toFixed(2) : '——'}</span>
          <span className="text-xs font-bold tracking-widest mt-0.5">BUY</span>
        </button>
      </div>

      {loading && (
        <div className="shrink-0 px-3 py-1.5 bg-[var(--mt-blue)]/20 border-t border-[var(--mt-blue)]/30 text-center text-[10px] text-[var(--mt-cyan)]">
          Simulating XAUUSD real data...
        </div>
      )}
    </div>
  );
}

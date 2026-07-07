'use client';
import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { usePricesStore }  from '@/store/prices.store';
import { useChartLines }   from '@/store/chart-lines.store';
import { useTrades }       from '@/hooks/useTrades';
import { useAccount }      from '@/hooks/useAccount';
import { useT }            from '@/hooks/useT';
import { PaywallModal }    from '@/components/PaywallModal';
import { useSuperwall }    from '@/hooks/useSuperwall';
import type { SimulationResult } from '@/types';

interface Props {
  onResult?: (result: SimulationResult) => void;
}

const SPREAD = 0.30;

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="w-3.5 h-3.5 rounded-full border border-[var(--mt-sep)] text-[var(--mt-text-dim)] text-[8px] leading-none hover:border-[var(--mt-blue)] hover:text-[var(--mt-cyan)] transition-colors"
        tabIndex={-1}
      >?</button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 w-52 bg-[#1a1d24] border border-[#3b82f6]/40 p-2 shadow-xl pointer-events-none"
          style={{ fontSize: 10 }}>
          <div className="text-[#c8cdd8] leading-relaxed">{text}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#3b82f6]/40" />
        </div>
      )}
    </span>
  );
}

// ─── R:R visual bar ───────────────────────────────────────────────────────────

function RRBar({ rr }: { rr: number }) {
  const pct = Math.min(100, (rr / 3) * 100);
  const color = rr >= 2 ? '#22c55e' : rr >= 1 ? '#f59e0b' : '#ef4444';
  const label = rr >= 2 ? '✅ Excelente' : rr >= 1.5 ? '⚠ Aceptable' : rr >= 1 ? '⚠ Mínimo' : '🛑 Bajo';

  return (
    <div>
      <div className="flex items-center justify-between mb-1" style={{ fontSize: 10 }}>
        <span className="text-[var(--mt-text-dim)]">R:R ratio</span>
        <span className="font-mono font-bold" style={{ color }}>{rr > 0 ? `${rr.toFixed(2)}:1` : '—'}</span>
      </div>
      <div className="relative h-2 bg-[var(--mt-bg)] border border-[var(--mt-border)] overflow-hidden">
        <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
        {/* 1:1 marker */}
        <div className="absolute top-0 bottom-0 w-px bg-[#f59e0b]/60" style={{ left: '33.3%' }} />
        {/* 2:1 marker */}
        <div className="absolute top-0 bottom-0 w-px bg-[#22c55e]/60" style={{ left: '66.6%' }} />
      </div>
      <div className="flex justify-between mt-0.5" style={{ fontSize: 8, color: '#4a5568' }}>
        <span>0</span><span>1:1</span><span>2:1</span><span>3:1</span>
      </div>
      {rr > 0 && (
        <div className="mt-1 text-[9px]" style={{ color }}>{label}</div>
      )}
    </div>
  );
}

// ─── Risk traffic light ───────────────────────────────────────────────────────

function RiskLight({ pct, t }: { pct: number; t: ReturnType<typeof import('@/hooks/useT').useT> }) {
  const level =
    pct === 0   ? 'neutral' :
    pct <= 1    ? 'great' :
    pct <= 2    ? 'ok' :
    pct <= 3    ? 'warn' : 'danger';

  const cfg = {
    neutral: { color: '#4a5568', label: t.otNoSl,          icon: '⚪' },
    great:   { color: '#22c55e', label: t.otGreat(pct),    icon: '🟢' },
    ok:      { color: '#22c55e', label: t.otOk(pct),       icon: '🟡' },
    warn:    { color: '#f59e0b', label: t.otWarn(pct),     icon: '🟠' },
    danger:  { color: '#ef4444', label: t.otDanger(pct),   icon: '🔴' },
  }[level];

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 border border-[var(--mt-border)] bg-[var(--mt-bg)]" style={{ fontSize: 10 }}>
      <span style={{ fontSize: 12 }}>{cfg.icon}</span>
      <span style={{ color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

// ─── Setup score ──────────────────────────────────────────────────────────────

function SetupScore({ hasSl, hasTp, rr, riskPct, t }: { hasSl: boolean; hasTp: boolean; rr: number; riskPct: number; t: ReturnType<typeof import('@/hooks/useT').useT> }) {
  const checks = [
    { ok: hasSl,         label: t.otSlLabel },
    { ok: hasTp,         label: t.otTpLabel },
    { ok: rr >= 2,       label: 'R:R ≥ 2:1' },
    { ok: riskPct <= 2 && riskPct > 0, label: t.otRiskLabel },
  ];
  const score = checks.filter((c) => c.ok).length;
  const color = score === 4 ? '#22c55e' : score >= 2 ? '#f59e0b' : '#ef4444';
  const label = score === 4 ? t.otIdeal : score === 3 ? t.otGood : score === 2 ? t.otBasic : t.otIncomplete;

  return (
    <div className="border border-[var(--mt-border)] bg-[var(--mt-bg)] p-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[var(--mt-text-dim)] font-medium uppercase tracking-wide">{t.otQuality}</span>
        <span className="font-mono font-bold text-[11px]" style={{ color }}>{score}/4 — {label}</span>
      </div>
      <div className="space-y-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-2" style={{ fontSize: 10 }}>
            <span style={{ color: c.ok ? '#22c55e' : '#4a5568' }}>{c.ok ? '✓' : '○'}</span>
            <span style={{ color: c.ok ? '#c8cdd8' : '#4a5568' }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OrderTicket({ onResult }: Props) {
  const { currentPrice }             = usePricesStore();
  const { simulate }                 = useTrades();
  const { account, refetch }         = useAccount();
  const { setPreview, clearPreview } = useChartLines();
  const t                            = useT();
  const { status, showPaywall, openPaywall, closePaywall } = useSuperwall();

  const bid = currentPrice > 0 ? +(currentPrice - SPREAD / 2).toFixed(2) : 0;
  const ask = currentPrice > 0 ? +(currentPrice + SPREAD / 2).toFixed(2) : 0;

  const [lot,     setLot]     = useState('0.01');
  const [sl,      setSl]      = useState('');
  const [tp,      setTp]      = useState('');
  const [notes,   setNotes]   = useState('');
  const [hovered, setHovered] = useState<'BUY' | 'SELL' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    const entry = hovered === 'BUY' ? ask : hovered === 'SELL' ? bid : currentPrice;
    setPreview({ entryPrice: entry > 0 ? entry : null, sl: parseFloat(sl) || null, tp: parseFloat(tp) || null, tradeType: hovered });
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
  const riskPct   = balance > 0 && riskUsd > 0 ? (riskUsd / balance) * 100 : 0;
  const rr        = riskUsd > 0 ? rewardUsd / riskUsd : 0;

  // Auto-suggest lot for 1% risk
  const suggestLot = useCallback((pips: number) => {
    if (!pips || !balance) return;
    const riskTarget = balance * 0.01;          // 1% del balance
    const pipVal     = 1;                        // $1/pip por lote estándar en oro
    const suggested  = riskTarget / (pips * pipVal);
    return Math.max(0.01, parseFloat(suggested.toFixed(2)));
  }, [balance]);

  const applySuggestion = useCallback((pips: number, direction: 'BUY' | 'SELL') => {
    const base = direction === 'BUY' ? ask : bid;
    if (!base) return;
    const newSl = (direction === 'BUY' ? base - pips : base + pips).toFixed(2);
    const newTp = (direction === 'BUY' ? base + pips * 2 : base - pips * 2).toFixed(2);
    setSl(newSl);
    setTp(newTp);
    const auto = suggestLot(pips);
    if (auto) setLot(auto.toFixed(2));
  }, [ask, bid, suggestLot]);

  const canTrade = slNum > 0 && tpNum > 0;

  const exec = async (type: 'BUY' | 'SELL') => {
    setError('');
    if (!slNum) { setError('⚠ Stop Loss obligatorio. Protege tu cuenta.'); return; }
    if (!tpNum) { setError('⚠ Take Profit recomendado para R:R correcto.'); return; }
    setLoading(true);
    setHovered(null);
    try {
      const entryPrice = type === 'BUY' ? ask : bid;
      const res = await simulate({ type, lot: lotNum, entryPrice, sl: slNum, tp: tpNum, notes });
      onResult?.(res.simulation);
      refetch();
      clearPreview();
      setSl(''); setTp(''); setNotes('');
    } catch (e: any) {
      if (e.response?.status === 403 && e.response?.data?.message === 'FREE_LIMIT_REACHED') {
        openPaywall();
      } else {
        setError(e.response?.data?.message ?? t.simulateError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--mt-panel)] w-full shrink-0">

      {/* Bid / Ask */}
      <div className="grid grid-cols-2 border-b border-[var(--mt-border)] shrink-0">
        {(['SELL', 'BUY'] as const).map((side) => {
          const price = side === 'SELL' ? bid : ask;
          const color = side === 'SELL' ? 'var(--mt-red)' : 'var(--mt-green)';
          return (
            <div
              key={side}
              className={clsx(
                'flex flex-col items-center py-3 cursor-pointer transition-colors select-none',
                side === 'SELL' && 'border-r border-[var(--mt-border)]',
                hovered === side ? (side === 'SELL' ? 'bg-[var(--mt-sell)]/40' : 'bg-[var(--mt-buy)]/40') : 'hover:bg-[var(--mt-hover)]',
              )}
              onMouseEnter={() => setHovered(side)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="text-[10px] text-[var(--mt-text-dim)] mb-0.5">{side === 'SELL' ? 'Sell Bid' : 'Buy Ask'}</span>
              <span className="font-mono font-bold text-xl tabular-nums" style={{ color }}>
                {price > 0 ? price.toFixed(2) : '——.——'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Spread */}
      <div className="flex justify-center items-center py-1 bg-[#0e1118] border-b border-[var(--mt-border)] shrink-0" style={{ fontSize: 10 }}>
        <span className="text-[var(--mt-text-dim)]">Spread: </span>
        <span className="font-mono text-[var(--mt-text)] ml-1">{SPREAD.toFixed(2)}</span>
        <Tip text="El spread es la diferencia entre el precio de compra y venta. Es el coste del trade. Con brokers buenos es 15–30 pips en oro." />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3" style={{ fontSize: 11 }}>

          {/* Lot */}
          <div>
            <label className="flex items-center text-[var(--mt-text-dim)] mb-1">
              {t.lots}
              <Tip text="0.01 = micro (riesgo mínimo). 0.10 = mini. 1.00 = estándar ($10/pip). Para empezar usa siempre 0.01." />
            </label>
            <div className="flex gap-1">
              <button onClick={() => setLot((v) => Math.max(0.01, +(parseFloat(v) - 0.01).toFixed(2)).toFixed(2))}
                className="mt-btn px-2.5 border border-[var(--mt-sep)] text-sm">−</button>
              <input type="number" step="0.01" min="0.01" max="10"
                value={lot} onChange={(e) => setLot(e.target.value)}
                className="mt-input text-center flex-1 font-mono font-bold text-[var(--mt-white)]" />
              <button onClick={() => setLot((v) => Math.min(10, +(parseFloat(v) + 0.01).toFixed(2)).toFixed(2))}
                className="mt-btn px-2.5 border border-[var(--mt-sep)] text-sm">+</button>
            </div>
            <div className="flex gap-1 mt-1">
              {['0.01','0.05','0.10','0.50','1.00'].map((v) => (
                <button key={v} onClick={() => setLot(v)}
                  className={clsx('flex-1 py-0.5 text-[10px] border transition-colors',
                    lot === v ? 'border-[var(--mt-blue)] text-[var(--mt-blue)] bg-[var(--mt-blue)]/10'
                              : 'border-[var(--mt-border)] text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)]')}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* SL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center text-[var(--mt-text-dim)]">
                {t.stopLoss} <span className="text-[var(--mt-red)] ml-1 text-[9px]">*obligatorio</span>
                <Tip text={t.otSlTooltip} />
              </label>
              {slDist > 0 && <span className="font-mono text-[var(--mt-red)] text-[10px]">{slDist.toFixed(2)} pts · ${riskUsd.toFixed(2)}</span>}
            </div>
            <input type="number" step="0.01" placeholder={t.otSlPlaceholder}
              value={sl} onChange={(e) => setSl(e.target.value)}
              className={clsx('mt-input font-mono', sl ? 'text-[var(--mt-red)]' : 'text-[var(--mt-text-dim)]')} />
          </div>

          {/* TP */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center text-[var(--mt-text-dim)]">
                {t.takeProfit}
                <Tip text="El Take Profit cierra tu trade automáticamente con ganancia. Ponlo siempre al doble del SL para tener R:R 1:2 mínimo." />
              </label>
              {tpDist > 0 && <span className="font-mono text-[var(--mt-green)] text-[10px]">{tpDist.toFixed(2)} pts · ${rewardUsd.toFixed(2)}</span>}
            </div>
            <input type="number" step="0.01" placeholder={t.otTpPlaceholder}
              value={tp} onChange={(e) => setTp(e.target.value)}
              className={clsx('mt-input font-mono', tp ? 'text-[var(--mt-green)]' : 'text-[var(--mt-text-dim)]')} />
          </div>

          {/* Quick SL/TP (auto-lot included) */}
          {(hovered || sl || tp) && (
            <div>
              <div className="text-[var(--mt-text-dim)] mb-1 text-[10px]">
                Presets rápidos {hovered ? `(${hovered})` : ''} — auto-lote al 1%
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[10, 20, 30, 50, 80, 100].map((pts) => (
                  <button key={pts}
                    onClick={() => applySuggestion(pts, hovered ?? 'BUY')}
                    className="py-1 text-[10px] border border-[var(--mt-border)] text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)] hover:text-[var(--mt-text)] transition-colors">
                    ±{pts}
                  </button>
                ))}
              </div>
              <div className="text-[9px] text-[var(--mt-text-dim)] mt-1">
                Al seleccionar, el lote se ajusta automáticamente para arriesgar 1% del balance.
              </div>
            </div>
          )}

          {/* R:R visual bar */}
          {(slNum > 0 || tpNum > 0) && <RRBar rr={rr} />}

          {/* Risk traffic light */}
          <RiskLight pct={riskPct} t={t} />

          {/* Risk calc detail */}
          <div className="border border-[var(--mt-border)] p-2 space-y-1.5 bg-[var(--mt-bg)]" style={{ fontSize: 10 }}>
            <div className="flex items-center justify-between">
              <span className="text-[var(--mt-text-label)] font-medium text-[11px]">{t.riskCalc}</span>
              <button onClick={() => setShowTips((v) => !v)} className="text-[var(--mt-text-dim)] text-[9px] hover:text-[var(--mt-cyan)]">
                {showTips ? t.otHide : t.otHelp}
              </button>
            </div>
            {[
              { label: t.otBalanceLabel, value: `$${balance.toFixed(2)}`,                              cls: 'text-[var(--mt-white)]'  },
              { label: t.otRiskUsd,     value: riskUsd   > 0 ? `$${riskUsd.toFixed(2)}`   : '—',      cls: riskPct > 2 ? 'text-[var(--mt-red)]' : 'text-[var(--mt-green)]' },
              { label: t.otRiskPct,     value: riskPct   > 0 ? `${riskPct.toFixed(2)}%`   : '—',      cls: riskPct > 2 ? 'text-[var(--mt-red)]' : riskPct > 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-text-dim)]' },
              { label: t.otReward,      value: rewardUsd > 0 ? `$${rewardUsd.toFixed(2)}` : '—',      cls: 'text-[var(--mt-green)]'  },
            ].map((row) => (
              <div key={row.label} className="flex justify-between">
                <span className="text-[var(--mt-text-dim)]">{row.label}</span>
                <span className={clsx('font-mono font-bold', row.cls)}>{row.value}</span>
              </div>
            ))}
            {showTips && (
              <div className="pt-1.5 mt-1 border-t border-[var(--mt-border)] space-y-1 text-[9px] text-[#4a5568]">
                <div>• Riesgo ideal: <span className="text-[#22c55e]">1–2%</span> del balance por trade</div>
                <div>• Con $10.000: máximo <span className="text-[#22c55e]">$100–$200</span> de riesgo</div>
                <div>• R:R mínimo: <span className="text-[#f59e0b]">1:2</span> (ganar el doble de lo que arriesgas)</div>
                <div>• FTMO limite diario: <span className="text-[#ef4444]">-5%</span> del balance</div>
              </div>
            )}
          </div>

          {/* Setup score */}
          <SetupScore hasSl={slNum > 0} hasTp={tpNum > 0} rr={rr} riskPct={riskPct} t={t} />

          {/* Notes */}
          <div>
            <label className="flex items-center text-[var(--mt-text-dim)] mb-1">
              {t.notes}
              <Tip text="Registra tu setup: 'Pin bar en soporte H1', 'Ruptura de resistencia'. El journal es tu arma más poderosa para mejorar." />
            </label>
            <input type="text" placeholder="¿Por qué abres este trade?"
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="mt-input" />
          </div>

          {/* SL warning */}
          {!sl && (
            <div className="border border-[#ef4444]/30 bg-[#ef4444]/5 p-2.5 text-[10px] text-[#f87171]">
              {t.otSlWarning}
            </div>
          )}

          {error && (
            <div className="text-[var(--mt-red)] text-[10px] bg-red-500/10 border border-red-500/20 p-2">⚠ {error}</div>
          )}
        </div>
      </div>

      {/* BUY / SELL */}
      <div className="border-t border-[var(--mt-border)] shrink-0">
        {!canTrade ? (
          <div className="p-3 text-center">
            <div className="text-[10px] text-[#4a5568] mb-2">Configura SL y TP para habilitar las órdenes</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="py-3 bg-[#1a1d24] border border-[#2e3340] text-center opacity-30">
                <div className="text-[var(--mt-red)] font-bold text-sm">SELL</div>
              </div>
              <div className="py-3 bg-[#1a1d24] border border-[#2e3340] text-center opacity-30">
                <div className="text-[var(--mt-green)] font-bold text-sm">BUY</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-px bg-[var(--mt-border)]">
            <button onClick={() => exec('SELL')} disabled={loading}
              onMouseEnter={() => setHovered('SELL')} onMouseLeave={() => setHovered(null)}
              className="mt-btn-sell flex flex-col items-center py-3 disabled:opacity-40">
              <span className="text-[10px] opacity-60 mb-0.5">Bid</span>
              <span className="font-mono text-lg tabular-nums">{bid > 0 ? bid.toFixed(2) : '——'}</span>
              <span className="text-xs font-bold tracking-widest mt-0.5">SELL</span>
            </button>
            <button onClick={() => exec('BUY')} disabled={loading}
              onMouseEnter={() => setHovered('BUY')} onMouseLeave={() => setHovered(null)}
              className="mt-btn-buy flex flex-col items-center py-3 disabled:opacity-40">
              <span className="text-[10px] opacity-60 mb-0.5">Ask</span>
              <span className="font-mono text-lg tabular-nums">{ask > 0 ? ask.toFixed(2) : '——'}</span>
              <span className="text-xs font-bold tracking-widest mt-0.5">BUY</span>
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="shrink-0 px-3 py-1.5 bg-[var(--mt-blue)]/20 border-t border-[var(--mt-blue)]/30 text-center text-[10px] text-[var(--mt-cyan)]">
          Simulando con datos reales de XAUUSD...
        </div>
      )}

      {showPaywall && (
        <PaywallModal
          onClose={closePaywall}
          used={status?.simulationsUsed}
          limit={status?.simulationsLimit}
        />
      )}
    </div>
  );
}

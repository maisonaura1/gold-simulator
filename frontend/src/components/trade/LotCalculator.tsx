'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { useAccount } from '@/hooks/useAccount';
import { usePricesStore } from '@/store/prices.store';
import { useT } from '@/hooks/useT';

interface Props {
  onClose: () => void;
}

type RiskPct = 0.5 | 1 | 1.5 | 2;

function fmt(n: number, dec = 2) {
  return n.toFixed(dec);
}

export function LotCalculator({ onClose }: Props) {
  const t = useT();
  const { account } = useAccount();
  const livePrice   = usePricesStore((s) => s.currentPrice);

  const balance   = account?.currentBalance ?? 10000;
  const entryPrice = livePrice > 0 ? livePrice : 2350;

  const [riskPct,  setRiskPct]  = useState<RiskPct>(1);
  const [slPips,   setSlPips]   = useState(30);
  const [tpRatio,  setTpRatio]  = useState(2);
  const [customBal, setCustomBal] = useState('');

  const effectiveBal = customBal ? parseFloat(customBal) || balance : balance;

  // 1 pip = $0.10 con 0.01 lotes → $10 con 1 lote → $1/pip/0.1 lote
  // lots = riskUsd / (slPips * pipValuePerLot)
  // pipValuePerLot for XAUUSD = $10
  const riskUsd    = effectiveBal * (riskPct / 100);
  const pipValue   = 10; // per 1.0 lot
  const lots       = slPips > 0 ? riskUsd / (slPips * pipValue) : 0;
  const lotsRounded = Math.floor(lots * 100) / 100; // floor to 2 decimals (conservative)

  const slUsd  = lotsRounded * slPips * pipValue;
  const tpPips = slPips * tpRatio;
  const tpUsd  = lotsRounded * tpPips * pipValue;

  const buyEntry  = entryPrice;
  const buySL     = entryPrice - slPips * 0.1;
  const buyTP     = entryPrice + tpPips * 0.1;
  const sellEntry = entryPrice;
  const sellSL    = entryPrice + slPips * 0.1;
  const sellTP    = entryPrice - tpPips * 0.1;

  // Pip value table
  const pipTable = [0.01, 0.05, 0.1, 0.5, 1.0].map((l) => ({
    lot: l,
    perPip: l * 10,
    slCost: l * 10 * slPips,
    tpGain: l * 10 * tpPips,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#141720] border border-[#2e3340] shadow-2xl w-full mx-4 flex flex-col overflow-hidden"
        style={{ maxWidth: 520, maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1d24] border-b border-[#2e3340] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px]">⚖️</span>
            <span className="text-[11px] font-medium text-[#c8cdd8]">{t.lotCalcTitle}</span>
          </div>
          <button onClick={onClose} className="text-[#4a5568] hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-[#4a5568] mb-1">{t.lotCalcBalanceLabel}</label>
              <input
                type="number"
                value={customBal || ''}
                placeholder={`${balance.toFixed(0)}`}
                onChange={(e) => setCustomBal(e.target.value)}
                className="w-full bg-[#0e1118] border border-[#2e3340] text-[#c8cdd8] px-2 py-1.5 text-[11px] font-mono focus:outline-none focus:border-[#3b82f6]/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#4a5568] mb-1">{t.lotCalcEntryLabel}</label>
              <div className="bg-[#0e1118] border border-[#2e3340] px-2 py-1.5 text-[11px] font-mono text-[#fbbf24]">
                {entryPrice.toFixed(2)} <span className="text-[#4a5568] text-[9px]">{t.lotCalcLiveNote}</span>
              </div>
            </div>
          </div>

          {/* Risk % selector */}
          <div>
            <div className="text-[10px] text-[#4a5568] mb-1.5">{t.lotCalcRiskLabel}</div>
            <div className="grid grid-cols-4 gap-1.5">
              {([0.5, 1, 1.5, 2] as RiskPct[]).map((r) => (
                <button key={r} onClick={() => setRiskPct(r)}
                  className={clsx('py-1.5 text-[11px] font-medium border transition-colors',
                    riskPct === r
                      ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                      : 'border-[#2e3340] text-[#8892a4] hover:border-[#3b82f6]/40 hover:text-[#c8cdd8]')}>
                  {r}%
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-[#4a5568]">{t.lotCalcRiskMoney}</span>
              <span className="font-mono font-bold text-[9px] text-[#fbbf24]">${riskUsd.toFixed(2)}</span>
            </div>
          </div>

          {/* SL Pips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-[#4a5568]">{t.lotCalcSLLabel}</label>
              <span className="text-[10px] font-mono text-[#f87171]">{slPips} pips = ${fmt(lotsRounded * slPips * pipValue)}</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="range" min={5} max={200} value={slPips}
                onChange={(e) => setSlPips(Number(e.target.value))}
                className="flex-1 accent-[#3b82f6]" />
              <input type="number" value={slPips} onChange={(e) => setSlPips(Math.max(1, Number(e.target.value)))}
                className="w-16 bg-[#0e1118] border border-[#2e3340] text-[#c8cdd8] px-2 py-1 text-[11px] font-mono text-center focus:outline-none" />
            </div>
            <div className="flex gap-1.5 mt-1.5">
              {[10, 20, 30, 50, 80, 100].map((p) => (
                <button key={p} onClick={() => setSlPips(p)}
                  className={clsx('px-2 py-0.5 text-[9px] border transition-colors',
                    slPips === p ? 'border-[#3b82f6]/60 text-[#60a5fa] bg-[#3b82f6]/10' : 'border-[#2e3340] text-[#4a5568] hover:border-[#3b82f6]/30')}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* R:R ratio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-[#4a5568]">{t.lotCalcRRLabel}</label>
              <span className={clsx('text-[10px] font-mono', tpRatio >= 2 ? 'text-[#4ade80]' : 'text-[#f59e0b]')}>
                1:{tpRatio} — TP: {tpPips} pips = ${fmt(tpUsd)}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 1.5, 2, 3].map((r) => (
                <button key={r} onClick={() => setTpRatio(r)}
                  className={clsx('py-1.5 text-[11px] border transition-colors',
                    tpRatio === r
                      ? r >= 2 ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'bg-[#f59e0b] border-[#f59e0b] text-[#141720]'
                      : 'border-[#2e3340] text-[#8892a4] hover:border-[#2e3340]/80')}>
                  1:{r}
                </button>
              ))}
            </div>
            {tpRatio < 2 && (
              <div className="mt-1 text-[9px] text-[#f59e0b]">{t.lotCalcRRWarning}</div>
            )}
          </div>

          {/* Result box */}
          <div className="border border-[#3b82f6]/30 bg-[#3b82f6]/5 p-3">
            <div className="text-[10px] text-[#60a5fa] font-medium mb-2">{t.lotCalcResultTitle}</div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div>
                <div className="font-mono font-bold text-[20px] text-white">{lotsRounded.toFixed(2)}</div>
                <div className="text-[9px] text-[#4a5568]">{t.lotCalcLotsLabel}</div>
              </div>
              <div>
                <div className="font-mono font-bold text-[10px] text-[#f87171]">-${fmt(slUsd)}</div>
                <div className="text-[9px] text-[#4a5568]">{t.lotCalcSLCostLabel}</div>
              </div>
              <div>
                <div className="font-mono font-bold text-[10px] text-[#4ade80]">+${fmt(tpUsd)}</div>
                <div className="text-[9px] text-[#4a5568]">{t.lotCalcTPGainLabel}</div>
              </div>
            </div>

            {/* BUY / SELL levels */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {[
                { dir: 'BUY 🟢', entry: buyEntry, sl: buySL, tp: buyTP, slColor: '#f87171', tpColor: '#4ade80' },
                { dir: 'SELL 🔴', entry: sellEntry, sl: sellSL, tp: sellTP, slColor: '#f87171', tpColor: '#4ade80' },
              ].map((d) => (
                <div key={d.dir} className="bg-[#0e1118] border border-[#2e3340] p-2">
                  <div className="font-medium text-[#c8cdd8] mb-1">{d.dir}</div>
                  <div className="flex flex-col gap-0.5 font-mono text-[10px]">
                    <div className="flex justify-between"><span className="text-[#4a5568]">{t.lotCalcEntryLabel2}:</span><span className="text-[#fbbf24]">{d.entry.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-[#4a5568]">SL:</span><span style={{ color: d.slColor }}>{d.sl.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-[#4a5568]">TP:</span><span style={{ color: d.tpColor }}>{d.tp.toFixed(2)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pip value table */}
          <div className="border border-[#2e3340]">
            <div className="px-3 py-1.5 bg-[#1a1d24] border-b border-[#2e3340] text-[9px] text-[#4a5568] uppercase tracking-wide">
              {t.lotCalcPipTableTitle(slPips, tpPips)}
            </div>
            <div className="divide-y divide-[#2e3340]">
              <div className="flex px-3 py-1 bg-[#0e1118] text-[9px] text-[#4a5568]">
                <span className="w-16">{t.lotCalcColLot}</span><span className="w-20">{t.lotCalcColPerPip}</span>
                <span className="flex-1 text-[#f87171]">{t.lotCalcColSL}</span>
                <span className="flex-1 text-[#4ade80]">{t.lotCalcColTP}</span>
              </div>
              {pipTable.map((row) => (
                <div key={row.lot}
                  className={clsx('flex px-3 py-1.5 text-[10px] font-mono',
                    row.lot === lotsRounded ? 'bg-[#3b82f6]/10' : 'hover:bg-[#1a1d24]')}>
                  <span className={clsx('w-16', row.lot === lotsRounded ? 'text-[#60a5fa] font-bold' : 'text-[#c8cdd8]')}>
                    {row.lot.toFixed(2)}{row.lot === lotsRounded ? ' ←' : ''}
                  </span>
                  <span className="w-20 text-[#8892a4]">${row.perPip.toFixed(2)}</span>
                  <span className="flex-1 text-[#f87171]">-${row.slCost.toFixed(2)}</span>
                  <span className="flex-1 text-[#4ade80]">+${row.tpGain.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Educational note */}
          <div className="border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-3 text-[10px] text-[#d97706]">
            <div className="font-medium mb-1">{t.lotCalcWhyTitle}</div>
            <div className="text-[#4a5568] leading-relaxed">{t.lotCalcWhyText(riskPct)}</div>
          </div>
        </div>

        <div className="px-4 py-3 bg-[#1a1d24] border-t border-[#2e3340] flex justify-end shrink-0">
          <button onClick={onClose}
            className="px-5 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-medium transition-colors">
            {t.lotCalcCloseBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

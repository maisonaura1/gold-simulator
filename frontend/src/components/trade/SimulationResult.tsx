'use client';
import type { SimulationResult } from '@/types';
import { useT } from '@/hooks/useT';
import clsx from 'clsx';

interface Props {
  result: SimulationResult;
  onClose: () => void;
}

export function SimulationResultPanel({ result, onClose }: Props) {
  const t = useT();
  const won = result.outcome === 'TP_HIT';
  const neutral = result.outcome === 'NEUTRAL';

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-[var(--mt-panel)] border border-[var(--mt-sep)] shadow-2xl w-96">
        <div
          className={clsx(
            'flex items-center justify-between px-3 py-2 border-b border-[var(--mt-border)]',
            won ? 'bg-[var(--mt-buy)]' : neutral ? 'bg-[var(--mt-toolbar)]' : 'bg-[var(--mt-sell)]',
          )}
        >
          <span className="text-xs font-bold text-white">
            {won ? t.tpHit : neutral ? t.neutral : t.slHit}
          </span>
          <button onClick={onClose} className="text-white/60 hover:text-white text-sm">✕</button>
        </div>

        <div className="p-4 space-y-3" style={{ fontSize: 11 }}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: t.resultUsd,         value: `${result.resultUsd >= 0 ? '+' : ''}$${result.resultUsd.toFixed(2)}`,  cls: won ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]' },
              { label: t.resultPct,         value: `${result.resultPct >= 0 ? '+' : ''}${result.resultPct.toFixed(2)}%`,  cls: won ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]' },
              { label: t.exitPrice,         value: result.exitPrice.toFixed(2),                                            cls: 'text-[var(--mt-white)]' },
              { label: t.candlesTraversed,  value: `${result.candlesTraversed} H1`,                                       cls: 'text-[var(--mt-cyan)]' },
              { label: t.riskPct,           value: `${result.riskPct.toFixed(2)}%`,                                       cls: result.riskPct > 2 ? 'text-[var(--mt-yellow)]' : 'text-[var(--mt-green)]' },
              { label: t.rrLabel,           value: `${result.rrRatio.toFixed(2)}:1`,                                      cls: result.rrRatio >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]' },
            ].map((row) => (
              <div key={row.label} className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-2">
                <div className="text-[var(--mt-text-dim)] text-[10px] mb-0.5">{row.label}</div>
                <div className={`font-mono font-bold text-sm ${row.cls}`}>{row.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3 text-[10px] leading-relaxed text-[var(--mt-text-dim)]">
            <div className="text-[var(--mt-text-label)] font-medium mb-1 text-[11px]">{t.educationalAnalysis}</div>
            {result.explanation.split('. ').filter(Boolean).map((line, i) => (
              <div key={i} className="mb-1">{line}.</div>
            ))}
          </div>
        </div>

        <div className="flex justify-end px-4 pb-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[var(--mt-blue)] hover:bg-blue-600 text-white text-xs transition-colors"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

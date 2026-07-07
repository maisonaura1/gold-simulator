'use client';
import { useState } from 'react';
import type { SimulationResult } from '@/types';
import { useT } from '@/hooks/useT';
import { useAccount } from '@/hooks/useAccount';
import Link from 'next/link';
import clsx from 'clsx';

interface Props {
  result: SimulationResult;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

import type { T } from '@/hooks/useT';

function grade(result: SimulationResult, t: T): {
  score: number;
  label: string;
  color: string;
  items: { ok: boolean; text: string; tip: string }[];
} {
  const won     = result.outcome === 'TP_HIT';
  const riskPct = result.riskPct ?? 0;
  const rrRatio = result.rrRatio ?? 0;
  const items = [
    {
      ok:  riskPct > 0 && riskPct <= 2,
      text: riskPct <= 2 ? t.criteriaRiskOk(riskPct.toFixed(2)) : t.criteriaRiskBad(riskPct.toFixed(2)),
      tip: t.criteriaRiskTip,
    },
    {
      ok:  rrRatio >= 2,
      text: rrRatio >= 2 ? t.criteriaRROk(rrRatio.toFixed(2)) : t.criteriaRRBad(rrRatio.toFixed(2)),
      tip: t.criteriaRRTip,
    },
    {
      ok:  won,
      text: won ? t.criteriaWin : result.outcome === 'SL_HIT' ? t.criteriaSLHit : t.criteriaNeutral,
      tip: won ? t.criteriaWinTip : t.criteriaSLTip,
    },
    {
      ok:  riskPct > 0,
      text: riskPct > 0 ? t.criteriaSLSet : t.criteriaSLMissing,
      tip: t.criteriaSLSetTip,
    },
  ];

  const score = items.filter((i) => i.ok).length;
  const label = score === 4 ? t.tradeGradePerfect : score === 3 ? t.tradeGradeGood : score === 2 ? t.tradeGradeOk : t.tradeGradePoor;
  const color = score === 4 ? '#22c55e' : score === 3 ? '#4ade80' : score === 2 ? '#f59e0b' : '#ef4444';
  return { score, label, color, items };
}

function ftmoStatus(result: SimulationResult, balance: number) {
  const dailyLossLimit = balance * 0.05;
  const totalDrawdownLimit = balance * 0.10;
  const profitTarget = balance * 0.08;

  const todayPnl = result.resultUsd;
  const usedDailyPct = Math.abs(Math.min(0, todayPnl)) / dailyLossLimit * 100;

  return {
    dailyOk: todayPnl > -dailyLossLimit,
    profitTarget,
    dailyLossLimit,
    usedDailyPct: Math.min(100, usedDailyPct),
    todayPnl,
  };
}

function getLessonLink(result: SimulationResult) {
  if ((result.riskPct ?? 0) > 2) return { href: '/academy', text: '📖 Risk management → Academy Level 1' };
  if ((result.rrRatio ?? 0) < 2)  return { href: '/academy', text: '📖 R:R ratio → Academy Level 1' };
  if (result.outcome === 'SL_HIT') return { href: '/academy', text: '📖 Why did the SL trigger? → Support & Resistance' };
  return { href: '/learn', text: '🎯 Evaluate missions →' };
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function SimulationResultPanel({ result, onClose }: Props) {
  const t = useT();
  const { account } = useAccount();
  const [tab, setTab] = useState<'analysis' | 'ftmo' | 'journal'>('analysis');

  const won     = result.outcome === 'TP_HIT';
  const slHit   = result.outcome === 'SL_HIT';
  const grading = grade(result, t);
  const balance = account?.currentBalance ?? 10000;
  const riskPct = result.riskPct ?? 0;
  const rrRatio = result.rrRatio ?? 0;
  const ftmo    = ftmoStatus(result, balance);
  const lesson  = getLessonLink(result);

  const headerBg = won
    ? 'bg-gradient-to-r from-[#14532d] to-[#166534]'
    : slHit
    ? 'bg-gradient-to-r from-[#450a0a] to-[#7f1d1d]'
    : 'bg-[var(--mt-toolbar)]';

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black/70 backdrop-blur-sm overflow-y-auto py-4 px-4">
      <div
        className="bg-[#141720] border border-[#2e3340] shadow-2xl flex flex-col w-full my-auto"
        style={{ maxWidth: 480 }}
      >
        {/* ── Header ── */}
        <div className={clsx('flex items-center justify-between px-4 py-3 border-b border-[#2e3340] shrink-0', headerBg)}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 22 }}>{won ? '🏆' : slHit ? '🛑' : '⚖️'}</span>
            <div>
              <div className="font-bold text-white text-[10px]">
                {won ? t.tpHit : slHit ? t.slHit : t.neutral}
              </div>
              <div className="text-[10px] text-white/60">XAUUSD · {result.candlesTraversed} {t.candlesTraversed}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={clsx('font-mono font-bold text-[18px]', won ? 'text-[#4ade80]' : slHit ? 'text-[#f87171]' : 'text-white')}>
                {result.resultUsd >= 0 ? '+' : ''}${result.resultUsd.toFixed(2)}
              </div>
              <div className="text-[10px] text-white/50">{result.resultPct >= 0 ? '+' : ''}{result.resultPct.toFixed(2)}%</div>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
          </div>
        </div>

        {/* ── Score bar ── */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1a1d24] border-b border-[#2e3340] shrink-0">
          <div className="flex gap-1">
            {[1,2,3,4].map((i) => (
              <div key={i} className={clsx('w-6 h-1.5 rounded-full', i <= grading.score ? '' : 'bg-[#2e3340]')}
                style={{ background: i <= grading.score ? grading.color : undefined }} />
            ))}
          </div>
          <span className="font-medium text-[11px]" style={{ color: grading.color }}>{grading.label}</span>
          <span className="text-[10px] text-[#4a5568] ml-auto">{t.criteriaMet(grading.score)}</span>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-[#2e3340] bg-[#0e1118] shrink-0">
          {([
            { key: 'analysis', label: t.tabAnalysis },
            { key: 'ftmo',     label: t.tabFunding  },
            { key: 'journal',  label: t.tabJournal  },
          ] as const).map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={clsx('px-4 py-2 text-[11px] border-b-2 transition-colors',
                tab === tb.key
                  ? 'border-[#3b82f6] text-[#60a5fa]'
                  : 'border-transparent text-[#4a5568] hover:text-[#8892a4]')}>
              {tb.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>

          {/* ANÁLISIS */}
          {tab === 'analysis' && (
            <div className="p-4 space-y-4">

              {/* Stat grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t.resultUsd,         value: `${result.resultUsd >= 0 ? '+' : ''}$${result.resultUsd.toFixed(2)}`, color: won ? '#4ade80' : '#f87171' },
                  { label: t.rrLabel,           value: `${rrRatio.toFixed(2)}:1`, color: rrRatio >= 2 ? '#4ade80' : rrRatio >= 1 ? '#f59e0b' : '#f87171' },
                  { label: t.riskPct,           value: `${riskPct.toFixed(2)}%`,  color: riskPct <= 2 ? '#4ade80' : '#f59e0b' },
                  { label: t.exitPrice,         value: result.exitPrice.toFixed(2),       color: '#c8cdd8' },
                  { label: t.candlesTraversed,  value: String(result.candlesTraversed),   color: '#60a5fa' },
                  { label: t.balance,           value: `$${balance.toFixed(0)}`,          color: '#c8cdd8' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#1a1d24] border border-[#2e3340] p-2">
                    <div className="text-[9px] text-[#4a5568] mb-0.5">{item.label}</div>
                    <div className="font-mono font-bold text-[9px]" style={{ color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Checklist */}
              <div className="border border-[#2e3340] bg-[#1a1d24]">
                <div className="px-3 py-2 border-b border-[#2e3340] text-[10px] font-medium text-[#8892a4] uppercase tracking-wide">
                  Evaluación del trade
                </div>
                <div className="divide-y divide-[#2e3340]">
                  {grading.items.map((item, i) => (
                    <div key={i} className="px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 text-[10px]">{item.ok ? '✅' : '❌'}</span>
                        <div className="flex-1">
                          <div className={clsx('text-[11px] font-medium', item.ok ? 'text-[#c8cdd8]' : 'text-[#f87171]')}>
                            {item.text}
                          </div>
                          {!item.ok && (
                            <div className="text-[10px] text-[#4a5568] mt-0.5 leading-relaxed">{item.tip}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-3">
                  <div className="text-[10px] text-[#60a5fa] font-medium mb-1">{t.simulatorAnalysisLabel}</div>
                  <div className="text-[10px] text-[#8892a4] leading-relaxed">{result.explanation}</div>
                </div>
              )}

              {/* What to do next */}
              <div className="border border-[#2e3340] bg-[#1a1d24] p-3">
                <div className="text-[10px] text-[#8892a4] font-medium mb-2">{t.whatNowTitle}</div>
                <div className="space-y-1.5 text-[10px] text-[#4a5568]">
                  {won ? (
                    <>
                      <div className="flex items-start gap-1.5"><span className="text-[#22c55e]">▸</span><span>{t.winAdvice1}</span></div>
                      <div className="flex items-start gap-1.5"><span className="text-[#22c55e]">▸</span><span>{t.winAdvice2}</span></div>
                      <div className="flex items-start gap-1.5"><span className="text-[#22c55e]">▸</span><span>{t.winAdvice3}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-1.5"><span className="text-[#f87171]">▸</span><span>{t.lossAdvice1}</span></div>
                      <div className="flex items-start gap-1.5"><span className="text-[#f87171]">▸</span><span>{t.lossAdvice2}</span></div>
                      <div className="flex items-start gap-1.5"><span className="text-[#f87171]">▸</span><span>{t.lossAdvice3}</span></div>
                    </>
                  )}
                </div>
              </div>

              {/* Academy link */}
              <Link href={lesson.href} onClick={onClose}
                className="flex items-center justify-between w-full border border-[#3b82f6]/30 bg-[#3b82f6]/5 px-3 py-2.5 hover:bg-[#3b82f6]/10 transition-colors">
                <span className="text-[11px] text-[#60a5fa]">{lesson.text}</span>
                <span className="text-[#4a5568]">›</span>
              </Link>
            </div>
          )}

          {/* FONDEO */}
          {tab === 'ftmo' && (
            <div className="p-4 space-y-4">
              <div className="text-[11px] text-[#8892a4] mb-1">{t.ftmoFundingNote}</div>

              {/* Daily loss meter */}
              <div className="border border-[#2e3340] bg-[#1a1d24] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#8892a4] font-medium">{t.ftmoDailyLoss}</span>
                  <span className={clsx('font-mono font-bold text-[11px]', ftmo.dailyOk ? 'text-[#4ade80]' : 'text-[#f87171]')}>
                    {ftmo.usedDailyPct.toFixed(1)}% / 5%
                  </span>
                </div>
                <div className="h-3 bg-[#0e1118] border border-[#2e3340] overflow-hidden">
                  <div className={clsx('h-full transition-all', ftmo.dailyOk ? 'bg-[#22c55e]' : 'bg-[#ef4444]')}
                    style={{ width: `${ftmo.usedDailyPct}%` }} />
                </div>
                <div className="flex justify-between mt-1" style={{ fontSize: 9, color: '#4a5568' }}>
                  <span>$0</span>
                  <span className="text-[#f59e0b]">-${ftmo.dailyLossLimit.toFixed(0)}</span>
                </div>
                {!ftmo.dailyOk && (
                  <div className="mt-2 text-[10px] text-[#f87171] border border-[#ef4444]/30 bg-[#ef4444]/5 p-2">
                    {t.ftmoDailyBlockedMsg}
                  </div>
                )}
              </div>

              {/* FTMO rules checklist */}
              <div className="border border-[#2e3340] bg-[#1a1d24]">
                <div className="px-3 py-2 border-b border-[#2e3340] text-[10px] font-medium text-[#8892a4] uppercase tracking-wide">
                  {t.ftmoRulesTitle}
                </div>
                {[
                  { rule: t.ftmoTargetRule,   value: '+8% = +$800', ok: result.resultUsd > 0,  detail: result.resultUsd > 0 ? `+$${result.resultUsd.toFixed(2)}` : t.ftmoInsideLimits },
                  { rule: t.ftmoDailyRule,    value: '-5% = -$500', ok: ftmo.dailyOk,          detail: ftmo.dailyOk ? t.ftmoInsideLimits : t.ftmoLimitExceeded },
                  { rule: t.ftmoDrawdownRule, value: '-10% = -$1K', ok: riskPct <= 2,   detail: `${t.riskPct}: ${riskPct.toFixed(2)}%` },
                  { rule: t.criteriaSLSet,    value: '—',           ok: riskPct > 0,    detail: riskPct > 0 ? t.criteriaSLSet : t.criteriaSLMissing },
                  { rule: t.rrLabel,          value: '≥ 2:1',       ok: rrRatio >= 2,   detail: `${rrRatio.toFixed(2)}:1` },
                ].map((item) => (
                  <div key={item.rule} className="flex items-start gap-3 px-3 py-2 border-b border-[#2e3340] last:border-0">
                    <span className="shrink-0 text-[9px] mt-0.5">{item.ok ? '✅' : '❌'}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#c8cdd8]">{item.rule}</span>
                        <span className="text-[10px] font-mono text-[#4a5568]">{item.value}</span>
                      </div>
                      <div className={clsx('text-[10px] mt-0.5', item.ok ? 'text-[#4a5568]' : 'text-[#f59e0b]')}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-3 text-[10px] text-[#d97706]">
                <div className="font-medium mb-1">{t.ftmoReadyNote}</div>
                <div className="text-[#4a5568] leading-relaxed">{t.ftmoReadyBody}</div>
              </div>
            </div>
          )}

          {/* JOURNAL */}
          {tab === 'journal' && (
            <div className="p-4 space-y-3">
              <div className="text-[11px] text-[#8892a4]">{t.journalSectionTitle}</div>

              <div className="border border-[#2e3340] bg-[#1a1d24] p-3 space-y-3">
                <div className="text-[10px] font-medium text-[#8892a4] uppercase tracking-wide">{t.tradeEvalTitle}</div>

                {[
                  { label: t.journalField1, placeholder: t.journalPlaceholder1 },
                  { label: t.journalField2, placeholder: t.journalPlaceholder2 },
                  { label: t.journalField3, placeholder: t.journalPlaceholder3 },
                  { label: t.journalField4, placeholder: t.journalPlaceholder4 },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-[10px] text-[#4a5568] mb-1">{field.label}</label>
                    <textarea
                      placeholder={field.placeholder}
                      rows={2}
                      className="w-full bg-[#0e1118] border border-[#2e3340] text-[#c8cdd8] px-2 py-1.5 resize-none focus:outline-none focus:border-[#3b82f6]/50"
                      style={{ fontSize: 10 }}
                      onBlur={(e) => {
                        // Save to localStorage as simple journal
                        const key = `gt_journal_${Date.now()}`;
                        const entry = JSON.parse(localStorage.getItem('gt_journal') ?? '[]');
                        entry.push({ date: new Date().toISOString(), field: field.label, value: e.target.value, result: result.resultUsd });
                        localStorage.setItem('gt_journal', JSON.stringify(entry.slice(-100)));
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="border border-[#22c55e]/20 bg-[#22c55e]/5 p-3 text-[10px] text-[#4ade80]">
                {t.journalTipText}
              </div>

              <Link href="/academy" onClick={onClose}
                className="flex items-center justify-between w-full border border-[#2e3340] bg-[#1a1d24] px-3 py-2.5 hover:bg-[#2e3340] transition-colors">
                <span className="text-[11px] text-[#8892a4]">{t.journalAcademyLink}</span>
                <span className="text-[#4a5568]">›</span>
              </Link>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24] border-t border-[#2e3340] shrink-0">
          <Link href="/learn" onClick={onClose}
            className="text-[10px] text-[#4a5568] hover:text-[#60a5fa] transition-colors">
            {t.evaluateMissionsLink}
          </Link>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-medium transition-colors">
            {t.nextTradeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

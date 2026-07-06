'use client';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import type { Stats } from '@/types';
import { useT } from '@/hooks/useT';
import { TipLabel } from '@/components/ui/Tooltip';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';
import clsx from 'clsx';

function MTStatBox({ label, value, cls = '', sub = '', tip = '' }: { label: string; value: string; cls?: string; sub?: string; tip?: string }) {
  return (
    <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
      <div className="text-[10px] text-[var(--mt-text-dim)] mb-1">
        {tip ? <TipLabel label={label} tip={tip} side="top" /> : label}
      </div>
      <div className={clsx('font-mono font-bold text-base', cls)}>{value}</div>
      {sub && <div className="text-[10px] text-[var(--mt-text-dim)] mt-0.5">{sub}</div>}
    </div>
  );
}

import type { T } from '@/hooks/useT';

function traderScore(stats: Stats, t: T): { score: number; grade: string; color: string; verdict: string; advice: string[] } {
  let score = 0;
  const advice: string[] = [];

  if (stats.winRate >= 50) score += 20;
  else if (stats.winRate >= 40) { score += 12; advice.push(t.traderAdviceWinRateLow); }
  else { score += 5; advice.push(t.traderAdviceWinRateCritical); }

  if (stats.avgRR >= 2)        score += 25;
  else if (stats.avgRR >= 1.5) { score += 15; advice.push(t.traderAdviceRRLow); }
  else                         { score += 5;  advice.push(t.traderAdviceRRCritical); }

  if (stats.avgRisk > 0 && stats.avgRisk <= 1) score += 20;
  else if (stats.avgRisk <= 2)                 score += 14;
  else if (stats.avgRisk <= 3) { score += 7; advice.push(t.traderAdviceRiskHigh); }
  else                         { score += 0; advice.push(t.traderAdviceRiskCritical); }

  const dd = stats.maxDrawdown ?? 0;
  if (dd <= 5)        score += 20;
  else if (dd <= 10)  score += 12;
  else if (dd <= 20) { score += 5; advice.push(t.traderAdviceDrawdownHigh); }
  else               { score += 0; advice.push(t.traderAdviceDrawdownCritical); }

  if (stats.totalTrades >= 20)      score += 15;
  else if (stats.totalTrades >= 10) { score += 8; advice.push(t.traderAdviceTradesLow); }
  else                              { score += 3; advice.push(t.traderAdviceTradesCritical); }

  const grade =
    score >= 85 ? t.traderGradeElite
    : score >= 70 ? t.traderGradeAdvanced
    : score >= 55 ? t.traderGradeIntermediate
    : score >= 40 ? t.traderGradeBeginner
    : t.traderGradeCritical;

  const color =
    score >= 85 ? '#22c55e' : score >= 70 ? '#4ade80' : score >= 55 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

  const verdict =
    score >= 85 ? t.traderVerdictElite
    : score >= 70 ? t.traderVerdictAdvanced
    : score >= 55 ? t.traderVerdictIntermediate
    : score >= 40 ? t.traderVerdictBeginner
    : t.traderVerdictCritical;

  return { score, grade, color, verdict, advice };
}

const TOOLTIP_STYLE = { background: '#22262e', border: '1px solid #2e3340', fontSize: 10, color: '#c8cdd8' };

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useT();

  useEffect(() => {
    api.get<Stats>('/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-auto">
        <div className="flex items-center px-4 py-2 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] shrink-0" style={{ fontSize: 11 }}>
          <span className="text-[var(--mt-text-label)] font-medium uppercase tracking-wide">{t.traderStats}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>{t.loading}</div>
        ) : !stats ? null : (
          <div className="p-4 space-y-4">

            {/* ── Trader Score ── */}
            {(() => {
              const { score, grade, color, verdict, advice } = traderScore(stats, t);
              return (
                <div className="border border-[#2e3340] bg-[#1a1d24]">
                  <div className="flex items-center gap-4 p-4 border-b border-[#2e3340]">
                    {/* Score dial */}
                    <div className="shrink-0 text-center">
                      <div className="font-mono font-black text-[32px] leading-none" style={{ color }}>{score}</div>
                      <div className="text-[9px] text-[#4a5568] mt-0.5">/ 100</div>
                    </div>
                    <div className="w-px h-10 bg-[#2e3340] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[11px]" style={{ color }}>{grade}</span>
                        <span className="text-[10px] text-[#4a5568]">— {t.traderScoreTitle}</span>
                      </div>
                      <div className="h-1.5 bg-[#0e1118] border border-[#2e3340] overflow-hidden mb-2">
                        <div className="h-full transition-all" style={{ width: `${score}%`, background: color }} />
                      </div>
                      <div className="text-[10px] text-[#8892a4]">{verdict}</div>
                    </div>
                  </div>
                  {advice.length > 0 && (
                    <div className="p-3 space-y-1.5">
                      <div className="text-[9px] text-[#4a5568] uppercase tracking-wide mb-2">{t.traderImprovementsTitle}</div>
                      {advice.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 text-[10px] text-[#8892a4]">
                          <span className="text-[#f59e0b] shrink-0">▸</span>
                          <span>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {advice.length === 0 && (
                    <div className="p-3 text-[10px] text-[#4ade80]">
                      {t.traderNoIssues}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── KPI grid ── */}
            <div className="grid grid-cols-4 gap-2">
              <MTStatBox label={t.winrateLabel}  value={`${stats.winRate}%`}
                tip={t.tipWinRate}
                cls={stats.winRate >= 50 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label={t.totalPL}        value={`${stats.totalPnl >= 0 ? '+' : ''}$${stats.totalPnl.toFixed(2)}`}
                tip={t.tipTotalPL}
                cls={stats.totalPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label={t.totalTrades}    value={String(stats.totalTrades)}
                tip={t.tipTotalTrades}
                cls="text-[var(--mt-cyan)]" />
              <MTStatBox label={t.avgPL}          value={`${stats.avgPnl >= 0 ? '+' : ''}$${stats.avgPnl.toFixed(2)}`}
                tip={t.tipAvgPL}
                cls={stats.avgPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label={t.avgRisk}        value={`${stats.avgRisk.toFixed(2)}%`}
                tip={t.tipAvgRisk}
                cls={stats.avgRisk <= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]'}
                sub={stats.avgRisk <= 2 ? `✅ ≤2%` : `⚠ >2%`} />
              <MTStatBox label={t.avgRR}          value={`${stats.avgRR.toFixed(2)}:1`}
                tip={t.tipAvgRR}
                cls={stats.avgRR >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]'}
                sub={stats.avgRR >= 2 ? `✅ ≥2:1` : `⚠ <2:1`} />
              <MTStatBox label={t.winStreak}      value={String(stats.winStreak)}
                tip={t.tipWinStreak}
                cls="text-[var(--mt-green)]" />
              <MTStatBox label={t.lossStreak}     value={String(stats.lossStreak)}
                tip={t.tipLossStreak}
                cls="text-[var(--mt-red)]" />
              <MTStatBox
                label="Max Drawdown"
                tip={t.tipMaxDrawdown}
                value={`${stats.maxDrawdown?.toFixed(2) ?? '0.00'}%`}
                cls={
                  (stats.maxDrawdown ?? 0) <= 10 ? 'text-[var(--mt-green)]' :
                  (stats.maxDrawdown ?? 0) <= 20 ? 'text-[var(--mt-yellow)]' : 'text-[var(--mt-red)]'
                }
                sub={(stats.maxDrawdown ?? 0) <= 10 ? '✅ ≤10%' : `⚠ >${(stats.maxDrawdown ?? 0).toFixed(0)}%`}
              />
            </div>

            {/* ── Equity curve ── */}
            {stats.equityCurve && stats.equityCurve.length > 1 && (
              <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
                <div className="text-[10px] text-[var(--mt-text-dim)] mb-2 uppercase tracking-wide font-medium">{t.equityCurveLabel}</div>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={stats.equityCurve} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2dcc6f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2dcc6f" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1c2030" strokeDasharray="2 2" />
                    <XAxis dataKey="date" hide />
                    <YAxis tick={{ fontSize: 9, fill: '#64748b' }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`$${v.toFixed(2)}`, 'Equity']} />
                    <ReferenceLine y={10000} stroke="#2e3340" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="balance" stroke="#2dcc6f" strokeWidth={1.5} fill="url(#equityGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Wins/Losses + Weekly P/L ── */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
                <div className="text-[10px] text-[var(--mt-text-dim)] mb-2">{t.winsVsLosses}</div>
                <div className="flex gap-1 h-3 rounded-sm overflow-hidden">
                  <div className="bg-[var(--mt-green)]" style={{ width: `${stats.winRate}%` }} />
                  <div className="bg-[var(--mt-red)]"   style={{ width: `${100 - stats.winRate}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-[10px]">
                  <span className="text-[var(--mt-green)]">✅ {stats.wins} {t.wins.toLowerCase()}</span>
                  <span className="text-[var(--mt-red)]">❌ {stats.losses} {t.losses.toLowerCase()}</span>
                </div>
              </div>

              <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
                <div className="text-[10px] text-[var(--mt-text-dim)] mb-1">{t.weeklyPL}</div>
                {stats.weeklyPnl.length > 0 ? (
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={stats.weeklyPnl} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                      <XAxis dataKey="week" hide />
                      <YAxis hide />
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`$${v.toFixed(2)}`, 'P/L']} />
                      <ReferenceLine y={0} stroke="#2e3340" />
                      <Bar dataKey="pnl" radius={[1, 1, 0, 0]}>
                        {stats.weeklyPnl.map((entry, i) => (
                          <Cell key={i} fill={entry.pnl >= 0 ? '#2dcc6f' : '#e84040'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-[var(--mt-text-dim)] text-[10px] pt-3">{t.noWeeklyData}</div>
                )}
              </div>
            </div>

            {/* ── Behaviour analysis ── */}
            <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
              <div className="text-[11px] text-[var(--mt-text-label)] font-medium mb-2 uppercase tracking-wide">{t.behaviourAnalysis}</div>
              <div className="space-y-1.5">
                {stats.behaviours.map((b, i) => (
                  <div key={i} className="text-[11px] text-[var(--mt-text)] py-1 border-b border-[var(--mt-border)]/40 last:border-0">
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

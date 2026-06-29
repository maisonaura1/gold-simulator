'use client';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import type { Stats } from '@/types';
import { useT } from '@/hooks/useT';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';
import clsx from 'clsx';

function MTStatBox({ label, value, cls = '', sub = '' }: { label: string; value: string; cls?: string; sub?: string }) {
  return (
    <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
      <div className="text-[10px] text-[var(--mt-text-dim)] mb-1">{label}</div>
      <div className={clsx('font-mono font-bold text-base', cls)}>{value}</div>
      {sub && <div className="text-[10px] text-[var(--mt-text-dim)] mt-0.5">{sub}</div>}
    </div>
  );
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

            {/* ── KPI grid ── */}
            <div className="grid grid-cols-4 gap-2">
              <MTStatBox label={t.winrateLabel}  value={`${stats.winRate}%`}
                cls={stats.winRate >= 50 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label={t.totalPL}        value={`${stats.totalPnl >= 0 ? '+' : ''}$${stats.totalPnl.toFixed(2)}`}
                cls={stats.totalPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label={t.totalTrades}    value={String(stats.totalTrades)} cls="text-[var(--mt-cyan)]" />
              <MTStatBox label={t.avgPL}          value={`${stats.avgPnl >= 0 ? '+' : ''}$${stats.avgPnl.toFixed(2)}`}
                cls={stats.avgPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label={t.avgRisk}        value={`${stats.avgRisk.toFixed(2)}%`}
                cls={stats.avgRisk <= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]'}
                sub={stats.avgRisk <= 2 ? '✅ Dentro del límite' : '⚠ Supera el 2%'} />
              <MTStatBox label={t.avgRR}          value={`${stats.avgRR.toFixed(2)}:1`}
                cls={stats.avgRR >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]'}
                sub={stats.avgRR >= 2 ? '✅ Buena relación R/R' : '⚠ Busca ≥ 2:1'} />
              <MTStatBox label={t.winStreak}      value={String(stats.winStreak)} cls="text-[var(--mt-green)]" />
              <MTStatBox label={t.lossStreak}     value={String(stats.lossStreak)} cls="text-[var(--mt-red)]" />
              <MTStatBox
                label="Max Drawdown"
                value={`${stats.maxDrawdown?.toFixed(2) ?? '0.00'}%`}
                cls={
                  (stats.maxDrawdown ?? 0) <= 10 ? 'text-[var(--mt-green)]' :
                  (stats.maxDrawdown ?? 0) <= 20 ? 'text-[var(--mt-yellow)]' : 'text-[var(--mt-red)]'
                }
                sub={(stats.maxDrawdown ?? 0) <= 10 ? '✅ Drawdown controlado' : '⚠ Revisa gestión de riesgo'}
              />
            </div>

            {/* ── Equity curve ── */}
            {stats.equityCurve && stats.equityCurve.length > 1 && (
              <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
                <div className="text-[10px] text-[var(--mt-text-dim)] mb-2 uppercase tracking-wide font-medium">Curva de Equity</div>
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

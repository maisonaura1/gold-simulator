'use client';
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import type { Stats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import clsx from 'clsx';

function MTStatBox({ label, value, cls = '' }: { label: string; value: string; cls?: string }) {
  return (
    <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
      <div className="text-[10px] text-[var(--mt-text-dim)] mb-1">{label}</div>
      <div className={clsx('font-mono font-bold text-base', cls)}>{value}</div>
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Stats>('/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-auto">
        {/* Header */}
        <div className="flex items-center px-4 py-2 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] shrink-0" style={{ fontSize: 11 }}>
          <span className="text-[var(--mt-text-label)] font-medium uppercase tracking-wide">Estadísticas del trader</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>Cargando...</div>
        ) : !stats ? null : (
          <div className="p-4 space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2">
              <MTStatBox label="Winrate" value={`${stats.winRate}%`} cls={stats.winRate >= 50 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label="P/L Total" value={`${stats.totalPnl >= 0 ? '+' : ''}$${stats.totalPnl.toFixed(2)}`} cls={stats.totalPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label="Operaciones" value={String(stats.totalTrades)} cls="text-[var(--mt-cyan)]" />
              <MTStatBox label="P/L promedio" value={`${stats.avgPnl >= 0 ? '+' : ''}$${stats.avgPnl.toFixed(2)}`} cls={stats.avgPnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]'} />
              <MTStatBox label="Riesgo promedio" value={`${stats.avgRisk.toFixed(2)}%`} cls={stats.avgRisk <= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]'} />
              <MTStatBox label="R/R promedio" value={`${stats.avgRR.toFixed(2)}:1`} cls={stats.avgRR >= 2 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-yellow)]'} />
              <MTStatBox label="Racha ganadora" value={String(stats.winStreak)} cls="text-[var(--mt-green)]" />
              <MTStatBox label="Racha perdedora" value={String(stats.lossStreak)} cls="text-[var(--mt-red)]" />
            </div>

            {/* Wins vs Losses */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
                <div className="text-[10px] text-[var(--mt-text-dim)] mb-2">Distribución</div>
                <div className="flex gap-1 h-3 rounded-sm overflow-hidden">
                  <div className="bg-[var(--mt-green)]" style={{ width: `${stats.winRate}%` }} />
                  <div className="bg-[var(--mt-red)]" style={{ width: `${100 - stats.winRate}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-[10px]">
                  <span className="text-[var(--mt-green)]">✅ {stats.wins} ganadoras</span>
                  <span className="text-[var(--mt-red)]">❌ {stats.losses} perdedoras</span>
                </div>
              </div>

              {/* P/L semanal chart */}
              <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
                <div className="text-[10px] text-[var(--mt-text-dim)] mb-1">P/L semanal</div>
                {stats.weeklyPnl.length > 0 ? (
                  <ResponsiveContainer width="100%" height={60}>
                    <BarChart data={stats.weeklyPnl} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                      <XAxis dataKey="week" hide />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ background: '#22262e', border: '1px solid #2e3340', fontSize: 10, color: '#c8cdd8' }}
                        formatter={(v: number) => [`$${v.toFixed(2)}`, 'P/L']}
                      />
                      <ReferenceLine y={0} stroke="#2e3340" />
                      <Bar dataKey="pnl" radius={[1, 1, 0, 0]}>
                        {stats.weeklyPnl.map((entry, i) => (
                          <Cell key={i} fill={entry.pnl >= 0 ? '#2dcc6f' : '#e84040'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-[var(--mt-text-dim)] text-[10px] pt-3">Sin datos suficientes</div>
                )}
              </div>
            </div>

            {/* Behavioral analysis */}
            <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
              <div className="text-[11px] text-[var(--mt-text-label)] font-medium mb-2 uppercase tracking-wide">Análisis de comportamiento</div>
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

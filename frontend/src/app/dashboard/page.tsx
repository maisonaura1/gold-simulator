'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useT } from '@/hooks/useT';
import type { Stats } from '@/types';

interface AccountData {
  currentBalance: number;
  initialBalance: number;
  level: number;
  xp: number;
}

interface RecentTrade {
  id: string;
  type: 'BUY' | 'SELL';
  lot: number;
  entryPrice: number;
  exitPrice?: number;
  resultUsd?: number;
  resultPct?: number;
  status: string;
  entryAt: string;
}

function StatPill({
  label, value, sub, positive,
}: { label: string; value: string; sub?: string; positive?: boolean }) {
  const color = positive === undefined ? '#c8cdd8' : positive ? '#2dcc6f' : '#e84040';
  return (
    <div
      className="flex flex-col gap-0.5 px-4 py-3 rounded-sm"
      style={{ background: '#0f1117', border: '1px solid #1d2029', minWidth: 110 }}
    >
      <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color, fontFamily: 'monospace', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ color: '#3a3f4d', fontSize: 9 }}>{sub}</span>}
    </div>
  );
}

function TradeRow({ trade }: { trade: RecentTrade }) {
  const pnl = trade.resultUsd ?? 0;
  const positive = pnl >= 0;
  return (
    <div
      className="flex items-center justify-between px-3 py-2 font-mono text-xs"
      style={{ borderBottom: '1px solid #0f1117' }}
    >
      <span style={{ color: trade.type === 'BUY' ? '#2dcc6f' : '#e84040', fontWeight: 700, minWidth: 36 }}>
        {trade.type === 'BUY' ? '▲' : '▼'} {trade.type}
      </span>
      <span style={{ color: '#8893a8', minWidth: 70 }}>XAUUSD</span>
      <span style={{ color: '#8893a8' }}>{trade.lot} lot</span>
      <span style={{ color: '#8893a8', minWidth: 70, textAlign: 'right' }}>
        @ {trade.entryPrice.toFixed(2)}
      </span>
      <span style={{ color: positive ? '#2dcc6f' : '#e84040', minWidth: 70, textAlign: 'right', fontWeight: 600 }}>
        {pnl !== 0 ? `${positive ? '+' : ''}$${pnl.toFixed(2)}` : '—'}
      </span>
      <span style={{ color: '#3a3f4d', minWidth: 80, textAlign: 'right' }}>
        {new Date(trade.entryAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
      </span>
    </div>
  );
}

function GradeBar({ score }: { score: number }) {
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#4ade80' : score >= 55 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';
  const grade = score >= 85 ? 'Elite' : score >= 70 ? 'Advanced' : score >= 55 ? 'Intermediate' : score >= 40 ? 'Beginner' : 'Critical';
  return (
    <div className="flex items-center gap-3">
      <div style={{ color, fontFamily: 'monospace', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{score}</div>
      <div>
        <div style={{ color, fontSize: 11, fontWeight: 600 }}>{grade}</div>
        <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1d2029', width: 80 }}>
          <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 9999 }} />
        </div>
      </div>
    </div>
  );
}

function calcScore(stats: Stats): number {
  let s = 0;
  if (stats.winRate >= 50) s += 20; else if (stats.winRate >= 40) s += 12; else s += 5;
  if (stats.avgRR >= 2) s += 25; else if (stats.avgRR >= 1.5) s += 15; else s += 5;
  if (stats.avgRisk > 0 && stats.avgRisk <= 1) s += 20; else if (stats.avgRisk <= 2) s += 14; else if (stats.avgRisk <= 3) s += 7;
  const dd = stats.maxDrawdown ?? 0;
  if (dd <= 5) s += 20; else if (dd <= 10) s += 12; else if (dd <= 20) s += 5;
  if (stats.totalTrades >= 20) s += 15; else if (stats.totalTrades >= 10) s += 8; else s += 3;
  return s;
}

function DashboardInner() {
  const { accessToken } = useAuthStore();
  const t = useT();
  const [stats, setStats]     = useState<Stats | null>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [trades, setTrades]   = useState<RecentTrade[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      api.get<Stats>('/stats').catch(() => null),
      api.get<AccountData>('/account').catch(() => null),
      api.get<RecentTrade[]>('/trades/history').catch(() => null),
    ]).then(([s, a, tr]) => {
      if (s) setStats(s.data);
      if (a) setAccount(a.data);
      if (tr) setTrades(tr.data.slice(0, 6));
    });
  }, [accessToken]);

  const balanceDiff = account ? account.currentBalance - account.initialBalance : 0;
  const score = stats ? calcScore(stats) : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#09090d' }}>
      {/* Top header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: '#1d2029', background: '#0b0d11' }}
      >
        <div>
          <span style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
            ◆ Gold Spot Dashboard
          </span>
          <div style={{ color: '#6b7385', fontSize: 10, marginTop: 1 }}>XAUUSD · Internal Practice Account</div>
        </div>
        <Link
          href="/trade"
          className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #c9a84c, #a8893c)',
            color: '#000',
            textDecoration: 'none',
          }}
        >
          ▶ New Session
        </Link>
      </div>

      <div className="flex-1 p-5 space-y-5">
        {/* Account overview */}
        <div className="flex gap-3 flex-wrap">
          <StatPill
            label="Balance"
            value={account ? `$${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
            sub="Practice account"
          />
          <StatPill
            label="Total P/L"
            value={balanceDiff !== 0 ? `${balanceDiff >= 0 ? '+' : ''}$${balanceDiff.toFixed(2)}` : '$0.00'}
            positive={balanceDiff >= 0}
            sub="vs. initial $10,000"
          />
          {stats && (
            <>
              <StatPill
                label="Win rate"
                value={`${stats.winRate}%`}
                positive={stats.winRate >= 50}
                sub={`${stats.wins}W · ${stats.losses}L`}
              />
              <StatPill
                label="Avg R:R"
                value={`${stats.avgRR.toFixed(2)}:1`}
                positive={stats.avgRR >= 2}
                sub={stats.avgRR >= 2 ? '✓ Target met' : 'Target: 2:1'}
              />
              <StatPill
                label="Sessions"
                value={String(stats.totalTrades)}
                sub="Total simulations"
              />
            </>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trader score */}
          <div
            className="p-4 rounded-sm"
            style={{ background: '#0f1117', border: '1px solid #1d2029' }}
          >
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Trader Score
            </div>
            {score !== null ? (
              <>
                <GradeBar score={score} />
                <div style={{ color: '#6b7385', fontSize: 10, marginTop: 10, lineHeight: 1.5 }}>
                  Based on win rate, R:R, risk management, drawdown and session volume.
                </div>
                <Link
                  href="/stats"
                  className="block text-center mt-3 py-1.5 rounded-sm text-xs"
                  style={{ background: '#141720', color: '#c9a84c', border: '1px solid #2c2410', textDecoration: 'none' }}
                >
                  Full analytics →
                </Link>
              </>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>Complete your first simulation to see your score.</div>
            )}
          </div>

          {/* Quick stats */}
          <div
            className="p-4 rounded-sm"
            style={{ background: '#0f1117', border: '1px solid #1d2029' }}
          >
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Key Metrics
            </div>
            {stats ? (
              <div className="space-y-2">
                {[
                  { label: 'Avg Risk/Trade', value: `${stats.avgRisk.toFixed(2)}%`, ok: stats.avgRisk <= 2 },
                  { label: 'Max Drawdown', value: `${(stats.maxDrawdown ?? 0).toFixed(2)}%`, ok: (stats.maxDrawdown ?? 0) <= 10 },
                  { label: 'Win Streak', value: `${stats.winStreak} trades`, ok: stats.winStreak >= 3 },
                  { label: 'Avg P/L/Trade', value: `${stats.avgPnl >= 0 ? '+' : ''}$${stats.avgPnl.toFixed(2)}`, ok: stats.avgPnl >= 0 },
                ].map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between text-xs font-mono">
                    <span style={{ color: '#8893a8' }}>{label}</span>
                    <span style={{ color: ok ? '#2dcc6f' : '#e84040', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>
                No data yet. Start a simulation to track your progress.
              </div>
            )}
          </div>

          {/* Level / XP */}
          <div
            className="p-4 rounded-sm"
            style={{ background: '#0f1117', border: '1px solid #1d2029' }}
          >
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              Progress
            </div>
            {account ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-sm flex items-center justify-center font-mono font-bold text-sm"
                    style={{ background: '#1a1508', border: '1px solid #2c2410', color: '#c9a84c' }}
                  >
                    N{account.level}
                  </div>
                  <div>
                    <div style={{ color: '#c8cdd8', fontSize: 12, fontWeight: 600 }}>Level {account.level}</div>
                    <div style={{ color: '#6b7385', fontSize: 10 }}>{account.xp} XP total</div>
                  </div>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden mb-2"
                  style={{ background: '#1d2029' }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, (account.xp % 500) / 5)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #c9a84c, #e8c96d)',
                      borderRadius: 9999,
                    }}
                  />
                </div>
                <div style={{ color: '#3a3f4d', fontSize: 9 }}>
                  {500 - (account.xp % 500)} XP to next level
                </div>
                <Link
                  href="/learn"
                  className="block text-center mt-3 py-1.5 rounded-sm text-xs"
                  style={{ background: '#141720', color: '#c9a84c', border: '1px solid #2c2410', textDecoration: 'none' }}
                >
                  View missions →
                </Link>
              </>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>Loading account…</div>
            )}
          </div>
        </div>

        {/* Recent trades */}
        <div
          className="rounded-sm overflow-hidden"
          style={{ border: '1px solid #1d2029' }}
        >
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ background: '#0f1117', borderColor: '#1d2029' }}
          >
            <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>
              Recent Sessions
            </span>
            <Link
              href="/history"
              style={{ color: '#c9a84c', fontSize: 10, textDecoration: 'none' }}
            >
              View all →
            </Link>
          </div>
          {trades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <span style={{ color: '#c9a84c', fontSize: 24 }}>◈</span>
              <p style={{ color: '#6b7385', fontSize: 12 }}>No sessions yet.</p>
              <Link
                href="/trade"
                className="px-4 py-2 rounded-sm text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c, #a8893c)',
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                Start your first simulation →
              </Link>
            </div>
          ) : (
            <div style={{ background: '#0b0d11' }}>
              {trades.map((tr) => <TradeRow key={tr.id} trade={tr} />)}
            </div>
          )}
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { href: '/trade',   icon: '◈', label: 'Simulator',  desc: 'XAUUSD practice' },
            { href: '/stats',   icon: '▦', label: 'Analytics',  desc: 'Performance review' },
            { href: '/academy', icon: '◎', label: 'Academy',    desc: 'Learn & improve' },
            { href: '/learn',   icon: '⬡', label: 'Missions',   desc: 'Daily challenges' },
          ].map(({ href, icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col gap-1 p-3 rounded-sm transition-colors"
              style={{
                background: '#0f1117',
                border: '1px solid #1d2029',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: '#c9a84c', fontSize: 16 }}>{icon}</span>
              <span style={{ color: '#c8cdd8', fontSize: 12, fontWeight: 600 }}>{label}</span>
              <span style={{ color: '#6b7385', fontSize: 10 }}>{desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardInner />
    </AppShell>
  );
}

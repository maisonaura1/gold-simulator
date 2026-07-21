'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useT } from '@/hooks/useT';
import { useReferral } from '@/hooks/useReferral';
import { TradeCalendar } from '@/components/dashboard/TradeCalendar';
import type { Stats } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface PaymentStatus {
  plan: 'free' | 'monthly' | 'annual' | 'lifetime' | 'propfirm';
  paid: boolean;
  simulationsUsed: number;
  simulationsLimit: number;
}

// ─── Score ────────────────────────────────────────────────────────────────────

function calcScore(s: Stats): number {
  let v = 0;
  v += s.winRate >= 50 ? 20 : s.winRate >= 40 ? 12 : 5;
  v += s.avgRR   >= 2  ? 25 : s.avgRR   >= 1.5 ? 15 : 5;
  v += s.avgRisk <= 1  ? 20 : s.avgRisk  <= 2  ? 14 : s.avgRisk <= 3 ? 7 : 0;
  const dd = s.maxDrawdown ?? 0;
  v += dd <= 5 ? 20 : dd <= 10 ? 12 : dd <= 20 ? 5 : 0;
  v += s.totalTrades >= 20 ? 15 : s.totalTrades >= 10 ? 8 : 3;
  return v;
}

function scoreColor(n: number) {
  if (n >= 85) return '#22c55e';
  if (n >= 70) return '#4ade80';
  if (n >= 55) return '#f59e0b';
  if (n >= 40) return '#f97316';
  return '#ef4444';
}

function scoreLabel(n: number) {
  if (n >= 85) return 'Elite';
  if (n >= 70) return 'Advanced';
  if (n >= 55) return 'Intermediate';
  if (n >= 40) return 'Beginner';
  return 'Critical';
}

// ─── Plan badge ───────────────────────────────────────────────────────────────

const PLAN_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  free:     { label: 'Free',        color: '#6b7385', bg: '#0f1117', border: '#1d2029' },
  monthly:  { label: 'Pro Monthly', color: '#c9a84c', bg: '#1a1508', border: '#2c2410' },
  annual:   { label: 'Pro Annual',  color: '#e8c96d', bg: '#1a1508', border: '#c9a84c55' },
  propfirm: { label: 'Prop Firm',   color: '#4a6cf7', bg: '#080d14', border: '#4a6cf755' },
  lifetime: { label: 'Lifetime',    color: '#22c55e', bg: '#0a1a0e', border: '#2dcc6f44' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs font-mono py-1.5"
      style={{ borderBottom: '1px solid #0f1117' }}>
      <span style={{ color: '#8893a8' }}>{label}</span>
      <span style={{ color: ok === undefined ? '#c8cdd8' : ok ? '#2dcc6f' : '#e84040', fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

function TradeRow({ trade }: { trade: RecentTrade }) {
  const pnl = trade.resultUsd ?? 0;
  const pos = pnl >= 0;
  return (
    <div className="flex items-center justify-between px-3 py-2 font-mono text-xs"
      style={{ borderBottom: '1px solid #0f1117' }}>
      <span style={{ color: trade.type === 'BUY' ? '#2dcc6f' : '#e84040', fontWeight: 700, minWidth: 48 }}>
        {trade.type === 'BUY' ? '▲' : '▼'} {trade.type}
      </span>
      <span style={{ color: '#8893a8', minWidth: 60 }}>{trade.lot} lot</span>
      <span style={{ color: '#8893a8', minWidth: 72, textAlign: 'right' }}>
        @{trade.entryPrice.toFixed(2)}
      </span>
      <span style={{ color: pos ? '#2dcc6f' : '#e84040', minWidth: 72, textAlign: 'right', fontWeight: 600 }}>
        {pnl !== 0 ? `${pos ? '+' : ''}$${pnl.toFixed(2)}` : '—'}
      </span>
      <span style={{ color: '#3a3f4d', minWidth: 60, textAlign: 'right' }}>
        {new Date(trade.entryAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
      </span>
    </div>
  );
}

function ReferralStrip({ referral }: { referral: ReturnType<typeof useReferral> }) {
  const [copied, setCopied] = useState(false);
  if (referral.loading || !referral.data) return null;
  const { code, bonus, referredCount } = referral.data;
  const handleCopy = async () => {
    const ok = await referral.copyLink(code);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-sm flex-wrap gap-3"
      style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 font-mono font-bold text-sm tracking-widest"
          style={{ background: '#1a1508', border: '1px solid #2c2410', color: '#e8b84b', borderRadius: 4 }}>
          {code}
        </div>
        <div>
          <div style={{ color: '#c8cdd8', fontSize: 11, fontWeight: 600 }}>
            {referredCount} {referredCount === 1 ? 'friend' : 'friends'} joined
          </div>
          <div style={{ color: bonus > 0 ? '#2dcc6f' : '#3a3f4d', fontSize: 10 }}>
            {bonus > 0 ? `+${bonus} bonus simulations` : '+5 sims per friend who joins'}
          </div>
        </div>
      </div>
      <button onClick={handleCopy} className="px-3 py-1.5 rounded-sm text-xs font-medium"
        style={{
          background: copied ? '#1a2e1a' : '#141720',
          color: copied ? '#2dcc6f' : '#c9a84c',
          border: `1px solid ${copied ? '#2dcc6f44' : '#2c2410'}`,
          cursor: 'pointer',
        }}>
        {copied ? '✓ Copied!' : '↗ Copy invite link'}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function DashboardInner() {
  const { accessToken } = useAuthStore();
  const t = useT();
  const referral = useReferral();

  const [stats,     setStats]     = useState<Stats | null>(null);
  const [account,   setAccount]   = useState<AccountData | null>(null);
  const [trades,    setTrades]    = useState<RecentTrade[]>([]);
  const [payStatus, setPayStatus] = useState<PaymentStatus | null>(null);

  useEffect(() => {
    const plan = sessionStorage.getItem('pending_plan');
    if (!plan || !accessToken) return;
    sessionStorage.removeItem('pending_plan');
    api.post<{ url: string }>('/payments/checkout', { plan })
      .then((r) => { if (r.data.url) window.location.href = r.data.url; })
      .catch(() => null);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      api.get<Stats>('/stats').catch(() => null),
      api.get<AccountData>('/account').catch(() => null),
      api.get<RecentTrade[]>('/trades/history').catch(() => null),
      api.get<PaymentStatus>('/payments/status').catch(() => null),
    ]).then(([s, a, tr, ps]) => {
      if (s)  setStats(s.data);
      if (a)  setAccount(a.data);
      if (tr) setTrades(tr.data.slice(0, 8));
      if (ps) setPayStatus(ps.data);
    });
  }, [accessToken]);

  const balanceDiff = account ? account.currentBalance - account.initialBalance : 0;
  const score       = stats ? calcScore(stats) : null;
  const planMeta    = PLAN_META[payStatus?.plan ?? 'free'] ?? PLAN_META.free;

  // Prop firm metrics (only computed when needed)
  const dd = stats?.maxDrawdown ?? 0;
  const propRows = stats ? [
    { label: 'Max drawdown',   value: `${dd.toFixed(1)}%`,             ok: dd <= 10,              limit: '< 10%'  },
    { label: 'Win rate',       value: `${stats.winRate}%`,              ok: stats.winRate >= 50,   limit: '≥ 50%'  },
    { label: 'Avg R:R',        value: `${stats.avgRR.toFixed(2)}:1`,    ok: stats.avgRR >= 2,      limit: '≥ 2:1'  },
    { label: 'Avg risk/trade', value: `${stats.avgRisk.toFixed(2)}%`,   ok: stats.avgRisk <= 2,    limit: '≤ 2%'   },
    { label: 'Trade count',    value: String(stats.totalTrades),         ok: stats.totalTrades >= 10, limit: '≥ 10' },
  ] : [];
  const passing = propRows.filter((r) => r.ok).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#09090d' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: '#1d2029', background: '#0b0d11' }}>
        <div>
          <span style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {t.dashTitle}
          </span>
          <div style={{ color: '#6b7385', fontSize: 10, marginTop: 1 }}>{t.dashSubtitle}</div>
        </div>
        <div className="flex items-center gap-3">
          {payStatus && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-xs font-bold"
              style={{ background: planMeta.bg, border: `1px solid ${planMeta.border}`, color: planMeta.color }}>
              {planMeta.label}
            </div>
          )}
          <Link href="/trade"
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}>
            {t.dashNewSession}
          </Link>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-4">

        {/* ── Row 1: Account stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: t.balance,
              value: account
                ? `$${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '—',
              color: '#c8cdd8',
              sub: t.dashPracticeAccount,
            },
            {
              label: t.totalPL,
              value: `${balanceDiff >= 0 ? '+' : ''}$${balanceDiff.toFixed(2)}`,
              color: balanceDiff >= 0 ? '#2dcc6f' : '#e84040',
              sub: t.dashVsInitial,
            },
            {
              label: t.winrateLabel,
              value: stats ? `${stats.winRate}%` : '—',
              color: stats && stats.winRate >= 50 ? '#2dcc6f' : '#e84040',
              sub: stats ? `${stats.wins}W · ${stats.losses}L` : t.dashNoData,
            },
            {
              label: 'Avg R:R',
              value: stats ? `${stats.avgRR.toFixed(2)}:1` : '—',
              color: stats && stats.avgRR >= 2 ? '#2dcc6f' : '#e84040',
              sub: stats && stats.avgRR >= 2 ? t.dashTargetMet : t.dashTargetLabel,
            },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="px-4 py-3 rounded-sm flex flex-col gap-0.5"
              style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
              <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</span>
              <span style={{ color, fontFamily: 'monospace', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>{value}</span>
              {sub && <span style={{ color: '#3a3f4d', fontSize: 9 }}>{sub}</span>}
            </div>
          ))}
        </div>

        {/* ── Row 2: Score + Metrics + XP ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Trader Score */}
          <div className="p-4 rounded-sm" style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              {t.dashTraderScoreLabel}
            </div>
            {score !== null ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span style={{ color: scoreColor(score), fontFamily: 'monospace', fontWeight: 800, fontSize: 44, lineHeight: 1 }}>
                    {score}
                  </span>
                  <div>
                    <div style={{ color: scoreColor(score), fontSize: 12, fontWeight: 600 }}>{scoreLabel(score)}</div>
                    <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: '#1d2029', width: 80 }}>
                      <div style={{ width: `${score}%`, height: '100%', background: scoreColor(score), borderRadius: 9999 }} />
                    </div>
                  </div>
                </div>
                <div style={{ color: '#6b7385', fontSize: 10, lineHeight: 1.6 }}>{t.dashScoreDesc}</div>
                <div className="flex gap-2 mt-3">
                  <Link href="/stats" className="flex-1 block text-center py-1.5 rounded-sm text-xs"
                    style={{ background: '#141720', color: '#c9a84c', border: '1px solid #2c2410', textDecoration: 'none' }}>
                    {t.dashFullAnalytics}
                  </Link>
                </div>
              </>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>{t.dashNoScore}</div>
            )}
          </div>

          {/* Performance / Challenge metrics */}
          <div className="p-4 rounded-sm" style={{
            background: payStatus?.plan === 'propfirm' ? '#080d14' : '#0f1117',
            border: `1px solid ${payStatus?.plan === 'propfirm' ? '#4a6cf755' : '#1d2029'}`,
          }}>
            <div className="flex items-center justify-between mb-3">
              <div style={{
                color: payStatus?.plan === 'propfirm' ? '#4a6cf7' : '#6b7385',
                fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
              }}>
                {payStatus?.plan === 'propfirm' ? '◈ Challenge Metrics' : t.dashKeyMetrics}
              </div>
              {payStatus?.plan === 'propfirm' && stats && (
                <span className="px-2 py-0.5 rounded-sm text-xs font-mono font-bold"
                  style={{
                    background: passing >= 4 ? '#0a1a0e' : '#1a0808',
                    color: passing >= 4 ? '#2dcc6f' : '#e84040',
                    border: `1px solid ${passing >= 4 ? '#2dcc6f33' : '#e8404033'}`,
                  }}>
                  {passing}/{propRows.length}
                </span>
              )}
            </div>
            {stats ? (
              <div>
                {(payStatus?.plan === 'propfirm' ? propRows : [
                  { label: t.dashAvgRiskTrade,  value: `${stats.avgRisk.toFixed(2)}%`,          ok: stats.avgRisk <= 2 },
                  { label: t.dashMaxDrawdown,    value: `${(stats.maxDrawdown ?? 0).toFixed(2)}%`, ok: (stats.maxDrawdown ?? 0) <= 10 },
                  { label: t.dashWinStreakLabel, value: `${stats.winStreak} trades`,              ok: stats.winStreak >= 3 },
                  { label: t.dashAvgPLTrade,     value: `${stats.avgPnl >= 0 ? '+' : ''}$${stats.avgPnl.toFixed(2)}`, ok: stats.avgPnl >= 0 },
                ] as { label: string; value: string; ok?: boolean }[]).map((row) => (
                  <MetricRow key={row.label} {...row} />
                ))}
              </div>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>{t.dashNoData}</div>
            )}
          </div>

          {/* Level & XP */}
          <div className="p-4 rounded-sm" style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              {t.dashProgress}
            </div>
            {account ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-sm flex items-center justify-center font-mono font-bold text-sm"
                    style={{ background: '#1a1508', border: '1px solid #2c2410', color: '#c9a84c' }}>
                    N{account.level}
                  </div>
                  <div>
                    <div style={{ color: '#c8cdd8', fontSize: 12, fontWeight: 600 }}>{t.dashLevelLabel(account.level)}</div>
                    <div style={{ color: '#6b7385', fontSize: 10 }}>{t.dashXPTotal(account.xp)}</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: '#1d2029' }}>
                  <div style={{
                    width: `${Math.min(100, (account.xp % 500) / 5)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg,#c9a84c,#e8c96d)',
                    borderRadius: 9999,
                  }} />
                </div>
                <div style={{ color: '#3a3f4d', fontSize: 9, marginBottom: 12 }}>
                  {t.dashXPToNext(500 - (account.xp % 500))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/learn" className="block text-center py-1.5 rounded-sm text-xs"
                    style={{ background: '#141720', color: '#c9a84c', border: '1px solid #2c2410', textDecoration: 'none' }}>
                    {t.dashViewMissions}
                  </Link>
                  <Link href="/academy" className="block text-center py-1.5 rounded-sm text-xs"
                    style={{ background: '#141720', color: '#6b7385', border: '1px solid #1d2029', textDecoration: 'none' }}>
                    Academy
                  </Link>
                </div>
              </>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>{t.dashLoadingAccount}</div>
            )}
          </div>
        </div>

        {/* ── Row 3: Trading Journal (Pro+) ── */}
        {payStatus?.paid && (
          <div>
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>
              Trading Journal
            </div>
            <TradeCalendar
              isPropFirm={payStatus.plan === 'propfirm'}
              onExportCsv={async () => {
                const res = await api.get('/stats/export/csv', { responseType: 'blob' });
                const url = URL.createObjectURL(new Blob([res.data as BlobPart], { type: 'text/csv' }));
                const a = document.createElement('a');
                a.href = url; a.download = 'goldtrader-journal.csv'; a.click();
                URL.revokeObjectURL(url);
              }}
            />
          </div>
        )}

        {/* ── Row 4: Referral ── */}
        <ReferralStrip referral={referral} />

        {/* ── Row 5: Recent trades ── */}
        <div className="rounded-sm overflow-hidden" style={{ border: '1px solid #1d2029' }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ background: '#0f1117', borderColor: '#1d2029' }}>
            <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>
              {t.dashRecentSessions}
            </span>
            <Link href="/history" style={{ color: '#c9a84c', fontSize: 10, textDecoration: 'none' }}>
              {t.dashViewAll}
            </Link>
          </div>
          {trades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <span style={{ color: '#c9a84c', fontSize: 28 }}>◈</span>
              <p style={{ color: '#6b7385', fontSize: 12 }}>{t.dashNoSessions}</p>
              <Link href="/trade" className="px-5 py-2 rounded-sm text-xs font-bold"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000', textDecoration: 'none' }}>
                {t.dashStartFirst}
              </Link>
            </div>
          ) : (
            <div style={{ background: '#0b0d11' }}>
              {trades.map((tr) => <TradeRow key={tr.id} trade={tr} />)}
            </div>
          )}
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

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useT } from '@/hooks/useT';
import { useReferral } from '@/hooks/useReferral';
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

function gradeLabel(score: number, t: ReturnType<typeof useT>): string {
  if (score >= 85) return t.traderGradeElite;
  if (score >= 70) return t.traderGradeAdvanced;
  if (score >= 55) return t.traderGradeIntermediate;
  if (score >= 40) return t.traderGradeBeginner;
  return t.traderGradeCritical;
}

function GradeBar({ score }: { score: number }) {
  const t = useT();
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#4ade80' : score >= 55 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';
  return (
    <div className="flex items-center gap-3">
      <div style={{ color, fontFamily: 'monospace', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{score}</div>
      <div>
        <div style={{ color, fontSize: 11, fontWeight: 600 }}>{gradeLabel(score, t)}</div>
        <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1d2029', width: 80 }}>
          <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 9999 }} />
        </div>
      </div>
    </div>
  );
}

function shareTraderCard(score: number, stats: Stats, gradeStr: string) {
  const color = score >= 85 ? '#22c55e' : score >= 70 ? '#4ade80' : score >= 55 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';
  const canvas = document.createElement('canvas');
  canvas.width = 800; canvas.height = 420;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#09090d';
  ctx.fillRect(0, 0, 800, 420);

  // Border
  ctx.strokeStyle = '#1d2029';
  ctx.lineWidth = 1;
  ctx.strokeRect(1, 1, 798, 418);

  // Gold accent bar top
  const grad = ctx.createLinearGradient(0, 0, 800, 0);
  grad.addColorStop(0, '#c9a84c');
  grad.addColorStop(1, '#4a3810');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 3);

  // Logo
  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('◆ GOLDTRADER', 40, 48);

  // XAU/USD label
  ctx.fillStyle = '#3a3f4d';
  ctx.font = '11px monospace';
  ctx.fillText('XAU/USD SIMULATOR', 40, 66);

  // Score
  ctx.fillStyle = color;
  ctx.font = 'bold 96px monospace';
  ctx.fillText(String(score), 40, 195);

  // Grade label
  ctx.font = 'bold 18px -apple-system, sans-serif';
  ctx.fillText(gradeStr, 40, 225);

  // Score bar bg
  ctx.fillStyle = '#1d2029';
  ctx.beginPath();
  ctx.roundRect(40, 240, 200, 6, 3);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(40, 240, score * 2, 6, 3);
  ctx.fill();

  // Divider
  ctx.strokeStyle = '#1d2029';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 275); ctx.lineTo(760, 275);
  ctx.stroke();

  // Stats
  const statsItems = [
    ['WIN RATE', `${stats.winRate}%`],
    ['AVG R:R',  `${stats.avgRR.toFixed(2)}:1`],
    ['TRADES',   String(stats.totalTrades)],
    ['MAX DD',   `${(stats.maxDrawdown ?? 0).toFixed(1)}%`],
  ];
  statsItems.forEach(([label, value], i) => {
    const x = 40 + i * 185;
    ctx.fillStyle = '#6b7385';
    ctx.font = '10px monospace';
    ctx.fillText(label, x, 310);
    ctx.fillStyle = '#c8cdd8';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(value, x, 338);
  });

  // Footer
  ctx.fillStyle = '#3a3f4d';
  ctx.font = '10px monospace';
  ctx.fillText('goldtrader.app  ·  XAUUSD Practice Simulator  ·  Not financial advice', 40, 390);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `goldtrader-score-${score}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
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

function ReferralCard({ referral }: { referral: ReturnType<typeof useReferral> }) {
  const [copied, setCopied] = useState(false);

  if (referral.loading || !referral.data) return null;
  const { code, bonus, referredCount } = referral.data;

  const handleCopy = async () => {
    const ok = await referral.copyLink(code);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div
      className="p-4 rounded-sm"
      style={{ background: '#0f1117', border: '1px solid #1d2029' }}
    >
      <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
        Refer &amp; earn simulations
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* Code badge */}
          <div
            className="px-3 py-1.5 font-mono font-bold text-sm tracking-widest"
            style={{ background: '#1a1508', border: '1px solid #2c2410', color: '#e8b84b', borderRadius: 4 }}
          >
            {code}
          </div>
          <div>
            <div style={{ color: '#c8cdd8', fontSize: 11, fontWeight: 600 }}>
              {referredCount} {referredCount === 1 ? 'friend' : 'friends'} joined
            </div>
            {bonus > 0 && (
              <div style={{ color: '#2dcc6f', fontSize: 10 }}>
                +{bonus} bonus simulations earned
              </div>
            )}
            {bonus === 0 && (
              <div style={{ color: '#3a3f4d', fontSize: 10 }}>
                +5 simulations per friend who joins
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="px-4 py-1.5 rounded-sm text-xs font-medium transition-colors"
          style={{
            background: copied ? '#1a2e1a' : '#141720',
            color: copied ? '#2dcc6f' : '#c9a84c',
            border: `1px solid ${copied ? '#2dcc6f44' : '#2c2410'}`,
            cursor: 'pointer',
          }}
        >
          {copied ? '✓ Copied!' : '↗ Copy invite link'}
        </button>
      </div>
    </div>
  );
}

function DashboardInner() {
  const { accessToken } = useAuthStore();
  const t = useT();
  const referral = useReferral();
  const [stats, setStats]     = useState<Stats | null>(null);

  // Launch checkout if user registered via a pricing CTA
  useEffect(() => {
    const plan = sessionStorage.getItem('pending_plan');
    if (!plan || !accessToken) return;
    sessionStorage.removeItem('pending_plan');
    api.post<{ url: string }>('/payments/checkout', { plan })
      .then((r) => { if (r.data.url) window.location.href = r.data.url; })
      .catch(() => null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
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
            {t.dashTitle}
          </span>
          <div style={{ color: '#6b7385', fontSize: 10, marginTop: 1 }}>{t.dashSubtitle}</div>
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
          {t.dashNewSession}
        </Link>
      </div>

      <div className="flex-1 p-5 space-y-5">
        {/* Account overview */}
        <div className="flex gap-3 flex-wrap">
          <StatPill
            label={t.balance}
            value={account ? `$${account.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
            sub={t.dashPracticeAccount}
          />
          <StatPill
            label={t.totalPL}
            value={balanceDiff !== 0 ? `${balanceDiff >= 0 ? '+' : ''}$${balanceDiff.toFixed(2)}` : '$0.00'}
            positive={balanceDiff >= 0}
            sub={t.dashVsInitial}
          />
          {stats && (
            <>
              <StatPill
                label={t.winrateLabel}
                value={`${stats.winRate}%`}
                positive={stats.winRate >= 50}
                sub={`${stats.wins}W · ${stats.losses}L`}
              />
              <StatPill
                label="Avg R:R"
                value={`${stats.avgRR.toFixed(2)}:1`}
                positive={stats.avgRR >= 2}
                sub={stats.avgRR >= 2 ? t.dashTargetMet : t.dashTargetLabel}
              />
              <StatPill
                label={t.dashSessionsLabel}
                value={String(stats.totalTrades)}
                sub={t.dashTotalSims}
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
              {t.dashTraderScoreLabel}
            </div>
            {score !== null ? (
              <>
                <GradeBar score={score} />
                <div style={{ color: '#6b7385', fontSize: 10, marginTop: 10, lineHeight: 1.5 }}>
                  {t.dashScoreDesc}
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    href="/stats"
                    className="flex-1 block text-center py-1.5 rounded-sm text-xs"
                    style={{ background: '#141720', color: '#c9a84c', border: '1px solid #2c2410', textDecoration: 'none' }}
                  >
                    {t.dashFullAnalytics}
                  </Link>
                  {stats && (
                    <button
                      onClick={() => shareTraderCard(score, stats, gradeLabel(score, t))}
                      className="px-3 py-1.5 rounded-sm text-xs font-medium"
                      style={{ background: '#141720', color: '#6b7385', border: '1px solid #1d2029', cursor: 'pointer' }}
                    >
                      ↓ Share
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>{t.dashNoScore}</div>
            )}
          </div>

          {/* Quick stats */}
          <div
            className="p-4 rounded-sm"
            style={{ background: '#0f1117', border: '1px solid #1d2029' }}
          >
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              {t.dashKeyMetrics}
            </div>
            {stats ? (
              <div className="space-y-2">
                {[
                  { label: t.dashAvgRiskTrade, value: `${stats.avgRisk.toFixed(2)}%`, ok: stats.avgRisk <= 2 },
                  { label: t.dashMaxDrawdown,  value: `${(stats.maxDrawdown ?? 0).toFixed(2)}%`, ok: (stats.maxDrawdown ?? 0) <= 10 },
                  { label: t.dashWinStreakLabel, value: `${stats.winStreak} trades`, ok: stats.winStreak >= 3 },
                  { label: t.dashAvgPLTrade,   value: `${stats.avgPnl >= 0 ? '+' : ''}$${stats.avgPnl.toFixed(2)}`, ok: stats.avgPnl >= 0 },
                ].map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between text-xs font-mono">
                    <span style={{ color: '#8893a8' }}>{label}</span>
                    <span style={{ color: ok ? '#2dcc6f' : '#e84040', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>{t.dashNoData}</div>
            )}
          </div>

          {/* Level / XP */}
          <div
            className="p-4 rounded-sm"
            style={{ background: '#0f1117', border: '1px solid #1d2029' }}
          >
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              {t.dashProgress}
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
                    <div style={{ color: '#c8cdd8', fontSize: 12, fontWeight: 600 }}>{t.dashLevelLabel(account.level)}</div>
                    <div style={{ color: '#6b7385', fontSize: 10 }}>{t.dashXPTotal(account.xp)}</div>
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
                  {t.dashXPToNext(500 - (account.xp % 500))}
                </div>
                <Link
                  href="/learn"
                  className="block text-center mt-3 py-1.5 rounded-sm text-xs"
                  style={{ background: '#141720', color: '#c9a84c', border: '1px solid #2c2410', textDecoration: 'none' }}
                >
                  {t.dashViewMissions}
                </Link>
              </>
            ) : (
              <div style={{ color: '#3a3f4d', fontSize: 11 }}>{t.dashLoadingAccount}</div>
            )}
          </div>
        </div>

        {/* Referral card */}
        <ReferralCard referral={referral} />

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
              {t.dashRecentSessions}
            </span>
            <Link
              href="/history"
              style={{ color: '#c9a84c', fontSize: 10, textDecoration: 'none' }}
            >
              {t.dashViewAll}
            </Link>
          </div>
          {trades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <span style={{ color: '#c9a84c', fontSize: 24 }}>◈</span>
              <p style={{ color: '#6b7385', fontSize: 12 }}>{t.dashNoSessions}</p>
              <Link
                href="/trade"
                className="px-4 py-2 rounded-sm text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #c9a84c, #a8893c)',
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                {t.dashStartFirst}
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
            { href: '/trade',   icon: '◈', label: t.dashNavSimulator, desc: t.dashNavSimDesc },
            { href: '/stats',   icon: '▦', label: t.dashNavAnalytics, desc: t.dashNavAnalDesc },
            { href: '/academy', icon: '◎', label: t.dashNavAcademy,   desc: t.dashNavAcadDesc },
            { href: '/learn',   icon: '⬡', label: t.dashNavMissions,  desc: t.dashNavMisDesc },
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

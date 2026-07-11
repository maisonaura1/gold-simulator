'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAccount } from '@/hooks/useAccount';
import { useTrades } from '@/hooks/useTrades';
import { usePricesStore } from '@/store/prices.store';
import clsx from 'clsx';

interface Stats {
  winRate: number;
  totalPnl: number;
  avgPnl: number;
  avgRisk: number;
  avgRR: number;
  winStreak: number;
  lossStreak: number;
  totalTrades: number;
  wins: number;
  losses: number;
  maxDrawdown: number;
  behaviours: string[];
}

function Meter({ label, pct, color, value }: { label: string; pct: number; color: string; value: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5" style={{ fontSize: 11 }}>
        <span style={{ color: '#6b7385' }}>{label}</span>
        <span className="font-mono font-bold" style={{ color }}>{value}</span>
      </div>
      <div style={{ height: 6, background: '#1a1d24', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

export function MobileStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { account } = useAccount();
  const { openTrades } = useTrades();
  const currentPrice = usePricesStore((s) => s.currentPrice);

  const livePnl = openTrades.reduce((sum, tr) => {
    if (currentPrice <= 0) return sum;
    return sum + (tr.type === 'BUY'
      ? (currentPrice - tr.entryPrice) * tr.lot * 100
      : (tr.entryPrice - currentPrice) * tr.lot * 100);
  }, 0);

  useEffect(() => {
    api.get<Stats>('/stats').then((r) => {
      setStats(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: '#4a5568', fontSize: 12 }}>
        Cargando estadísticas...
      </div>
    );
  }

  const initialBalance = account?.initialBalance ?? 10000;
  const currentBalance = account?.currentBalance ?? initialBalance;
  const dailyPnl = account?.dailyPnl ?? 0;

  const ftmoDailyLimit    = initialBalance * 0.05;
  const ftmoDrawdownLimit = initialBalance * 0.10;
  const ftmoProfitTarget  = initialBalance * 0.08;
  const dailyLoss   = Math.max(0, -dailyPnl);
  const totalDD     = Math.max(0, initialBalance - currentBalance);
  const totalProfit = Math.max(0, currentBalance - initialBalance);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5" style={{ overscrollBehavior: 'contain' }}>

      {/* Account snapshot */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Balance',    value: `$${currentBalance.toFixed(2)}`,  color: '#e8ecf4' },
          { label: 'Equity',     value: `$${(currentBalance + livePnl).toFixed(2)}`, color: '#33c2ff' },
          { label: 'P/L Hoy',   value: `${dailyPnl >= 0 ? '+' : ''}$${dailyPnl.toFixed(2)}`, color: dailyPnl >= 0 ? '#2dcc6f' : '#e84040' },
          { label: 'Flotante',   value: `${livePnl >= 0 ? '+' : ''}$${livePnl.toFixed(2)}`, color: livePnl >= 0 ? '#2dcc6f' : '#e84040' },
        ].map((item) => (
          <div key={item.label} style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#6b7385', marginBottom: 4 }}>{item.label}</div>
            <div className="font-mono font-bold" style={{ fontSize: 16, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* FTMO meters */}
      <div style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 12, padding: '16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#c9a84c', marginBottom: 14, letterSpacing: 1 }}>
          🏦 FTMO CHALLENGE
        </div>
        <div className="space-y-4">
          <Meter
            label="Pérdida diaria"
            pct={(dailyLoss / ftmoDailyLimit) * 100}
            color={dailyLoss / ftmoDailyLimit >= 1 ? '#e84040' : dailyLoss / ftmoDailyLimit >= 0.75 ? '#f0b429' : '#2dcc6f'}
            value={`-$${dailyLoss.toFixed(0)} / -$${ftmoDailyLimit.toFixed(0)}`}
          />
          <Meter
            label="Drawdown total"
            pct={(totalDD / ftmoDrawdownLimit) * 100}
            color={totalDD / ftmoDrawdownLimit >= 1 ? '#e84040' : totalDD / ftmoDrawdownLimit >= 0.75 ? '#f0b429' : '#2dcc6f'}
            value={`-$${totalDD.toFixed(0)} / -$${ftmoDrawdownLimit.toFixed(0)}`}
          />
          <Meter
            label="Objetivo de profit"
            pct={(totalProfit / ftmoProfitTarget) * 100}
            color={totalProfit / ftmoProfitTarget >= 1 ? '#2dcc6f' : totalProfit / ftmoProfitTarget >= 0.5 ? '#f0b429' : '#6b7385'}
            value={`+$${totalProfit.toFixed(0)} / +$${ftmoProfitTarget.toFixed(0)}`}
          />
        </div>
      </div>

      {/* Trading stats */}
      {stats && (
        <div style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 12, padding: '16px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#e8ecf4', marginBottom: 14, letterSpacing: 0.5 }}>
            📊 ESTADÍSTICAS
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Win Rate',    value: `${stats.winRate.toFixed(1)}%`,  color: stats.winRate >= 50 ? '#2dcc6f' : '#f0b429' },
              { label: 'R:R Medio',  value: `${stats.avgRR.toFixed(2)}:1`,   color: stats.avgRR >= 2 ? '#2dcc6f' : '#f0b429' },
              { label: 'P/L Total',  value: `$${stats.totalPnl.toFixed(0)}`, color: stats.totalPnl >= 0 ? '#2dcc6f' : '#e84040' },
              { label: 'Trades',     value: String(stats.totalTrades),        color: '#c8cdd8' },
              { label: 'Racha Win',  value: String(stats.winStreak),          color: '#2dcc6f' },
              { label: 'Racha Loss', value: String(stats.lossStreak),         color: '#e84040' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-mono font-bold" style={{ fontSize: 18, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 9, color: '#4a5568', marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Behaviours */}
          <div className="space-y-2">
            {stats.behaviours.map((b, i) => (
              <div key={i} style={{ fontSize: 11, color: '#8893a8', padding: '8px 12px', background: '#0b0d14', borderRadius: 6 }}>
                {b}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

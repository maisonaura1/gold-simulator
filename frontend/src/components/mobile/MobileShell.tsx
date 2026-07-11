'use client';
import { useState } from 'react';
import { PriceChart } from '@/components/charts/PriceChart';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav, type MobileTab } from './MobileBottomNav';
import { MobileOrderSheet } from './MobileOrderSheet';
import { MobileHistoryPage } from './MobileHistoryPage';
import { MobileStatsPage } from './MobileStatsPage';
import { MobileAccountPage } from './MobileAccountPage';
import { useChartStore } from '@/store/chart.store';
import { useTrades } from '@/hooks/useTrades';
import clsx from 'clsx';

const TIMEFRAMES = ['M5', 'M15', 'H1', 'H4', 'D1'] as const;

export function MobileShell({ children }: { children?: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<MobileTab>('chart');
  const [orderSheetOpen, setOrderSheetOpen] = useState(false);
  const chart = useChartStore();
  const { openTrades } = useTrades();

  const handleTabChange = (tab: MobileTab) => {
    if (tab === 'trade') {
      setOrderSheetOpen(true);
      return;
    }
    setActiveTab(tab);
    setOrderSheetOpen(false);
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: '#07080b', touchAction: 'manipulation' }}
    >
      <MobileHeader />

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden min-h-0">

        {/* Chart — always mounted, hidden when not active */}
        <div
          className="absolute inset-0"
          style={{ display: activeTab === 'chart' ? 'block' : 'none' }}
        >
          <PriceChart />

          {/* Timeframe pills — floating over chart */}
          <div
            className="absolute flex gap-1 select-none"
            style={{ top: 8, left: 8, zIndex: 10 }}
          >
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => chart.setTimeframe(tf)}
                style={{
                  padding: '4px 10px',
                  fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
                  borderRadius: 4,
                  border: `1px solid ${chart.timeframe === tf ? '#4a6cf7' : '#1d2029'}`,
                  background: chart.timeframe === tf ? '#4a6cf720' : '#0a0c1188',
                  color: chart.timeframe === tf ? '#33c2ff' : '#6b7385',
                  WebkitTapHighlightColor: 'transparent',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Replay badge */}
          {chart.replayMode && (
            <div
              className="absolute flex items-center gap-1.5 px-2 py-1"
              style={{ top: 8, right: 8, zIndex: 10, background: '#f0b42920', border: '1px solid #f0b42944', borderRadius: 4 }}
            >
              <div style={{ width: 6, height: 6, borderRadius: 3, background: '#f0b429' }} className="animate-pulse" />
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#f0b429' }}>REPLAY</span>
              <button onClick={() => chart.setReplayMode(false)} style={{ color: '#6b7385', fontSize: 12 }}>✕</button>
            </div>
          )}

          {/* FAB — Nueva Orden */}
          <button
            onClick={() => setOrderSheetOpen(true)}
            className="absolute flex items-center gap-2 select-none active:scale-95 transition-transform"
            style={{
              bottom: 16, right: 16, zIndex: 10,
              height: 48, paddingLeft: 18, paddingRight: 20,
              background: 'linear-gradient(135deg, #1e7d44 0%, #2dcc6f 100%)',
              borderRadius: 24,
              boxShadow: '0 4px 20px rgba(45,204,111,0.4)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>Nueva Orden</span>
          </button>
        </div>

        {/* History */}
        {activeTab === 'history' && (
          <div className="flex flex-col h-full">
            <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid #1d2029' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e8ecf4' }}>Historial de Trades</h2>
              <p style={{ fontSize: 11, color: '#6b7385', marginTop: 2 }}>
                {openTrades.length} posiciones abiertas
              </p>
            </div>
            <MobileHistoryPage />
          </div>
        )}

        {/* Stats */}
        {activeTab === 'stats' && (
          <div className="flex flex-col h-full">
            <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid #1d2029' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e8ecf4' }}>Estadísticas</h2>
              <p style={{ fontSize: 11, color: '#6b7385', marginTop: 2 }}>FTMO + trading analytics</p>
            </div>
            <MobileStatsPage />
          </div>
        )}

        {/* Account */}
        {activeTab === 'account' && (
          <div className="flex flex-col h-full">
            <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid #1d2029' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e8ecf4' }}>Mi Cuenta</h2>
            </div>
            <MobileAccountPage />
          </div>
        )}
      </div>

      <MobileBottomNav
        active={activeTab}
        onChange={handleTabChange}
        openCount={openTrades.length}
      />

      <MobileOrderSheet
        open={orderSheetOpen}
        onClose={() => setOrderSheetOpen(false)}
      />
    </div>
  );
}

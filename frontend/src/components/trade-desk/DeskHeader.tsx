'use client';
import { usePricesStore } from '@/store/prices.store';
import type { DeskOverview } from '@/types/trade-desk';

interface Props {
  overview: DeskOverview | null;
  reviewQueueCount: number;
}

export function DeskHeader({ overview, reviewQueueCount }: Props) {
  const price = usePricesStore((s) => s.currentPrice);
  const bid   = price ? price - 0.10 : null;
  const ask   = price ? price + 0.10 : null;

  const total = overview?.orderSummary
    ? Object.values(overview.orderSummary).reduce((a, b) => a + b, 0)
    : 0;

  const netBuy  = overview?.recentOrders?.filter((o) => o.side === 'BUY').reduce((s, o) => s + o.quantity, 0) ?? 0;
  const netSell = overview?.recentOrders?.filter((o) => o.side === 'SELL').reduce((s, o) => s + o.quantity, 0) ?? 0;
  const netFlow = netBuy - netSell;

  return (
    <div
      className="flex items-center gap-0 border-b text-xs font-mono select-none overflow-x-auto"
      style={{
        background: 'linear-gradient(180deg, #0d0e12 0%, #09090d 100%)',
        borderColor: '#2c2410',
        minHeight: 40,
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-r shrink-0"
        style={{ borderColor: '#2c2410' }}
      >
        <span style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 2 }} className="uppercase font-bold">
          ◆ Bullion Desk
        </span>
      </div>

      {/* XAUUSD ticker */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-r shrink-0"
        style={{ borderColor: '#2c2410' }}
      >
        <span style={{ color: '#e8c96d', fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>XAUUSD</span>
        <span style={{ color: '#6b7385', fontSize: 10 }}>GOLD SPOT</span>
      </div>

      {/* Bid / Ask / Spread */}
      {bid !== null && (
        <>
          <div className="flex items-center gap-1 px-3 py-2 shrink-0">
            <span style={{ color: '#6b7385' }}>BID</span>
            <span style={{ color: '#2dcc6f', fontWeight: 600 }}>{bid.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-2 shrink-0">
            <span style={{ color: '#6b7385' }}>ASK</span>
            <span style={{ color: '#e84040', fontWeight: 600 }}>{ask!.toFixed(2)}</span>
          </div>
          <div
            className="flex items-center gap-1 px-3 py-2 border-r shrink-0"
            style={{ borderColor: '#2c2410' }}
          >
            <span style={{ color: '#6b7385' }}>SPD</span>
            <span style={{ color: '#c9a84c' }}>0.20</span>
          </div>
        </>
      )}

      {/* Session */}
      <div
        className="flex items-center gap-1 px-3 py-2 border-r shrink-0"
        style={{ borderColor: '#2c2410' }}
      >
        <span style={{ color: '#6b7385' }}>SESSION</span>
        <span style={{ color: '#c8cdd8' }}>LONDON</span>
      </div>

      {/* Net flow */}
      <div
        className="flex items-center gap-1 px-3 py-2 border-r shrink-0"
        style={{ borderColor: '#2c2410' }}
      >
        <span style={{ color: '#6b7385' }}>NET FLOW</span>
        <span style={{ color: netFlow >= 0 ? '#2dcc6f' : '#e84040', fontWeight: 600 }}>
          {netFlow >= 0 ? '+' : ''}{netFlow.toFixed(0)} oz {netFlow >= 0 ? 'BUY' : 'SELL'}
        </span>
      </div>

      {/* Review queue */}
      <div
        className="flex items-center gap-1 px-3 py-2 border-r shrink-0"
        style={{ borderColor: '#2c2410' }}
      >
        <span style={{ color: '#6b7385' }}>REVIEW QUEUE</span>
        <span
          style={{
            color: reviewQueueCount > 0 ? '#f0b429' : '#6b7385',
            fontWeight: reviewQueueCount > 0 ? 700 : 400,
          }}
        >
          {reviewQueueCount}
        </span>
      </div>

      {/* User role badge */}
      {overview && overview.memberships.length > 0 && (
        <div className="flex items-center gap-1 px-3 py-2 shrink-0">
          <span style={{ color: '#6b7385' }}>ROLE</span>
          <span
            style={{
              color: '#c9a84c',
              border: '1px solid #2c2410',
              padding: '1px 6px',
              borderRadius: 2,
              fontSize: 9,
              letterSpacing: 1,
            }}
          >
            {overview.memberships[0].role}
          </span>
        </div>
      )}

      <div className="flex-1" />

      {/* Total orders */}
      <div className="px-4 py-2 shrink-0">
        <span style={{ color: '#6b7385' }}>{total} orders · </span>
        <span style={{ color: '#8893a8' }}>Internal Spot Reference</span>
      </div>
    </div>
  );
}

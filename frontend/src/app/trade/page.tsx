'use client';
import { useState, useEffect, useCallback } from 'react';
import { AppShell }         from '@/components/layout/AppShell';
import { PriceChart }       from '@/components/charts/PriceChart';
import { SimulationResultPanel } from '@/components/trade/SimulationResult';
import { DeskHeader }       from '@/components/trade-desk/DeskHeader';
import { DeskOrderEntry }   from '@/components/trade-desk/DeskOrderEntry';
import { OrderBlotter }     from '@/components/trade-desk/OrderBlotter';
import { AuditPanel }       from '@/components/trade-desk/AuditPanel';
import { usePricesStore }   from '@/store/prices.store';
import { useReplay }        from '@/hooks/useReplay';
import { useOpenTradeLines } from '@/hooks/useOpenTradeLines';
import { tradeDeskApi }     from '@/lib/trade-desk-api';
import { useAuthStore }     from '@/store/auth.store';
import type { DeskOverview, TradeOrder, BookRole } from '@/types/trade-desk';
import type { SimulationResult } from '@/types';

// ─── Right sidebar tabs ───────────────────────────────────────────────────────
type RightTab = 'ORDER' | 'AUDIT';

function TradeInner() {
  const allCandles = usePricesStore((s) => s.candles);
  const { accessToken } = useAuthStore();

  useReplay(allCandles);
  useOpenTradeLines();

  // Simulator (legacy)
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  // Desk state
  const [overview,  setOverview]  = useState<DeskOverview | null>(null);
  const [orders,    setOrders]    = useState<TradeOrder[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [rightTab,  setRightTab]  = useState<RightTab>('ORDER');

  const loadDesk = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [ov, ords] = await Promise.all([
        tradeDeskApi.getOverview(),
        tradeDeskApi.listOrders(),
      ]);
      setOverview(ov);
      setOrders(ords);
    } catch {
      // user may not be in any book yet — that's fine
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => { loadDesk(); }, [loadDesk]);

  function handleOrderCreated(order: TradeOrder) {
    setOrders((prev) => [order, ...prev]);
    loadDesk();
  }

  function handleOrderUpdated(updated: TradeOrder) {
    setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o));
    loadDesk();
  }

  const myEmail   = overview?.currentUserEmail ?? '';
  const myRole: BookRole = overview?.memberships[0]?.role ?? 'VIEWER';
  const reviewQueueCount = orders.filter((o) => o.status === 'SUBMITTED').length;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ background: '#07080b' }}>
      {/* Gold desk header strip */}
      <DeskHeader overview={overview} reviewQueueCount={reviewQueueCount} />

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Chart area — 65% */}
        <div className="flex-1 min-w-0 overflow-hidden" style={{ borderRight: '1px solid #1d2029' }}>
          <PriceChart />
          {simResult && (
            <SimulationResultPanel result={simResult} onClose={() => setSimResult(null)} />
          )}
        </div>

        {/* Right sidebar — 320px */}
        <div className="w-80 shrink-0 flex flex-col overflow-hidden" style={{ background: '#0b0d11' }}>
          {/* Tab switcher */}
          <div
            className="flex border-b shrink-0"
            style={{ borderColor: '#1d2029' }}
          >
            {(['ORDER', 'AUDIT'] as RightTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className="flex-1 py-2 text-xs font-mono uppercase tracking-widest transition-colors"
                style={{
                  borderBottom: `2px solid ${rightTab === tab ? '#c9a84c' : 'transparent'}`,
                  color: rightTab === tab ? '#c9a84c' : '#6b7385',
                  background: 'transparent',
                }}
              >
                {tab === 'ORDER' ? '◆ Order Entry' : '◎ Audit'}
                {tab === 'AUDIT' && overview?.findings && overview.findings.length > 0 && (
                  <span style={{ color: '#f0b429', marginLeft: 4 }}>!</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {rightTab === 'ORDER' ? (
              <DeskOrderEntry
                memberships={overview?.memberships ?? []}
                onOrderCreated={handleOrderCreated}
              />
            ) : (
              <AuditPanel overview={overview} loading={loading} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom blotter — fixed height */}
      <div
        className="shrink-0 overflow-hidden"
        style={{ height: 220, borderTop: '1px solid #1d2029' }}
      >
        <OrderBlotter
          orders={orders}
          myEmail={myEmail}
          myRole={myRole}
          onUpdate={handleOrderUpdated}
        />
      </div>
    </div>
  );
}

export default function TradePage() {
  return (
    <AppShell>
      <TradeInner />
    </AppShell>
  );
}

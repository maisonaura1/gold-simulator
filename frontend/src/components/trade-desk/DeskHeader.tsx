'use client';
import { useState, useRef } from 'react';
import { usePricesStore } from '@/store/prices.store';
import type { DeskOverview } from '@/types/trade-desk';

// ─── Fixed-position tooltip (avoids overflow-x:auto clipping) ────────────────
function HTip({ children, tip }: { children: React.ReactNode; tip: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);

  function handleEnter() {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.bottom + 6 });
  }

  return (
    <>
      <span
        ref={anchorRef}
        style={{ display: 'inline-flex', alignItems: 'center', cursor: 'help' }}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setPos(null)}
      >
        {children}
        <span style={{
          color: '#4a6cf7', fontSize: 8, marginLeft: 3, opacity: 0.6, userSelect: 'none', lineHeight: 1,
        }}>ⓘ</span>
      </span>

      {pos && (
        <span style={{
          position: 'fixed', top: pos.y, left: pos.x, transform: 'translateX(-50%)',
          background: '#0e1118', border: '1px solid #c9a84c55',
          padding: '8px 11px', borderRadius: 3, fontSize: 10, color: '#c8cdd8',
          lineHeight: 1.6, whiteSpace: 'normal', width: 240, zIndex: 99999,
          pointerEvents: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.75)',
        }}>
          <span style={{
            position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)',
            width: 8, height: 8, background: '#0e1118', border: '1px solid #c9a84c55',
            borderBottom: 'none', borderRight: 'none', rotate: '45deg',
          }} />
          {tip}
        </span>
      )}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
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
      <div className="flex items-center gap-2 px-4 py-2 border-r shrink-0" style={{ borderColor: '#2c2410' }}>
        <HTip tip="El Bullion Desk es tu mesa de operaciones virtual para el oro (XAU). Aquí gestionas órdenes de compra y venta como lo haría un trader institucional.">
          <span style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 2 }} className="uppercase font-bold">
            ◆ Bullion Desk
          </span>
        </HTip>
      </div>

      {/* XAUUSD ticker */}
      <div className="flex items-center gap-3 px-4 py-2 border-r shrink-0" style={{ borderColor: '#2c2410' }}>
        <HTip tip="XAUUSD = Oro (XAU) cotizado en dólares (USD). Si ves 4.147, significa que 1 onza troy de oro cuesta $4.147. Es el par de trading más popular del mercado de materias primas.">
          <span style={{ color: '#e8c96d', fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>XAUUSD</span>
        </HTip>
        <HTip tip="'Spot' significa precio de mercado actual, para entrega inmediata. Es distinto de los futuros, que son contratos para entregas en el futuro. En trading minorista siempre operas el precio spot.">
          <span style={{ color: '#6b7385', fontSize: 10 }}>GOLD SPOT</span>
        </HTip>
      </div>

      {/* Bid / Ask / Spread */}
      {bid !== null && (
        <>
          <div className="flex items-center gap-1 px-3 py-2 shrink-0">
            <HTip tip="BID (verde) = precio al que VENDES. El broker te compra a este precio. Si quieres abrir una operación SELL, tu orden se ejecuta al BID.">
              <span style={{ color: '#6b7385' }}>BID</span>
            </HTip>
            <span style={{ color: '#2dcc6f', fontWeight: 600 }}>{bid.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-2 shrink-0">
            <HTip tip="ASK (rojo) = precio al que COMPRAS. El broker te vende a este precio. Si quieres abrir una operación BUY, tu orden se ejecuta al ASK. El ASK siempre es mayor que el BID.">
              <span style={{ color: '#6b7385' }}>ASK</span>
            </HTip>
            <span style={{ color: '#e84040', fontWeight: 600 }}>{ask!.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-2 border-r shrink-0" style={{ borderColor: '#2c2410' }}>
            <HTip tip="SPD = Spread. Es la diferencia entre ASK y BID. Es el coste implícito de cada operación — el broker se queda con este margen. Cuanto menor el spread, mejor para ti. En oro real, el spread típico es 0.20–0.50 puntos.">
              <span style={{ color: '#6b7385' }}>SPD</span>
            </HTip>
            <span style={{ color: '#c9a84c' }}>0.20</span>
          </div>
        </>
      )}

      {/* Session */}
      <div className="flex items-center gap-1 px-3 py-2 border-r shrink-0" style={{ borderColor: '#2c2410' }}>
        <HTip tip="Las sesiones son los horarios de actividad de los principales mercados financieros mundiales. Londres (8-16h GMT) es la más activa para el oro. Nueva York (13-21h GMT) es la más volátil. La sesión determina la liquidez y amplitud de los movimientos.">
          <span style={{ color: '#6b7385' }}>SESSION</span>
        </HTip>
        <span style={{ color: '#c8cdd8' }}>LONDON</span>
      </div>

      {/* Net flow */}
      <div className="flex items-center gap-1 px-3 py-2 border-r shrink-0" style={{ borderColor: '#2c2410' }}>
        <HTip tip="NET FLOW = flujo neto de órdenes en tu mesa. Es la diferencia entre el volumen total comprado y vendido (en onzas). Positivo (verde, BUY) = más compradores que vendedores en la mesa. Negativo (rojo, SELL) = más presión vendedora. Es un indicador de sentimiento interno.">
          <span style={{ color: '#6b7385' }}>NET FLOW</span>
        </HTip>
        <span style={{ color: netFlow >= 0 ? '#2dcc6f' : '#e84040', fontWeight: 600 }}>
          {netFlow >= 0 ? '+' : ''}{netFlow.toFixed(0)} oz {netFlow >= 0 ? 'BUY' : 'SELL'}
        </span>
      </div>

      {/* Review queue */}
      <div className="flex items-center gap-1 px-3 py-2 border-r shrink-0" style={{ borderColor: '#2c2410' }}>
        <HTip tip="REVIEW QUEUE = cola de órdenes pendientes de revisión. En el flujo de trabajo del Bullion Desk, un TRADER puede crear una orden pero necesita que un MANAGER la apruebe antes de ejecutarse. Si ves un número aquí, hay órdenes esperando aprobación.">
          <span style={{ color: '#6b7385' }}>REVIEW QUEUE</span>
        </HTip>
        <span style={{
          color: reviewQueueCount > 0 ? '#f0b429' : '#6b7385',
          fontWeight: reviewQueueCount > 0 ? 700 : 400,
        }}>
          {reviewQueueCount}
        </span>
      </div>

      {/* User role badge */}
      {overview && overview.memberships.length > 0 && (
        <div className="flex items-center gap-1 px-3 py-2 shrink-0">
          <HTip tip="Tu ROL en esta mesa de operaciones: OWNER = dueño de la mesa, puede todo. MANAGER = aprueba y rechaza órdenes. TRADER = crea órdenes que requieren aprobación. VIEWER = solo lectura, no puede crear órdenes. AUDITOR = acceso de revisión.">
            <span style={{ color: '#6b7385' }}>ROLE</span>
          </HTip>
          <span style={{
            color: '#c9a84c', border: '1px solid #2c2410',
            padding: '1px 6px', borderRadius: 2, fontSize: 9, letterSpacing: 1,
          }}>
            {overview.memberships[0].role}
          </span>
        </div>
      )}

      <div className="flex-1" />

      <div className="px-4 py-2 shrink-0">
        <span style={{ color: '#6b7385' }}>{total} orders · </span>
        <span style={{ color: '#8893a8' }}>Internal Spot Reference</span>
      </div>
    </div>
  );
}

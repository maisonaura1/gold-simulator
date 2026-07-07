'use client';
import { useState } from 'react';
import { tradeDeskApi } from '@/lib/trade-desk-api';
import type { TradeOrder, DeskStatus, BookRole } from '@/types/trade-desk';

interface Props {
  orders:   TradeOrder[];
  myEmail:  string;
  myRole:   BookRole;
  onUpdate: (order: TradeOrder) => void;
}

const STATUS_COLORS: Record<DeskStatus, { bg: string; text: string; border: string }> = {
  DRAFT:     { bg: '#141720', text: '#8893a8', border: '#1d2029' },
  SUBMITTED: { bg: '#1a1508', text: '#f0b429', border: '#2c2410' },
  APPROVED:  { bg: '#0a1a0e', text: '#2dcc6f', border: '#0f3018' },
  REJECTED:  { bg: '#1a0a0a', text: '#e84040', border: '#3a1a1a' },
};

const TABS: DeskStatus[] = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'];

export function OrderBlotter({ orders, myEmail, myRole, onUpdate }: Props) {
  const [activeTab, setActiveTab]     = useState<DeskStatus | 'ALL'>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError]     = useState<string | null>(null);

  const filtered = activeTab === 'ALL' ? orders : orders.filter((o) => o.status === activeTab);

  async function handleSubmit(orderId: string) {
    setActionLoading(orderId);
    setActionError(null);
    try {
      const updated = await tradeDeskApi.submitOrder(orderId);
      onUpdate(updated);
    } catch (e: unknown) {
      setActionError((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Action failed.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReview(orderId: string, action: 'APPROVE' | 'REJECT') {
    setActionLoading(orderId + action);
    setActionError(null);
    try {
      const updated = await tradeDeskApi.reviewOrder(orderId, { action });
      onUpdate(updated);
    } catch (e: unknown) {
      setActionError((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Action failed.');
    } finally {
      setActionLoading(null);
    }
  }

  const canReview = myRole === 'OWNER' || myRole === 'AUDITOR';

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: '#0b0d11' }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-0 border-b px-2 shrink-0"
        style={{ borderColor: '#1d2029', height: 32 }}
      >
        {(['ALL', ...TABS] as (DeskStatus | 'ALL')[]).map((tab) => {
          const count = tab === 'ALL' ? orders.length : orders.filter((o) => o.status === tab).length;
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 h-full font-mono uppercase tracking-widest border-b-2 transition-colors"
              style={{
                fontSize: 11,
                borderColor: active ? '#c9a84c' : 'transparent',
                color: active ? '#c9a84c' : '#6b7385',
              }}
            >
              {tab}{count > 0 && <span style={{ color: active ? '#c9a84c88' : '#3a3f4d', marginLeft: 3 }}>·{count}</span>}
            </button>
          );
        })}

        {actionError && (
          <span className="ml-auto text-xs" style={{ color: '#e84040' }}>{actionError}</span>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-16">
            <span style={{ color: '#3a3f4d', fontSize: 12, letterSpacing: 1 }}>— Sin órdenes en esta cola —</span>
          </div>
        ) : (
          <table className="w-full text-xs font-mono" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1d2029' }}>
                {['STATUS', 'SIDE', 'XAUUSD', 'OUNCES', 'NOTIONAL', 'CREATOR', 'APPROVER', 'TIMESTAMP', 'ACTIONS'].map((h) => (
                  <th key={h} className="text-left px-3 py-1.5" style={{ color: '#6b7385', fontWeight: 400, letterSpacing: 1, fontSize: 9 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const sc = STATUS_COLORS[order.status];
                const isMyOrder = order.creatorEmail === myEmail;
                const submitted = actionLoading === order.id;
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid #13151c' }}
                    className="hover:bg-desk-hover transition-colors"
                  >
                    {/* Status */}
                    <td className="px-3 py-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs uppercase tracking-widest"
                        style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                      >
                        {order.status}
                      </span>
                    </td>
                    {/* Side */}
                    <td className="px-3 py-2">
                      <span style={{ color: order.side === 'BUY' ? '#2dcc6f' : '#e84040', fontWeight: 700 }}>
                        {order.side === 'BUY' ? '▲' : '▼'} {order.side}
                      </span>
                    </td>
                    {/* Symbol */}
                    <td className="px-3 py-2" style={{ color: '#e8c96d' }}>{order.symbol}</td>
                    {/* Qty */}
                    <td className="px-3 py-2" style={{ color: '#c8cdd8' }}>{order.quantity.toFixed(1)} oz</td>
                    {/* Notional */}
                    <td className="px-3 py-2" style={{ color: '#c9a84c' }}>
                      ${(order.quantity * order.price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                    {/* Creator */}
                    <td className="px-3 py-2" style={{ color: isMyOrder ? '#c9a84c' : '#8893a8' }}>
                      {isMyOrder ? '● ' : ''}{order.creatorEmail.split('@')[0]}
                    </td>
                    {/* Approver */}
                    <td className="px-3 py-2" style={{ color: '#6b7385' }}>
                      {order.approvedByEmail ? order.approvedByEmail.split('@')[0] : '—'}
                    </td>
                    {/* Timestamp */}
                    <td className="px-3 py-2" style={{ color: '#6b7385', fontSize: 9 }}>
                      {new Date(order.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    {/* Actions */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {order.status === 'DRAFT' && (isMyOrder || myRole === 'OWNER') && (
                          <button
                            onClick={() => handleSubmit(order.id)}
                            disabled={submitted}
                            className="px-2 py-0.5 rounded text-xs uppercase tracking-widest"
                            style={{
                              background: '#1a1508', color: '#f0b429',
                              border: '1px solid #2c2410', cursor: 'pointer',
                              opacity: submitted ? 0.5 : 1,
                            }}
                          >
                            {submitted ? '…' : 'Submit'}
                          </button>
                        )}
                        {order.status === 'SUBMITTED' && canReview && !isMyOrder && (
                          <>
                            <button
                              onClick={() => handleReview(order.id, 'APPROVE')}
                              disabled={!!actionLoading}
                              className="px-2 py-0.5 rounded text-xs uppercase tracking-widest"
                              style={{ background: '#0a1a0e', color: '#2dcc6f', border: '1px solid #0f3018', cursor: 'pointer' }}
                            >
                              {actionLoading === order.id + 'APPROVE' ? '…' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReview(order.id, 'REJECT')}
                              disabled={!!actionLoading}
                              className="px-2 py-0.5 rounded text-xs uppercase tracking-widest"
                              style={{ background: '#1a0a0a', color: '#e84040', border: '1px solid #3a1a1a', cursor: 'pointer' }}
                            >
                              {actionLoading === order.id + 'REJECT' ? '…' : 'Reject'}
                            </button>
                          </>
                        )}
                        {order.status === 'SUBMITTED' && canReview && isMyOrder && (
                          <span style={{ color: '#3a3f4d', fontSize: 9 }}>Self-approval blocked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

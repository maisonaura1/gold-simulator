'use client';
import type { DeskOverview, DeskStatus } from '@/types/trade-desk';

interface Props {
  overview: DeskOverview | null;
  loading:  boolean;
}

const STATUS_DOT: Record<DeskStatus, string> = {
  DRAFT:     '#6b7385',
  SUBMITTED: '#f0b429',
  APPROVED:  '#2dcc6f',
  REJECTED:  '#e84040',
};

export function AuditPanel({ overview, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span style={{ color: '#3a3f4d', fontSize: 11, letterSpacing: 2 }} className="font-mono uppercase">Loading audit…</span>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <span style={{ color: '#c9a84c', fontSize: 20 }}>◆</span>
        <p style={{ color: '#6b7385', fontSize: 11 }} className="font-mono">No membership found</p>
      </div>
    );
  }

  const summary = overview.orderSummary ?? {};
  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-0 overflow-y-auto h-full">
      {/* Header */}
      <div
        className="px-4 py-2.5 border-b shrink-0"
        style={{ borderColor: '#1d2029' }}
      >
        <span style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 2 }} className="font-mono uppercase font-bold">
          Audit · Control
        </span>
      </div>

      {/* Findings */}
      {overview.findings.length > 0 && (
        <div className="px-3 py-2 shrink-0" style={{ borderBottom: '1px solid #1d2029' }}>
          <p style={{ color: '#f0b429', fontSize: 9, letterSpacing: 2 }} className="font-mono uppercase mb-1.5">
            ⚠ Findings
          </p>
          {overview.findings.map((f, i) => (
            <div
              key={i}
              className="text-xs px-2 py-1 rounded mb-1 font-mono"
              style={{ background: '#1a0e00', color: '#f0b429', border: '1px solid #2c1e00' }}
            >
              {f}
            </div>
          ))}
        </div>
      )}
      {overview.findings.length === 0 && (
        <div className="px-3 py-2 shrink-0" style={{ borderBottom: '1px solid #1d2029' }}>
          <div
            className="text-xs px-2 py-1.5 rounded font-mono"
            style={{ background: '#080e0a', color: '#2dcc6f', border: '1px solid #0f2a14' }}
          >
            ✓ No integrity findings
          </div>
        </div>
      )}

      {/* Order summary */}
      <div className="px-3 py-2 shrink-0" style={{ borderBottom: '1px solid #1d2029' }}>
        <p style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2 }} className="font-mono uppercase mb-2">
          Order Summary
        </p>
        <div className="grid grid-cols-2 gap-1">
          {(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'] as DeskStatus[]).map((s) => (
            <div
              key={s}
              className="flex items-center justify-between px-2 py-1.5 rounded"
              style={{ background: '#0f1117', border: '1px solid #1d2029' }}
            >
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <span style={{ color: STATUS_DOT[s], fontSize: 8 }}>●</span>
                <span style={{ color: '#8893a8', fontSize: 9, letterSpacing: 1 }}>{s}</span>
              </span>
              <span style={{ color: '#c8cdd8', fontWeight: 600 }} className="font-mono text-xs">
                {summary[s] ?? 0}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1 mt-1">
          <span style={{ color: '#6b7385', fontSize: 9 }} className="font-mono">TOTAL</span>
          <span style={{ color: '#c9a84c', fontSize: 9, fontWeight: 600 }} className="font-mono">{total}</span>
        </div>
      </div>

      {/* Membership / session */}
      <div className="px-3 py-2 shrink-0" style={{ borderBottom: '1px solid #1d2029' }}>
        <p style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2 }} className="font-mono uppercase mb-2">
          Session
        </p>
        <div className="flex justify-between text-xs font-mono mb-1">
          <span style={{ color: '#6b7385' }}>Actor</span>
          <span style={{ color: '#c8cdd8', fontSize: 9 }}>{overview.currentUserEmail}</span>
        </div>
        {overview.memberships.map((m) => (
          <div key={m.bookId} className="flex justify-between text-xs font-mono mb-0.5">
            <span style={{ color: '#6b7385', fontSize: 9 }}>{m.bookName}</span>
            <span
              style={{ color: '#c9a84c', fontSize: 9, letterSpacing: 1 }}
              className="px-1 rounded"
            >
              {m.role}
            </span>
          </div>
        ))}
      </div>

      {/* Recent approvals */}
      <div className="px-3 py-2 flex-1">
        <p style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2 }} className="font-mono uppercase mb-2">
          Approval Attribution
        </p>
        {overview.recentOrders
          .filter((o) => o.status === 'APPROVED')
          .slice(0, 5)
          .map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between px-2 py-1 rounded mb-1"
              style={{ background: '#0f1117', border: '1px solid #1d2029' }}
            >
              <span style={{ color: '#2dcc6f', fontSize: 9, fontWeight: 600 }} className="font-mono">
                {o.side} {o.quantity} oz
              </span>
              <span style={{ color: '#6b7385', fontSize: 9 }} className="font-mono">
                ← {o.approvedByEmail?.split('@')[0]}
              </span>
            </div>
          ))}
        {overview.recentOrders.filter((o) => o.status === 'APPROVED').length === 0 && (
          <p style={{ color: '#3a3f4d', fontSize: 9 }} className="font-mono">No approved orders yet</p>
        )}
      </div>
    </div>
  );
}

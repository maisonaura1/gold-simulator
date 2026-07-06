'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Props {
  onClose: () => void;
  used?:  number;
  limit?: number;
}

export function PaywallModal({ onClose, used = 0, limit = 10 }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const remaining = Math.max(0, limit - used);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleUpgrade() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{ url: string }>('/payments/checkout');
      window.location.href = res.data.url;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? 'Could not start checkout. Try again.';
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,8,11,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-sm overflow-hidden"
        style={{
          background: '#0d0f15',
          border: '1px solid #c9a84c33',
          boxShadow: '0 0 80px rgba(201,168,76,0.12)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#2c2410', background: '#0b0d11' }}>
          <div>
            <span style={{ color: '#c9a84c', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
              ◆ Unlock Pro Access
            </span>
            <div style={{ color: remaining === 0 ? '#e84040' : '#6b7385', fontSize: 10, marginTop: 2 }}>
              {remaining === 0
                ? `Free limit reached (${used}/${limit} simulations used)`
                : `${remaining} free simulation${remaining !== 1 ? 's' : ''} remaining`}
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#3a3f4d', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>
            ×
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Price display */}
          <div className="flex items-end gap-3">
            <div style={{ color: '#e8c96d', fontFamily: 'monospace', fontWeight: 800, fontSize: 40, lineHeight: 1 }}>
              €9.95
            </div>
            <div style={{ color: '#6b7385', fontSize: 11, paddingBottom: 4 }}>
              one-time · lifetime access
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-2">
            {[
              'Unlimited XAUUSD simulations',
              'Full analytics & equity curve',
              'Trader Score + coaching tips',
              'Trade journal & export',
              'All missions unlocked',
              'Priority support',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs" style={{ color: '#c8cdd8' }}>
                <span style={{ color: '#2dcc6f' }}>✓</span> {f}
              </li>
            ))}
          </ul>

          {/* Error */}
          {error && (
            <div className="px-3 py-2 rounded-sm text-xs"
              style={{ background: '#1a0808', border: '1px solid #7a1a1a', color: '#e84040' }}>
              ⚠ {error}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-3 rounded-sm font-bold text-sm tracking-wide"
            style={{
              background: loading ? '#141720' : 'linear-gradient(135deg,#c9a84c,#a8893c)',
              color: loading ? '#6b7385' : '#000',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Redirecting to Stripe…' : 'Unlock everything — €9.95'}
          </button>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-5 flex-wrap">
            {['Stripe secure', '30-day refund', 'iDEAL & card', 'Lifetime deal'].map((t) => (
              <span key={t} style={{ color: '#3a3f4d', fontSize: 9 }}>{t}</span>
            ))}
          </div>

          <button onClick={onClose}
            className="w-full py-2 rounded-sm text-xs"
            style={{ background: 'transparent', color: '#3a3f4d', border: 'none', cursor: 'pointer' }}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

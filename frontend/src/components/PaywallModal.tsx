'use client';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface Props {
  used: number;
  limit: number;
  onClose: () => void;
}

export function PaywallModal({ used, limit, onClose }: Props) {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleUpgrade() {
    try {
      const res = await api.post<{ url: string }>('/payments/checkout');
      window.location.href = res.data.url;
    } catch {
      alert('Could not start checkout. Please try again.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,8,11,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-sm overflow-hidden"
        style={{
          background: '#0d0f15',
          border: '1px solid #c9a84c44',
          boxShadow: '0 0 60px rgba(201,168,76,0.15)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: '#2c2410', background: '#0b0d11' }}
        >
          <div style={{ color: '#c9a84c', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
            ◆ Simulation limit reached
          </div>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Count */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center font-mono font-bold text-lg shrink-0"
              style={{ background: '#1a1508', border: '1px solid #2c2410', color: '#c9a84c' }}
            >
              {used}/{limit}
            </div>
            <div>
              <div style={{ color: '#e8ecf4', fontWeight: 600, fontSize: 13 }}>
                You've used {used} of {limit} free simulations
              </div>
              <div style={{ color: '#6b7385', fontSize: 11, marginTop: 2 }}>
                Unlock unlimited sessions with a one-time upgrade
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #1d2029' }} />

          {/* Pro features */}
          <div>
            <div style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
              Pro includes
            </div>
            <ul className="space-y-2">
              {[
                'Unlimited XAUUSD simulations',
                'Full analytics & equity curve',
                'Trader Score + coaching',
                'Trade journal & export',
                'All missions unlocked',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs" style={{ color: '#c8cdd8' }}>
                  <span style={{ color: '#2dcc6f' }}>✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            className="w-full py-3 rounded-sm font-bold text-sm tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #c9a84c, #a8893c)',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Unlock everything — €9.95
          </button>
          <p style={{ color: '#3a3f4d', fontSize: 9, textAlign: 'center' }}>
            One-time payment · Lifetime access · iDEAL & card
          </p>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-sm text-xs"
            style={{ background: 'transparent', color: '#6b7385', border: '1px solid #1d2029', cursor: 'pointer' }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface PaymentStatus {
  paid: boolean;
  trialActive: boolean;
  trialDaysLeft: number;
  simulationsUsed: number;
  simulationsLimit: number;
  canSimulate: boolean;
}

export function TrialBanner() {
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) return;
    api.get<PaymentStatus>('/payments/status')
      .then(r => setStatus(r.data))
      .catch(() => {});
  }, [isAuthenticated]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data } = await api.post<{ url: string }>('/payments/checkout');
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  if (!status || status.paid) return null;

  const limitReached = !status.canSimulate;
  const remaining = Math.max(0, status.simulationsLimit - status.simulationsUsed);

  if (limitReached) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(7,8,11,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#0d0f15',
            border: '1px solid #c9a84c44',
            borderRadius: 4,
            padding: '2rem',
            maxWidth: 380,
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 0 60px rgba(201,168,76,0.12)',
          }}
        >
          <div style={{ color: '#c9a84c', fontSize: 28, marginBottom: 12 }}>◆</div>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#e8ecf4', fontFamily: 'monospace' }}>
            Free tier limit reached
          </h2>
          <p style={{ fontSize: 12, color: '#6b7385', marginBottom: 20, lineHeight: 1.6 }}>
            You've used all {status.simulationsLimit} free simulations.
            Unlock unlimited access for a one-time payment.
          </p>
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #c9a84c, #a8893c)',
              color: '#000',
              border: 'none',
              borderRadius: 3,
              padding: '10px 24px',
              fontWeight: 700,
              fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              width: '100%',
            }}
          >
            {loading ? '...' : 'Unlock everything — €9.95'}
          </button>
          <p style={{ color: '#3a3f4d', fontSize: 10, marginTop: 8 }}>
            One-time · Lifetime access · iDEAL & card
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#0b0d11',
        borderBottom: '1px solid #1d2029',
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 11,
        color: '#6b7385',
      }}
    >
      <span style={{ fontFamily: 'monospace' }}>
        <span style={{ color: '#c9a84c' }}>{remaining}</span> free simulations remaining
      </span>
      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          background: 'transparent',
          border: '1px solid #2c2410',
          color: '#c9a84c',
          borderRadius: 2,
          padding: '2px 10px',
          fontSize: 10,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          fontFamily: 'monospace',
        }}
      >
        {loading ? '...' : 'Upgrade — €9.95'}
      </button>
    </div>
  );
}

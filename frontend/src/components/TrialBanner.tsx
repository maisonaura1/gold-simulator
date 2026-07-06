'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useT } from '@/hooks/useT';

interface PaymentStatus {
  paid: boolean;
  trialActive: boolean;
  trialDaysLeft: number;
}

export function TrialBanner() {
  const { isAuthenticated } = useAuthStore();
  const t = useT();
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

  const expired = !status.trialActive;

  return (
    <>
      {expired && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'var(--mt-toolbar)',
              border: '1px solid var(--mt-border)',
              borderRadius: 6,
              padding: '2rem',
              maxWidth: 420,
              width: '90%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏰</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--mt-text)' }}>
              {t.trialExpiredTitle}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--mt-text-muted, #888)', marginBottom: 20, lineHeight: 1.6 }}>
              {t.trialExpiredBody}
            </p>
            <button
              onClick={handlePay}
              disabled={loading}
              style={{
                background: '#f0b429',
                color: '#000',
                border: 'none',
                borderRadius: 4,
                padding: '10px 24px',
                fontWeight: 700,
                fontSize: 13,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '...' : t.trialPayBtn}
            </button>
          </div>
        </div>
      )}

      {!expired && (
        <div
          style={{
            background: 'var(--mt-toolbar)',
            borderBottom: '1px solid var(--mt-border)',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--mt-text-muted, #aaa)',
          }}
        >
          <span>{t.trialDaysLeft(status.trialDaysLeft)}</span>
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              background: 'transparent',
              border: '1px solid #f0b429',
              color: '#f0b429',
              borderRadius: 3,
              padding: '2px 10px',
              fontSize: 11,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '...' : t.trialUpgradeBtn}
          </button>
        </div>
      )}
    </>
  );
}

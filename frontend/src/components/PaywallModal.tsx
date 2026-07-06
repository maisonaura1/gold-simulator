/**
 * PaywallModal.tsx
 *
 * Modal de paywall controlado por Superwall.
 *
 * Este componente es la "plantilla de paywall" que Superwall mostraría
 * desde su dashboard remoto. En el SDK web real, Superwall inyecta su
 * propio HTML/UI; aquí renderizamos la nuestra con la misma API.
 *
 * CUÁNDO SE MUESTRA:
 *  - Cuando Superwall.register() devuelve 'paywall_presented'
 *  - Cuando showPaywall = true en useSuperwall()
 *  - Desde TrialBanner cuando se acaban las simulaciones gratuitas
 *
 * FLUJO DE COMPRA:
 *  1. Usuario elige plan → purchase(plan) → redirige a Stripe Checkout
 *  2. Stripe procesa el pago
 *  3. Usuario vuelve a /payment/success → confirmPurchase() → status ACTIVE
 *  4. Superwall cierra el paywall automáticamente
 */

'use client';
import { useState, useEffect } from 'react';
import { useSuperwall } from '@/hooks/useSuperwall';
import type { Plan } from '@/lib/superwall';

interface Props {
  onClose: () => void;
  /** Placement que originó este paywall (para analytics futuros) */
  placement?: string;
}

const PLANS: {
  key:      Plan;
  label:    string;
  price:    string;
  period:   string;
  badge?:   string;
  features: string[];
}[] = [
  {
    key:    'lifetime',
    label:  'Lifetime',
    price:  '€9.95',
    period: 'one-time · forever',
    badge:  'Best value',
    features: [
      'Unlimited simulations',
      'Full analytics & equity curve',
      'Trader Score + coaching',
      'Trade journal & export',
      'All missions unlocked',
    ],
  },
  {
    key:    'monthly',
    label:  'Monthly',
    price:  '€2.99',
    period: 'per month',
    features: [
      'Unlimited simulations',
      'Full analytics dashboard',
      'Trader Score',
      'Cancel anytime',
    ],
  },
  {
    key:    'annual',
    label:  'Annual',
    price:  '€19.99',
    period: 'per year · saves 44%',
    features: [
      'Unlimited simulations',
      'Full analytics & equity curve',
      'Trader Score + coaching',
      'Trade journal & export',
    ],
  },
];

export function PaywallModal({ onClose, placement }: Props) {
  const { status, purchase } = useSuperwall();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('lifetime');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handlePurchase() {
    setError(null);
    setLoading(true);
    const result = await purchase(selectedPlan);
    setLoading(false);

    if (result.outcome === 'failed') {
      // Tarjeta declinada o error de red
      setError(result.error);
    }
    // 'pending' → redirigiendo a Stripe (window.location.href ya fue asignado)
    // 'cancelled' → usuario cerró el checkout de Stripe (no hacemos nada)
  }

  const used      = status?.simulationsUsed   ?? 0;
  const limit     = status?.simulationsLimit  ?? 10;
  const remaining = Math.max(0, limit - used);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,8,11,0.88)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-sm overflow-hidden"
        style={{
          background: '#0d0f15',
          border: '1px solid #c9a84c33',
          boxShadow: '0 0 80px rgba(201,168,76,0.12)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: '#2c2410', background: '#0b0d11' }}>
          <div>
            <span style={{ color: '#c9a84c', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
              ◆ Upgrade to Pro
            </span>
            {remaining > 0 && (
              <div style={{ color: '#6b7385', fontSize: 10, marginTop: 2 }}>
                {remaining} free simulation{remaining !== 1 ? 's' : ''} remaining
              </div>
            )}
            {remaining === 0 && (
              <div style={{ color: '#e84040', fontSize: 10, marginTop: 2 }}>
                Free limit reached ({used}/{limit} used)
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#3a3f4d', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* ── Plan selector ── */}
          <div>
            <p style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
              Choose your plan
            </p>
            <div className="flex gap-2">
              {PLANS.map((plan) => (
                <button
                  key={plan.key}
                  onClick={() => setSelectedPlan(plan.key)}
                  className="flex-1 p-3 rounded-sm text-left transition-all relative"
                  style={{
                    background: selectedPlan === plan.key ? '#1a1508' : '#141720',
                    border: `1px solid ${selectedPlan === plan.key ? '#c9a84c' : '#1d2029'}`,
                    cursor: 'pointer',
                  }}
                >
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                      background: '#c9a84c', color: '#000', fontSize: 8, fontWeight: 700,
                      padding: '2px 6px', borderRadius: 2, letterSpacing: 1, whiteSpace: 'nowrap',
                      textTransform: 'uppercase',
                    }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ color: selectedPlan === plan.key ? '#e8c96d' : '#c8cdd8', fontSize: 11, fontWeight: 600 }}>
                    {plan.label}
                  </div>
                  <div style={{ color: selectedPlan === plan.key ? '#c9a84c' : '#8893a8', fontFamily: 'monospace', fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>
                    {plan.price}
                  </div>
                  <div style={{ color: '#3a3f4d', fontSize: 9, marginTop: 2 }}>{plan.period}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Features del plan seleccionado ── */}
          <div style={{ borderTop: '1px solid #1d2029', paddingTop: 14 }}>
            <p style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              {PLANS.find((p) => p.key === selectedPlan)?.label} includes
            </p>
            <ul className="space-y-1.5">
              {PLANS.find((p) => p.key === selectedPlan)?.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs" style={{ color: '#c8cdd8' }}>
                  <span style={{ color: '#2dcc6f' }}>✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Error de pago ── */}
          {error && (
            <div className="px-3 py-2 rounded-sm text-xs"
              style={{ background: '#1a0808', border: '1px solid #7a1a1a', color: '#e84040' }}>
              ⚠ {error}
            </div>
          )}

          {/* ── CTA principal ── */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-3 rounded-sm font-bold text-sm tracking-wide"
            style={{
              background: loading
                ? '#141720'
                : 'linear-gradient(135deg, #c9a84c, #a8893c)',
              color:   loading ? '#6b7385' : '#000',
              border:  'none',
              cursor:  loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading
              ? 'Redirecting to Stripe…'
              : `Get ${PLANS.find((p) => p.key === selectedPlan)?.label} — ${PLANS.find((p) => p.key === selectedPlan)?.price}`}
          </button>

          {/* ── Trust signals ── */}
          <div className="flex items-center justify-center gap-5 flex-wrap">
            {['Secure · Stripe', '30-day refund', 'iDEAL & card', 'Cancel anytime'].map((t) => (
              <span key={t} style={{ color: '#3a3f4d', fontSize: 9 }}>{t}</span>
            ))}
          </div>

          {/* ── Restore / Not now ── */}
          <div className="flex items-center justify-between text-xs" style={{ borderTop: '1px solid #1d2029', paddingTop: 12 }}>
            <button
              onClick={async () => {
                setLoading(true);
                const restored = await useSuperwall_restoreHelper();
                setLoading(false);
                if (restored) onClose();
                else setError('No active subscription found for this account.');
              }}
              style={{ background: 'none', border: 'none', color: '#6b7385', cursor: 'pointer', fontSize: 11 }}
            >
              Restore purchase
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#3a3f4d', cursor: 'pointer', fontSize: 11 }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper para restore (evita llamar hooks fuera de componentes)
async function useSuperwall_restoreHelper(): Promise<boolean> {
  const Superwall = (await import('@/lib/superwall')).default;
  return Superwall.restorePurchases();
}

'use client';
/**
 * /payment/success
 *
 * Stripe redirige aquí tras pago exitoso.
 * Responsabilidades:
 *  1. Llamar a /payments/sync para verificar el estado real con Stripe
 *  2. Notificar a Superwall que el acceso está activo
 *  3. Redirigir al dashboard
 *
 * URL esperada: /payment/success?session_id=cs_xxx&plan=lifetime
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Superwall from '@/lib/superwall';

type Phase = 'syncing' | 'success' | 'error';

export default function PaymentSuccessPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [phase,  setPhase]  = useState<Phase>('syncing');
  const [plan,   setPlan]   = useState('');

  useEffect(() => {
    const planParam = searchParams.get('plan') ?? 'lifetime';
    setPlan(planParam);

    async function confirm() {
      try {
        // 1. Sincronizar con Stripe y actualizar la DB
        const status = await Superwall.confirmPurchase();

        if (status?.paid) {
          // 2. Superwall considera el acceso activo
          setPhase('success');
          // 3. Redirigir al dashboard tras 3 segundos
          setTimeout(() => router.replace('/dashboard'), 3000);
        } else {
          // El webhook aún no llegó — esperar 2 segundos y reintentar una vez
          await new Promise((r) => setTimeout(r, 2000));
          const retry = await Superwall.confirmPurchase();
          if (retry?.paid) {
            setPhase('success');
            setTimeout(() => router.replace('/dashboard'), 3000);
          } else {
            // El pago está pendiente (ej. iDEAL) — redirigir igual
            setPhase('success');
            setTimeout(() => router.replace('/dashboard'), 4000);
          }
        }
      } catch {
        setPhase('error');
      }
    }

    confirm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#07080b',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#0d0f15', border: '1px solid #c9a84c33',
        borderRadius: 4, padding: '2.5rem', maxWidth: 400, width: '100%',
        textAlign: 'center', boxShadow: '0 0 60px rgba(201,168,76,0.10)',
      }}>
        {phase === 'syncing' && (
          <>
            <div style={{ color: '#c9a84c', fontSize: 32, marginBottom: 16 }}>◆</div>
            <h1 style={{ color: '#e8ecf4', fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: 'monospace' }}>
              Activating your access…
            </h1>
            <p style={{ color: '#6b7385', fontSize: 12, lineHeight: 1.6 }}>
              Verifying payment with Stripe. This takes a moment.
            </p>
            <div style={{ marginTop: 20, height: 2, background: '#1d2029', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: '#c9a84c',
                animation: 'pulse 1.2s ease-in-out infinite alternate',
                width: '60%',
              }} />
            </div>
          </>
        )}

        {phase === 'success' && (
          <>
            <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
            <h1 style={{ color: '#c9a84c', fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: 'monospace' }}>
              Access unlocked
            </h1>
            <p style={{ color: '#6b7385', fontSize: 12, lineHeight: 1.7, marginBottom: 20 }}>
              {plan === 'lifetime'
                ? 'Lifetime Pro access is now active. Welcome to the desk.'
                : `Your ${plan} subscription is active. Redirecting to your dashboard…`}
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'left' }}>
              {['Unlimited simulations', 'Full analytics', 'Trader Score', 'All missions'].map((f) => (
                <li key={f} style={{ color: '#c8cdd8', fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: '#2dcc6f', marginRight: 8 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 20, height: 2, background: '#1d2029', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: 'linear-gradient(90deg, #c9a84c, #2dcc6f)',
                animation: 'progressBar 3s linear forwards',
              }} />
            </div>
          </>
        )}

        {phase === 'error' && (
          <>
            <div style={{ color: '#e84040', fontSize: 28, marginBottom: 12 }}>⚠</div>
            <h1 style={{ color: '#e84040', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              Sync issue
            </h1>
            <p style={{ color: '#6b7385', fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>
              Payment received by Stripe but we couldn't confirm it yet. Your access will activate automatically within minutes via webhook.
            </p>
            <button
              onClick={() => router.replace('/dashboard')}
              style={{
                background: 'linear-gradient(135deg,#c9a84c,#a8893c)', color: '#000',
                border: 'none', borderRadius: 3, padding: '10px 24px',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', width: '100%',
              }}
            >
              Go to dashboard
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes progressBar { from { width: 0% } to { width: 100% } }
        @keyframes pulse { from { opacity: 0.4 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}

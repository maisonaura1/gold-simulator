'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useAuthReady } from '@/hooks/useAuth';
import { useBilling } from '@/store/billing.store';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function PaymentSuccessPage() {
  const { ready, authed } = useAuthReady();
  const [phase, setPhase] = useState<'checking' | 'active' | 'pending'>('checking');

  useEffect(() => {
    if (!ready) return;
    if (!authed) {
      setPhase('pending');
      return;
    }
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 4 && !cancelled; i++) {
        const s = await useBilling.getState().confirmPurchase();
        if (s?.paid) return !cancelled && setPhase('active');
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!cancelled) setPhase('pending');
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, authed]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-4">
      <Logo />
      <div className="card card-pad mt-8 w-full max-w-md text-center">
        {phase === 'checking' ? (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold-400" />
            <h1 className="mt-4 text-[20px] font-semibold text-fg">Activando tu plan Pro…</h1>
            <p className="mt-1 text-[14px] text-fg-muted">Estamos confirmando el pago con Stripe. Tarda unos segundos.</p>
          </>
        ) : (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />
            <h1 className="mt-4 text-[20px] font-semibold text-fg">{phase === 'active' ? '¡Ya eres Pro!' : 'Pago recibido'}</h1>
            <p className="mt-1 text-[14px] text-fg-muted">
              {phase === 'active'
                ? 'Tienes simulaciones ilimitadas y todas las prácticas desbloqueadas.'
                : 'Tu acceso Pro se activará automáticamente en unos minutos. Si no lo ves, recarga la página o escríbenos.'}
            </p>
            <ButtonLink href="/dashboard" block className="mt-6">
              Ir a mi panel
            </ButtonLink>
          </>
        )}
      </div>
    </div>
  );
}

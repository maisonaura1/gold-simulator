'use client';
import { useState } from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { PLANS, type PlanInfo } from '@/lib/plans';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useBilling } from '@/store/billing.store';

/** Tarjetas de planes de pago. Con `hrefPrefix` enlazan (landing: prefijo + id del plan); si no, abren Stripe. */
export function PlanCards({ hrefPrefix, compact }: { hrefPrefix?: string; compact?: boolean }) {
  const checkout = useBilling((s) => s.checkout);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  const buy = async (plan: PlanInfo['id']) => {
    setBusy(plan);
    setError('');
    const err = await checkout(plan);
    if (err) {
      setError(err);
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={clsx(
              'relative flex flex-col rounded-2xl border p-5',
              p.highlight ? 'border-gold-400/60 bg-gradient-to-b from-gold-500/[0.10] to-ink-850 shadow-glow' : 'border-ink-700 bg-ink-850',
            )}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-5 rounded-full bg-gold-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-950">
                Más elegido
              </span>
            )}
            <div className="text-[15px] font-semibold text-fg">{p.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-[32px] font-bold tracking-tight num text-fg">{p.price}</span>
              <span className="text-[14px] text-fg-dim">{p.period}</span>
            </div>
            {p.note && <div className="text-[13px] text-gold-300">{p.note}</div>}
            {!compact && (
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[14px] text-fg-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5">
              {hrefPrefix ? (
                <ButtonLink href={`${hrefPrefix}${p.id}`} block variant={p.highlight ? 'primary' : 'secondary'}>
                  Elegir {p.name}
                </ButtonLink>
              ) : (
                <Button block variant={p.highlight ? 'primary' : 'secondary'} loading={busy === p.id} disabled={!!busy} onClick={() => buy(p.id)}>
                  Elegir {p.name}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-[14px] text-red-300">{error}</p>}
    </div>
  );
}

'use client';
import { Lock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { PlanCards } from './PlanCards';
import { useBilling } from '@/store/billing.store';
import { FREE_SIMULATIONS } from '@/lib/plans';

export function PaywallModal() {
  const { paywallOpen, paywallReason, closePaywall, status } = useBilling();
  const limit = status?.simulationsLimit ?? FREE_SIMULATIONS;

  return (
    <Modal open={paywallOpen} onClose={closePaywall} size="lg">
      <div className="mb-5 flex items-start gap-3 pr-6">
        <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 p-2.5 text-gold-300">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-[20px] font-semibold text-fg">
            {paywallReason === 'limit' ? `Has usado tus ${limit} simulaciones gratuitas` : 'Pásate a Pro'}
          </h2>
          <p className="mt-1 text-[14px] text-fg-muted">
            Con Pro practicas sin límite, completas todas las prácticas de la academia y llevas tu diario completo.
            Las lecciones siguen siendo gratis.
          </p>
        </div>
      </div>
      <PlanCards />
      <p className="mt-4 text-center text-[12px] text-fg-dim">Pago seguro con Stripe. Puedes cancelar la suscripción desde tu cuenta.</p>
    </Modal>
  );
}

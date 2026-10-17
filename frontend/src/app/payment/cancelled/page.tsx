import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export const metadata: Metadata = { title: 'Pago cancelado' };

export default function PaymentCancelledPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-4">
      <Logo />
      <div className="card card-pad mt-8 w-full max-w-md text-center">
        <h1 className="text-[20px] font-semibold text-fg">Pago cancelado</h1>
        <p className="mt-2 text-[14px] text-fg-muted">No se ha hecho ningún cargo. Puedes seguir con la academia gratis y pasarte a Pro cuando quieras.</p>
        <div className="mt-6 grid gap-2">
          <ButtonLink href="/dashboard" block>
            Volver a mi panel
          </ButtonLink>
          <ButtonLink href="/account" variant="secondary" block>
            Ver planes
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

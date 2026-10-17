import { ButtonLink } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-4 text-center">
      <Logo />
      <h1 className="mt-10 text-[28px] font-semibold text-fg">Esta página no existe</h1>
      <p className="mt-2 text-[15px] text-fg-muted">Puede que el enlace haya cambiado con la nueva versión de la app.</p>
      <div className="mt-6 flex gap-2">
        <ButtonLink href="/dashboard">Ir a mi panel</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Inicio
        </ButtonLink>
      </div>
    </div>
  );
}

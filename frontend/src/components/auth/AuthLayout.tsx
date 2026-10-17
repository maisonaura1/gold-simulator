import Link from 'next/link';
import { BookOpen, CandlestickChart, NotebookPen } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { GOOGLE_AUTH_URL } from '@/lib/config';

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ink-950">
      <aside className="relative hidden w-[440px] shrink-0 flex-col justify-between overflow-hidden border-r border-ink-750 bg-ink-900 p-10 lg:flex">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <Logo />
        <div className="relative">
          <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-fg">
            Aprende a operar oro <span className="gold-text">sin arriesgar tu dinero</span>
          </h2>
          <ul className="mt-8 space-y-5">
            {[
              { icon: BookOpen, t: 'Academia en 6 etapas', d: 'De qué es el XAU/USD a tu propio plan de trading.' },
              { icon: CandlestickChart, t: 'Simulador con datos reales', d: 'Practica cada lección con una cuenta demo de $10,000.' },
              { icon: NotebookPen, t: 'Diario automático', d: 'Tus estadísticas te dicen qué mejorar.' },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-3">
                <div className="rounded-xl border border-gold-500/25 bg-gold-500/10 p-2 text-gold-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-fg">{t}</div>
                  <div className="text-[14px] text-fg-muted">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[12px] text-fg-dim">Contenido educativo. Operar en los mercados conlleva riesgo de pérdida.</p>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10" style={{ paddingTop: 'calc(2.5rem + var(--safe-top))' }}>
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-[400px]">
          <h1 className="text-[26px] font-semibold tracking-tight text-fg">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[15px] text-fg-muted">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-[14px] text-fg-muted">{footer}</div>}
        </div>
        <Link href="/" className="mt-10 text-[13px] text-fg-dim hover:text-fg">
          ← Volver a la web
        </Link>
      </main>
    </div>
  );
}

export function GoogleButton() {
  return (
    <a
      href={GOOGLE_AUTH_URL}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-ink-600 bg-ink-850 text-[14px] font-semibold text-fg transition hover:bg-ink-800"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Continuar con Google
    </a>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-[12px] text-fg-dim">
      <span className="h-px flex-1 bg-ink-700" /> o con tu email <span className="h-px flex-1 bg-ink-700" />
    </div>
  );
}

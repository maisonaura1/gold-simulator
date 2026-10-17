'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Crown, Sparkles } from 'lucide-react';
import { useAuthReady } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { useBilling } from '@/store/billing.store';
import { useProgress } from '@/store/progress.store';
import { overallProgress } from '@/lib/catalog';
import { useCatalog } from '@/components/academy/CatalogProvider';
import { fmtUsd } from '@/lib/format';
import { FREE_SIMULATIONS, PLAN_LABEL } from '@/lib/plans';
import { Logo } from '@/components/ui/Logo';
import { ProgressBar } from '@/components/ui/Progress';
import { FullScreenLoader } from '@/components/ui/Spinner';
import { PaywallModal } from '@/components/billing/PaywallModal';
import type { SimAccount } from '@/types';
import { NAV } from './nav';

export function AppShell({ children, fullBleed = false }: { children: React.ReactNode; fullBleed?: boolean }) {
  const { ready, authed } = useAuthReady();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !authed) router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, authed, router, pathname]);

  useEffect(() => {
    if (!authed) return;
    void useBilling.getState().fetchStatus();
    void useProgress.getState().load();
  }, [authed]);

  if (!ready || !authed) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-ink-950">
      <Sidebar pathname={pathname} />
      <MobileHeader />
      <main className={clsx('lg:pl-64', fullBleed ? 'pb-20 lg:pb-0' : 'pb-28 lg:pb-12')}>
        {fullBleed ? children : <div className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 lg:px-10 lg:pt-10">{children}</div>}
      </main>
      <BottomNav pathname={pathname} />
      <PaywallModal />
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  const lessons = useProgress((s) => s.lessons);
  const catalog = useCatalog();
  const progress = overallProgress(catalog, lessons);
  const status = useBilling((s) => s.status);
  const openPaywall = useBilling((s) => s.openPaywall);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-ink-750 bg-ink-900/95 px-4 py-6 backdrop-blur lg:flex">
      <div className="px-2">
        <Logo href="/dashboard" />
      </div>
      <nav className="mt-8 space-y-1">
        {NAV.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition',
                active ? 'bg-gold-500/10 text-gold-200' : 'text-fg-muted hover:bg-ink-800 hover:text-fg',
              )}
            >
              <Icon className={clsx('h-[18px] w-[18px]', active ? 'text-gold-400' : 'text-fg-dim')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <Link href="/academy" className="block rounded-2xl border border-ink-700 bg-ink-850 p-4 transition hover:border-ink-600">
          <div className="flex items-center justify-between text-[12px] text-fg-dim">
            <span>Progreso en la academia</span>
            <span className="num font-semibold text-gold-300">{Math.round(progress.pct * 100)}%</span>
          </div>
          <ProgressBar value={progress.pct} className="mt-2.5" />
          <div className="mt-2 text-[12px] text-fg-dim">
            {progress.done} de {progress.total} lecciones
          </div>
        </Link>

        {status && !status.paid && (
          <button
            onClick={() => openPaywall('upgrade')}
            className="w-full rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-500/[0.14] to-transparent p-4 text-left transition hover:border-gold-400/60"
          >
            <div className="flex items-center gap-2 text-[14px] font-semibold text-gold-200">
              <Sparkles className="h-4 w-4" /> Pásate a Pro
            </div>
            <div className="mt-1 text-[12px] text-fg-muted">
              {Math.max(0, status.simulationsLimit - status.simulationsUsed)} de {status.simulationsLimit ?? FREE_SIMULATIONS} simulaciones
              gratis restantes
            </div>
          </button>
        )}
        {status?.paid && (
          <div className="flex items-center gap-2 rounded-2xl border border-ink-700 bg-ink-850 px-4 py-3 text-[13px] text-fg-muted">
            <Crown className="h-4 w-4 text-gold-400" /> {PLAN_LABEL[status.plan] ?? 'Pro'}
          </div>
        )}
      </div>
    </aside>
  );
}

function MobileHeader() {
  const { data: account } = useApi<SimAccount>('/account');
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-750 bg-ink-950/90 px-4 pb-3 backdrop-blur lg:hidden"
      style={{ paddingTop: 'calc(0.75rem + var(--safe-top))' }}
    >
      <Logo href="/dashboard" />
      {account && (
        <Link href="/journal" className="rounded-xl border border-ink-700 bg-ink-850 px-3 py-1.5 text-right">
          <div className="text-[10px] uppercase tracking-wide text-fg-dim">Balance demo</div>
          <div className="text-[14px] font-semibold num text-fg">{fmtUsd(account.currentBalance)}</div>
        </Link>
      )}
    </header>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-ink-750 bg-ink-900/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
      aria-label="Navegación principal"
    >
      {NAV.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium', active ? 'text-gold-300' : 'text-fg-dim')}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PageHeader({ eyebrow, title, text, action }: { eyebrow?: string; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-8">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-fg sm:text-[30px]">{title}</h1>
        {text && <p className="mt-1.5 max-w-2xl text-[15px] text-fg-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}

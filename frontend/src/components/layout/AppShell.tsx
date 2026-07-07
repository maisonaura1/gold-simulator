'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppToolbar } from './AppToolbar';
import { MarketWatch } from './MarketWatch';
import { Navigator } from './Navigator';
import { TerminalPanel } from './TerminalPanel';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { TrialBanner } from '@/components/TrialBanner';
import { PaywallModal } from '@/components/PaywallModal';
import { useAuthStore } from '@/store/auth.store';
import { useSocket } from '@/hooks/useSocket';
import { useT } from '@/hooks/useT';
import { useSuperwall } from '@/hooks/useSuperwall';
import Superwall from '@/lib/superwall';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);
  const t = useT();

  // Inicializar Superwall y exponer el paywall global
  const { showPaywall, closePaywall } = useSuperwall();

  useSocket();

  useEffect(() => {
    useAuthStore.persist.rehydrate();
    // Configurar Superwall con la API key (cuando exista SDK real)
    const superwallKey = process.env.NEXT_PUBLIC_SUPERWALL_API_KEY ?? '';
    if (superwallKey && !superwallKey.startsWith('pk_dev')) {
      Superwall.configure(superwallKey);
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('[Superwall] No production API key — paywall running in permissive mode. Set NEXT_PUBLIC_SUPERWALL_API_KEY in Vercel env vars.');
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !isAuthenticated()) {
      router.replace('/auth/login');
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated()) {
    return (
      <div className="h-full flex items-center justify-center bg-[var(--mt-bg)]">
        <div className="text-[var(--mt-text-dim)] text-xs font-mono animate-pulse">
          {t.appLoading}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--mt-bg)]">
      {/* Paywall global — controlado por Superwall.register() */}
      {showPaywall && <PaywallModal onClose={closePaywall} />}
      <OnboardingWizard />
      <TrialBanner />
      <AppToolbar />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <div className="flex flex-col border-r border-[var(--mt-border)] shrink-0 overflow-hidden">
          <MarketWatch />
          <div className="border-t border-[var(--mt-sep)]" />
          <Navigator />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden bg-[var(--mt-chart)]">
          {children}
        </div>
      </div>
      <div className="border-t border-[var(--mt-border)] shrink-0">
        <TerminalPanel />
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MTToolbar } from './MTToolbar';
import { MarketWatch } from './MarketWatch';
import { Navigator } from './Navigator';
import { TerminalPanel } from './TerminalPanel';
import { useAuthStore } from '@/store/auth.store';
import { useSocket } from '@/hooks/useSocket';
import { useT } from '@/hooks/useT';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);
  const t = useT();

  useSocket();

  useEffect(() => {
    useAuthStore.persist.rehydrate();
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
      <MTToolbar />
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

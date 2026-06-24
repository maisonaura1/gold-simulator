'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MTToolbar } from './MTToolbar';
import { MarketWatch } from './MarketWatch';
import { Navigator } from './Navigator';
import { TerminalPanel } from './TerminalPanel';
import { useAuthStore } from '@/store/auth.store';
import { useSocket } from '@/hooks/useSocket';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useSocket();

  useEffect(() => {
    // Hydrate Zustand persist store from localStorage (skipHydration=true)
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
          GoldTrader MT · Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--mt-bg)]">
      {/* Top: menu + toolbar */}
      <MTToolbar />

      {/* Middle: sidebars + content */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left panels: Market Watch + Navigator stacked */}
        <div className="flex flex-col border-r border-[var(--mt-border)] shrink-0 overflow-hidden">
          <MarketWatch />
          <div className="border-t border-[var(--mt-sep)]" />
          <Navigator />
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0 overflow-hidden bg-[var(--mt-chart)]">
          {children}
        </div>
      </div>

      {/* Bottom: Terminal panel */}
      <div className="border-t border-[var(--mt-border)] shrink-0">
        <TerminalPanel />
      </div>
    </div>
  );
}

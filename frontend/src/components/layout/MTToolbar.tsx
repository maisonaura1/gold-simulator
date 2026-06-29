'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePricesStore } from '@/store/prices.store';
import { useAuthStore } from '@/store/auth.store';
import { useLangStore } from '@/store/lang.store';
import { useAccount } from '@/hooks/useAccount';
import { useTrades } from '@/hooks/useTrades';
import { useT } from '@/hooks/useT';
import type { Lang } from '@/lib/i18n';
import clsx from 'clsx';

const LANG_OPTIONS: { code: 'es' | Lang; flag: string }[] = [
  { code: 'es', flag: '🇪🇸' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'nl', flag: '🇳🇱' },
];

export function MTToolbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { currentPrice, connected } = usePricesStore();
  const { clearTokens } = useAuthStore();
  const { lang, setLang } = useLangStore();
  const { account } = useAccount();
  const { openTrades } = useTrades();
  const t = useT();
  const [time, setTime] = useState('');

  const totalLivePnl = openTrades.reduce((sum, tr) => {
    if (currentPrice <= 0) return sum;
    return sum + (tr.type === 'BUY'
      ? (currentPrice - tr.entryPrice) * tr.lot * 100
      : (tr.entryPrice - currentPrice) * tr.lot * 100);
  }, 0);
  const equity = (account?.currentBalance ?? 0) + totalLivePnl;

  const MENUS = [t.menuFile, t.menuView, t.menuInsert, t.menuCharts, t.menuTools, t.menuWindow, t.menuHelp];

  const TOOLBAR_ACTIONS = [
    { icon: '📈', label: t.navChart,    href: '/dashboard' },
    { icon: '⚡', label: t.navNewOrder, href: '/trade' },
    { icon: '📋', label: t.navHistory,  href: '/history' },
    { icon: '🎯', label: t.navMissions, href: '/learn' },
    { icon: '📊', label: t.navStats,    href: '/stats' },
  ];

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('es', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col shrink-0 select-none">
      {/* ── Menu bar ── */}
      <div className="flex items-center h-6 bg-[#0d1017] border-b border-[var(--mt-border)] px-1" style={{ fontSize: 11 }}>
        {MENUS.map((m) => (
          <button key={m} className="px-3 h-full text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)] hover:text-[var(--mt-text)] transition-colors">
            {m}
          </button>
        ))}
        <div className="flex-1" />

        {/* Language selector */}
        <div className="flex items-center gap-0.5 px-2 border-r border-[var(--mt-border)]">
          {LANG_OPTIONS.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              title={code.toUpperCase()}
              className={clsx(
                'px-1.5 h-5 text-[11px] transition-colors rounded-sm',
                lang === code
                  ? 'bg-[var(--mt-blue)]/30 text-[var(--mt-white)]'
                  : 'text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)]',
              )}
            >
              {flag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 text-[10px] text-[var(--mt-text-dim)]">
          <span className={clsx('w-1.5 h-1.5 rounded-full', connected ? 'bg-[var(--mt-green)]' : 'bg-[var(--mt-red)]')} />
          {connected ? t.connected : t.disconnected}
        </div>
        <button
          onClick={() => { clearTokens(); router.replace('/auth/login'); }}
          className="px-3 h-full text-[var(--mt-text-dim)] hover:text-[var(--mt-red)] transition-colors"
        >
          {t.logout}
        </button>
      </div>

      {/* ── Icon toolbar ── */}
      <div className="flex items-center h-9 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] px-1 gap-0.5">
        {TOOLBAR_ACTIONS.map((a) => {
          const active = pathname === a.href || (a.href !== '/dashboard' && pathname.startsWith(a.href));
          return (
            <button
              key={a.href}
              onClick={() => router.push(a.href)}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 h-7 text-[11px] border transition-colors',
                active
                  ? 'bg-[var(--mt-hover)] border-[var(--mt-sep)] text-[var(--mt-white)]'
                  : 'border-transparent text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)] hover:border-[var(--mt-sep)] hover:text-[var(--mt-text)]',
              )}
            >
              <span style={{ fontSize: 12 }}>{a.icon}</span>
              <span>{a.label}</span>
            </button>
          );
        })}

        <div className="w-px h-5 bg-[var(--mt-sep)] mx-2" />

        {/* Precio en vivo */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--mt-text-dim)] text-[11px]">XAUUSD</span>
          <span className="font-mono font-bold text-[var(--mt-cyan)] text-[13px] tracking-wide tabular-nums">
            {currentPrice > 0 ? currentPrice.toFixed(2) : '——.——'}
          </span>
        </div>

        <div className="flex-1" />

        {/* Account quick-view */}
        {account && (
          <div className="flex items-center gap-3 px-3 border-r border-[var(--mt-sep)] text-[11px]">
            <span className="text-[var(--mt-text-dim)]">
              {t.balance}: <span className="font-mono text-[var(--mt-white)] tabular-nums">${account.currentBalance.toFixed(2)}</span>
            </span>
            <span className="text-[var(--mt-text-dim)]">
              {t.equity}: <span className={clsx('font-mono tabular-nums', equity >= account.currentBalance ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>${equity.toFixed(2)}</span>
            </span>
            {totalLivePnl !== 0 && (
              <span className={clsx('font-mono tabular-nums text-[10px]', totalLivePnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>
                {totalLivePnl >= 0 ? '+' : ''}{totalLivePnl.toFixed(2)}
              </span>
            )}
          </div>
        )}

        <div className="font-mono text-[11px] text-[var(--mt-text-dim)] px-3 tabular-nums">
          {time} GMT+0
        </div>
      </div>
    </div>
  );
}

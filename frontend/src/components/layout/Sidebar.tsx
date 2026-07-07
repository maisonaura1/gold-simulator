'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAuthStore } from '@/store/auth.store';
import { usePricesStore } from '@/store/prices.store';
import { LogoIcon } from '@/components/ui/LogoIcon';
import { api } from '@/lib/api';

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',     icon: '📊' },
  { href: '/trade',      label: 'Simular',        icon: '⚡' },
  { href: '/history',    label: 'Historial',      icon: '📋' },
  { href: '/learn',      label: 'Misiones',       icon: '🎯' },
  { href: '/academy',    label: 'Academia XAU',   icon: '🎓' },
  { href: '/stats',      label: 'Estadísticas',   icon: '📈' },
  { href: '/account',    label: 'Mi cuenta',      icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { clearTokens, accessToken } = useAuthStore();
  const { currentPrice, connected } = usePricesStore();
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    api.get<{ current: number; longest: number }>('/stats/streak')
      .then((r) => setStreak(r.data))
      .catch(() => null);
  }, [accessToken]);

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[var(--card)] border-r border-[var(--border)] flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <LogoIcon size={26} />
          <div>
            <div style={{ color: '#e8b84b', fontWeight: 700, fontSize: 14, letterSpacing: '0.02em', lineHeight: 1 }}>GoldTrader</div>
            <div style={{ color: '#3a3f4d', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 3 }}>XAU/USD Simulator</div>
          </div>
        </div>
      </div>

      {/* Price ticker */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-gold-500/10 border border-gold-500/20">
        <div className="text-xs text-[var(--muted)] mb-1 flex items-center gap-1">
          <span className={clsx('w-1.5 h-1.5 rounded-full', connected ? 'bg-green-400' : 'bg-red-400')} />
          XAUUSD
        </div>
        <div className="font-mono font-bold text-gold-400 text-lg">
          {currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : '—'}
        </div>
      </div>

      {/* Streak */}
      {streak !== null && (
        <div className="mx-4 mt-3 p-3 rounded-xl" style={{ background: streak.current > 0 ? '#1a1508' : '#0f1117', border: `1px solid ${streak.current > 0 ? '#2c2410' : '#1d2029'}` }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'monospace' }}>Racha diaria</span>
            {streak.longest > 0 && (
              <span style={{ color: '#3a3f4d', fontSize: 9, fontFamily: 'monospace' }}>récord {streak.longest}d</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>{streak.current > 0 ? '🔥' : '○'}</span>
            <span style={{ color: streak.current > 0 ? '#c9a84c' : '#3a3f4d', fontFamily: 'monospace', fontWeight: 800, fontSize: 22, lineHeight: 1 }}>
              {streak.current}
            </span>
            <span style={{ color: '#6b7385', fontSize: 10 }}>{streak.current === 1 ? 'día' : 'días'}</span>
          </div>
          {streak.current === 0 && (
            <p style={{ color: '#3a3f4d', fontSize: 9, marginTop: 4 }}>Simula hoy para empezar racha</p>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
              pathname.startsWith(item.href)
                ? 'bg-gold-500/15 text-gold-400 font-medium'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5',
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[var(--border)]">
        <button
          onClick={() => { clearTokens(); window.location.href = '/auth/login'; }}
          className="w-full text-left text-sm text-[var(--muted)] hover:text-red-400 transition-colors px-3 py-2"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuthStore } from '@/store/auth.store';
import { usePricesStore } from '@/store/prices.store';
import { LogoIcon } from '@/components/ui/LogoIcon';

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',     icon: '📊' },
  { href: '/trade',      label: 'Simular',        icon: '⚡' },
  { href: '/history',    label: 'Historial',      icon: '📋' },
  { href: '/learn',      label: 'Misiones',       icon: '🎯' },
  { href: '/academy',    label: 'Academia XAU',   icon: '🎓' },
  { href: '/stats',      label: 'Estadísticas',   icon: '📈' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { clearTokens } = useAuthStore();
  const { currentPrice, connected } = usePricesStore();

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

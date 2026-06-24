'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePricesStore } from '@/store/prices.store';
import { useAuthStore } from '@/store/auth.store';
import clsx from 'clsx';

const MENUS = ['Archivo', 'Ver', 'Insertar', 'Gráficos', 'Herramientas', 'Ventana', 'Ayuda'];

const TOOLBAR_ACTIONS = [
  { icon: '📈', label: 'Gráfico',       href: '/dashboard' },
  { icon: '⚡', label: 'Nueva orden',   href: '/trade' },
  { icon: '📋', label: 'Historial',     href: '/history' },
  { icon: '🎯', label: 'Misiones',      href: '/learn' },
  { icon: '📊', label: 'Estadísticas',  href: '/stats' },
];

export function MTToolbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { currentPrice, connected } = usePricesStore();
  const { clearTokens } = useAuthStore();
  const [time, setTime] = useState('');

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
        <div className="flex items-center gap-2 px-3 text-[10px] text-[var(--mt-text-dim)]">
          <span className={clsx('w-1.5 h-1.5 rounded-full', connected ? 'bg-[var(--mt-green)]' : 'bg-[var(--mt-red)]')} />
          {connected ? 'Conectado — Servidor Demo' : 'Sin conexión'}
        </div>
        <button
          onClick={() => { clearTokens(); router.replace('/auth/login'); }}
          className="px-3 h-full text-[var(--mt-text-dim)] hover:text-[var(--mt-red)] transition-colors"
        >
          Salir
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

        <div className="font-mono text-[11px] text-[var(--mt-text-dim)] px-3 tabular-nums">
          {time} GMT+0
        </div>
      </div>
    </div>
  );
}

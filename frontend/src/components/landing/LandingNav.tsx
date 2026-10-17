'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { useAuthReady } from '@/hooks/useAuth';

const LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#temario', label: 'Temario' },
  { href: '#simulador', label: 'Simulador' },
  { href: '#precios', label: 'Precios' },
  { href: '#preguntas', label: 'Preguntas' },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { authed } = useAuthReady();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${scrolled || open ? 'border-b border-ink-750 bg-ink-950/90 backdrop-blur' : ''}`}
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[14px] text-fg-muted transition hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {authed ? (
            <ButtonLink href="/dashboard" size="sm">
              Ir a mi panel
            </ButtonLink>
          ) : (
            <>
              <Link href="/auth/login" className="px-3 text-[14px] font-medium text-fg-muted hover:text-fg">
                Entrar
              </Link>
              <ButtonLink href="/auth/register" size="sm">
                Empezar gratis
              </ButtonLink>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 text-fg md:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-ink-750 px-4 pb-5 md:hidden">
          <nav className="flex flex-col py-2">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-[16px] text-fg-muted">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="grid gap-2">
            {authed ? (
              <ButtonLink href="/dashboard" block>
                Ir a mi panel
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/auth/register" block>
                  Empezar gratis
                </ButtonLink>
                <ButtonLink href="/auth/login" variant="secondary" block>
                  Entrar
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

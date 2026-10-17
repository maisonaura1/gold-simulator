'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { apiError } from '@/lib/format';
import { useAuthStore } from '@/store/auth.store';
import { useAuthReady } from '@/hooks/useAuth';
import { AuthLayout, Divider, GoogleButton } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';

const EMAIL_KEY = 'gold-saved-email';

function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { ready, authed } = useAuthReady();
  const setTokens = useAuthStore((s) => s.setTokens);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(params.get('error') === 'google' ? 'No se pudo entrar con Google. Inténtalo de nuevo.' : '');
  const [loading, setLoading] = useState(false);
  const next = safeNext(params.get('next'));

  useEffect(() => {
    if (ready && authed) router.replace(next);
  }, [ready, authed, router, next]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(EMAIL_KEY);
      if (saved) setEmail(saved);
    } catch {
      /* sin localStorage */
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: email.trim().toLowerCase(), password });
      setTokens(data);
      try {
        localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
      } catch {
        /* sin localStorage */
      }
      router.replace(next);
    } catch (err) {
      setError(apiError(err, 'No se pudo iniciar sesión.'));
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Entra para seguir con tus lecciones y tu práctica."
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="link">
            Crea una gratis
          </Link>
        </>
      }
    >
      <GoogleButton />
      <Divider />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" autoComplete="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">
              Contraseña
            </label>
            <Link href="/auth/forgot-password" className="mb-1.5 text-[13px] text-fg-dim hover:text-fg">
              ¿La has olvidado?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="input pr-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-dim hover:text-fg" aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {error && <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2 text-[14px] text-red-200">{error}</p>}
        <Button type="submit" block size="lg" loading={loading}>
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}

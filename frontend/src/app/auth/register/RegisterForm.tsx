'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Gift } from 'lucide-react';
import { api } from '@/lib/api';
import { apiError } from '@/lib/format';
import { useAuthStore } from '@/store/auth.store';
import { useAuthReady } from '@/hooks/useAuth';
import { AuthLayout, Divider, GoogleButton } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { ready, authed } = useAuthReady();
  const setTokens = useAuthStore((s) => s.setTokens);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [ref, setRef] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const justRegistered = useRef(false);

  // Si ya tenía sesión abierta, al panel (pero no justo después de registrarse)
  useEffect(() => {
    if (ready && authed && !justRegistered.current) router.replace('/dashboard');
  }, [ready, authed, router]);

  useEffect(() => {
    const r = params.get('ref');
    if (r) setRef(r.toUpperCase().slice(0, 8));
    const plan = params.get('plan');
    if (plan === 'monthly' || plan === 'annual') {
      try {
        sessionStorage.setItem('pending_plan', plan);
      } catch {
        /* sin sessionStorage */
      }
    }
  }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Escribe tu nombre (mínimo 2 letras).');
    if (form.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    setLoading(true);
    try {
      const payload = { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, ...(ref ? { referralCode: ref } : {}) };
      const { data } = await api.post('/auth/register', payload);
      justRegistered.current = true;
      setTokens(data);
      router.replace('/onboarding');
    } catch (err) {
      setError(apiError(err, 'No se pudo crear la cuenta.'));
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta gratis"
      subtitle="Acceso a toda la academia y 20 simulaciones gratis. Sin tarjeta."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="link">
            Entra
          </Link>
        </>
      }
    >
      {ref && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-3 py-2 text-[14px] text-gold-200">
          <Gift className="h-4 w-4" /> Te invitó un amigo (código {ref})
        </div>
      )}
      <GoogleButton />
      <Divider />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Nombre
          </label>
          <input id="name" autoComplete="given-name" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" autoComplete="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={64}
              className="input pr-11"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-dim hover:text-fg" aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-[12px] text-fg-dim">Mínimo 8 caracteres.</p>
        </div>
        {error && <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2 text-[14px] text-red-200">{error}</p>}
        <Button type="submit" block size="lg" loading={loading}>
          Crear cuenta
        </Button>
        <p className="text-center text-[12px] text-fg-dim">
          Al registrarte aceptas los{' '}
          <Link href="/terms" className="underline">
            términos
          </Link>{' '}
          y la{' '}
          <Link href="/privacy" className="underline">
            política de privacidad
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  );
}

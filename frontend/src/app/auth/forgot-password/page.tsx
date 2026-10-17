'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { apiError } from '@/lib/format';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSent(true);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recupera tu contraseña"
      subtitle="Te enviaremos un enlace para crear una nueva."
      footer={
        <Link href="/auth/login" className="link">
          Volver a entrar
        </Link>
      }
    >
      {sent ? (
        <div className="card card-pad text-center">
          <MailCheck className="mx-auto h-8 w-8 text-gold-400" />
          <p className="mt-3 text-[15px] text-fg">Si existe una cuenta con {email}, recibirás un email en unos minutos.</p>
          <p className="mt-1 text-[13px] text-fg-dim">Revisa también la carpeta de spam. El enlace caduca en 1 hora.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p className="text-[14px] text-red-300">{error}</p>}
          <Button type="submit" block size="lg" loading={loading}>
            Enviar enlace
          </Button>
          <p className="text-center text-[12px] text-fg-dim">Si entraste con Google, no tienes contraseña: usa «Continuar con Google».</p>
        </form>
      )}
    </AuthLayout>
  );
}

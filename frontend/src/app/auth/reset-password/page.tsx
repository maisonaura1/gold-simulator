'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { apiError } from '@/lib/format';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button, ButtonLink } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetInner />
    </Suspense>
  );
}

function ResetInner() {
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    if (password !== confirm) return setError('Las contraseñas no coinciden.');
    setLoading(true);
    try {
      await api.post('/auth/reset-password-token', { token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(apiError(err, 'El enlace no es válido o ha caducado.'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Enlace no válido" subtitle="Pide un enlace nuevo para cambiar tu contraseña.">
        <ButtonLink href="/auth/forgot-password" block>
          Pedir enlace nuevo
        </ButtonLink>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Nueva contraseña" footer={<Link href="/auth/login" className="link">Volver a entrar</Link>}>
      {done ? (
        <div className="card card-pad text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-green-400" />
          <p className="mt-3 text-[15px] text-fg">Contraseña actualizada.</p>
          <ButtonLink href="/auth/login" className="mt-5" block>
            Entrar
          </ButtonLink>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="pw">
              Nueva contraseña
            </label>
            <input id="pw" type="password" autoComplete="new-password" required minLength={8} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="pw2">
              Repite la contraseña
            </label>
            <input id="pw2" type="password" autoComplete="new-password" required className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && <p className="text-[14px] text-red-300">{error}</p>}
          <Button type="submit" block size="lg" loading={loading}>
            Guardar contraseña
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      // Don't reveal whether email exists — show success always for security
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#07080c' }}>

      <div className="w-full max-w-sm">

        <div className="mb-8">
          <Link href="/auth/login" style={{ textDecoration: 'none', color: '#6b7385', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            className="hover:opacity-80 transition-opacity">
            ← Volver al login
          </Link>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span style={{ fontSize: 20, color: '#c9a84c' }}>◆</span>
          <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 16 }}>GOLDTRADER</span>
        </div>

        {sent ? (
          <div>
            <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
            <h1 style={{ color: '#e8ecf4', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Revisa tu email
            </h1>
            <p style={{ color: '#6b7385', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Si <strong style={{ color: '#c8cdd8' }}>{email}</strong> tiene una cuenta en GoldTrader, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
            <p style={{ color: '#3a3f4d', fontSize: 13, marginBottom: 24 }}>
              ¿No lo ves? Revisa la carpeta de spam.
            </p>
            <Link href="/auth/login"
              style={{
                display: 'block', textAlign: 'center', padding: '11px',
                background: 'linear-gradient(135deg,#c9a84c,#a8893c)',
                borderRadius: 4, color: '#08090c', fontSize: 14, fontWeight: 700,
                textDecoration: 'none',
              }}>
              Volver al login →
            </Link>
          </div>
        ) : (
          <div>
            <h1 style={{ color: '#e8ecf4', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              ¿Olvidaste tu contraseña?
            </h1>
            <p style={{ color: '#6b7385', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label style={{ display: 'block', color: '#8893a8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: '#0f1117', border: '1px solid #2a2f3d', borderRadius: 4,
                    color: '#e8ecf4', fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: '#1a0808', border: '1px solid #e5383533', borderRadius: 4,
                  padding: '10px 12px', color: '#e53835', fontSize: 13,
                }}>
                  ⚠ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '11px',
                  background: loading ? '#a8893c' : 'linear-gradient(135deg,#c9a84c,#a8893c)',
                  border: 'none', borderRadius: 4, color: '#08090c',
                  fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? 'Enviando…' : 'Enviar enlace de recuperación →'}
              </button>
            </form>

            <div className="flex items-center justify-between mt-6" style={{ fontSize: 13, color: '#6b7385' }}>
              <Link href="/auth/login" style={{ color: '#6b7385', textDecoration: 'none' }}
                className="hover:opacity-80">
                ← Login
              </Link>
              <Link href="/auth/register" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 500 }}
                className="hover:opacity-80">
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        )}

        <p style={{ color: '#3a3f4d', fontSize: 11, textAlign: 'center', marginTop: 32 }}>
          Sin tarjeta de crédito · Sin riesgo real · 100% simulador
        </p>
      </div>
    </div>
  );
}

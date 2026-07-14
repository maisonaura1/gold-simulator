'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterPage() {
  return <Suspense><RegisterInner /></Suspense>;
}

function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [refCode, setRefCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setRefCode(ref.toUpperCase());
    const plan = searchParams.get('plan');
    if (plan) sessionStorage.setItem('pending_plan', plan);
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = refCode ? { ...form, referralCode: refCode } : form;
      const { data } = await api.post('/auth/register', payload);
      setTokens(data);
      router.replace('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#07080c' }}>

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ background: '#0a0b10', borderRight: '1px solid #1d2029' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 22, color: '#c9a84c' }}>◆</span>
            <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>GOLDTRADER</span>
          </div>
        </Link>
        <div>
          <div style={{ color: '#c9a84c', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 12 }}>
            ◈ CUENTA GRATUITA
          </div>
          <p style={{ color: '#e8ecf4', fontSize: 22, fontWeight: 700, lineHeight: 1.35, marginBottom: 16 }}>
            20 simulaciones gratis.<br />Sin tarjeta. Sin riesgo.
          </p>
          <p style={{ color: '#6b7385', fontSize: 14, lineHeight: 1.7 }}>
            Empieza a practicar XAUUSD hoy mismo. Capital virtual de $10,000. Exactamente las mismas condiciones que un challenge real.
          </p>
          <div className="mt-8 p-4 rounded-sm" style={{ background: '#0f1117', border: '1px solid #2c2410' }}>
            <div style={{ color: '#c9a84c', fontSize: 11, fontFamily: 'monospace', marginBottom: 8 }}>TU CUENTA DEMO</div>
            <div className="flex justify-between" style={{ fontSize: 13, color: '#8893a8', marginBottom: 4 }}>
              <span>Capital inicial</span>
              <span style={{ color: '#e8ecf4', fontFamily: 'monospace', fontWeight: 600 }}>$10,000.00</span>
            </div>
            <div className="flex justify-between" style={{ fontSize: 13, color: '#8893a8', marginBottom: 4 }}>
              <span>Instrumento</span>
              <span style={{ color: '#c9a84c', fontFamily: 'monospace', fontWeight: 600 }}>XAUUSD</span>
            </div>
            <div className="flex justify-between" style={{ fontSize: 13, color: '#8893a8' }}>
              <span>Simulaciones gratis</span>
              <span style={{ color: '#2dcc6f', fontFamily: 'monospace', fontWeight: 600 }}>20</span>
            </div>
          </div>
        </div>
        <p style={{ color: '#3a3f4d', fontSize: 11 }}>
          GoldTrader Simulator · XAUUSD · No real capital
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        <div className="w-full max-w-sm mb-8">
          <Link href="/" style={{ textDecoration: 'none', color: '#6b7385', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            className="hover:opacity-80 transition-opacity">
            ← Volver al inicio
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span style={{ fontSize: 20, color: '#c9a84c' }}>◆</span>
            <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 16 }}>GOLDTRADER</span>
          </div>

          <h1 style={{ color: '#e8ecf4', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Crear cuenta gratis</h1>
          <p style={{ color: '#6b7385', fontSize: 14, marginBottom: 28 }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 600 }}>
              Iniciar sesión
            </Link>
          </p>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/auth/google`}
            className="w-full flex items-center justify-center gap-3 py-2.5 mb-5 transition-colors"
            style={{
              background: '#0f1117', border: '1px solid #2a2f3d',
              color: '#c8cdd8', fontSize: 14, fontWeight: 500, borderRadius: 4, cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div style={{ flex: 1, height: 1, background: '#1d2029' }} />
            <span style={{ color: '#3a3f4d', fontSize: 12, fontFamily: 'monospace' }}>o con email</span>
            <div style={{ flex: 1, height: 1, background: '#1d2029' }} />
          </div>

          {refCode && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-sm" style={{ background: '#1a1000', border: '1px solid #c9a84c33', fontSize: 13 }}>
              <span>🎁</span>
              <span style={{ color: '#c8cdd8' }}>Código <span style={{ color: '#c9a84c', fontFamily: 'monospace', fontWeight: 700 }}>{refCode}</span> aplicado — 20 simulaciones gratis</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label style={{ display: 'block', color: '#8893a8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>Nombre</label>
              <input
                type="text"
                required
                minLength={2}
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0f1117', border: '1px solid #2a2f3d', borderRadius: 4,
                  color: '#e8ecf4', fontSize: 14, outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#8893a8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#0f1117', border: '1px solid #2a2f3d', borderRadius: 4,
                  color: '#e8ecf4', fontSize: 14, outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#8893a8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                Contraseña <span style={{ color: '#3a3f4d' }}>(mín. 8 caracteres)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 40px 10px 12px',
                    background: '#0f1117', border: '1px solid #2a2f3d', borderRadius: 4,
                    color: '#e8ecf4', fontSize: 14, outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7385', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
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
              {loading ? 'Creando cuenta…' : 'Crear cuenta gratis →'}
            </button>
          </form>

          <p style={{ color: '#3a3f4d', fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 1.6 }}>
            Al registrarte aceptas los{' '}
            <Link href="/terms" style={{ color: '#3a3f4d', textDecoration: 'underline' }}>Términos de uso</Link>
            {' '}y la{' '}
            <Link href="/privacy" style={{ color: '#3a3f4d', textDecoration: 'underline' }}>Política de privacidad</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

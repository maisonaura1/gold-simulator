'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { setTokens } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setTokens(data);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1d23 100%)' }}
    >
      {/* Window frame — exactamente como el login de MT */}
      <div className="w-80 border border-[var(--mt-sep)] shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#12151a] border-b border-[var(--mt-border)]">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14 }}>🪙</span>
            <span className="text-[var(--mt-text)] text-xs font-medium">GoldTrader — Conexión a cuenta demo</span>
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--mt-sep)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--mt-sep)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--mt-sep)]" />
          </div>
        </div>

        {/* Form body */}
        <div className="bg-[var(--mt-panel)] p-5">
          {/* Server info like MT */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-[var(--mt-bg)] border border-[var(--mt-border)]" style={{ fontSize: 10 }}>
            <span className="w-2 h-2 rounded-full bg-[var(--mt-green)]" />
            <span className="text-[var(--mt-text-dim)]">Servidor: Demo-XAUUSD-001 · Latencia: 2ms</span>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-[10px] text-[var(--mt-text-dim)] mb-1">Login (email)</label>
              <input
                type="email"
                className="mt-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[var(--mt-text-dim)] mb-1">Contraseña</label>
              <input
                type="password"
                className="mt-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center gap-2" style={{ fontSize: 10 }}>
              <input type="checkbox" id="save" className="accent-[var(--mt-blue)]" defaultChecked />
              <label htmlFor="save" className="text-[var(--mt-text-dim)]">Guardar contraseña</label>
            </div>

            {error && (
              <div className="text-[var(--mt-red)] text-[10px] bg-red-500/10 border border-red-500/20 p-2">
                ⚠ {error}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={loading} className="flex-1 py-2 text-xs font-medium bg-[var(--mt-blue)] hover:bg-blue-600 text-white transition-colors disabled:opacity-50">
                {loading ? 'Conectando...' : 'Conectar'}
              </button>
              <Link href="/auth/register" className="flex-1 py-2 text-xs font-medium text-center text-[var(--mt-text-dim)] border border-[var(--mt-border)] hover:bg-[var(--mt-hover)] transition-colors">
                Nueva cuenta
              </Link>
            </div>
          </form>
        </div>

        {/* Status bar */}
        <div className="flex items-center px-3 py-1.5 bg-[#12151a] border-t border-[var(--mt-border)]" style={{ fontSize: 9 }}>
          <span className="text-[var(--mt-text-dim)]">GoldTrader Simulator v1.0 · XAUUSD · Cuenta demo ilimitada</span>
        </div>
      </div>
    </div>
  );
}

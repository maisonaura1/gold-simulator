'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useLangStore } from '@/store/lang.store';
import { useT } from '@/hooks/useT';
import type { Lang } from '@/lib/i18n';
import clsx from 'clsx';

const LANG_OPTIONS: { code: 'es' | Lang; flag: string }[] = [
  { code: 'es', flag: '🇪🇸' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'nl', flag: '🇳🇱' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setTokens } = useAuthStore();
  const { lang, setLang } = useLangStore();
  const t = useT();
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setTokens(data);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t.registerError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1d23 100%)' }}
    >
      <div className="w-80 border border-[var(--mt-sep)] shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#12151a] border-b border-[var(--mt-border)]">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14 }}>🪙</span>
            <span className="text-[var(--mt-text)] text-xs font-medium">{t.registerTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {LANG_OPTIONS.map(({ code, flag }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={clsx(
                    'px-1 text-[11px] rounded-sm transition-colors',
                    lang === code ? 'bg-[var(--mt-blue)]/30' : 'opacity-50 hover:opacity-100',
                  )}
                >
                  {flag}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-[var(--mt-sep)]" />
              <div className="w-3 h-3 rounded-full bg-[var(--mt-sep)]" />
              <div className="w-3 h-3 rounded-full bg-[var(--mt-sep)]" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--mt-panel)] p-5">
          <div className="p-2 mb-4 bg-[var(--mt-bg)] border border-[var(--mt-blue)]/30 text-[10px] text-[var(--mt-text-dim)]">
            <div className="text-[var(--mt-cyan)] font-medium mb-1">{t.registerDemoInfo}</div>
            {t.registerCapital}: <span className="font-mono text-[var(--mt-white)]">$10,000.00</span> ·
            {' '}Symbol: <span className="text-[var(--mt-yellow)]">XAUUSD</span>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-[10px] text-[var(--mt-text-dim)] mb-1">{t.registerName}</label>
              <input className="mt-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} />
            </div>
            <div>
              <label className="block text-[10px] text-[var(--mt-text-dim)] mb-1">{t.registerEmail}</label>
              <input type="email" className="mt-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-[10px] text-[var(--mt-text-dim)] mb-1">{t.registerPassword}</label>
              <input type="password" className="mt-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
            </div>

            {error && (
              <div className="text-[var(--mt-red)] text-[10px] bg-red-500/10 border border-red-500/20 p-2">
                ⚠ {error}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={loading} className="flex-1 py-2 text-xs font-medium bg-[var(--mt-blue)] hover:bg-blue-600 text-white transition-colors disabled:opacity-50">
                {loading ? t.registerCreating : t.registerCreate}
              </button>
              <Link href="/auth/login" className="flex-1 py-2 text-xs font-medium text-center text-[var(--mt-text-dim)] border border-[var(--mt-border)] hover:bg-[var(--mt-hover)] transition-colors">
                {t.registerHaveAccount}
              </Link>
            </div>
          </form>
        </div>

        <div className="flex items-center px-3 py-1.5 bg-[#12151a] border-t border-[var(--mt-border)]" style={{ fontSize: 9 }}>
          <span className="text-[var(--mt-text-dim)]">{t.registerFooter}</span>
        </div>
      </div>
    </div>
  );
}

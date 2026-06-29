'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useLangStore } from '@/store/lang.store';
import { useT } from '@/hooks/useT';
import type { Lang } from '@/lib/i18n';
import clsx from 'clsx';

const CRED_KEY = 'gold-saved-creds';

const LANG_OPTIONS: { code: 'es' | Lang; flag: string }[] = [
  { code: 'es', flag: '🇪🇸' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'nl', flag: '🇳🇱' },
];

export default function LoginPage() {
  const router = useRouter();
  const { setTokens } = useAuthStore();
  const { lang, setLang } = useLangStore();
  const t = useT();

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef  = useRef<HTMLInputElement>(null);

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [savePass, setSave]   = useState(true);

  // Pre-fill from saved credentials
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CRED_KEY);
      if (saved) {
        const { email, password } = JSON.parse(saved);
        if (emailRef.current) emailRef.current.value = email ?? '';
        if (passRef.current)  passRef.current.value  = password ?? '';
      }
    } catch {}
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email    = emailRef.current?.value ?? '';
    const password = passRef.current?.value  ?? '';

    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (savePass) {
        localStorage.setItem(CRED_KEY, JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem(CRED_KEY);
      }
      setTokens(data);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t.loginInvalid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #1a1d23 100%)' }}
    >
      <div className="w-80 border border-[var(--mt-sep)] shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#12151a] border-b border-[var(--mt-border)]">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14 }}>🪙</span>
            <span className="text-[var(--mt-text)] text-xs font-medium">{t.loginTitle}</span>
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
          <div className="flex items-center gap-2 mb-4 p-2 bg-[var(--mt-bg)] border border-[var(--mt-border)]" style={{ fontSize: 10 }}>
            <span className="w-2 h-2 rounded-full bg-[var(--mt-green)]" />
            <span className="text-[var(--mt-text-dim)]">{t.loginServer}</span>
          </div>

          <form onSubmit={submit} className="space-y-3" autoComplete="off">
            <div>
              <label className="block text-[10px] text-[var(--mt-text-dim)] mb-1">{t.loginEmail}</label>
              <input
                ref={emailRef}
                type="email"
                className="mt-input"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[var(--mt-text-dim)] mb-1">{t.loginPassword}</label>
              <input
                ref={passRef}
                type="password"
                className="mt-input"
                required
                autoComplete="off"
              />
            </div>

            <div className="flex items-center gap-2" style={{ fontSize: 10 }}>
              <input
                type="checkbox"
                id="save"
                className="accent-[var(--mt-blue)]"
                checked={savePass}
                onChange={(e) => setSave(e.target.checked)}
              />
              <label htmlFor="save" className="text-[var(--mt-text-dim)]">{t.loginSave}</label>
            </div>

            {error && (
              <div className="text-[var(--mt-red)] text-[10px] bg-red-500/10 border border-red-500/20 p-2">
                ⚠ {error}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={loading} className="flex-1 py-2 text-xs font-medium bg-[var(--mt-blue)] hover:bg-blue-600 text-white transition-colors disabled:opacity-50">
                {loading ? t.loginConnecting : t.loginConnect}
              </button>
              <Link href="/auth/register" className="flex-1 py-2 text-xs font-medium text-center text-[var(--mt-text-dim)] border border-[var(--mt-border)] hover:bg-[var(--mt-hover)] transition-colors">
                {t.loginNewAccount}
              </Link>
            </div>
          </form>
        </div>

        <div className="flex items-center px-3 py-1.5 bg-[#12151a] border-t border-[var(--mt-border)]" style={{ fontSize: 9 }}>
          <span className="text-[var(--mt-text-dim)]">{t.loginFooter}</span>
        </div>
      </div>
    </div>
  );
}

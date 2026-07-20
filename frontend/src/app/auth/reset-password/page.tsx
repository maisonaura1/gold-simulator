'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useLandingT } from '@/hooks/useLandingT';

export default function ResetPasswordPage() {
  return <Suspense><ResetPasswordInner /></Suspense>;
}

function ResetPasswordInner() {
  const t      = useLandingT();
  const router = useRouter();
  const params = useSearchParams();
  const token  = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [done,     setDone]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError(t.resetErrorMismatch); return; }
    if (password.length < 8)  { setError(t.resetErrorLength);   return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password-token', { token, newPassword: password });
      setDone(true);
      setTimeout(() => router.replace('/auth/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || t.resetErrorExpired);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#07080c' }}>
        <div className="w-full max-w-sm text-center">
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ color: '#e8ecf4', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            {t.forgotInvalidLink}
          </h1>
          <p style={{ color: '#6b7385', fontSize: 14, marginBottom: 24 }}>
            {t.forgotInvalidBody}
          </p>
          <Link href="/auth/forgot-password"
            style={{ color: '#c9a84c', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
            {t.forgotRequestNew}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#07080c' }}>
      <div className="w-full max-w-sm">

        <div className="flex items-center gap-2 mb-8">
          <span style={{ fontSize: 20, color: '#c9a84c' }}>◆</span>
          <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 16 }}>GOLDTRADER</span>
        </div>

        {done ? (
          <div>
            <div style={{ fontSize: 36, marginBottom: 16 }}>✅</div>
            <h1 style={{ color: '#e8ecf4', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              {t.resetDoneH1}
            </h1>
            <p style={{ color: '#6b7385', fontSize: 14, marginBottom: 24 }}>
              {t.resetDoneSub}
            </p>
            <Link href="/auth/login"
              style={{
                display: 'block', textAlign: 'center', padding: '11px',
                background: 'linear-gradient(135deg,#c9a84c,#a8893c)',
                borderRadius: 4, color: '#08090c', fontSize: 14, fontWeight: 700,
                textDecoration: 'none',
              }}>
              {t.resetDoneBtn}
            </Link>
          </div>
        ) : (
          <div>
            <h1 style={{ color: '#e8ecf4', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {t.resetH1}
            </h1>
            <p style={{ color: '#6b7385', fontSize: 14, marginBottom: 28 }}>
              {t.resetSub}
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label style={{ display: 'block', color: '#8893a8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                  {t.resetLabelNew}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required minLength={8}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 40px 10px 12px',
                      background: '#0f1117', border: '1px solid #2a2f3d', borderRadius: 4,
                      color: '#e8ecf4', fontSize: 14, outline: 'none',
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#6b7385', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#8893a8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                  {t.resetLabelConfirm}
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required minLength={8}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: '#0f1117', border: '1px solid #2a2f3d', borderRadius: 4,
                    color: '#e8ecf4', fontSize: 14, outline: 'none',
                  }}
                />
              </div>

              {error && (
                <div style={{ background: '#1a0808', border: '1px solid #e5383533', borderRadius: 4, padding: '10px 12px', color: '#e53835', fontSize: 13 }}>
                  ⚠ {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '11px',
                  background: loading ? '#a8893c' : 'linear-gradient(135deg,#c9a84c,#a8893c)',
                  border: 'none', borderRadius: 4, color: '#08090c',
                  fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? t.resetBtnLoading : t.resetBtn}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

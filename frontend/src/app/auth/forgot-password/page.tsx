'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLandingT } from '@/hooks/useLandingT';

export default function ForgotPasswordPage() {
  const t = useLandingT();
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
    } catch {
      // Never reveal whether email exists — always show success
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#07080c' }}>
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <Link href="/auth/login"
            style={{ textDecoration: 'none', color: '#6b7385', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            className="hover:opacity-80 transition-opacity">
            {t.forgotBackLogin}
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <span style={{ fontSize: 20, color: '#c9a84c' }}>◆</span>
          <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 16 }}>GOLDTRADER</span>
        </div>

        {sent ? (
          <div>
            <div style={{ fontSize: 36, marginBottom: 16 }}>📬</div>
            <h1 style={{ color: '#e8ecf4', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              {t.forgotSentH1}
            </h1>
            <p style={{ color: '#6b7385', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              {t.forgotSentBody(email)}
            </p>
            <p style={{ color: '#3a3f4d', fontSize: 13, marginBottom: 24 }}>
              {t.forgotSentSpam}
            </p>
            <Link href="/auth/login"
              style={{
                display: 'block', textAlign: 'center', padding: '11px',
                background: 'linear-gradient(135deg,#c9a84c,#a8893c)',
                borderRadius: 4, color: '#08090c', fontSize: 14, fontWeight: 700,
                textDecoration: 'none',
              }}>
              {t.forgotBackLogin} →
            </Link>
          </div>
        ) : (
          <div>
            <h1 style={{ color: '#e8ecf4', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {t.forgotH1}
            </h1>
            <p style={{ color: '#6b7385', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              {t.forgotSub}
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label style={{ display: 'block', color: '#8893a8', fontSize: 12, marginBottom: 6, fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.forgotEmailPlaceholder}
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
                {loading ? t.forgotBtnLoading : t.forgotBtn}
              </button>
            </form>

            <div className="flex items-center justify-between mt-6" style={{ fontSize: 13, color: '#6b7385' }}>
              <Link href="/auth/login" style={{ color: '#6b7385', textDecoration: 'none' }}
                className="hover:opacity-80">
                {t.forgotBackLogin}
              </Link>
              <Link href="/auth/register" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 500 }}
                className="hover:opacity-80">
                {t.forgotCreateAccount}
              </Link>
            </div>
          </div>
        )}

        <p style={{ color: '#3a3f4d', fontSize: 11, textAlign: 'center', marginTop: 32 }}>
          {t.forgotFooter}
        </p>
      </div>
    </div>
  );
}

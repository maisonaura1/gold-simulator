'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function GoogleSuccessPage() {
  return <Suspense><GoogleSuccessInner /></Suspense>;
}

function GoogleSuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const accessToken  = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    if (accessToken && refreshToken) {
      setTokens({ accessToken, refreshToken });
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login?error=google');
    }
  }, [params, router, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#07080c' }}>
      <div className="text-center">
        <div style={{ fontSize: 32, marginBottom: 12 }}>◆</div>
        <p style={{ color: '#6b7385', fontSize: 14 }}>Signing in with Google…</p>
      </div>
    </div>
  );
}

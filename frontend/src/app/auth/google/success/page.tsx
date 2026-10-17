'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { FullScreenLoader } from '@/components/ui/Spinner';

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <GoogleInner />
    </Suspense>
  );
}

function GoogleInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    if (accessToken && refreshToken) {
      useAuthStore.getState().setTokens({ accessToken, refreshToken });
      // Limpia los tokens de la URL antes de seguir
      window.history.replaceState(null, '', '/auth/google/success');
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login?error=google');
    }
  }, [params, router]);

  return <FullScreenLoader />;
}

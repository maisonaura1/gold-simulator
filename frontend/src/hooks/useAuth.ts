'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useProgress } from '@/store/progress.store';
import { clearApiCache } from '@/hooks/useApi';

let rehydrated = false;

/** Rehidrata la sesión guardada (el store usa skipHydration) y avisa cuando está lista. */
export function useAuthReady() {
  const [ready, setReady] = useState(rehydrated);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (rehydrated) return;
    Promise.resolve(useAuthStore.persist.rehydrate()).finally(() => {
      rehydrated = true;
      setReady(true);
    });
  }, []);

  return { ready, authed: ready && !!accessToken };
}

export function logout() {
  useAuthStore.getState().clearTokens();
  useProgress.getState().reset();
  try {
    localStorage.removeItem('gt-academy-progress');
  } catch {
    /* sin acceso a localStorage */
  }
  clearApiCache();
  window.location.href = '/';
}

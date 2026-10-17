'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

// Caché en memoria compartida entre páginas: al volver a una pantalla se ven los
// datos anteriores al instante mientras se refrescan en segundo plano.
const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

export function invalidate(...paths: string[]) {
  for (const p of paths) {
    cache.delete(p);
    listeners.get(p)?.forEach((fn) => fn());
  }
}

export function clearApiCache() {
  cache.clear();
}

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | undefined>(() => (path ? (cache.get(path) as T | undefined) : undefined));
  const [loading, setLoading] = useState(!!path && !cache.has(path));
  const [error, setError] = useState<unknown>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    if (!path) return;
    if (!cache.has(path)) setLoading(true);
    try {
      const res = await api.get<T>(path);
      cache.set(path, res.data);
      if (mounted.current) {
        setData(res.data);
        setError(null);
      }
    } catch (e) {
      if (mounted.current) setError(e);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    mounted.current = true;
    if (!path) return;
    setData(cache.get(path) as T | undefined);
    void load();
    const set = listeners.get(path) ?? new Set();
    set.add(load);
    listeners.set(path, set);
    return () => {
      mounted.current = false;
      set.delete(load);
    };
  }, [path, load]);

  return { data, loading, error, reload: load };
}

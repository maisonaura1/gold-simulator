'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { SimAccount } from '@/types';

export function useAccount() {
  const [account, setAccount] = useState<SimAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccount = useCallback(async () => {
    try {
      const { data } = await api.get<SimAccount>('/account');
      setAccount(data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccount(); }, [fetchAccount]);

  const reset = async () => {
    await api.post('/account/reset');
    fetchAccount();
  };

  return { account, loading, refetch: fetchAccount, reset };
}

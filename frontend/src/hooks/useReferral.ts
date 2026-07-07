'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface ReferralInfo {
  code:          string;
  bonus:         number;
  referredCount: number;
}

export function useReferral() {
  const { accessToken } = useAuthStore();
  const [data,    setData]    = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    api.get<ReferralInfo>('/referral/my-code')
      .then((r) => setData(r.data))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const shareUrl = (code: string) =>
    `${typeof window !== 'undefined' ? window.location.origin : 'https://goldtrader.app'}/auth/register?ref=${code}`;

  const copyLink = async (code: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl(code));
      return true;
    } catch {
      return false;
    }
  };

  return { data, loading, shareUrl, copyLink };
}

'use client';
import { create } from 'zustand';
import { api } from '@/lib/api';
import type { PaymentStatus, PlanId } from '@/types';

interface BillingState {
  status: PaymentStatus | null;
  loading: boolean;
  paywallOpen: boolean;
  paywallReason: 'limit' | 'upgrade' | null;
  fetchStatus: () => Promise<PaymentStatus | null>;
  openPaywall: (reason?: 'limit' | 'upgrade') => void;
  closePaywall: () => void;
  /** Crea la sesión de Stripe Checkout y redirige. Devuelve un error si falla. */
  checkout: (plan: Exclude<PlanId, 'free'>) => Promise<string | null>;
  /** Tras volver de Stripe: verifica el pago y refresca el estado. */
  confirmPurchase: () => Promise<PaymentStatus | null>;
}

export const useBilling = create<BillingState>((set, get) => ({
  status: null,
  loading: false,
  paywallOpen: false,
  paywallReason: null,

  fetchStatus: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<PaymentStatus>('/payments/status');
      set({ status: data });
      return data;
    } catch {
      return null;
    } finally {
      set({ loading: false });
    }
  },

  openPaywall: (reason = 'upgrade') => set({ paywallOpen: true, paywallReason: reason }),
  closePaywall: () => set({ paywallOpen: false, paywallReason: null }),

  checkout: async (plan) => {
    try {
      const { data } = await api.post<{ url: string }>('/payments/checkout', { plan });
      window.location.href = data.url;
      return null;
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      return msg ?? 'No se pudo abrir el pago. Inténtalo de nuevo.';
    }
  },

  confirmPurchase: async () => {
    try {
      await api.post('/payments/sync');
    } catch {
      /* el webhook de Stripe lo activará igualmente */
    }
    return get().fetchStatus();
  },
}));

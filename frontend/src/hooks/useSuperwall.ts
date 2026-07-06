/**
 * useSuperwall.ts
 *
 * Hook React que expone el estado de Superwall y helpers de UI.
 *
 * USOS TÍPICOS:
 *
 *   const { isSubscribed, canSimulate, registerPlacement, purchase } = useSuperwall();
 *
 *   // Antes de abrir el simulador:
 *   const result = await registerPlacement('open_simulator');
 *   if (result === 'granted') startSimulation();
 *   // Si 'paywall_presented', el componente PaywallModal se mostrará
 *   // automáticamente a través del contexto.
 */

'use client';
import { useEffect, useState, useCallback } from 'react';
import Superwall, {
  PaymentStatus,
  PurchaseResult,
  PlacementResult,
  PlacementHandler,
  Plan,
  PLACEMENTS,
} from '@/lib/superwall';

export { PLACEMENTS };

interface UseSuperwallReturn {
  // Estado
  status:          PaymentStatus | null;
  isSubscribed:    boolean;
  canSimulate:     boolean;
  simulationsLeft: number;
  loading:         boolean;

  // Acciones
  registerPlacement: (
    placement: string,
    params?: Record<string, unknown>,
    handler?: PlacementHandler,
  ) => Promise<PlacementResult>;

  purchase:         (plan?: Plan) => Promise<PurchaseResult>;
  restorePurchases: () => Promise<boolean>;
  refreshStatus:    () => Promise<void>;

  // UI helpers
  showPaywall:    boolean;
  openPaywall:    () => void;
  closePaywall:   () => void;
}

export function useSuperwall(): UseSuperwallReturn {
  const [status,      setStatus]      = useState<PaymentStatus | null>(Superwall.status);
  const [loading,     setLoading]     = useState(!Superwall.status);
  const [showPaywall, setShowPaywall] = useState(false);

  // Suscribirse a cambios de estado del singleton
  useEffect(() => {
    const unsub = Superwall.subscribe((s) => {
      setStatus(s);
      setLoading(false);
    });
    // Cargar estado si aún no se ha cargado
    if (!Superwall.status) {
      Superwall.fetchStatus().finally(() => setLoading(false));
    }
    return unsub;
  }, []);

  const registerPlacement = useCallback(
    async (
      placement: string,
      params?: Record<string, unknown>,
      handler?: PlacementHandler,
    ): Promise<PlacementResult> => {
      const result = await Superwall.register(placement, params, {
        onPresent: () => {
          setShowPaywall(true);
          handler?.onPresent?.();
        },
        onDismiss: () => {
          setShowPaywall(false);
          handler?.onDismiss?.();
        },
        onPurchase: (r) => handler?.onPurchase?.(r),
        onRestore:  () => handler?.onRestore?.(),
      });
      return result;
    },
    [],
  );

  const purchase = useCallback(
    async (plan?: Plan): Promise<PurchaseResult> => {
      return Superwall.purchase(plan);
    },
    [],
  );

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    return Superwall.restorePurchases();
  }, []);

  const refreshStatus = useCallback(async (): Promise<void> => {
    setLoading(true);
    await Superwall.fetchStatus();
    setLoading(false);
  }, []);

  const simulationsLeft = status
    ? Math.max(0, status.simulationsLimit - status.simulationsUsed)
    : 10;

  return {
    status,
    isSubscribed:    status?.paid === true,
    canSimulate:     status?.canSimulate !== false,
    simulationsLeft,
    loading,
    registerPlacement,
    purchase,
    restorePurchases,
    refreshStatus,
    showPaywall,
    openPaywall:     () => setShowPaywall(true),
    closePaywall:    () => setShowPaywall(false),
  };
}

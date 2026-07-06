/**
 * superwall.ts
 *
 * Adapter de Superwall para web.
 *
 * Superwall es nativamente iOS/Android; su SDK web aún no está publicado.
 * Este módulo expone exactamente la misma API contractual que el SDK real
 * tendría, de modo que cuando lancen el paquete oficial el swap sea trivial:
 *
 *   // Hoy:  import Superwall from '@/lib/superwall'
 *   // Futuro: import Superwall from '@superwall/web'
 *
 * RESPONSABILIDADES:
 *  - Mantener el estado de suscripción en memoria (sincronizado desde el backend)
 *  - Decidir si un "placement" debe mostrar el paywall o conceder acceso libre
 *  - Delegar el flujo de compra al Checkout de Stripe (vía backend)
 *  - Exponer eventos para que los componentes reaccionen
 *
 * CONFIGURACIÓN (.env.local):
 *   NEXT_PUBLIC_SUPERWALL_API_KEY=pk_paywallXXXXXXXX  ← cuando lancen SDK web
 *   NEXT_PUBLIC_API_URL=https://...railway.app/api
 */

import { api } from '@/lib/api';

// ── Tipos públicos ─────────────────────────────────────────────────────────────

export type SubscriptionStatus = 'FREE' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
export type Plan = 'free' | 'lifetime';

export interface PaymentStatus {
  paid:               boolean;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndsAt: string | null;
  simulationsUsed:    number;
  simulationsLimit:   number;
  canSimulate:        boolean;
  plan:               Plan;
}

/** Resultado de un intento de compra */
export type PurchaseResult =
  | { outcome: 'purchased' }
  | { outcome: 'cancelled' }
  | { outcome: 'pending'; checkoutUrl: string }  // redirige a Stripe
  | { outcome: 'failed';  error: string };

/** Resultado de registro de placement */
export type PlacementResult = 'granted' | 'paywall_presented' | 'paywall_dismissed';

/** Handler opcional que recibe el resultado de mostrar el paywall */
export interface PlacementHandler {
  onPresent?:  () => void;
  onDismiss?:  () => void;
  onPurchase?: (result: PurchaseResult) => void;
  onRestore?:  () => void;
}

// ── Nombres de placements (centralizados) ────────────────────────────────────
// Deben coincidir con los configurados en el dashboard de Superwall

export const PLACEMENTS = {
  openSimulator:        'open_simulator',         // al intentar abrir el simulador
  viewAdvancedAnalytics:'view_advanced_analytics', // al ir a /stats con cuenta free
  startUnlimitedSession:'start_unlimited_session', // al superar el límite de 10
  viewTradeDesk:        'view_trade_desk',         // al abrir /trade
  viewMissions:         'view_missions',           // al intentar misiones Pro
  manualUpgrade:        'manual_upgrade',          // CTA de upgrade explícito
} as const;

export type PlacementKey = keyof typeof PLACEMENTS;

// ── Estado interno singleton ──────────────────────────────────────────────────

type Listener = (status: PaymentStatus | null) => void;

class SuperwallAdapter {
  private _status:    PaymentStatus | null = null;
  private _listeners: Set<Listener>        = new Set();
  private _apiKey:    string               = '';
  private _initialized = false;

  // ── Inicialización ──────────────────────────────────────────────────────────

  /**
   * Debe llamarse una sola vez al montar la app (en el layout raíz).
   * Cuando Superwall lance su SDK web real, aquí se llamará también
   * `Superwall.configure(apiKey, { purchaseController: this })`.
   */
  configure(apiKey: string): void {
    if (this._initialized) return;
    this._apiKey     = apiKey;
    this._initialized = true;

    if (process.env.NODE_ENV === 'development') {
      console.debug('[Superwall] configured', { apiKey: apiKey.slice(0, 8) + '...' });
    }
  }

  // ── Estado de suscripción ───────────────────────────────────────────────────

  /** Carga el estado desde el backend y notifica a los listeners */
  async fetchStatus(): Promise<PaymentStatus | null> {
    try {
      const res = await api.get<PaymentStatus>('/payments/status');
      this._status = res.data;
      this._emit(this._status);
      return this._status;
    } catch {
      // El usuario no está autenticado o el backend no responde
      return null;
    }
  }

  /** Estado en caché (sin petición de red) */
  get status(): PaymentStatus | null {
    return this._status;
  }

  /** true si el usuario tiene acceso completo */
  get isSubscribed(): boolean {
    return this._status?.paid === true;
  }

  /** Actualiza el estado localmente (tras pago exitoso, sin esperar webhook) */
  setStatus(status: PaymentStatus): void {
    this._status = status;
    this._emit(status);
  }

  // ── Placements ──────────────────────────────────────────────────────────────

  /**
   * Registra un placement/evento.
   * Si el usuario tiene acceso → devuelve 'granted' inmediatamente.
   * Si no             → llama onPresent y devuelve 'paywall_presented'.
   *
   * Equivale a `Superwall.shared.register(placement, params, handler)`
   * en el SDK nativo.
   */
  async register(
    placement: string,
    _params?: Record<string, unknown>,
    handler?: PlacementHandler,
  ): Promise<PlacementResult> {
    // Asegurar que el estado esté cargado
    if (!this._status) await this.fetchStatus();

    const granted = this._isGranted(placement);

    if (granted) return 'granted';

    // Mostrar el paywall
    handler?.onPresent?.();
    return 'paywall_presented';
  }

  /**
   * Lógica de acceso por placement.
   * Permite personalizar qué features son free vs Pro.
   */
  private _isGranted(placement: string): boolean {
    if (!this._status) return true; // sin estado → conceder (falla silenciosa)
    if (this._status.paid) return true;

    // Reglas específicas por placement
    switch (placement) {
      case PLACEMENTS.openSimulator:
      case PLACEMENTS.viewTradeDesk:
        // Permitir si quedan simulaciones gratuitas
        return this._status.canSimulate;

      case PLACEMENTS.startUnlimitedSession:
        return this._status.paid;

      case PLACEMENTS.viewAdvancedAnalytics:
      case PLACEMENTS.viewMissions:
        return this._status.paid;

      default:
        return true;
    }
  }

  // ── Flujo de compra ─────────────────────────────────────────────────────────

  /**
   * Inicia el flujo de compra delegando a Stripe Checkout.
   *
   * Cuando el SDK web de Superwall esté disponible, este método
   * pasará a ser el `purchaseController.purchase(product)` que
   * Superwall invoca al pulsar "Comprar" en el paywall.
   */
  async purchase(_plan: Plan = 'lifetime'): Promise<PurchaseResult> {
    try {
      const res = await api.post<{ url: string; sessionId: string }>(
        '/payments/checkout',
      );

      // Redirigir a Stripe Checkout
      window.location.href = res.data.url;

      // El pago es asíncrono: el resultado llega por webhook + /payment/success
      return { outcome: 'pending', checkoutUrl: res.data.url };
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? 'Error al iniciar el pago. Intenta de nuevo.';
      return { outcome: 'failed', error: message };
    }
  }

  /**
   * Sincroniza el estado tras un pago exitoso (llamar desde /payment/success).
   * Equivale a `Superwall.shared.setSubscriptionStatus(.active)` en mobile.
   */
  async confirmPurchase(): Promise<PaymentStatus | null> {
    try {
      await api.post('/payments/sync');
      return this.fetchStatus();
    } catch {
      return null;
    }
  }

  /**
   * Restaurar compras (para usuarios que ya pagaron en otro dispositivo).
   * Equivale a `purchaseController.restorePurchases()` en el SDK nativo.
   */
  async restorePurchases(): Promise<boolean> {
    const status = await this.fetchStatus();
    return status?.paid === true;
  }

  // ── Listeners ───────────────────────────────────────────────────────────────

  /** Suscribirse a cambios de estado de suscripción */
  subscribe(listener: Listener): () => void {
    this._listeners.add(listener);
    // Emitir el estado actual inmediatamente si ya existe
    if (this._status) listener(this._status);
    return () => this._listeners.delete(listener);
  }

  private _emit(status: PaymentStatus | null): void {
    this._listeners.forEach((l) => l(status));
  }
}

// ── Singleton exportado ──────────────────────────────────────────────────────

const Superwall = new SuperwallAdapter();
export default Superwall;

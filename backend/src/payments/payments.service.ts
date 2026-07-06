/**
 * payments.service.ts
 *
 * Responsabilidades:
 *  - Crear/reutilizar el Customer de Stripe por usuario
 *  - Generar sesiones de Checkout para suscripciones Y pagos únicos (lifetime)
 *  - Procesar webhooks de Stripe y mantener subscription_status sincronizado
 *  - Exponer getStatus() que devuelve el estado completo al frontend
 *
 * Stripe es la fuente de verdad de pagos.
 * Superwall consume getStatus() para decidir si mostrar el paywall.
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

// ── Stripe product ID ─────────────────────────────────────────────────────────
// Un solo precio: €9.95 pago único, acceso de por vida
// Configurar en Railway: STRIPE_PRICE_LIFETIME=price_1...
const PRICE_LIFETIME = process.env.STRIPE_PRICE_LIFETIME ?? '';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-06-24.dahlia' as any,
    });
  }

  // ── 1. CUSTOMER ─────────────────────────────────────────────────────────────

  /**
   * Devuelve el stripeCustomerId existente o crea uno nuevo.
   * Garantiza que cada usuario tiene exactamente un Customer en Stripe.
   */
  private async getOrCreateCustomer(userId: string, email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (user?.stripeCustomerId) return user.stripeCustomerId;

    // Buscar por email en Stripe antes de crear (evita duplicados)
    const existing = await this.stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0]
      ?? await this.stripe.customers.create({ email, metadata: { userId } });

    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  // ── 2. CHECKOUT SESSION ──────────────────────────────────────────────────────

  /**
   * Crea una sesión de Checkout de Stripe.
   * @param plan 'monthly' | 'annual' | 'lifetime' (default 'lifetime')
   *
   * Superwall delega aquí cuando el usuario acepta comprar.
   * La URL de retorno incluye ?session_id para que el frontend
   * pueda confirmar el pago y notificar a Superwall.
   */
  async createCheckoutSession(
    userId: string,
    userEmail: string,
  ): Promise<{ url: string; sessionId: string }> {
    if (!PRICE_LIFETIME) {
      throw new BadRequestException('STRIPE_PRICE_LIFETIME no está configurado en las variables de entorno');
    }

    const customerId = await this.getOrCreateCustomer(userId, userEmail);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',           // pago único, no suscripción
      customer: customerId,
      payment_method_types: ['card', 'ideal'],
      line_items: [{ price: PRICE_LIFETIME, quantity: 1 }],
      metadata: { userId },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.FRONTEND_URL}/payment/cancelled`,
    });

    return { url: session.url!, sessionId: session.id };
  }

  // ── 3. WEBHOOKS ──────────────────────────────────────────────────────────────

  /**
   * Punto de entrada único para todos los eventos de Stripe.
   * Railway recibe el webhook en POST /payments/webhook con rawBody.
   *
   * Eventos manejados:
   *  - checkout.session.completed       → pago único (lifetime) completado
   *  - customer.subscription.created    → nueva suscripción activa
   *  - customer.subscription.updated    → cambio de plan o estado
   *  - customer.subscription.deleted    → suscripción cancelada/expirada
   *  - invoice.paid                     → renovación mensual/anual exitosa
   *  - invoice.payment_failed           → pago fallido → PAST_DUE
   */
  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch {
      throw new BadRequestException('Stripe webhook signature inválida');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.onCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.onSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.onSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await this.onInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.onInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        // Eventos no manejados se ignoran silenciosamente
        break;
    }
  }

  // ── Handlers de webhook ────────────────────────────────────────────────────

  /** Pago único (lifetime) completado vía Checkout */
  private async onCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    if (session.payment_status !== 'paid') return;
    const userId = session.metadata?.userId;
    if (!userId) return;

    const plan = session.metadata?.plan ?? 'lifetime';

    if (plan === 'lifetime') {
      // Acceso perpetuo: marcamos paidAt + status ACTIVE sin subscriptionId
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          paidAt: new Date(),
          stripeSessionId: session.id,
          stripeCustomerId: session.customer as string,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          subscriptionEndsAt: null, // lifetime = no expira
        },
      });
    }
    // Si es subscription, el evento customer.subscription.created llega justo después
  }

  /** Suscripción creada o actualizada */
  private async onSubscriptionUpdated(sub: Stripe.Subscription): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: sub.customer as string },
    });
    if (!user) return;

    const status = this.mapStripeStatus(sub.status);
    // current_period_end existe en el objeto runtime aunque las typedefs nuevas no lo expongan
    const periodEnd: number | undefined = (sub as any).current_period_end;
    const endsAt = periodEnd ? new Date(periodEnd * 1000) : null;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionId:     sub.id,
        subscriptionStatus: status,
        subscriptionEndsAt: endsAt,
        // Marcar paidAt si acaba de activarse
        paidAt: status === SubscriptionStatus.ACTIVE ? (user.paidAt ?? new Date()) : user.paidAt,
      },
    });
  }

  /** Suscripción eliminada (cancelada o expirada) */
  private async onSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: sub.customer as string },
    });
    if (!user) return;

    const cancelPeriodEnd: number | undefined = (sub as any).current_period_end;
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: SubscriptionStatus.CANCELLED,
        subscriptionEndsAt: cancelPeriodEnd
          ? new Date(cancelPeriodEnd * 1000)
          : new Date(),
      },
    });
  }

  /** Factura pagada (renovación exitosa) → mantener ACTIVE */
  private async onInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    });
    if (!user) return;

    await this.prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: SubscriptionStatus.ACTIVE },
    });
  }

  /** Factura fallida → período de gracia PAST_DUE */
  private async onInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer as string },
    });
    if (!user) return;

    await this.prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: SubscriptionStatus.PAST_DUE },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Convierte el estado de Stripe al enum interno */
  private mapStripeStatus(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
    switch (stripeStatus) {
      case 'active':
      case 'trialing':
        return SubscriptionStatus.ACTIVE;
      case 'past_due':
      case 'unpaid':
        return SubscriptionStatus.PAST_DUE;
      case 'canceled':
      case 'incomplete_expired':
        return SubscriptionStatus.CANCELLED;
      case 'incomplete':
        return SubscriptionStatus.FREE;
      default:
        return SubscriptionStatus.FREE;
    }
  }

  // ── 4. STATUS (consumido por frontend + Superwall) ───────────────────────────

  /**
   * Devuelve el estado completo del usuario.
   * El frontend usa este endpoint para:
   *  - Inicializar Superwall con el estado de suscripción correcto
   *  - Decidir si mostrar o no el paywall
   *  - Contar simulaciones usadas en el tier free
   */
  async getStatus(userId: string): Promise<{
    paid:              boolean;
    subscriptionStatus: SubscriptionStatus;
    subscriptionEndsAt: Date | null;
    simulationsUsed:   number;
    simulationsLimit:  number;
    canSimulate:       boolean;
    plan:              'free' | 'lifetime';
  }> {
    const [user, simCount] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          paidAt:             true,
          subscriptionStatus: true,
          subscriptionId:     true,
          subscriptionEndsAt: true,
        },
      }),
      this.prisma.trade.count({ where: { userId } }),
    ]);

    if (!user) {
      return {
        paid: false,
        subscriptionStatus: SubscriptionStatus.FREE,
        subscriptionEndsAt: null,
        simulationsUsed:  0,
        simulationsLimit: 10,
        canSimulate:      true,
        plan:             'free',
      };
    }

    const isActive = user.subscriptionStatus === SubscriptionStatus.ACTIVE;
    const isPastDue = user.subscriptionStatus === SubscriptionStatus.PAST_DUE;

    // Acceso permitido si está activo, en período de gracia, o es lifetime
    const paid       = isActive || isPastDue || !!user.paidAt;
    const canSimulate = paid || simCount < 10;

    // Inferir el plan a partir del estado
    const plan: 'free' | 'lifetime' = isActive || user.paidAt ? 'lifetime' : 'free';

    return {
      paid,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEndsAt: user.subscriptionEndsAt,
      simulationsUsed:  simCount,
      simulationsLimit: 10,
      canSimulate,
      plan,
    };
  }

  // ── 5. SUPERWALL CALLBACK ────────────────────────────────────────────────────

  /**
   * Superwall llama a este endpoint después de que el usuario completa
   * el pago en Stripe para sincronizar el estado de acceso.
   *
   * También puede usarse desde el frontend después de
   * un redirect exitoso de Stripe Checkout.
   */
  async syncSuperwallStatus(userId: string): Promise<{ status: SubscriptionStatus }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true, stripeCustomerId: true, subscriptionId: true },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    // Si tiene subscriptionId activo, verificar con Stripe en tiempo real
    if (user.subscriptionId) {
      try {
        const sub = await this.stripe.subscriptions.retrieve(user.subscriptionId);
        const freshStatus = this.mapStripeStatus(sub.status);
        await this.prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: freshStatus },
        });
        return { status: freshStatus };
      } catch {
        // Si Stripe falla, devolver el estado local
      }
    }

    return { status: user.subscriptionStatus };
  }

  /**
   * Portal de billing de Stripe: permite al usuario gestionar
   * su suscripción (cancelar, cambiar plan, actualizar tarjeta).
   */
  async createBillingPortalSession(userId: string): Promise<{ url: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      throw new BadRequestException('No hay customer de Stripe asociado a este usuario');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer:   user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    return { url: session.url };
  }
}

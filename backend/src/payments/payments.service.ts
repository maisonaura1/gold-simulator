import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createCheckoutSession(userId: string, userEmail: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'ideal'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'GoldTrader MT — Acceso completo',
              description: 'Pago único · Acceso ilimitado al simulador XAU/USD',
              images: [],
            },
            unit_amount: 995, // €9.95 in cents
          },
          quantity: 1,
        },
      ],
      metadata: { userId },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.FRONTEND_URL}/payment/cancelled`,
    });

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId && session.payment_status === 'paid') {
        await this.prisma.user.update({
          where: { id: userId },
          data: { paidAt: new Date(), stripeSessionId: session.id },
        });
      }
    }
  }

  async getStatus(userId: string) {
    const [user, simCount] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true, paidAt: true },
      }),
      this.prisma.trade.count({ where: { userId } }),
    ]);
    if (!user) return { paid: false, trialActive: false, trialDaysLeft: 0, simulationsUsed: 0, simulationsLimit: 10 };

    const paid = !!user.paidAt;
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceCreation = (Date.now() - user.createdAt.getTime()) / msPerDay;
    const trialDaysLeft = Math.max(0, Math.ceil(7 - daysSinceCreation));
    const trialActive = trialDaysLeft > 0;
    const simulationsLimit = 10;
    const simulationsUsed = simCount;
    const canSimulate = paid || simulationsUsed < simulationsLimit;

    return { paid, trialActive, trialDaysLeft, simulationsUsed, simulationsLimit, canSimulate };
  }
}

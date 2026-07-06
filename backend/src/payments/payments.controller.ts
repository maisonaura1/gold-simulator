/**
 * payments.controller.ts
 *
 * Endpoints públicos y autenticados del módulo de pagos.
 * Stripe es el procesador; Superwall consume /status y /sync.
 */

import {
  Controller, Post, Get, Req, Res, Headers,
  UseGuards, RawBodyRequest,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  /**
   * POST /payments/checkout
   * Genera sesión de Stripe Checkout para el pago único €9.95 lifetime.
   */
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(@CurrentUser() user: { sub: string; email: string }) {
    return this.payments.createCheckoutSession(user.sub, user.email);
  }

  /**
   * GET /payments/status
   *
   * Frontend lo llama al montar la app para:
   *  1. Inicializar Superwall con el subscriptionStatus correcto
   *  2. Decidir si mostrar TrialBanner o bloquear features
   */
  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@CurrentUser() user: { sub: string }) {
    return this.payments.getStatus(user.sub);
  }

  /**
   * POST /payments/sync
   *
   * Llamado desde el frontend después de que Stripe redirige
   * al usuario a /payment/success. Verifica el estado real con
   * Stripe y actualiza la DB. Superwall lo usa para confirmar acceso.
   */
  @UseGuards(JwtAuthGuard)
  @Post('sync')
  sync(@CurrentUser() user: { sub: string }) {
    return this.payments.syncSuperwallStatus(user.sub);
  }

  /**
   * GET /payments/portal
   *
   * Devuelve URL del portal de billing de Stripe.
   * Permite al usuario gestionar/cancelar su suscripción.
   */
  @UseGuards(JwtAuthGuard)
  @Get('portal')
  portal(@CurrentUser() user: { sub: string }) {
    return this.payments.createBillingPortalSession(user.sub);
  }

  /**
   * POST /payments/webhook
   * Header: stripe-signature (verificado con STRIPE_WEBHOOK_SECRET)
   *
   * Requiere rawBody — configurado en main.ts con bodyParser.
   * NO protegido con JWT (Stripe llama directamente).
   */
  @Post('webhook')
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
    @Res() res: Response,
  ) {
    try {
      await this.payments.handleWebhook(req.rawBody!, sig);
      res.json({ received: true });
    } catch (e: any) {
      res.status(400).send(e.message);
    }
  }
}

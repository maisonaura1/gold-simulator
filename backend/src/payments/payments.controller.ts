import {
  Controller, Post, Get, Req, Res, Headers, UseGuards, RawBodyRequest,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  /** Authenticated: create a Stripe Checkout session */
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@CurrentUser() user: { sub: string; email: string }) {
    return this.payments.createCheckoutSession(user.sub, user.email);
  }

  /** Authenticated: get trial/payment status */
  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@CurrentUser() user: { sub: string }) {
    return this.payments.getStatus(user.sub);
  }

  /** Public: Stripe webhook (raw body required) */
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

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailsService } from './emails.service';
import { PaymentsService } from '../payments/payments.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private prisma: PrismaService,
    private emails: EmailsService,
    private payments: PaymentsService,
  ) {}

  /** Runs daily at 10:00 UTC */
  @Cron('0 10 * * *')
  async dailyEmailJobs() {
    // allSettled: both jobs always run independently even if one throws
    const results = await Promise.allSettled([
      this.sendInactivityEmails(),
      this.sendPreRenewalEmails(),
    ]);
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        this.logger.error(`Daily email job ${i} failed: ${r.reason}`);
      }
    });
  }

  /** Day 7 inactivity — user hasn't simulated in 7 days */
  private async sendInactivityEmails() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const eightDaysAgo = new Date(Date.now() - 8 * 86400000);

    const users = await this.prisma.user.findMany({
      where: {
        trades: {
          none: { entryAt: { gte: sevenDaysAgo } },
          some: { entryAt: { gte: eightDaysAgo, lt: sevenDaysAgo } },
        },
      },
      select: {
        email: true,
        trades: { orderBy: { entryAt: 'desc' }, take: 1, select: { entryAt: true } },
      },
    });

    this.logger.log(`Inactivity emails: ${users.length} candidates`);

    for (const user of users) {
      const lastTrade = user.trades[0]?.entryAt;
      const days = lastTrade
        ? Math.floor((Date.now() - lastTrade.getTime()) / 86400000)
        : 7;
      // Wrap per-user send so one failure doesn't abort remaining users
      await this.emails.sendInactivityReminder(user.email, days, null).catch((e) =>
        this.logger.error(`Inactivity email failed for ${user.email}: ${e}`),
      );
    }
  }

  /** Pre-renewal — subscription renews in ~5 days */
  private async sendPreRenewalEmails() {
    const fiveDaysFromNow = new Date(Date.now() + 5 * 86400000);
    const sixDaysFromNow  = new Date(Date.now() + 6 * 86400000);

    const users = await this.prisma.user.findMany({
      where: {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionEndsAt: { gte: fiveDaysFromNow, lt: sixDaysFromNow },
      },
      select: { email: true, subscriptionEndsAt: true, subscriptionId: true },
    });

    this.logger.log(`Pre-renewal emails: ${users.length} candidates`);

    for (const user of users) {
      if (!user.subscriptionEndsAt || !user.subscriptionId) continue;

      // Plan and amount come from Stripe; skip subscriptions set to cancel
      const renewal = await this.payments.getRenewalInfo(user.subscriptionId).catch((e) => {
        this.logger.error(`Renewal lookup failed for ${user.email}: ${e}`);
        return null;
      });
      if (!renewal) continue;
      const { plan, price } = renewal;

      await this.emails.sendPreRenewalReminder(
        user.email, user.subscriptionEndsAt, plan, price,
      ).catch((e) =>
        this.logger.error(`Pre-renewal email failed for ${user.email}: ${e}`),
      );
    }
  }
}

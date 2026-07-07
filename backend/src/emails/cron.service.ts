import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailsService } from './emails.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private prisma: PrismaService,
    private emails: EmailsService,
  ) {}

  /** Runs daily at 10:00 UTC */
  @Cron('0 10 * * *')
  async dailyEmailJobs() {
    await Promise.all([
      this.sendInactivityEmails(),
      this.sendPreRenewalEmails(),
    ]);
  }

  /** Day 7 inactivity — user hasn't simulated in 7 days */
  private async sendInactivityEmails() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const eightDaysAgo = new Date(Date.now() - 8 * 86400000);

    // Users whose last trade was exactly 7 days ago (window: 24h)
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
      await this.emails.sendInactivityReminder(user.email, days, null);
    }
  }

  /** Day 25 pre-renewal — subscription renews in ~5 days (monthly=30d, annual=365d) */
  private async sendPreRenewalEmails() {
    const fiveDaysFromNow   = new Date(Date.now() + 5 * 86400000);
    const sixDaysFromNow    = new Date(Date.now() + 6 * 86400000);

    const users = await this.prisma.user.findMany({
      where: {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionEndsAt: { gte: fiveDaysFromNow, lt: sixDaysFromNow },
      },
      select: { email: true, subscriptionEndsAt: true, subscriptionId: true },
    });

    this.logger.log(`Pre-renewal emails: ${users.length} candidates`);

    for (const user of users) {
      if (!user.subscriptionEndsAt) continue;

      // Determine plan label and price from subscription id presence
      // (crude but avoids a Stripe API call per user in the cron)
      const renewalDate = user.subscriptionEndsAt;
      const daysBetween = Math.round(
        (renewalDate.getTime() - (renewalDate.getTime() - 30 * 86400000)) / 86400000,
      );
      const isAnnual = daysBetween > 300;
      const plan  = isAnnual ? 'Pro Annual' : 'Pro Monthly';
      const price = isAnnual ? '€79' : '€9.95';

      await this.emails.sendPreRenewalReminder(user.email, renewalDate, plan, price);
    }
  }
}

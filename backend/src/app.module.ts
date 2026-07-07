import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { TradesModule } from './trades/trades.module';
import { MissionsModule } from './missions/missions.module';
import { StatsModule } from './stats/stats.module';
import { PricesModule } from './prices/prices.module';
import { PaymentsModule } from './payments/payments.module';
import { TradeDeskModule } from './trade-desk/trade-desk.module';
import { ReferralModule } from './referral/referral.module';
import { EmailsModule } from './emails/emails.module';
import { EmailsService } from './emails/emails.service';
import { CronService } from './emails/cron.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    AccountModule,
    TradesModule,
    MissionsModule,
    StatsModule,
    PricesModule,
    PaymentsModule,
    TradeDeskModule,
    ReferralModule,
    EmailsModule,
  ],
  providers: [CronService, EmailsService],
})
export class AppModule {}

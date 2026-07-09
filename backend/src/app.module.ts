import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
  providers: [
    // Activate rate limiting globally — without this APP_GUARD the
    // ThrottlerModule is registered but @Throttle decorators have no effect.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // CronService is declared here (not inside EmailsModule) so @nestjs/schedule
    // can discover its @Cron methods. EmailsService is provided by EmailsModule
    // (imported above) and injected via DI — no duplicate instantiation.
    CronService,
  ],
})
export class AppModule {}

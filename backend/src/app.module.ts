import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { TradesModule } from './trades/trades.module';
import { MissionsModule } from './missions/missions.module';
import { StatsModule } from './stats/stats.module';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    AccountModule,
    TradesModule,
    MissionsModule,
    StatsModule,
    PricesModule,
  ],
})
export class AppModule {}

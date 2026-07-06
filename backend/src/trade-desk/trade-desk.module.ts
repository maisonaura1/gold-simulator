import { Module } from '@nestjs/common';
import { TradeDeskController } from './trade-desk.controller';
import { TradeDeskService } from './trade-desk.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TradeDeskController],
  providers: [TradeDeskService],
})
export class TradeDeskModule {}

import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { SimulatorService } from './simulator.service';
import { AccountModule } from '../account/account.module';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [AccountModule, PricesModule],
  controllers: [TradesController],
  providers: [TradesService, SimulatorService],
  exports: [TradesService],
})
export class TradesModule {}

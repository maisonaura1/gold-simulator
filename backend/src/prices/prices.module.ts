import { Module } from '@nestjs/common';
import { PricesGateway } from './prices.gateway';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { DataFetcherService } from './data-fetcher.service';

@Module({
  controllers: [PricesController],
  providers:   [DataFetcherService, PricesService, PricesGateway],
  exports:     [DataFetcherService, PricesService],
})
export class PricesModule {}

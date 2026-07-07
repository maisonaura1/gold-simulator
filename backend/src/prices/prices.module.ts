import { Module } from '@nestjs/common';
import { PricesGateway } from './prices.gateway';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { DataFetcherService } from './data-fetcher.service';
import { IntradayService } from './intraday.service';

@Module({
  controllers: [PricesController],
  providers:   [DataFetcherService, PricesService, PricesGateway, IntradayService],
  exports:     [DataFetcherService, PricesService, IntradayService],
})
export class PricesModule {}

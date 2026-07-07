import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DataFetcherService } from './data-fetcher.service';
import { PricesService } from './prices.service';
import { IntradayService } from './intraday.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('prices')
export class PricesController {
  constructor(
    private fetcher:   DataFetcherService,
    private prices:    PricesService,
    private intraday:  IntradayService,
  ) {}

  @Get('current')
  getCurrent() {
    return {
      symbol:   'XAUUSD',
      price:    this.prices.getCurrentPrice(),
      candles:  this.prices.getRecentCandles(1).at(-1),
      total:    this.prices.getAllCandles().length,
    };
  }

  @Get('candles')
  getCandles() {
    return this.prices.getRecentCandles(300);
  }

  @Get('intraday')
  async getIntraday(@Query('tf') tf = 'M5') {
    const valid = ['M1', 'M5', 'M15'];
    const safeTf = valid.includes(tf) ? tf : 'M5';
    return this.intraday.getIntraday(safeTf);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh() {
    await this.fetcher.fetchHistorical();
    return { ok: true, candles: this.prices.getAllCandles().length };
  }
}

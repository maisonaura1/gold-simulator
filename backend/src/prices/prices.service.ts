import { Injectable } from '@nestjs/common';
import { DataFetcherService } from './data-fetcher.service';

// Thin wrapper — the gateway & trades use this to decouple from DataFetcher
@Injectable()
export class PricesService {
  constructor(private fetcher: DataFetcherService) {}

  getRecentCandles(count = 300) {
    return this.fetcher.getCandles(count);
  }

  getCurrentPrice(): number {
    return this.fetcher.getCurrentPrice();
  }

  getAllCandles() {
    return this.fetcher.getAllCandles();
  }
}

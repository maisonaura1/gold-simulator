import { Injectable, Logger } from '@nestjs/common';

export interface IntradayCandle {
  timestamp: number;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface CacheEntry {
  candles: IntradayCandle[];
  synthetic: boolean;
  fetchedAt: number;
}

const TD_BASE = 'https://api.twelvedata.com';
const TD_KEY  = () => process.env.TWELVE_DATA_API_KEY ?? '';

const TF_MAP: Record<string, { interval: string; outputsize: number }> = {
  M1:  { interval: '1min',  outputsize: 500 },
  M5:  { interval: '5min',  outputsize: 500 },
  M15: { interval: '15min', outputsize: 500 },
};

const CACHE_TTL: Record<string, number> = {
  M1: 60_000, M5: 300_000, M15: 300_000,
};

@Injectable()
export class IntradayService {
  private readonly logger = new Logger(IntradayService.name);
  private cache = new Map<string, CacheEntry>();

  async getIntraday(tf: string): Promise<{ candles: IntradayCandle[]; synthetic: boolean; total: number }> {
    const entry = this.cache.get(tf);
    const ttl   = CACHE_TTL[tf] ?? 300_000;

    if (entry && Date.now() - entry.fetchedAt < ttl) {
      this.logger.debug(`[${tf}] serving from cache (${entry.candles.length} candles)`);
      return { candles: entry.candles, synthetic: entry.synthetic, total: entry.candles.length };
    }

    const candles = await this.fetchFromTwelveData(tf);

    if (candles) {
      this.cache.set(tf, { candles, synthetic: false, fetchedAt: Date.now() });
      return { candles, synthetic: false, total: candles.length };
    }

    // Stale cache is better than synthetic
    if (entry) {
      this.logger.warn(`[${tf}] Twelve Data unavailable — serving stale cache`);
      return { candles: entry.candles, synthetic: false, total: entry.candles.length };
    }

    this.logger.warn(`[${tf}] No data available — serving synthetic`);
    const synthetic = this.generateSynthetic(tf);
    return { candles: synthetic, synthetic: true, total: synthetic.length };
  }

  private async fetchFromTwelveData(tf: string): Promise<IntradayCandle[] | null> {
    if (!TD_KEY()) {
      this.logger.warn('TWELVE_DATA_API_KEY not set');
      return null;
    }

    const cfg = TF_MAP[tf] ?? TF_MAP['M5'];
    const url  = `${TD_BASE}/time_series?symbol=XAU/USD&interval=${cfg.interval}&outputsize=${cfg.outputsize}&apikey=${TD_KEY()}&format=JSON`;

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) {
        this.logger.warn(`Twelve Data HTTP ${res.status} for ${tf}`);
        return null;
      }

      const json = await res.json() as Record<string, unknown>;

      if ((json as { status?: string }).status === 'error') {
        this.logger.warn(`Twelve Data error for ${tf}: ${(json as { message?: string }).message}`);
        return null;
      }

      const values = json['values'] as Array<{
        datetime: string;
        open: string;
        high: string;
        low: string;
        close: string;
        volume?: string;
      }> | undefined;

      if (!values?.length) return null;

      const candles: IntradayCandle[] = values
        .map((v) => {
          const c = +parseFloat(v.close).toFixed(2);
          return {
            timestamp: new Date(v.datetime).getTime(),
            price:  c,
            open:   +parseFloat(v.open).toFixed(2),
            high:   +parseFloat(v.high).toFixed(2),
            low:    +parseFloat(v.low).toFixed(2),
            close:  c,
            volume: v.volume ? Math.round(parseFloat(v.volume)) : undefined,
          };
        })
        .filter((c) => c.open && c.high && c.low && c.close)
        .sort((a, b) => a.timestamp - b.timestamp);

      this.logger.log(`[${tf}] fetched ${candles.length} candles from Twelve Data`);
      return candles;
    } catch (err) {
      this.logger.warn(`Twelve Data fetch error for ${tf}: ${err}`);
      return null;
    }
  }

  private generateSynthetic(tf: string): IntradayCandle[] {
    const intervalMs: Record<string, number> = { M1: 60_000, M5: 300_000, M15: 900_000 };
    const ms    = intervalMs[tf] ?? 300_000;
    const count = tf === 'M1' ? 500 : 300;
    const now   = Date.now();
    let price   = 3340 + Math.random() * 20;
    const candles: IntradayCandle[] = [];

    for (let i = count; i >= 0; i--) {
      const drift = (Math.random() - 0.499) * 0.8;
      const open  = price;
      price = Math.max(3200, Math.min(3500, price + drift));
      const close = price;
      candles.push({
        timestamp: now - i * ms,
        price:  +close.toFixed(2),
        open:   +open.toFixed(2),
        high:   +(Math.max(open, close) + Math.random() * 0.6).toFixed(2),
        low:    +(Math.min(open, close) - Math.random() * 0.6).toFixed(2),
        close:  +close.toFixed(2),
        volume: Math.floor(Math.random() * 500 + 100),
      });
    }
    return candles;
  }
}

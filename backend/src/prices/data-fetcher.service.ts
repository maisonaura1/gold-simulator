import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface OhlcCandle {
  time: number;   // unix ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

const DATA_DIR  = join(process.cwd(), '..', 'data');
const DATA_FILE = join(DATA_DIR, 'xauusd_h1.json');

// Yahoo Finance — sin API key, ticker XAUUSD=X
const YF_HIST_URL =
  'https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1h&range=2y&includePrePost=false';
const YF_PRICE_URL =
  'https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1m&range=1d&includePrePost=false';

@Injectable()
export class DataFetcherService implements OnModuleInit {
  private readonly logger = new Logger(DataFetcherService.name);
  private candles: OhlcCandle[] = [];
  private currentPrice = 0;
  private lastFetchAt  = 0;

  async onModuleInit() {
    this.ensureDataDir();
    await this.loadOrFetch();
    // Refresh price every 30 seconds
    setInterval(() => this.refreshCurrentPrice(), 30_000);
  }

  // ── Public API ────────────────────────────────────────────

  getCandles(count = 300): OhlcCandle[] {
    return this.candles.slice(-count);
  }

  getCurrentPrice(): number {
    return this.currentPrice || this.candles.at(-1)?.close || 4000;
  }

  getAllCandles(): OhlcCandle[] {
    return this.candles;
  }

  // ── Init ──────────────────────────────────────────────────

  private async loadOrFetch() {
    if (existsSync(DATA_FILE)) {
      try {
        this.candles = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
        this.currentPrice = this.candles.at(-1)?.close ?? 0;
        this.logger.log(`Loaded ${this.candles.length} candles from cache`);

        // Refresh if cache is older than 6 hours
        const lastCandle = this.candles.at(-1);
        const ageHours   = lastCandle ? (Date.now() - lastCandle.time) / 3_600_000 : 999;
        if (ageHours > 6) await this.fetchHistorical();
        else await this.refreshCurrentPrice();
        return;
      } catch {
        this.logger.warn('Cache corrupt — refetching');
      }
    }

    await this.fetchHistorical();
  }

  // ── Yahoo Finance fetchers ────────────────────────────────

  async fetchHistorical(): Promise<void> {
    this.logger.log('Fetching XAUUSD historical data from Yahoo Finance...');
    try {
      const res  = await fetch(YF_HIST_URL, { headers: this.headers() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json() as any;
      const parsed = this.parseYahooChart(json);

      if (parsed.length < 10) throw new Error('Too few candles received');

      this.candles      = parsed;
      this.currentPrice = parsed.at(-1)?.close ?? 0;
      this.lastFetchAt  = Date.now();

      writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2));
      this.logger.log(`✅ Fetched & saved ${parsed.length} XAUUSD H1 candles`);
    } catch (err) {
      this.logger.error(`Historical fetch failed: ${err}. Falling back to synthetic data.`);
      if (this.candles.length === 0) this.useSyntheticFallback();
    }
  }

  async refreshCurrentPrice(): Promise<void> {
    try {
      const res  = await fetch(YF_PRICE_URL, { headers: this.headers() });
      if (!res.ok) return;

      const json   = await res.json() as any;
      const result = json?.chart?.result?.[0];
      const closes = result?.indicators?.quote?.[0]?.close ?? [];
      const last   = closes.filter(Boolean).at(-1);

      if (last && last > 100) {
        this.currentPrice = +last.toFixed(2);
        // Append a new pseudo-candle so the chart updates
        const prevClose = this.candles.at(-1)?.close ?? last;
        this.candles.push({
          time:  Date.now(),
          open:  prevClose,
          high:  +(Math.max(prevClose, last) + Math.random() * 0.5).toFixed(2),
          low:   +(Math.min(prevClose, last) - Math.random() * 0.5).toFixed(2),
          close: +last.toFixed(2),
        });
        // Keep only last 2000 candles in memory
        if (this.candles.length > 2000) this.candles = this.candles.slice(-2000);
        this.logger.verbose(`Price refreshed: $${this.currentPrice}`);
      }
    } catch {
      // Silent — use last known price
    }
  }

  // ── Parser ────────────────────────────────────────────────

  private parseYahooChart(json: any): OhlcCandle[] {
    const result = json?.chart?.result?.[0];
    if (!result) return [];

    const timestamps: number[]   = result.timestamp ?? [];
    const quote = result.indicators?.quote?.[0] ?? {};
    const opens:   number[] = quote.open   ?? [];
    const highs:   number[] = quote.high   ?? [];
    const lows:    number[] = quote.low    ?? [];
    const closes:  number[] = quote.close  ?? [];
    const volumes: number[] = quote.volume ?? [];

    const candles: OhlcCandle[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const o = opens[i], h = highs[i], l = lows[i], c = closes[i];
      if (!o || !h || !l || !c) continue;
      candles.push({
        time:   timestamps[i] * 1000,
        open:   +o.toFixed(2),
        high:   +h.toFixed(2),
        low:    +l.toFixed(2),
        close:  +c.toFixed(2),
        volume: volumes[i] ? Math.round(volumes[i]) : undefined,
      });
    }

    return candles.sort((a, b) => a.time - b.time);
  }

  // ── Synthetic fallback ────────────────────────────────────

  private useSyntheticFallback() {
    this.logger.warn('Using synthetic XAUUSD data');
    const candles: OhlcCandle[] = [];
    let price = 3300; // aproximado mid-2024; Yahoo Finance siempre sobrescribe esto
    const now = Date.now();

    for (let i = 0; i < 2000; i++) {
      const drift  = (Math.random() - 0.49) * 8;
      const open   = price;
      const close  = +(open + drift).toFixed(2);
      const high   = +(Math.max(open, close) + Math.random() * 4).toFixed(2);
      const low    = +(Math.min(open, close) - Math.random() * 4).toFixed(2);
      price = close;
      candles.push({ time: now - (2000 - i) * 3_600_000, open, high, low, close });
    }

    this.candles      = candles;
    this.currentPrice = candles.at(-1)?.close ?? 4000;
  }

  private ensureDataDir() {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  }

  private headers() {
    return {
      'User-Agent': 'Mozilla/5.0 (compatible; GoldSimulator/1.0)',
      'Accept': 'application/json',
    };
  }
}

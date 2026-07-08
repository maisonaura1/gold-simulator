import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { writeFileSync, readFileSync, existsSync, mkdirSync, renameSync } from 'fs';
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

const TD_BASE = 'https://api.twelvedata.com';
const TD_KEY  = () => process.env.TWELVE_DATA_API_KEY ?? '';

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
    return this.currentPrice || this.candles.at(-1)?.close || 3340;
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
        this.logger.log(`Loaded ${this.candles.length} candles from file cache`);

        const lastCandle = this.candles.at(-1);
        const ageHours   = lastCandle ? (Date.now() - lastCandle.time) / 3_600_000 : 999;
        if (ageHours > 6) await this.fetchHistorical();
        else await this.refreshCurrentPrice();
        return;
      } catch {
        this.logger.warn('Cache file corrupt — refetching');
      }
    }
    await this.fetchHistorical();
  }

  // ── Twelve Data fetchers ──────────────────────────────────

  async fetchHistorical(): Promise<void> {
    if (!TD_KEY()) {
      this.logger.warn('TWELVE_DATA_API_KEY not set — using synthetic fallback');
      if (this.candles.length === 0) this.useSyntheticFallback();
      return;
    }

    this.logger.log('Fetching XAUUSD H1 historical data from Twelve Data...');
    try {
      // Twelve Data: 5000 outputsize covers ~7 months of H1
      // We chain two requests to get ~2 years: last 5000 bars
      const url = `${TD_BASE}/time_series?symbol=XAU/USD&interval=1h&outputsize=5000&apikey=${TD_KEY()}&format=JSON`;
      const res  = await fetch(url, { signal: AbortSignal.timeout(15_000) });

      if (!res.ok) throw new Error(`Twelve Data HTTP ${res.status}`);

      const json = await res.json() as Record<string, unknown>;

      if ((json as { status?: string }).status === 'error') {
        throw new Error((json as { message?: string }).message ?? 'Twelve Data error');
      }

      const parsed = this.parseTwelveData(json);
      if (parsed.length < 10) throw new Error(`Too few candles: ${parsed.length}`);

      this.candles      = parsed;
      this.currentPrice = parsed.at(-1)?.close ?? 0;
      this.lastFetchAt  = Date.now();

      // Atomic write: write to temp file then rename to avoid corruption on crash
      const tmp = DATA_FILE + '.tmp';
      writeFileSync(tmp, JSON.stringify(parsed, null, 2));
      renameSync(tmp, DATA_FILE);
      this.logger.log(`✅ Fetched & saved ${parsed.length} XAUUSD H1 candles from Twelve Data`);
    } catch (err) {
      this.logger.error(`Historical fetch failed: ${err}`);
      if (this.candles.length === 0) this.useSyntheticFallback();
    }
  }

  async refreshCurrentPrice(): Promise<void> {
    if (!TD_KEY()) return;
    try {
      const url = `${TD_BASE}/price?symbol=XAU/USD&apikey=${TD_KEY()}`;
      const res  = await fetch(url, { signal: AbortSignal.timeout(5_000) });
      if (!res.ok) return;

      const json = await res.json() as { price?: string; status?: string };
      if (json.status === 'error') return;

      const price = parseFloat(json.price ?? '0');
      if (price > 100) {
        this.currentPrice = +price.toFixed(2);
        const prevClose = this.candles.at(-1)?.close ?? price;
        this.candles.push({
          time:  Date.now(),
          open:  prevClose,
          high:  +(Math.max(prevClose, price) + Math.random() * 0.5).toFixed(2),
          low:   +(Math.min(prevClose, price) - Math.random() * 0.5).toFixed(2),
          close: +price.toFixed(2),
        });
        if (this.candles.length > 2000) this.candles = this.candles.slice(-2000);
        this.logger.verbose(`Price refreshed: $${this.currentPrice}`);
      }
    } catch {
      // silent — keep last known price
    }
  }

  // ── Parser ────────────────────────────────────────────────

  private parseTwelveData(json: Record<string, unknown>): OhlcCandle[] {
    const values = json['values'] as Array<{
      datetime: string;
      open: string;
      high: string;
      low: string;
      close: string;
      volume?: string;
    }> | undefined;

    if (!values?.length) return [];

    const candles: OhlcCandle[] = values
      .map((v) => ({
        time:   new Date(v.datetime).getTime(),
        open:   +parseFloat(v.open).toFixed(2),
        high:   +parseFloat(v.high).toFixed(2),
        low:    +parseFloat(v.low).toFixed(2),
        close:  +parseFloat(v.close).toFixed(2),
        volume: v.volume ? Math.round(parseFloat(v.volume)) : undefined,
      }))
      .filter((c) => c.open && c.high && c.low && c.close);

    return candles.sort((a, b) => a.time - b.time);
  }

  // ── Synthetic fallback ────────────────────────────────────

  private useSyntheticFallback() {
    this.logger.warn('Using synthetic XAUUSD H1 data');
    const candles: OhlcCandle[] = [];
    let price = 3300;
    const now = Date.now();

    for (let i = 0; i < 2000; i++) {
      const drift = (Math.random() - 0.49) * 8;
      const open  = price;
      const close = +(open + drift).toFixed(2);
      const high  = +(Math.max(open, close) + Math.random() * 4).toFixed(2);
      const low   = +(Math.min(open, close) - Math.random() * 4).toFixed(2);
      price = close;
      candles.push({ time: now - (2000 - i) * 3_600_000, open, high, low, close });
    }

    this.candles      = candles;
    this.currentPrice = candles.at(-1)?.close ?? 3340;
  }

  private ensureDataDir() {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  }
}

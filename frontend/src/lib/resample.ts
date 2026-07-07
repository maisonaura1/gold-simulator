import type { PriceTick } from '@/types';

const INTERVAL_MS: Record<string, number> = {
  M1:  60_000,
  M5:  300_000,
  M15: 900_000,
  H1:  3_600_000,
  H4:  14_400_000,
  D1:  86_400_000,
  W1:  604_800_000,
  MN:  2_592_000_000,
};

export function resampleCandles(candles: PriceTick[], tf: string): PriceTick[] {
  if (tf === 'H1' || candles.length === 0) return candles;
  const interval = INTERVAL_MS[tf];
  if (!interval || interval < INTERVAL_MS['H1']) return candles; // can't upsample

  const buckets = new Map<number, PriceTick[]>();
  for (const c of candles) {
    const bucket = Math.floor(c.timestamp / interval) * interval;
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket)!.push(c);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([ts, cs]) => ({
      timestamp: ts,
      open:   cs[0].open,
      high:   Math.max(...cs.map((c) => c.high)),
      low:    Math.min(...cs.map((c) => c.low)),
      close:  cs[cs.length - 1].close,
      price:  cs[cs.length - 1].close,
      volume: cs.reduce((s, c) => s + (c.volume ?? 0), 0) || undefined,
    }));
}

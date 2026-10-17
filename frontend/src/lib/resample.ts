import type { PriceTick } from '@/types';

export const INTERVAL_MS: Record<string, number> = {
  M1: 60_000,
  M5: 300_000,
  M15: 900_000,
  H1: 3_600_000,
  H4: 14_400_000,
  D1: 86_400_000,
  W1: 604_800_000,
};

/** Agrupa velas H1 en temporalidades mayores (H4, D1, W1). */
export function resampleCandles(candles: PriceTick[], tf: string): PriceTick[] {
  const interval = INTERVAL_MS[tf];
  if (!interval || interval <= INTERVAL_MS.H1 || candles.length === 0) return candles;

  // Las semanas empiezan en lunes (el epoch fue jueves: +3 días)
  const offset = tf === 'W1' ? 3 * 86_400_000 : 0;
  const out: PriceTick[] = [];
  let cur: PriceTick | null = null;
  for (const c of candles) {
    const bucket = Math.floor((c.timestamp + offset) / interval) * interval - offset;
    if (!cur || cur.timestamp !== bucket) {
      if (cur) out.push(cur);
      cur = { timestamp: bucket, open: c.open, high: c.high, low: c.low, close: c.close, price: c.close, volume: c.volume };
    } else {
      cur.high = Math.max(cur.high, c.high);
      cur.low = Math.min(cur.low, c.low);
      cur.close = c.close;
      cur.price = c.close;
      cur.volume = (cur.volume ?? 0) + (c.volume ?? 0) || undefined;
    }
  }
  if (cur) out.push(cur);
  return out;
}

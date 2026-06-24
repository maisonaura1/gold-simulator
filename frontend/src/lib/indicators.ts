import type { PriceTick } from '@/types';

export interface LinePoint { time: number; value: number; }
export interface BBPoint   { time: number; upper: number; middle: number; lower: number; }
export interface RSIPoint  { time: number; value: number; }

export function calcMA(candles: PriceTick[], period: number): LinePoint[] {
  const result: LinePoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1);
    const avg   = slice.reduce((s, c) => s + c.close, 0) / period;
    result.push({ time: candles[i].timestamp, value: +avg.toFixed(2) });
  }
  return result;
}

export function calcBB(candles: PriceTick[], period = 20, mult = 2): BBPoint[] {
  const result: BBPoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    const slice  = candles.slice(i - period + 1, i + 1);
    const mean   = slice.reduce((s, c) => s + c.close, 0) / period;
    const variance = slice.reduce((s, c) => s + Math.pow(c.close - mean, 2), 0) / period;
    const std    = Math.sqrt(variance);
    result.push({
      time:   candles[i].timestamp,
      upper:  +(mean + mult * std).toFixed(2),
      middle: +mean.toFixed(2),
      lower:  +(mean - mult * std).toFixed(2),
    });
  }
  return result;
}

export function calcRSI(candles: PriceTick[], period = 14): RSIPoint[] {
  const result: RSIPoint[] = [];
  if (candles.length < period + 1) return result;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff > 0) gains  += diff;
    else          losses -= diff;
  }

  let avgGain = gains  / period;
  let avgLoss = losses / period;

  for (let i = period; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain)  / period;
    avgLoss = (avgLoss * (period - 1) + loss)  / period;

    const rs  = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    result.push({ time: candles[i].timestamp, value: +rsi.toFixed(2) });
  }

  return result;
}

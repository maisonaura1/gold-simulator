import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TD_BASE = 'https://api.twelvedata.com';
const TD_KEY  = () => process.env.TWELVE_DATA_API_KEY ?? '';

const TF_MAP: Record<string, { interval: string; outputsize: number }> = {
  M1:  { interval: '1min',  outputsize: 500 },
  M5:  { interval: '5min',  outputsize: 500 },
  M15: { interval: '15min', outputsize: 500 },
};

function generateSynthetic(tf: string): object[] {
  const intervalMs: Record<string, number> = { M1: 60_000, M5: 300_000, M15: 900_000 };
  const ms    = intervalMs[tf] ?? 300_000;
  const count = tf === 'M1' ? 500 : 300;
  const now   = Date.now();
  let price   = 3340 + Math.random() * 20;
  const candles: object[] = [];

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

async function fetchFromTwelveData(tf: string) {
  const key = TD_KEY();
  if (!key) return null;

  const cfg = TF_MAP[tf] ?? TF_MAP['M5'];
  const url = `${TD_BASE}/time_series?symbol=XAU/USD&interval=${cfg.interval}&outputsize=${cfg.outputsize}&apikey=${key}&format=JSON`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      next:   { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json() as Record<string, unknown>;
    if ((json as { status?: string }).status === 'error') return null;

    const values = json['values'] as Array<{
      datetime: string; open: string; high: string; low: string; close: string; volume?: string;
    }> | undefined;

    if (!values?.length) return null;

    const candles = values
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

    return candles.length > 0 ? candles : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tf  = searchParams.get('tf') ?? 'M5';
  const safeTf = ['M1', 'M5', 'M15'].includes(tf) ? tf : 'M5';

  const candles = await fetchFromTwelveData(safeTf);

  if (candles) {
    return NextResponse.json({ candles, tf: safeTf, total: candles.length, source: 'twelvedata', synthetic: false });
  }

  const synthetic = generateSynthetic(safeTf);
  return NextResponse.json(
    { candles: synthetic, tf: safeTf, total: synthetic.length, source: 'synthetic', synthetic: true },
    { headers: { 'X-Data-Source': 'synthetic' } },
  );
}

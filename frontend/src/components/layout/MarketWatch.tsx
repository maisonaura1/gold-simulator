'use client';
import { usePricesStore } from '@/store/prices.store';
import { useT } from '@/hooks/useT';

const MOCK_PAIRS = [
  { symbol: 'EURUSD', digits: 5, bid: 1.08412, ask: 1.08415 },
  { symbol: 'GBPUSD', digits: 5, bid: 1.26845, ask: 1.26849 },
  { symbol: 'USDJPY', digits: 3, bid: 149.542, ask: 149.546 },
  { symbol: 'USDCHF', digits: 5, bid: 0.88921, ask: 0.88925 },
  { symbol: 'USDCAD', digits: 5, bid: 1.35210, ask: 1.35215 },
];

const SPREAD_XAU = 0.30;

export function MarketWatch() {
  const { currentPrice, connected } = usePricesStore();
  const t = useT();

  const bid = currentPrice > 0 ? +(currentPrice - SPREAD_XAU / 2).toFixed(2) : null;
  const ask = currentPrice > 0 ? +(currentPrice + SPREAD_XAU / 2).toFixed(2) : null;

  return (
    <div className="flex flex-col border-[var(--mt-border)] bg-[var(--mt-panel)]" style={{ width: 192 }}>
      <div className="mt-panel-header">
        {t.marketWatch}
        <span
          className="text-[10px] normal-case tracking-normal"
          style={{ color: connected ? 'var(--mt-green)' : 'var(--mt-red)' }}
        >
          {connected ? `● ${t.live}` : `○ ${t.offline}`}
        </span>
      </div>

      <div
        className="grid border-b border-[var(--mt-border)] bg-[var(--mt-toolbar)] text-[var(--mt-text-dim)]"
        style={{ gridTemplateColumns: '1fr 56px 56px', fontSize: 10 }}
      >
        <div className="px-2 py-1">{t.symbol}</div>
        <div className="py-1 text-right pr-1">{t.bid}</div>
        <div className="py-1 text-right pr-2">{t.ask}</div>
      </div>

      <div
        className="grid border-b border-[var(--mt-border)]/50 bg-[var(--mt-hover)]/60 cursor-pointer"
        style={{ gridTemplateColumns: '1fr 56px 56px', fontSize: 11 }}
      >
        <div className="px-2 py-2">
          <div className="font-medium text-[var(--mt-yellow)]">XAUUSD</div>
          <div className="text-[9px] text-[var(--mt-text-dim)] mt-0.5">
            {connected ? t.realtime : t.offline}
          </div>
        </div>
        <div className="py-2 pr-1 text-right font-mono text-[var(--mt-green)] tabular-nums">
          {bid?.toFixed(2) ?? '——'}
        </div>
        <div className="py-2 pr-2 text-right font-mono text-[var(--mt-red)] tabular-nums">
          {ask?.toFixed(2) ?? '——'}
        </div>
      </div>

      {MOCK_PAIRS.map((p) => (
        <div
          key={p.symbol}
          className="grid border-b border-[var(--mt-border)]/20 hover:bg-[var(--mt-hover)] cursor-pointer transition-colors"
          style={{ gridTemplateColumns: '1fr 56px 56px', fontSize: 10 }}
        >
          <div className="px-2 py-1.5 text-[var(--mt-text)]">{p.symbol}</div>
          <div className="py-1.5 pr-1 text-right font-mono text-[var(--mt-green)] tabular-nums">
            {p.bid.toFixed(p.digits)}
          </div>
          <div className="py-1.5 pr-2 text-right font-mono text-[var(--mt-red)] tabular-nums">
            {p.ask.toFixed(p.digits)}
          </div>
        </div>
      ))}

      <div className="mt-auto border-t border-[var(--mt-border)] p-2 space-y-1 text-[10px]">
        {[
          [t.spread,  `${SPREAD_XAU.toFixed(2)}`],
          [t.onePip,  '$1.00 / 0.01 lot'],
          [t.oneLot,  '100 oz'],
          [t.margin,  '~$200 / 0.1 lot'],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between">
            <span className="text-[var(--mt-text-dim)]">{label}</span>
            <span className="font-mono text-[var(--mt-text)]">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

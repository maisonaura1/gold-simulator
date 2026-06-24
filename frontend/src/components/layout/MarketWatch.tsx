'use client';
import { usePricesStore } from '@/store/prices.store';

const MOCK_PAIRS = [
  { symbol: 'EURUSD', digits: 5, bid: 1.08412, ask: 1.08415, change: +0.12  },
  { symbol: 'GBPUSD', digits: 5, bid: 1.26845, ask: 1.26849, change: -0.08  },
  { symbol: 'USDJPY', digits: 3, bid: 149.542, ask: 149.546, change: +0.21  },
  { symbol: 'USDCHF', digits: 5, bid: 0.88921, ask: 0.88925, change: -0.05  },
  { symbol: 'USDCAD', digits: 5, bid: 1.35210, ask: 1.35215, change: +0.07  },
];

const SPREAD_XAU = 0.30;

export function MarketWatch() {
  const { currentPrice, connected } = usePricesStore();

  const bid = currentPrice > 0 ? +(currentPrice - SPREAD_XAU / 2).toFixed(2) : null;
  const ask = currentPrice > 0 ? +(currentPrice + SPREAD_XAU / 2).toFixed(2) : null;

  return (
    <div className="flex flex-col border-[var(--mt-border)] bg-[var(--mt-panel)]" style={{ width: 192 }}>
      {/* Header */}
      <div className="mt-panel-header">
        Market Watch
        <span
          className="text-[10px] normal-case tracking-normal"
          style={{ color: connected ? 'var(--mt-green)' : 'var(--mt-red)' }}
        >
          {connected ? '● Live' : '○ Off'}
        </span>
      </div>

      {/* Column headers */}
      <div
        className="grid border-b border-[var(--mt-border)] bg-[var(--mt-toolbar)] text-[var(--mt-text-dim)]"
        style={{ gridTemplateColumns: '1fr 56px 56px', fontSize: 10 }}
      >
        <div className="px-2 py-1">Símbolo</div>
        <div className="py-1 text-right pr-1">Bid</div>
        <div className="py-1 text-right pr-2">Ask</div>
      </div>

      {/* XAUUSD row — destacado */}
      <div
        className="grid border-b border-[var(--mt-border)]/50 bg-[var(--mt-hover)]/60 cursor-pointer"
        style={{ gridTemplateColumns: '1fr 56px 56px', fontSize: 11 }}
      >
        <div className="px-2 py-2">
          <div className="font-medium text-[var(--mt-yellow)]">XAUUSD</div>
          <div className="text-[9px] text-[var(--mt-text-dim)] mt-0.5">
            {connected ? 'Real-time' : 'Offline'}
          </div>
        </div>
        <div className="py-2 pr-1 text-right font-mono text-[var(--mt-green)] tabular-nums">
          {bid?.toFixed(2) ?? '——'}
        </div>
        <div className="py-2 pr-2 text-right font-mono text-[var(--mt-red)] tabular-nums">
          {ask?.toFixed(2) ?? '——'}
        </div>
      </div>

      {/* Other pairs — mock */}
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

      {/* XAUUSD detail footer */}
      <div className="mt-auto border-t border-[var(--mt-border)] p-2 space-y-1 text-[10px]">
        {[
          ['Spread',  `${SPREAD_XAU.toFixed(2)}`],
          ['1 pip',   '$1.00 / 0.01 lot'],
          ['1 lote',  '100 oz'],
          ['Margen',  '~$200 / 0.1 lot'],
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

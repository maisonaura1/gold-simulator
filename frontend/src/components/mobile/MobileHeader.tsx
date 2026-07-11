'use client';
import { useRouter } from 'next/navigation';
import { usePricesStore } from '@/store/prices.store';
import { useAccount } from '@/hooks/useAccount';
import { useTrades } from '@/hooks/useTrades';
import { LogoIcon } from '@/components/ui/LogoIcon';
import clsx from 'clsx';

export function MobileHeader() {
  const router = useRouter();
  const { currentPrice, connected } = usePricesStore();
  const { account } = useAccount();
  const { openTrades } = useTrades();

  const livePnl = openTrades.reduce((sum, tr) => {
    if (currentPrice <= 0) return sum;
    return sum + (tr.type === 'BUY'
      ? (currentPrice - tr.entryPrice) * tr.lot * 100
      : (tr.entryPrice - currentPrice) * tr.lot * 100);
  }, 0);

  const equity = (account?.currentBalance ?? 0) + livePnl;

  return (
    <header
      className="flex items-center shrink-0 px-3 gap-3 select-none"
      style={{
        height: 48,
        background: '#0a0c11',
        borderBottom: '1px solid #1d2029',
      }}
    >
      {/* Brand */}
      <button
        onClick={() => router.push('/trade')}
        className="flex items-center gap-1.5 shrink-0"
      >
        <LogoIcon size={18} />
        <span style={{ color: '#e8b84b', fontWeight: 700, fontSize: 13, letterSpacing: '0.02em' }}>
          GoldTrader
        </span>
      </button>

      {/* Live price pill */}
      <div
        className="flex items-center gap-1.5 px-2 py-1 shrink-0"
        style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 4 }}
      >
        <span style={{ fontSize: 10, color: '#6b7385', letterSpacing: 1 }}>XAU</span>
        <span
          className="font-mono font-bold tabular-nums"
          style={{ fontSize: 13, color: '#33c2ff' }}
        >
          {currentPrice > 0 ? currentPrice.toFixed(2) : '——'}
        </span>
      </div>

      <div className="flex-1" />

      {/* Balance */}
      {account && (
        <div className="text-right">
          <div style={{ fontSize: 9, color: '#6b7385', letterSpacing: 0.5 }}>EQUITY</div>
          <div
            className="font-mono font-bold tabular-nums"
            style={{ fontSize: 12, color: livePnl >= 0 ? '#2dcc6f' : '#e84040' }}
          >
            ${equity.toFixed(2)}
          </div>
        </div>
      )}

      {/* Connection dot */}
      <div
        className={clsx('w-2 h-2 rounded-full shrink-0', connected ? 'bg-[#2dcc6f]' : 'bg-[#e84040]')}
        style={{ boxShadow: connected ? '0 0 6px #2dcc6f88' : '0 0 6px #e8404088' }}
      />
    </header>
  );
}

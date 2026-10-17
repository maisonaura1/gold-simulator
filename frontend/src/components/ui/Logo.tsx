import Link from 'next/link';
import clsx from 'clsx';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={clsx('h-8 w-8', className)} aria-hidden="true">
      <defs>
        <linearGradient id="gt-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8ecc7" />
          <stop offset="55%" stopColor="#ddb54a" />
          <stop offset="100%" stopColor="#a8842d" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="#12141a" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" fill="none" stroke="#ddb54a" strokeOpacity="0.35" />
      <line x1="11" y1="7" x2="11" y2="25" stroke="#ddb54a" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="8" y="12" width="6" height="9" rx="1.5" fill="#ddb54a" fillOpacity="0.45" />
      <line x1="21" y1="5" x2="21" y2="27" stroke="url(#gt-gold)" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="17.5" y="9" width="7" height="13" rx="1.6" fill="url(#gt-gold)" />
    </svg>
  );
}

export function Logo({ href = '/', compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="GoldTrader MT — inicio">
      <LogoMark />
      {!compact && (
        <span className="text-[17px] font-semibold tracking-tight text-fg">
          GoldTrader <span className="gold-text">MT</span>
        </span>
      )}
    </Link>
  );
}

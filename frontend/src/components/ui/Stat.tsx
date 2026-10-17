import clsx from 'clsx';
import type { ReactNode } from 'react';

export function Stat({
  label,
  value,
  sub,
  tone,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: 'up' | 'down' | 'gold';
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('card p-4', className)}>
      <div className="flex items-center justify-between gap-2 text-[12px] font-medium text-fg-dim">
        <span>{label}</span>
        {icon}
      </div>
      <div
        className={clsx(
          'mt-1.5 text-[22px] font-semibold num tracking-tight',
          tone === 'up' && 'text-green-400',
          tone === 'down' && 'text-red-400',
          tone === 'gold' && 'text-gold-300',
          !tone && 'text-fg',
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[12px] text-fg-dim">{sub}</div>}
    </div>
  );
}

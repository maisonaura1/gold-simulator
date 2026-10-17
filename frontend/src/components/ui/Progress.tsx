import clsx from 'clsx';

export function ProgressBar({ value, className, tone = 'gold' }: { value: number; className?: string; tone?: 'gold' | 'up' }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={clsx('h-2 w-full overflow-hidden rounded-full bg-ink-700', className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={clsx('h-full rounded-full transition-[width] duration-500', tone === 'gold' ? 'bg-gradient-to-r from-gold-500 to-gold-300' : 'bg-up')}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ProgressRing({ value, size = 64, stroke = 6, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#262a35" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#ddb54a"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute text-[13px] font-semibold num text-fg">{label ?? `${Math.round(pct * 100)}%`}</span>
    </div>
  );
}

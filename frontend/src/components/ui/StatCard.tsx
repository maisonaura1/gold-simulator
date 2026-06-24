import clsx from 'clsx';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: 'default' | 'green' | 'red' | 'gold';
  icon?: string;
}

export function StatCard({ label, value, sub, color = 'default', icon }: Props) {
  const valueColor = {
    default: 'text-white',
    green: 'text-green-400',
    red: 'text-red-400',
    gold: 'text-gold-400',
  }[color];

  return (
    <div className="card flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <div className={clsx('text-2xl font-bold font-mono', valueColor)}>{value}</div>
      {sub && <div className="text-xs text-[var(--muted)]">{sub}</div>}
    </div>
  );
}

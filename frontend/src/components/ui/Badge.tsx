import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'gold' | 'muted';
}

export function Badge({ children, variant = 'muted' }: Props) {
  return (
    <span
      className={clsx('px-2 py-0.5 rounded-full text-xs font-medium border', {
        'badge-green': variant === 'green',
        'badge-red': variant === 'red',
        'badge-gold': variant === 'gold',
        'bg-white/5 text-[var(--muted)] border-[var(--border)]': variant === 'muted',
      })}
    >
      {children}
    </span>
  );
}

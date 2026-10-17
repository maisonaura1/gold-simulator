import Link from 'next/link';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'buy' | 'sell';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-150 select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 shadow-glow hover:from-gold-200 hover:to-gold-400',
  secondary: 'border border-ink-600 bg-ink-800 text-fg hover:border-ink-600 hover:bg-ink-750',
  ghost: 'text-fg-muted hover:bg-ink-800 hover:text-fg',
  danger: 'border border-down/40 bg-down/10 text-red-300 hover:bg-down/20',
  buy: 'bg-up text-ink-950 hover:bg-green-400',
  sell: 'bg-down text-white hover:bg-red-400',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
};

interface Common {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  block?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  iconRight,
  block,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: Common & ComponentProps<'button'>) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], block && 'w-full', className)}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  block,
  className,
  children,
  ...rest
}: Common & { href: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link href={href} className={clsx(base, variants[variant], sizes[size], block && 'w-full', className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}

import clsx from 'clsx';
import type { ReactNode } from 'react';

type Tone = 'gold' | 'up' | 'down' | 'warn' | 'info' | 'neutral';

const tones: Record<Tone, string> = {
  gold: 'border-gold-500/30 bg-gold-500/10 text-gold-300',
  up: 'border-up/30 bg-up/10 text-green-300',
  down: 'border-down/30 bg-down/10 text-red-300',
  warn: 'border-warn/30 bg-warn/10 text-amber-300',
  info: 'border-info/30 bg-info/10 text-blue-300',
  neutral: 'border-ink-600 bg-ink-800 text-fg-muted',
};

export function Badge({ tone = 'neutral', children, className, icon }: { tone?: Tone; children: ReactNode; className?: string; icon?: ReactNode }) {
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[12px] font-medium', tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}

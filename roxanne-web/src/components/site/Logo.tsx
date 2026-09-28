import { cn } from '@/lib/cn'

/** Splits "RoxanneAlexia" into two styled parts; any other name renders as-is. */
function splitName(name: string): [string, string] {
  const match = name.match(/^([A-Z][a-z]+)([A-Z][A-Za-z]+)$/)
  return match ? [match[1], match[2]] : [name, '']
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 40" className={cn('h-9 w-auto', className)} aria-hidden>
      <path d="M4 38V16a12 12 0 0 1 24 0v22" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 38V17a7 7 0 0 1 14 0v21" fill="none" stroke="currentColor" strokeWidth="1" opacity=".45" />
      <circle cx="16" cy="25" r="2.6" fill="currentColor" />
    </svg>
  )
}

export function Logo({
  name,
  descriptor,
  tone = 'ink',
  className,
}: {
  name: string
  descriptor: string
  tone?: 'ink' | 'light'
  className?: string
}) {
  const [first, second] = splitName(name)
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <LogoMark className={tone === 'ink' ? 'text-clay' : 'text-clay-soft'} />
      <span className="leading-none">
        <span className={cn('block font-display text-[1.65rem] font-semibold tracking-tight', tone === 'ink' ? 'text-ink' : 'text-ivory')}>
          {first}
          {second && <span className={cn('font-normal italic', tone === 'ink' ? 'text-clay' : 'text-clay-soft')}>{second}</span>}
        </span>
        <span className={cn('mt-1 block text-[0.625rem] font-bold uppercase tracking-[0.3em]', tone === 'ink' ? 'text-ink-soft' : 'text-ivory/60')}>
          {descriptor}
        </span>
      </span>
    </span>
  )
}

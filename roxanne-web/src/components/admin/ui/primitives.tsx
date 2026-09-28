import Link from 'next/link'
import { CircleCheck, Info, LoaderCircle, Sparkles, TriangleAlert } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/* ─────────────────────────────── Buttons ───────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-solid'
type ButtonSize = 'sm' | 'md' | 'icon'

const BUTTON_BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-55 [&_svg]:size-4 [&_svg]:shrink-0'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-clay text-white shadow-[0_10px_24px_-14px_rgb(165_83_58/0.9)] hover:bg-clay-dark',
  secondary: 'border border-line bg-white text-ink hover:border-ink/25 hover:bg-ivory',
  ghost: 'text-ink-soft hover:bg-ink/[0.05] hover:text-ink',
  danger: 'border border-clay/25 bg-white text-clay-dark hover:border-clay-dark hover:bg-clay-dark hover:text-white',
  'danger-solid': 'bg-clay-dark text-white hover:brightness-90',
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  icon: 'size-9',
}

export function buttonStyles({
  variant = 'secondary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)
}

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function AdminButton({
  variant,
  size,
  className,
  type = 'button',
  pending = false,
  children,
  ...rest
}: ButtonStyleProps & ComponentProps<'button'> & { pending?: boolean }) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      aria-busy={pending || undefined}
      {...rest}
      disabled={rest.disabled || pending}
    >
      {pending && <LoaderCircle className="animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

/** Link styled as a button. External links open in a new tab. */
export function AdminButtonLink({
  href,
  variant,
  size,
  className,
  children,
  external,
  ...rest
}: ButtonStyleProps & Omit<ComponentProps<'a'>, 'href'> & { href: string; external?: boolean }) {
  const classes = buttonStyles({ variant, size, className })
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  )
}

/* ──────────────────────────────── Layout ───────────────────────────── */

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  eyebrow?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-xs font-bold tracking-[0.2em] text-clay uppercase">{eyebrow}</p>}
        <h1 className={cn('font-display text-[2.25rem] leading-[1.1] text-ink sm:text-[2.75rem]', eyebrow ? 'mt-2' : undefined)}>
          {title}
        </h1>
        {description && <p className="mt-2.5 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function Card({
  className,
  children,
  as = 'section',
  ...rest
}: { as?: 'section' | 'div' | 'article' } & ComponentProps<'div'>) {
  const Tag = as as 'div'
  return (
    <Tag className={cn('rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgb(31_37_51/0.04)]', className)} {...rest}>
      {children}
    </Tag>
  )
}

export function CardHeader({
  title,
  description,
  icon,
  action,
  id,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  id?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-start gap-4', className)}>
      {icon && (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream text-clay [&_svg]:size-5" aria-hidden>
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <h2 id={id} className="font-display text-2xl leading-tight text-ink">
          {title}
        </h2>
        {description && <div className="mt-1 text-sm leading-relaxed text-ink-soft">{description}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/* ───────────────────────────── Feedback ────────────────────────────── */

type Tone = 'clay' | 'sage' | 'ink' | 'muted' | 'warm'

const BADGE_TONES: Record<Tone, string> = {
  clay: 'bg-clay text-white',
  sage: 'bg-sage/12 text-sage-dark ring-1 ring-sage/25',
  ink: 'bg-ink text-ivory',
  muted: 'bg-ink/[0.06] text-ink-soft',
  warm: 'bg-blush/70 text-clay-dark ring-1 ring-clay/15',
}

export function Badge({ tone = 'muted', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap [&_svg]:size-3',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

type CalloutTone = 'info' | 'warning' | 'success' | 'draft'

const CALLOUT_STYLES: Record<CalloutTone, { box: string; icon: ReactNode }> = {
  info: { box: 'border-line bg-cream/70 text-ink', icon: <Info className="text-ink-soft" /> },
  warning: { box: 'border-clay/25 bg-blush/45 text-ink', icon: <TriangleAlert className="text-clay-dark" /> },
  success: { box: 'border-sage/30 bg-sage/10 text-ink', icon: <CircleCheck className="text-sage-dark" /> },
  draft: { box: 'border-gold/40 bg-gold-soft/20 text-ink', icon: <Sparkles className="text-clay" /> },
}

export function Callout({
  tone = 'info',
  title,
  children,
  action,
  className,
  role,
}: {
  tone?: CalloutTone
  title?: ReactNode
  children?: ReactNode
  action?: ReactNode
  className?: string
  role?: 'alert' | 'status'
}) {
  const style = CALLOUT_STYLES[tone]
  return (
    <div role={role} className={cn('flex gap-3 rounded-2xl border p-4 sm:p-5', style.box, className)}>
      <span className="mt-0.5 shrink-0 [&_svg]:size-5" aria-hidden>
        {style.icon}
      </span>
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        {title && <p className="font-semibold text-ink">{title}</p>}
        {children && <div className={cn('text-ink-soft', title ? 'mt-1' : undefined)}>{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon: ReactNode
  title: ReactNode
  children?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center px-6 py-12 text-center sm:py-16', className)}>
      <span className="grid size-14 place-items-center rounded-full bg-cream text-clay [&_svg]:size-6" aria-hidden>
        {icon}
      </span>
      <h2 className="mt-5 font-display text-2xl text-ink">{title}</h2>
      {children && <div className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{children}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

/* ─────────────────────────────── Forms ─────────────────────────────── */

export const inputStyles =
  'block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base leading-snug text-ink shadow-[inset_0_1px_2px_rgb(31_37_51/0.04)] transition-[border-color,box-shadow] placeholder:text-ink-soft/55 hover:border-ink/20 focus:border-clay focus:ring-4 focus:ring-clay/12 focus:outline-none aria-[invalid=true]:border-clay-dark aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-clay/10 disabled:bg-ivory disabled:text-ink-soft'

export function FieldLabel({
  htmlFor,
  children,
  optional,
  className,
}: {
  htmlFor: string
  children: ReactNode
  optional?: boolean
  className?: string
}) {
  return (
    <label htmlFor={htmlFor} className={cn('block text-sm font-semibold text-ink', className)}>
      {children}
      {optional && <span className="ml-1.5 font-normal text-ink-soft">(optional)</span>}
    </label>
  )
}

export function FieldHint({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
      {children}
    </p>
  )
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] font-medium text-clay-dark">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

/** Checkbox styled as an on/off switch (works without JavaScript). */
export function Switch({
  className,
  ...rest
}: Omit<ComponentProps<'input'>, 'type'> & { className?: string }) {
  return (
    <span className={cn('relative inline-flex h-7 w-12 shrink-0', className)}>
      <input
        type="checkbox"
        role="switch"
        className="peer absolute inset-0 z-10 m-0 cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-clay disabled:cursor-not-allowed"
        {...rest}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-ink/15 transition-colors duration-200 peer-checked:bg-clay peer-disabled:opacity-50"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1 left-1 size-5 rounded-full bg-white shadow-[0_1px_3px_rgb(31_37_51/0.3)] transition-transform duration-200 peer-checked:translate-x-5"
      />
    </span>
  )
}

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={cn('size-5 animate-spin text-clay', className)} aria-hidden />
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-ink/[0.06]', className)} aria-hidden />
}

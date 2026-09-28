import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'light' | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full text-center font-sans font-semibold tracking-[0.01em] sm:whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const sizes: Record<Size, string> = {
  sm: 'min-h-10 px-5 py-2 text-sm',
  md: 'min-h-12 px-7 py-3 text-[0.9375rem]',
  lg: 'min-h-14 px-8 py-3.5 text-base',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-clay text-white shadow-[0_12px_30px_-14px_rgb(165_83_58/0.8)] hover:bg-clay-dark hover:shadow-[0_18px_40px_-16px_rgb(165_83_58/0.9)]',
  secondary: 'border border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/[0.04]',
  light: 'bg-ivory text-ink hover:bg-white',
  'outline-light': 'border border-ivory/30 text-ivory hover:border-ivory/60 hover:bg-ivory/10',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  arrow?: boolean
  className?: string
  children: ReactNode
}

export function buttonClasses({ variant = 'primary', size = 'md', className }: Omit<CommonProps, 'children'>) {
  return cn(base, sizes[size], variants[variant], className)
}

function Arrow() {
  return <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
}

export function ButtonLink({
  href,
  variant,
  size,
  arrow = false,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, 'className' | 'children'>) {
  const external = typeof href === 'string' && /^(https?:|mailto:|tel:)/.test(href)
  const classes = buttonClasses({ variant, size, className })
  if (external) {
    return (
      <a href={href as string} className={classes} target={href.toString().startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" {...(rest as ComponentProps<'a'>)}>
        {children}
        {arrow && <Arrow />}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  )
}

export function Button({
  variant,
  size,
  arrow = false,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & Omit<ComponentProps<'button'>, 'className' | 'children'>) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

/** Understated text link with an animated underline and arrow. */
export function TextLink({
  href,
  children,
  className,
  tone = 'ink',
}: {
  href: string
  children: ReactNode
  className?: string
  tone?: 'ink' | 'light'
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 font-semibold tracking-[0.01em]',
        tone === 'ink' ? 'text-ink' : 'text-ivory',
        className,
      )}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:0%_1px] group-hover:bg-right-bottom">
        {children}
      </span>
      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
    </Link>
  )
}

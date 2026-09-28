import type { CSSProperties, ReactNode } from 'react'
import { Motif3D, type Motif } from '@/components/three'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import { ConsultationButton } from './actions'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  tone = 'ink',
  as: Heading = 'h2',
  className,
  size = 'lg',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  tone?: 'ink' | 'light'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  size?: 'lg' | 'md'
}) {
  return (
    <Reveal className={cn(align === 'center' && 'mx-auto text-center', 'max-w-3xl', className)}>
      {eyebrow && <p className={cn('eyebrow', align === 'center' && 'justify-center', tone === 'light' && 'text-gold-soft')}>{eyebrow}</p>}
      <Heading className={cn(size === 'lg' ? 'display-lg' : 'display-md', eyebrow && 'mt-5', tone === 'light' ? 'text-ivory' : 'text-ink')}>{title}</Heading>
      {subtitle && <p className={cn('lead mt-5', tone === 'light' && 'text-ivory/70', align === 'center' && 'mx-auto')}>{subtitle}</p>}
    </Reveal>
  )
}

/** Hero for inner pages: headline + optional subtitle/CTA with a 3D motif on the side. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  motif,
  children,
  cta,
  breadcrumb,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  motif?: Motif
  children?: ReactNode
  cta?: string
  breadcrumb?: ReactNode
}) {
  return (
    <section className="grain relative overflow-hidden bg-cream pt-36 pb-20 sm:pt-44 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-blush/70 blur-[100px]" />
      <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
        {/* Pure-CSS entrance so the headline is visible at first paint (see .enter in globals.css). */}
        <div>
          {breadcrumb}
          <p className="eyebrow enter">{eyebrow}</p>
          <h1 className="display-xl enter-lift mt-6 max-w-4xl">{title}</h1>
          {subtitle && (
            <p className="lead enter mt-7 max-w-2xl" style={{ '--enter-delay': '0.1s' } as CSSProperties}>
              {subtitle}
            </p>
          )}
          {cta && (
            <div className="enter mt-10" style={{ '--enter-delay': '0.18s' } as CSSProperties}>
              <ConsultationButton size="lg" arrow>
                {cta}
              </ConsultationButton>
            </div>
          )}
          {children}
        </div>
        {motif && (
          <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
            <div aria-hidden className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--color-ivory),var(--color-blush)_60%,var(--color-sand))] shadow-soft" />
            <Motif3D motif={motif} className="absolute inset-0" />
          </div>
        )}
      </div>
    </section>
  )
}

/** Closing call-to-action band used at the bottom of most pages. */
export function CtaBand({ title, body, buttonLabel }: { title: string; body?: string; buttonLabel: string }) {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 sm:py-32">
      <div className="container-site">
        <Reveal className="grain relative overflow-hidden rounded-[2.5rem] bg-clay px-6 py-16 text-center text-white shadow-soft sm:px-16 sm:py-24">
          <div aria-hidden className="pointer-events-none absolute -top-24 -left-16 size-80 rounded-full bg-clay-soft/50 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-20 -bottom-28 size-96 rounded-full bg-navy/40 blur-3xl" />
          <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute top-1/2 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]">
            <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.4" />
            <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </svg>
          <h2 className="display-lg relative mx-auto max-w-3xl text-white">{title}</h2>
          {body && <p className="relative mx-auto mt-5 max-w-xl text-lg text-white">{body}</p>}
          <div className="relative mt-10 flex justify-center">
            <ConsultationButton variant="light" size="lg" arrow>
              {buttonLabel}
            </ConsultationButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Numbered list with brass markers. */
export function CheckList({ items, tone = 'ink' }: { items: string[]; tone?: 'ink' | 'light' }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={item} className="flex gap-4">
          <span className={cn('mt-1 font-display text-sm tracking-[0.2em]', tone === 'ink' ? 'text-gold-deep' : 'text-gold-soft')}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className={cn('leading-relaxed', tone === 'ink' ? 'text-ink' : 'text-ivory/90')}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

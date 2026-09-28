'use client'

import type { CourseSlug } from '@/content/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { useSite } from './site-context'

type ButtonProps = Parameters<typeof Button>[0]

/** Opens the "Book a Free Consultation" popup. */
export function ConsultationButton({ children, ...props }: Omit<ButtonProps, 'onClick' | 'children'> & { children?: React.ReactNode }) {
  const { openConsultation, data } = useSite()
  return (
    <Button onClick={openConsultation} aria-haspopup="dialog" {...props}>
      {children ?? data.global.consultationCta}
    </Button>
  )
}

/** Slowly rotating circular badge ("Free consultation • Book now •") that opens the popup. */
export function ConsultationBadge({ text, className }: { text: string; className?: string }) {
  const { openConsultation, data } = useSite()
  const label = `${text} • ${text} • `
  return (
    <button
      type="button"
      onClick={openConsultation}
      aria-label={data.global.consultationCta}
      aria-haspopup="dialog"
      className={cn(
        'group grid size-32 place-items-center rounded-full bg-ivory/90 text-ink shadow-card backdrop-blur transition duration-500 hover:scale-105 hover:bg-white',
        className,
      )}
    >
      <svg viewBox="0 0 120 120" className="absolute size-32 animate-[spin_26s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        <defs>
          <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text className="fill-current font-sans text-[10.5px] font-bold tracking-[0.22em] uppercase">
          <textPath href="#badge-circle">{label}</textPath>
        </text>
      </svg>
      <span className="grid size-12 place-items-center rounded-full bg-clay text-white transition group-hover:bg-clay-dark">
        <svg viewBox="0 0 16 16" className="size-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0" aria-hidden>
          <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  )
}

/** Opens the package-options popup for one course. */
export function PackagesButton({
  slug,
  children,
  className,
  tone = 'ink',
}: {
  slug: CourseSlug
  children: React.ReactNode
  className?: string
  tone?: 'ink' | 'light'
}) {
  const { openPackages } = useSite()
  return (
    <button
      type="button"
      onClick={() => openPackages(slug)}
      aria-haspopup="dialog"
      className={cn(
        'group inline-flex items-center gap-2 text-sm font-semibold tracking-[0.01em]',
        tone === 'ink' ? 'text-ink' : 'text-ivory',
        className,
      )}
    >
      <span className="grid size-7 place-items-center rounded-full border border-current/25 transition group-hover:border-clay group-hover:bg-clay group-hover:text-white">
        <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
        {children}
      </span>
    </button>
  )
}

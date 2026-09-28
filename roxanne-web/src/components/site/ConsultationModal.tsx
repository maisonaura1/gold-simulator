'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, CalendarDays, Mail, MessageCircle } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { WhatsAppIcon } from '@/components/icons/brand'
import { Modal } from '@/components/ui/Modal'
import { whatsappHref } from '@/lib/site'
import { CalendlyFrame } from './CalendlyFrame'
import type { SiteClientData } from './site-context'

export function ConsultationModal({ open, onClose, data }: { open: boolean; onClose: () => void; data: SiteClientData }) {
  const [view, setView] = useState<'options' | 'calendar'>('options')
  const copy = data.global.consultationModal
  const wa = whatsappHref(data.whatsappNumber, data.global.whatsappMessage)

  // Always reopen on the list of options.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setView('options'), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  return (
    <Modal open={open} onClose={onClose} labelledBy="consultation-title" size={view === 'calendar' ? 'lg' : 'md'}>
      {view === 'calendar' && data.calendlyUrl ? (
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-3 px-3 pt-2 pb-3 pr-14">
            <button
              type="button"
              onClick={() => setView('options')}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-cream hover:text-ink"
            >
              <ArrowLeft className="size-4" aria-hidden /> Back
            </button>
            <h2 id="consultation-title" className="font-display text-2xl">
              {copy.calendlyLabel}
            </h2>
          </div>
          <CalendlyFrame url={data.calendlyUrl} className="h-[min(720px,calc(100dvh-8rem))] rounded-[1.25rem]" />
        </div>
      ) : (
        <div className="relative overflow-hidden p-7 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-blush/70 blur-3xl" />
          <p className="eyebrow relative">{copy.eyebrow}</p>
          <h2 id="consultation-title" className="relative mt-4 font-display text-4xl leading-[1.05] sm:text-[2.75rem]">
            {copy.title}
          </h2>
          <p className="relative mt-3 max-w-md text-ink-soft">{copy.body}</p>

          <ul className="relative mt-8 grid gap-3">
            {data.calendlyUrl && (
              <li>
                <Option
                  as="button"
                  onClick={() => setView('calendar')}
                  icon={<CalendarDays className="size-5" aria-hidden />}
                  label={copy.calendlyLabel}
                  hint={copy.calendlyHint}
                  highlight
                />
              </li>
            )}
            {wa && (
              <li>
                <Option
                  as="a"
                  href={wa}
                  icon={<WhatsAppIcon className="size-5" />}
                  label={copy.whatsappLabel}
                  hint={copy.whatsappHint}
                  highlight={!data.calendlyUrl}
                />
              </li>
            )}
            <li>
              <Option
                as="link"
                href="/contact#message"
                onClick={onClose}
                icon={<MessageCircle className="size-5" aria-hidden />}
                label={copy.messageLabel}
                hint={copy.messageHint}
              />
            </li>
          </ul>

          {data.email && (
            <p className="relative mt-6 flex items-center gap-2 text-sm text-ink-soft">
              <Mail className="size-4 text-clay" aria-hidden />
              <a className="break-all underline decoration-line underline-offset-4 hover:decoration-clay" href={`mailto:${data.email}`}>
                {data.email}
              </a>
            </p>
          )}
        </div>
      )}
    </Modal>
  )
}

type OptionProps = {
  icon: ReactNode
  label: string
  hint: string
  highlight?: boolean
  onClick?: () => void
} & ({ as: 'button' } | { as: 'a'; href: string } | { as: 'link'; href: string })

function Option(props: OptionProps) {
  const { icon, label, hint, highlight } = props
  const inner = (
    <>
      <span
        className={
          highlight
            ? 'grid size-11 shrink-0 place-items-center rounded-full bg-clay text-white'
            : 'grid size-11 shrink-0 place-items-center rounded-full bg-cream text-clay transition group-hover:bg-blush'
        }
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-semibold text-ink">{label}</span>
        <span className="block text-sm text-ink-soft">{hint}</span>
      </span>
      <ArrowRight className="size-5 shrink-0 text-ink-soft transition-transform duration-300 group-hover:translate-x-1 group-hover:text-clay" aria-hidden />
    </>
  )
  const className =
    'group flex w-full items-center gap-4 rounded-2xl border border-line bg-white/60 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-clay/40 hover:bg-white hover:shadow-card'

  if (props.as === 'button') {
    return (
      <button type="button" className={className} onClick={props.onClick}>
        {inner}
      </button>
    )
  }
  if (props.as === 'a') {
    return (
      <a className={className} href={props.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return (
    <Link className={className} href={props.href} onClick={props.onClick}>
      {inner}
    </Link>
  )
}

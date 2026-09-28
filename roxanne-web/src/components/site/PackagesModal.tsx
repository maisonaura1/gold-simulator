'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/brand'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { courseHref, whatsappHref } from '@/lib/site'
import type { SiteClientData } from './site-context'

interface PackagesModalProps {
  open: boolean
  course: SiteClientData['courses'][number] | undefined
  onClose: () => void
  onBook: () => void
  data: SiteClientData
}

export function PackagesModal({ open, course, onClose, onBook, data }: PackagesModalProps) {
  const copy = data.global.packagesModal
  const wa = course
    ? whatsappHref(data.whatsappNumber, `Hello Roxanne! I'd like to know more about the ${course.name} package options.`)
    : null

  return (
    <Modal open={open && Boolean(course)} onClose={onClose} labelledBy="packages-title" size="lg">
      {course && (
        <div className="relative overflow-hidden p-7 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 size-72 rounded-full bg-blush/60 blur-3xl" />
          <p className="eyebrow relative">{copy.eyebrow}</p>
          <h2 id="packages-title" className="relative mt-4 pr-10 font-display text-4xl leading-[1.05] sm:text-5xl">
            {course.name}
          </h2>
          <p className="relative mt-3 max-w-xl text-ink-soft">{copy.body}</p>

          <ol className="relative mt-8 grid gap-3 sm:grid-cols-3">
            {course.packages.map((pkg, i) => (
              <li key={pkg.name} className="flex flex-col rounded-2xl border border-line bg-white/70 p-5">
                <span className="font-display text-sm tracking-[0.2em] text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-sans text-base font-bold leading-snug text-ink">{pkg.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{pkg.description}</p>
              </li>
            ))}
          </ol>

          <p className="relative mt-6 text-sm text-ink-soft italic">{copy.note}</p>

          <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              arrow
              onClick={() => {
                onClose()
                // Let the first dialog close before opening the next one.
                setTimeout(onBook, 60)
              }}
            >
              {copy.primaryLabel}
            </Button>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-ink/15 px-6 text-[0.9375rem] font-semibold transition hover:border-ink/40 hover:bg-ink/[0.04]"
              >
                <WhatsAppIcon className="size-4 text-[#1f9e55]" />
                {copy.secondaryLabel}
              </a>
            )}
            <Link
              href={courseHref(course.slug)}
              onClick={onClose}
              className="group inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-ink-soft hover:text-ink sm:ml-auto"
            >
              View course <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </Modal>
  )
}

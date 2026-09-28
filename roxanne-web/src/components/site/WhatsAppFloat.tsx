'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WhatsAppIcon } from '@/components/icons/brand'
import { whatsappHref } from '@/lib/site'
import type { SiteClientData } from './site-context'

/** Floating WhatsApp button (bottom-right) with a pre-filled greeting. */
export function WhatsAppFloat({ data }: { data: SiteClientData }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const href = whatsappHref(data.whatsappNumber, data.global.whatsappMessage)

  // Appear after a short delay so it doesn't compete with the hero.
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  if (!href || pathname.startsWith('/admin')) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={data.global.whatsappTooltip}
      className={`group fixed right-4 bottom-4 z-40 flex items-center gap-3 sm:right-6 sm:bottom-6 transition-[opacity,transform] duration-700 ease-out-expo ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-ivory opacity-0 shadow-card transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
        {data.global.whatsappTooltip}
      </span>
      <span className="relative grid size-14 place-items-center rounded-full bg-[#1f9e55] text-white shadow-[0_14px_30px_-10px_rgb(31_158_85/0.7)] transition-transform duration-300 group-hover:scale-105">
        <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-[#1f9e55]" />
        <WhatsAppIcon className="relative size-7" />
      </span>
    </a>
  )
}

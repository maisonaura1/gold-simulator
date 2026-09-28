'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CourseSlug, PackageFormat, SiteContent } from '@/content/types'
import { ConsultationModal } from './ConsultationModal'
import { PackagesModal } from './PackagesModal'
import { WhatsAppFloat } from './WhatsAppFloat'

/** Serializable subset of content/settings that client widgets need. */
export interface SiteClientData {
  brandName: string
  personName: string
  global: SiteContent['global']
  email: string
  whatsappNumber: string
  calendlyUrl: string
  courses: { slug: CourseSlug; name: string; formats: string; packages: PackageFormat[] }[]
}

interface SiteActions {
  data: SiteClientData
  openConsultation: () => void
  openPackages: (slug: CourseSlug) => void
}

const SiteContext = createContext<SiteActions | null>(null)

export function useSite(): SiteActions {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>')
  return ctx
}

type Open = { kind: 'none' } | { kind: 'consultation' } | { kind: 'packages'; slug: CourseSlug }

export function SiteProvider({ data, children }: { data: SiteClientData; children: ReactNode }) {
  const [open, setOpen] = useState<Open>({ kind: 'none' })
  const close = useCallback(() => setOpen({ kind: 'none' }), [])
  const openConsultation = useCallback(() => setOpen({ kind: 'consultation' }), [])
  const openPackages = useCallback((slug: CourseSlug) => setOpen({ kind: 'packages', slug }), [])

  const value = useMemo(() => ({ data, openConsultation, openPackages }), [data, openConsultation, openPackages])
  const packagesCourse = open.kind === 'packages' ? data.courses.find((c) => c.slug === open.slug) : undefined

  return (
    <SiteContext.Provider value={value}>
      {children}
      <ConsultationModal open={open.kind === 'consultation'} onClose={close} data={data} />
      <PackagesModal
        open={open.kind === 'packages'}
        course={packagesCourse}
        onClose={close}
        onBook={openConsultation}
        data={data}
      />
      <WhatsAppFloat data={data} />
    </SiteContext.Provider>
  )
}

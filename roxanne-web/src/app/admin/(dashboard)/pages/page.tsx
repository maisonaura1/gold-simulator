import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Briefcase, FileText, Globe, House, Mail, Scale, Shield, Sparkles, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge, PageHeader } from '@/components/admin/ui/primitives'
import { getEditedSectionIds } from '@/lib/admin/content'
import { PAGE_SECTIONS, SECTION_GROUPS, type PageSectionId } from '@/lib/admin/sections'
import { requireAdmin } from '@/lib/auth'

export const metadata: Metadata = { title: 'Pages' }

const ICONS: Partial<Record<PageSectionId, LucideIcon>> = {
  home: House,
  about: UserRound,
  courses: BookOpen,
  freelance: Briefcase,
  contact: Mail,
  brand: Globe,
  privacy: Shield,
  'legal-english': Scale,
}

export default async function PagesIndex() {
  await requireAdmin()
  const edited = await getEditedSectionIds()

  return (
    <div className="space-y-10">
      <PageHeader
        title="Pages"
        description="Change the text of your website. Choose a page, edit what you like, then press “Save changes” — it appears on your site straight away."
      />

      {SECTION_GROUPS.map((group) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`} className="font-sans text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
            {group.label}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {PAGE_SECTIONS.filter((section) => section.group === group.id).map((section) => {
              const Icon = ICONS[section.id] ?? FileText
              const isEdited = edited.includes(section.id)
              return (
                <li key={section.id}>
                  <Link
                    href={`/admin/pages/${section.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-clay/40 hover:shadow-[0_14px_34px_-26px_rgb(31_37_51/0.6)]"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="grid size-10 place-items-center rounded-xl bg-cream text-clay" aria-hidden>
                        <Icon className="size-5" />
                      </span>
                      <span className="flex flex-wrap justify-end gap-1.5">
                        {section.review?.tone === 'draft' && (
                          <Badge tone="warm">
                            <Sparkles aria-hidden />
                            Please review
                          </Badge>
                        )}
                        {isEdited && <Badge tone="sage">Edited</Badge>}
                      </span>
                    </span>
                    <span className="mt-4 font-display text-[1.6rem] leading-tight text-ink">{section.label}</span>
                    <span className="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{section.description}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-clay">
                      Edit
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      <span className="sr-only"> {section.label}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

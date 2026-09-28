'use client'

import { ChevronLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { PAGE_SECTIONS, type PageSectionId } from '@/lib/admin/sections'
import { cn } from '@/lib/cn'
import { GuardedLink } from '../ui/UnsavedChanges'

/** Horizontal list of every editable page (scrolls on phones). */
export function SectionTabs({ current, edited }: { current: PageSectionId; edited: PageSectionId[] }) {
  const activeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [current])

  return (
    <nav aria-label="Pages of your website" className="-mx-4 sm:-mx-6 lg:mx-0">
      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:px-6 lg:flex-wrap lg:overflow-visible lg:px-0">
        <GuardedLink
          href="/admin/pages"
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full pr-3 pl-2 text-sm font-semibold text-ink-soft transition hover:bg-ink/[0.05] hover:text-ink"
        >
          <ChevronLeft className="size-4" aria-hidden />
          All pages
        </GuardedLink>
        <span className="h-5 w-px shrink-0 bg-line" aria-hidden />
        {PAGE_SECTIONS.map((section) => {
          const active = section.id === current
          const isEdited = edited.includes(section.id)
          return (
            <GuardedLink
              key={section.id}
              ref={active ? activeRef : undefined}
              href={`/admin/pages/${section.id}`}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors',
                active ? 'border-ink bg-ink text-ivory' : 'border-line bg-white text-ink-soft hover:border-ink/25 hover:text-ink',
              )}
            >
              {section.label}
              {isEdited && (
                <span className={cn('size-1.5 rounded-full', active ? 'bg-clay-soft' : 'bg-sage-dark')} aria-hidden />
              )}
              {isEdited && <span className="sr-only">(edited)</span>}
            </GuardedLink>
          )
        })}
      </div>
    </nav>
  )
}

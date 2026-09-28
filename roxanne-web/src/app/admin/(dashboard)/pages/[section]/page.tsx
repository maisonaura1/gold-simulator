import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentEditor } from '@/components/admin/pages/ContentEditor'
import { SectionTabs } from '@/components/admin/pages/SectionTabs'
import { getEditedSectionIds, listSamples, sectionDefaults, sectionValue } from '@/lib/admin/content'
import { findPageSection } from '@/lib/admin/sections'
import { requireAdmin } from '@/lib/auth'
import { getContent } from '@/lib/data'

export async function generateMetadata({ params }: PageProps<'/admin/pages/[section]'>): Promise<Metadata> {
  const section = findPageSection((await params).section)
  return { title: section ? `${section.label} — Pages` : 'Pages' }
}

export default async function EditSectionPage({ params }: PageProps<'/admin/pages/[section]'>) {
  await requireAdmin()
  const section = findPageSection((await params).section)
  if (!section) notFound()

  const [content, edited] = await Promise.all([getContent(), getEditedSectionIds()])
  const labelRoot = section.kind === 'course' ? 'course' : section.keys.length === 1 ? section.keys[0] : ''
  // Course identity fields are fixed.
  const hiddenPaths = section.kind === 'course' ? ['slug', 'photo'] : []

  return (
    <div className="space-y-6">
      <SectionTabs current={section.id} edited={edited} />
      <ContentEditor
        key={section.id}
        section={{
          id: section.id,
          label: section.label,
          href: section.href,
          description: section.description,
          review: section.review,
        }}
        labelRoot={labelRoot}
        initialValue={sectionValue(section, content)}
        template={sectionDefaults(section)}
        hiddenPaths={hiddenPaths}
        listSamples={listSamples(section)}
        initiallyEdited={edited.includes(section.id)}
      />
    </div>
  )
}

import 'server-only'
import { defaultContent } from '@/content/defaults'
import type { SiteContent } from '@/content/types'
import { getContent, getEditedSections } from '@/lib/data'
import { deepEqual, getIn } from './json'
import { PAGE_SECTIONS, type PageSection, type PageSectionId } from './sections'

export type SectionValue = Record<string, unknown>

/** The value edited by one dashboard tab: a section, several sections, or one course. */
export function sectionValue(section: PageSection, content: SiteContent): SectionValue {
  if (section.kind === 'course') {
    const course = content.courseList.find((item) => item.slug === section.slug)
    return { ...(course ?? {}) } as SectionValue
  }
  if (section.keys.length === 1) return content[section.keys[0]] as unknown as SectionValue
  return Object.fromEntries(section.keys.map((key) => [key, content[key]]))
}

export function sectionDefaults(section: PageSection): SectionValue {
  return sectionValue(section, defaultContent)
}

/** Tabs whose text differs from the original copy. */
export async function getEditedSectionIds(): Promise<PageSectionId[]> {
  const [edited, content] = await Promise.all([getEditedSections(), getContent()])
  return PAGE_SECTIONS.filter((section) => {
    if (section.kind === 'course') {
      return edited.includes('courseList') && !deepEqual(sectionValue(section, content), sectionDefaults(section))
    }
    return section.keys.some((key) => edited.includes(key))
  }).map((section) => section.id)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function emptyListPaths(value: unknown, path: string[] = []): string[][] {
  if (Array.isArray(value)) return value.length === 0 ? [path] : []
  if (isObject(value)) return Object.entries(value).flatMap(([key, item]) => emptyListPaths(item, [...path, key]))
  return []
}

/**
 * Lists that are empty in a course's original copy but hold blocks (title +
 * text) on other courses. The content store keeps only text lines in lists
 * that start empty, so the editor hides them instead of offering an "Add"
 * button whose items would be dropped on save.
 */
export function unsupportedListPaths(section: PageSection): string[] {
  if (section.kind !== 'course') return []
  return emptyListPaths(sectionDefaults(section))
    .filter((path) =>
      defaultContent.courseList.some((course) => {
        const list = getIn(course, path)
        return Array.isArray(list) && list.length > 0 && isObject(list[0])
      }),
    )
    .map((path) => path.join('.'))
}

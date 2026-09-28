'use server'

import { z } from 'zod'
import { defaultContent } from '@/content/defaults'
import type { ContentSectionKey, Course, SiteContent } from '@/content/types'
import { assertAdmin } from '@/lib/auth'
import { conform } from '@/lib/conform'
import { getContent, resetContentSection, saveContentSection } from '@/lib/data'
import { sectionDefaults, type SectionValue } from '../content'
import { deepEqual } from '../json'
import { findPageSection, PAGE_SECTIONS, type PageSection } from '../sections'
import { actionFailure, type ActionResult } from '../types'

const sectionIdSchema = z.enum(PAGE_SECTIONS.map((section) => section.id) as [string, ...string[]])
const valueSchema = z
  .record(z.string(), z.unknown())
  .refine((value) => JSON.stringify(value).length <= 1_000_000, 'This page is too long to save.')

const SAVE_FAILED = 'Your changes couldn’t be saved. Please try again in a moment.'

/** Saves one content section; removes the override when it matches the original copy again. */
async function saveKey<K extends ContentSectionKey>(key: K, value: unknown): Promise<SiteContent[K]> {
  const clean = await saveContentSection(key, value)
  if (deepEqual(clean, defaultContent[key])) await resetContentSection(key)
  return clean
}

async function saveCourse(section: PageSection & { kind: 'course' }, value: SectionValue): Promise<SectionValue> {
  const { courseList } = await getContent()
  const list = courseList.map((course) =>
    course.slug === section.slug ? ({ ...value, slug: course.slug, photo: course.photo } as unknown as Course) : course,
  )
  const clean = await saveKey('courseList', list)
  return { ...(clean.find((course) => course.slug === section.slug) ?? {}) } as SectionValue
}

export async function saveContent(sectionId: string, value: unknown): Promise<ActionResult<{ value: SectionValue }>> {
  await assertAdmin()
  const id = sectionIdSchema.safeParse(sectionId)
  const input = valueSchema.safeParse(value)
  const section = id.success ? findPageSection(id.data) : undefined
  if (!section) return actionFailure('This page can’t be edited.')
  if (!input.success) return actionFailure(input.error.issues[0]?.message ?? SAVE_FAILED)

  try {
    if (section.kind === 'course') return { ok: true, value: await saveCourse(section, input.data) }

    if (section.keys.length === 1) {
      const [key] = section.keys
      return { ok: true, value: (await saveKey(key, input.data)) as unknown as SectionValue }
    }

    // Several sections in one tab: only write the ones that changed.
    const current = await getContent()
    const saved: SectionValue = {}
    for (const key of section.keys) {
      const incoming = conform(defaultContent[key], input.data[key])
      saved[key] = deepEqual(incoming, current[key]) ? current[key] : await saveKey(key, input.data[key])
    }
    return { ok: true, value: saved }
  } catch (err) {
    console.error('[dashboard] saveContent failed', err)
    return actionFailure(SAVE_FAILED)
  }
}

export async function resetContent(sectionId: string): Promise<ActionResult<{ value: SectionValue }>> {
  await assertAdmin()
  const id = sectionIdSchema.safeParse(sectionId)
  const section = id.success ? findPageSection(id.data) : undefined
  if (!section) return actionFailure('This page can’t be reset.')

  try {
    if (section.kind === 'course') {
      const { courseList } = await getContent()
      const original = defaultContent.courseList.find((course) => course.slug === section.slug)
      const list = courseList.map((course) => (course.slug === section.slug && original ? original : course))
      if (deepEqual(list, defaultContent.courseList)) await resetContentSection('courseList')
      else await saveContentSection('courseList', list)
    } else {
      for (const key of section.keys) await resetContentSection(key)
    }
    return { ok: true, value: sectionDefaults(section) }
  } catch (err) {
    console.error('[dashboard] resetContent failed', err)
    return actionFailure('The original text couldn’t be restored. Please try again.')
  }
}

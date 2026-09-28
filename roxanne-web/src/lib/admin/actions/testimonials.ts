'use server'

import { z } from 'zod'
import type { Testimonial } from '@/content/types'
import { assertAdmin } from '@/lib/auth'
import { getTestimonials, newId, saveTestimonials } from '@/lib/data'
import { actionFailure, type ActionResult, type FieldErrors } from '../types'

const idSchema = z.string().regex(/^[a-z0-9-]{6,64}$/)

const inputSchema = z.object({
  id: idSchema.optional(),
  quote: z
    .string()
    .trim()
    .min(1, 'Please add the quote.')
    .max(1500, 'Please keep the quote under 1,500 characters.'),
  name: z.string().trim().min(1, 'Please add the client’s name.').max(120, 'Please keep the name under 120 characters.'),
  role: z.string().trim().max(160, 'Please keep this under 160 characters.'),
  location: z.string().trim().max(120, 'Please keep this under 120 characters.'),
  published: z.boolean(),
})

export type TestimonialInput = z.input<typeof inputSchema>

const SAVE_FAILED = 'The testimonials couldn’t be saved. Please try again.'

async function persist(list: Testimonial[]): Promise<ActionResult> {
  try {
    await saveTestimonials(list)
    return { ok: true }
  } catch (err) {
    console.error('[dashboard] saveTestimonials failed', err)
    return actionFailure(SAVE_FAILED)
  }
}

/** Creates a testimonial (no id) or updates an existing one. */
export async function saveTestimonial(input: TestimonialInput): Promise<ActionResult<{ id: string }>> {
  await assertAdmin()
  const parsed = inputSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      fieldErrors[key] ??= issue.message
    }
    return actionFailure('Please check the highlighted fields.', fieldErrors)
  }

  const { id, ...fields } = parsed.data
  const list = await getTestimonials()
  if (id) {
    if (!list.some((t) => t.id === id)) return actionFailure('This testimonial no longer exists.')
    const result = await persist(list.map((t) => (t.id === id ? { ...t, ...fields } : t)))
    return result.ok ? { ok: true, id } : result
  }
  if (list.length >= 100) return actionFailure('You can keep up to 100 testimonials. Please delete one first.')
  const created: Testimonial = { id: newId(), ...fields, createdAt: new Date().toISOString() }
  const result = await persist([...list, created])
  return result.ok ? { ok: true, id: created.id } : result
}

export async function setTestimonialPublished(id: string, published: boolean): Promise<ActionResult> {
  await assertAdmin()
  const parsed = z.object({ id: idSchema, published: z.boolean() }).safeParse({ id, published })
  if (!parsed.success) return actionFailure(SAVE_FAILED)
  const list = await getTestimonials()
  if (!list.some((t) => t.id === parsed.data.id)) return actionFailure('This testimonial no longer exists.')
  return persist(list.map((t) => (t.id === parsed.data.id ? { ...t, published: parsed.data.published } : t)))
}

export async function moveTestimonial(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  await assertAdmin()
  const parsed = z.object({ id: idSchema, direction: z.enum(['up', 'down']) }).safeParse({ id, direction })
  if (!parsed.success) return actionFailure(SAVE_FAILED)
  const list = await getTestimonials()
  const from = list.findIndex((t) => t.id === parsed.data.id)
  const to = parsed.data.direction === 'up' ? from - 1 : from + 1
  if (from === -1) return actionFailure('This testimonial no longer exists.')
  if (to < 0 || to >= list.length) return { ok: true }
  const next = [...list]
  ;[next[from], next[to]] = [next[to], next[from]]
  return persist(next)
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await assertAdmin()
  const parsed = idSchema.safeParse(id)
  if (!parsed.success) return actionFailure(SAVE_FAILED)
  const list = await getTestimonials()
  if (!list.some((t) => t.id === parsed.data)) return actionFailure('This testimonial was already deleted.')
  return persist(list.filter((t) => t.id !== parsed.data))
}

import 'server-only'
import { cache } from 'react'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { defaultContent, defaultSettings } from '@/content/defaults'
import type {
  ContactMessage,
  ContentSectionKey,
  Course,
  MediaItem,
  MessageStatus,
  SiteContent,
  SiteSettings,
  Testimonial,
} from '@/content/types'
import { conform, safeHref } from './conform'
import { getStore } from './store'

/* ────────────────────────────── Content ────────────────────────────── */

type ContentOverrides = Partial<Record<ContentSectionKey, unknown>>

function sanitizeSection<K extends ContentSectionKey>(key: K, value: unknown): SiteContent[K] {
  const section = conform(defaultContent[key], value)
  if (key === 'courseList') {
    // Courses are a fixed set: keep identity fields from the defaults.
    const courses = section as Course[]
    return defaultContent.courseList.map((base, i) => ({
      ...(courses[i] ?? base),
      slug: base.slug,
      photo: base.photo,
    })) as SiteContent[K]
  }
  if (key === 'nav' || key === 'footer') {
    const withLinks = section as SiteContent['nav'] | SiteContent['footer']
    const list = 'items' in withLinks ? withLinks.items : withLinks.links
    for (const link of list) link.href = safeHref(link.href)
  }
  return section
}

/** Full site content: defaults overlaid with the sections edited in the dashboard. */
export const getContent = cache(async (): Promise<SiteContent> => {
  const overrides = (await getStore().getJSON<ContentOverrides>('content')) ?? {}
  const content = { ...defaultContent }
  for (const key of Object.keys(defaultContent) as ContentSectionKey[]) {
    if (key in overrides) {
      ;(content as Record<ContentSectionKey, unknown>)[key] = sanitizeSection(key, overrides[key])
    }
  }
  return content
})

/** Sections that differ from the defaults (used by the dashboard to offer "Reset"). */
export async function getEditedSections(): Promise<ContentSectionKey[]> {
  const overrides = (await getStore().getJSON<ContentOverrides>('content')) ?? {}
  return (Object.keys(overrides) as ContentSectionKey[]).filter((key) => key in defaultContent)
}

export async function saveContentSection<K extends ContentSectionKey>(key: K, value: unknown): Promise<SiteContent[K]> {
  if (!(key in defaultContent)) throw new Error(`Unknown content section: ${String(key)}`)
  const store = getStore()
  const overrides = (await store.getJSON<ContentOverrides>('content')) ?? {}
  const clean = sanitizeSection(key, value)
  overrides[key] = clean
  await store.setJSON('content', overrides)
  revalidateSite()
  return clean
}

export async function resetContentSection(key: ContentSectionKey): Promise<void> {
  const store = getStore()
  const overrides = (await store.getJSON<ContentOverrides>('content')) ?? {}
  delete overrides[key]
  await store.setJSON('content', overrides)
  revalidateSite()
}

/* ────────────────────────────── Settings ───────────────────────────── */

const optionalHttpsUrl = z.union([z.literal(''), z.url({ protocol: /^https$/ }).max(500)])

export const settingsSchema = z.object({
  email: z.union([z.literal(''), z.email().max(200)]),
  whatsappNumber: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+\d\s().-]*$/, 'Use digits, spaces and + ( ) - only'),
  showPhone: z.boolean(),
  calendlyUrl: z.union([
    z.literal(''),
    z
      .url({ protocol: /^https$/, hostname: /^(www\.)?calendly\.com$/ })
      .max(300),
  ]),
  socials: z.object({
    linkedin: optionalHttpsUrl,
    instagram: optionalHttpsUrl,
    facebook: optionalHttpsUrl,
    youtube: optionalHttpsUrl,
  }),
  photos: z.partialRecord(
    z.enum(['hero', 'portrait', 'business', 'legal', 'beginner', 'speech', 'freelance']),
    z.union([z.string().regex(/^\/media\/[a-z0-9-]+$/), z.url({ protocol: /^https$/ }).max(1000)]),
  ),
  notifyByEmail: z.boolean(),
})

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const stored = (await getStore().getJSON<Record<string, unknown>>('settings')) ?? {}
  // Validate field by field so one bad value never wipes the others.
  const merged = { ...defaultSettings } as Record<string, unknown>
  for (const [key, schema] of Object.entries(settingsSchema.shape)) {
    const parsed = schema.safeParse(stored[key])
    if (parsed.success) merged[key] = parsed.data
  }
  const settings = merged as unknown as SiteSettings
  if (!settings.calendlyUrl && process.env.CALENDLY_URL) settings.calendlyUrl = process.env.CALENDLY_URL
  return settings
})

export async function saveSettings(input: unknown): Promise<SiteSettings> {
  const settings = settingsSchema.parse(input)
  await getStore().setJSON('settings', settings)
  revalidateSite()
  return settings
}

/* ──────────────────────────── Testimonials ─────────────────────────── */

export const testimonialSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{6,64}$/),
  quote: z.string().trim().min(1).max(1500),
  name: z.string().trim().min(1).max(120),
  role: z.string().trim().max(160),
  location: z.string().trim().max(120),
  published: z.boolean(),
  createdAt: z.string().max(40),
})

export async function getTestimonials(): Promise<Testimonial[]> {
  const stored = await getStore().getJSON<unknown[]>('testimonials')
  if (!Array.isArray(stored)) return []
  return stored.flatMap((item) => {
    const parsed = testimonialSchema.safeParse(item)
    return parsed.success ? [parsed.data] : []
  })
}

export const getPublishedTestimonials = cache(async () => (await getTestimonials()).filter((t) => t.published))

export async function saveTestimonials(list: unknown): Promise<Testimonial[]> {
  const testimonials = z.array(testimonialSchema).max(100).parse(list)
  await getStore().setJSON('testimonials', testimonials)
  revalidateSite()
  return testimonials
}

/* ────────────────────────────── Messages ───────────────────────────── */

const MAX_MESSAGES = 1000

export const contactInputSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.email('Please enter a valid email address').max(200),
  topic: z.string().trim().max(120).default(''),
  message: z.string().trim().min(10, 'Please write a few words about your goals').max(5000),
  source: z.enum(['contact-page', 'freelance-page', 'popup']).default('contact-page'),
})
export type ContactInput = z.infer<typeof contactInputSchema>

export async function getMessages(): Promise<ContactMessage[]> {
  return (await getStore().getJSON<ContactMessage[]>('messages')) ?? []
}

export async function addMessage(input: ContactInput): Promise<ContactMessage> {
  const store = getStore()
  const messages = await getMessages()
  const message: ContactMessage = {
    id: newId(),
    ...input,
    status: 'new',
    createdAt: new Date().toISOString(),
  }
  await store.setJSON('messages', [message, ...messages].slice(0, MAX_MESSAGES))
  return message
}

export async function setMessageStatus(id: string, status: MessageStatus): Promise<void> {
  const messages = await getMessages()
  await getStore().setJSON(
    'messages',
    messages.map((m) => (m.id === id ? { ...m, status } : m)),
  )
}

export async function deleteMessage(id: string): Promise<void> {
  const messages = await getMessages()
  await getStore().setJSON(
    'messages',
    messages.filter((m) => m.id !== id),
  )
}

/* ─────────────────────────────── Media ─────────────────────────────── */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const IMAGE_SIGNATURES: { type: string; test: (b: Buffer) => boolean }[] = [
  { type: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: 'image/png', test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { type: 'image/webp', test: (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP' },
  { type: 'image/avif', test: (b) => b.subarray(4, 12).toString('ascii').startsWith('ftypavi') },
]

/** Detects the real image type from magic bytes (never trust the client's MIME type). SVG is rejected. */
export function sniffImageType(data: Buffer): string | null {
  return IMAGE_SIGNATURES.find((sig) => sig.test(data))?.type ?? null
}

export async function getMediaIndex(): Promise<MediaItem[]> {
  return (await getStore().getJSON<MediaItem[]>('media')) ?? []
}

export async function saveMedia(
  data: Buffer,
  meta: { width: number; height: number; label: string },
): Promise<MediaItem> {
  if (data.byteLength > MAX_UPLOAD_BYTES) throw new Error('Image is larger than 5 MB')
  const contentType = sniffImageType(data)
  if (!contentType) throw new Error('Unsupported file — please upload a JPG, PNG, WebP or AVIF image')
  const store = getStore()
  const id = newId()
  await store.setBinary(id, { data, contentType })
  const item: MediaItem = {
    id,
    path: `/media/${id}`,
    contentType,
    width: Math.max(0, Math.round(meta.width)) || 0,
    height: Math.max(0, Math.round(meta.height)) || 0,
    bytes: data.byteLength,
    createdAt: new Date().toISOString(),
    label: meta.label.slice(0, 120),
  }
  await store.setJSON('media', [item, ...(await getMediaIndex())].slice(0, 500))
  return item
}

export async function deleteMedia(id: string): Promise<void> {
  const store = getStore()
  await store.deleteBinary(id)
  await store.setJSON(
    'media',
    (await getMediaIndex()).filter((m) => m.id !== id),
  )
}

/* ─────────────────────────────── Helpers ───────────────────────────── */

export function newId(): string {
  return `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`
}

/** Refresh every prerendered page after an edit in the dashboard. */
export function revalidateSite() {
  revalidatePath('/', 'layout')
}

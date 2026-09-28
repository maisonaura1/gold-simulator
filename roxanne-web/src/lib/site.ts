import type { Course, CourseSlug, SiteContent } from '@/content/types'

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function whatsappHref(number: string, message?: string): string | null {
  const digits = digitsOnly(number)
  if (digits.length < 7) return null
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export function telHref(number: string): string | null {
  const digits = digitsOnly(number)
  return digits.length < 7 ? null : `tel:+${digits}`
}

/** Calendly inline embed URL, themed to the site palette. */
export function calendlyEmbedSrc(url: string, host: string): string {
  const u = new URL(url)
  u.searchParams.set('embed_domain', host)
  u.searchParams.set('embed_type', 'Inline')
  u.searchParams.set('hide_gdpr_banner', '1')
  u.searchParams.set('background_color', 'faf6f0')
  u.searchParams.set('text_color', '1f2533')
  u.searchParams.set('primary_color', 'a5533a')
  return u.toString()
}

export function courseHref(slug: CourseSlug): string {
  return `/courses/${slug}`
}

export function findCourse(content: SiteContent, slug: string): Course | undefined {
  return content.courseList.find((course) => course.slug === slug)
}

/** "Legal English" → "legal-english" style anchors for in-page navigation. */
export function anchorId(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

import type { MetadataRoute } from 'next'
import { COURSE_SLUGS } from '@/content/types'
import { siteUrl } from '@/lib/site'

type Entry = { path: string; priority: number; changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'] }

const PAGES: Entry[] = [
  { path: '/', priority: 1 },
  { path: '/courses', priority: 0.9 },
  ...COURSE_SLUGS.map((slug) => ({ path: `/courses/${slug}`, priority: 0.8 })),
  { path: '/about', priority: 0.8 },
  { path: '/contact', priority: 0.8 },
  { path: '/freelance', priority: 0.7 },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const lastModified = new Date()
  return PAGES.map(({ path, priority, changeFrequency = 'monthly' }) => ({
    url: `${base}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}

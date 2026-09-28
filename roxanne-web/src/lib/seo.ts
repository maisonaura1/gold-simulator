import type { Metadata } from 'next'
import type { Course, Meta, SiteContent, SiteSettings } from '@/content/types'
import { courseHref, siteUrl, telHref } from './site'

/** Page metadata with canonical URL and social cards. */
export function pageMetadata(meta: Meta, path: string, options: { image?: string; noindex?: boolean } = {}): Metadata {
  const url = `${siteUrl()}${path === '/' ? '' : path}`
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url,
      title: meta.title,
      description: meta.description,
      siteName: 'RoxanneAlexia Language Coach',
      locale: 'en_US',
      ...(options.image ? { images: [{ url: options.image }] } : {}),
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
    ...(options.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/** Business entity shared by every page (ProfessionalService + the person behind it). */
export function organizationJsonLd(content: SiteContent, settings: SiteSettings) {
  const base = siteUrl()
  const sameAs = Object.values(settings.socials).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['ProfessionalService', 'EducationalOrganization'],
        '@id': `${base}/#business`,
        name: `${content.brand.name} ${content.brand.descriptor}`,
        alternateName: 'Law Business English Speech Coaching',
        slogan: content.brand.tagline,
        description: content.home.meta.description,
        url: base,
        ...(settings.email ? { email: settings.email } : {}),
        ...(telHref(settings.whatsappNumber) ? { telephone: telHref(settings.whatsappNumber)!.replace('tel:', '') } : {}),
        areaServed: { '@type': 'Place', name: 'Europe' },
        availableLanguage: ['English'],
        founder: { '@id': `${base}/#person` },
        ...(sameAs.length ? { sameAs } : {}),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'English courses for professionals',
          itemListElement: content.courseList.map((course) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Course', name: course.name, url: `${base}${courseHref(course.slug)}` },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: content.brand.personName,
        jobTitle: 'English Language Coach — Law & Business English',
        worksFor: { '@id': `${base}/#business` },
        url: `${base}/about`,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: `${content.brand.name} ${content.brand.descriptor}`,
        publisher: { '@id': `${base}/#business` },
        inLanguage: 'en',
      },
    ],
  }
}

export function courseJsonLd(course: Course) {
  const base = siteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.page.meta.description,
    url: `${base}${courseHref(course.slug)}`,
    provider: { '@id': `${base}/#business` },
    inLanguage: 'en',
    teaches: course.focusAreas.map((f) => f.title),
    hasCourseInstance: [
      { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'Flexible — scheduled around you' },
    ],
    offers: { '@type': 'Offer', category: 'Consultation', price: 0, priceCurrency: 'EUR', description: 'Free consultation' },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const base = siteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${base}${item.path === '/' ? '' : item.path}`,
    })),
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

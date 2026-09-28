/**
 * Site content model. Every string here is editable from the dashboard
 * (Dashboard → Pages). Defaults live in ./defaults.ts and come from the
 * client's copy spreadsheet ("Website" sheet, tabs 1–8).
 */

export type CourseSlug =
  | 'business-english'
  | 'legal-english'
  | 'beginner-english'
  | 'speech-presentation-coaching'

export const COURSE_SLUGS: CourseSlug[] = [
  'business-english',
  'legal-english',
  'beginner-english',
  'speech-presentation-coaching',
]

export type PhotoKey = 'hero' | 'portrait' | 'business' | 'legal' | 'beginner' | 'speech' | 'freelance'

export interface Meta {
  title: string
  description: string
}

export interface Feature {
  title: string
  description: string
}

export interface TitledList {
  title: string
  items: string[]
}

export interface TitledBody {
  title: string
  body: string
}

export interface PackageFormat {
  name: string
  description: string
}

export interface CoursePage {
  meta: Meta
  hero: { eyebrow: string; title: string; subtitle: string; ctaLabel: string }
  intro: string
  whoFor: TitledList
  learn: TitledList
  sections: TitledBody[]
  /** Optional specialist track shown on the page (e.g. Litigation English inside Legal English). */
  specialism?: {
    eyebrow: string
    title: string
    subtitle: string
    intro: string
    whoFor: TitledList
    learn: TitledList
    approach: TitledBody
  }
  bottomCta: { title: string; body: string; buttonLabel: string }
}

export interface Course {
  slug: CourseSlug
  name: string
  /** One-line promise used in the Courses intro and menus. */
  tagline: string
  /** Formats line, e.g. "Private 1-on-1 Package, … available." */
  formats: string
  /** Short description for cards on the home page. */
  cardDescription: string
  /** Long description on the Courses page. */
  description: string
  focusTitle: string
  focusAreas: Feature[]
  /** Call-to-action label pointing to the course page. */
  ctaLabel: string
  /** Formats shown in the "Package options" popup. */
  packages: PackageFormat[]
  photo: PhotoKey
  page: CoursePage
}

export interface SiteContent {
  brand: {
    name: string
    descriptor: string
    tagline: string
    personName: string
  }
  global: {
    consultationCta: string
    consultationModal: {
      eyebrow: string
      title: string
      body: string
      calendlyLabel: string
      calendlyHint: string
      whatsappLabel: string
      whatsappHint: string
      messageLabel: string
      messageHint: string
    }
    packagesModal: {
      eyebrow: string
      sectionTitle: string
      body: string
      note: string
      primaryLabel: string
      secondaryLabel: string
    }
    whatsappMessage: string
    whatsappTooltip: string
  }
  nav: {
    items: { label: string; href: string }[]
  }
  footer: {
    blurb: string
    links: { label: string; href: string }[]
    legal: string
  }
  home: {
    meta: Meta
    hero: { eyebrow: string; title: string; subtitle: string; ctaLabel: string; secondaryCtaLabel: string }
    intro: { eyebrow: string; title: string; body: string; linkLabel: string; quote: string }
    marquee: string[]
    benefits: { eyebrow: string; title: string; items: Feature[] }
    services: { eyebrow: string; title: string; subtitle: string; cardCtaLabel: string }
    freelance: { eyebrow: string; title: string; linkLabel: string }
    testimonials: { eyebrow: string; title: string }
    finalCta: { title: string; subtitle: string; buttonLabel: string }
  }
  about: {
    meta: Meta
    hero: { eyebrow: string; title: string; subtitle: string }
    bio: { eyebrow: string; title: string; paragraphs: string[] }
    credentials: TitledList
    offer: { eyebrow: string; title: string; items: Feature[]; linkLabel: string }
  }
  courses: {
    meta: Meta
    hero: { eyebrow: string; title: string }
    intro: { body: string; programsTitle: string }
    packagesLabel: string
    howItWorks: { eyebrow: string; title: string; subtitle: string; steps: TitledBody[] }
    bottomCta: { title: string; linkLabel: string }
  }
  courseList: Course[]
  freelance: {
    meta: Meta
    hero: { eyebrow: string; title: string; subtitle: string; ctaLabel: string }
    intro: string
    services: { eyebrow: string; title: string; items: Feature[] }
    idealFor: TitledList
    process: { eyebrow: string; title: string; steps: TitledBody[] }
    bottomCta: { title: string; body: string; buttonLabel: string }
  }
  contact: {
    meta: Meta
    hero: { eyebrow: string; title: string; body: string }
    details: { title: string; emailLabel: string; whatsappLabel: string; note: string }
    scheduler: { eyebrow: string; title: string; body: string; buttonLabel: string; privacyNote: string }
    form: {
      title: string
      nameLabel: string
      emailLabel: string
      topicLabel: string
      topics: string[]
      messageLabel: string
      consentLabel: string
      submitLabel: string
      successTitle: string
      successBody: string
    }
    faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] }
  }
  privacy: {
    meta: Meta
    title: string
    updated: string
    sections: TitledBody[]
  }
}

export type ContentSectionKey = keyof SiteContent

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  location: string
  published: boolean
  createdAt: string
}

export type MessageStatus = 'new' | 'read' | 'replied' | 'archived'

export interface ContactMessage {
  id: string
  name: string
  email: string
  topic: string
  message: string
  status: MessageStatus
  createdAt: string
  source: 'contact-page' | 'freelance-page' | 'popup'
}

export interface SiteSettings {
  email: string
  whatsappNumber: string
  /** Show the phone number as text on the Contact page (WhatsApp button is always shown). */
  showPhone: boolean
  calendlyUrl: string
  socials: {
    linkedin: string
    instagram: string
    facebook: string
    youtube: string
  }
  /** Per-slot photo overrides (uploaded /media/… paths or https URLs). */
  photos: Partial<Record<PhotoKey, string>>
  notifyByEmail: boolean
}

export interface MediaItem {
  id: string
  path: string
  contentType: string
  width: number
  height: number
  bytes: number
  createdAt: string
  label: string
}

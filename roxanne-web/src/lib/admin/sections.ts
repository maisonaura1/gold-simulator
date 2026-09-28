import type { ContentSectionKey, CourseSlug } from '@/content/types'

/**
 * The tabs of Dashboard → Pages. A tab edits one or more top-level content
 * sections, or one course of `courseList`.
 */
export type PageSectionId =
  | 'home'
  | 'about'
  | 'courses'
  | CourseSlug
  | 'freelance'
  | 'contact'
  | 'brand'
  | 'privacy'

interface SectionBase {
  id: PageSectionId
  label: string
  description: string
  /** Public page where the section is shown. */
  href: string
  group: 'pages' | 'courses' | 'site'
  /** Copy drafted by the web team that Roxanne should review. */
  review?: { tone: 'draft' | 'note'; text: string }
}

export interface KeysSection extends SectionBase {
  kind: 'keys'
  keys: ContentSectionKey[]
}

export interface CourseSection extends SectionBase {
  kind: 'course'
  slug: CourseSlug
}

export type PageSection = KeysSection | CourseSection

const DRAFT_NOTE = 'drafted by the web team because it was not in your copy document. Please read it carefully and change anything that doesn’t sound like you.'

export const PAGE_SECTIONS: PageSection[] = [
  {
    id: 'home',
    kind: 'keys',
    keys: ['home'],
    label: 'Home',
    href: '/',
    group: 'pages',
    description: 'Headline, introduction, benefits, courses overview and the closing message.',
  },
  {
    id: 'about',
    kind: 'keys',
    keys: ['about'],
    label: 'About',
    href: '/about',
    group: 'pages',
    description: 'Your story, qualifications and what you offer.',
    review: {
      tone: 'note',
      text: 'The “Personal attention, always” item (under “What you offer”) was reworded by the web team so it doesn’t contradict your group courses. Please check it matches how you work.',
    },
  },
  {
    id: 'courses',
    kind: 'keys',
    keys: ['courses'],
    label: 'Courses page',
    href: '/courses',
    group: 'pages',
    description: 'Introduction, the “How it works” steps and the closing call to action.',
    review: {
      tone: 'note',
      text: 'The titles of steps 2 and 3 in “How it works” were drafted by the web team (your document had the text but no titles). Please check they read well.',
    },
  },
  {
    id: 'business-english',
    kind: 'course',
    slug: 'business-english',
    label: 'Business English',
    href: '/courses/business-english',
    group: 'courses',
    description: 'Course card, focus areas, package options and the course page.',
    review: { tone: 'note', text: `The package descriptions (in the “Package options” popup) were ${DRAFT_NOTE}` },
  },
  {
    id: 'legal-english',
    kind: 'course',
    slug: 'legal-english',
    label: 'Legal English',
    href: '/courses/legal-english',
    group: 'courses',
    description: 'Course card, focus areas, package options and the course page with Litigation English.',
    review: {
      tone: 'draft',
      text: `Parts of this page — the Google listing, “Who this is for” and the package descriptions — were ${DRAFT_NOTE}`,
    },
  },
  {
    id: 'beginner-english',
    kind: 'course',
    slug: 'beginner-english',
    label: 'Beginner English',
    href: '/courses/beginner-english',
    group: 'courses',
    description: 'Course card, focus areas, package options and the course page.',
    review: {
      tone: 'draft',
      text: `Parts of this page — the Google listing, “Who this is for”, the closing message and the package descriptions — were ${DRAFT_NOTE}`,
    },
  },
  {
    id: 'speech-presentation-coaching',
    kind: 'course',
    slug: 'speech-presentation-coaching',
    label: 'Speech & Presentation',
    href: '/courses/speech-presentation-coaching',
    group: 'courses',
    description: 'Course card, focus areas, package options and the course page.',
    review: {
      tone: 'draft',
      text: `Parts of this page — the Google listing, the formats line, the short card text, “Who this is for”, the closing message and the package descriptions — were ${DRAFT_NOTE}`,
    },
  },
  {
    id: 'freelance',
    kind: 'keys',
    keys: ['freelance'],
    label: 'Freelance',
    href: '/freelance',
    group: 'pages',
    description: 'Your freelance legal assistant services, who they are for and how it works.',
    review: { tone: 'draft', text: `This whole page was ${DRAFT_NOTE}` },
  },
  {
    id: 'contact',
    kind: 'keys',
    keys: ['contact'],
    label: 'Contact',
    href: '/contact',
    group: 'pages',
    description: 'Introduction, booking block, contact form labels and the FAQ.',
  },
  {
    id: 'brand',
    kind: 'keys',
    keys: ['brand', 'global', 'nav', 'footer'],
    label: 'Brand & global',
    href: '/',
    group: 'site',
    description: 'Logo text, your name, the menu, the footer and the popups shown on every page.',
  },
  {
    id: 'privacy',
    kind: 'keys',
    keys: ['privacy'],
    label: 'Privacy policy',
    href: '/privacy',
    group: 'site',
    description: 'The privacy policy linked in the footer and the contact form.',
    review: {
      tone: 'note',
      text: 'This privacy policy is template text prepared by the web team. Please review it before launch — ideally with someone who knows the data-protection rules in your country.',
    },
  },
]

export const SECTION_GROUPS: { id: PageSection['group']; label: string }[] = [
  { id: 'pages', label: 'Main pages' },
  { id: 'courses', label: 'Course pages' },
  { id: 'site', label: 'Site-wide' },
]

export function findPageSection(id: string): PageSection | undefined {
  return PAGE_SECTIONS.find((section) => section.id === id)
}

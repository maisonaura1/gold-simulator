import 'server-only'
import type { ContactMessage, MessageStatus } from '@/content/types'
import { getSecrets } from '@/lib/auth'
import { getContent, getMessages, getSettings, getTestimonials } from '@/lib/data'
import { storeLooksEphemeral } from '@/lib/store'
import { getAdminPrefs } from './prefs'

export interface ChecklistItem {
  id: string
  label: string
  hint: string
  done: boolean
  href: string
  action: string
  manual?: boolean
}

export interface MessagePreview {
  id: string
  name: string
  topic: string
  excerpt: string
  status: MessageStatus
  createdAt: string
}

export function sortNewestFirst(messages: ContactMessage[]): ContactMessage[] {
  return [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function toPreview(message: ContactMessage): MessagePreview {
  const text = message.message.replace(/\s+/g, ' ').trim()
  return {
    id: message.id,
    name: message.name,
    topic: message.topic,
    excerpt: text.length > 140 ? `${text.slice(0, 140).trimEnd()}…` : text,
    status: message.status,
    createdAt: message.createdAt,
  }
}

export async function countNewMessages(): Promise<number> {
  return (await getMessages()).filter((message) => message.status === 'new').length
}

/** Data for Dashboard → Overview. */
export async function getOverview() {
  const [content, settings, testimonials, messages, secrets, prefs] = await Promise.all([
    getContent(),
    getSettings(),
    getTestimonials(),
    getMessages(),
    getSecrets(),
    getAdminPrefs(),
  ])

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const published = testimonials.filter((t) => t.published).length

  const checklist: ChecklistItem[] = [
    {
      id: 'calendly',
      label: 'Add your Calendly booking link',
      hint: 'So visitors can book a free consultation instantly.',
      done: Boolean(settings.calendlyUrl),
      href: '/admin/settings#booking',
      action: 'Add link',
    },
    {
      id: 'linkedin',
      label: 'Add your LinkedIn profile',
      hint: 'Professionals like to check who they will learn with.',
      done: Boolean(settings.socials.linkedin),
      href: '/admin/settings#socials',
      action: 'Add link',
    },
    {
      id: 'portrait',
      label: 'Upload your portrait',
      hint: 'Visitors want to see who they’ll learn with.',
      done: Boolean(settings.photos.portrait),
      href: '/admin/photos#portrait',
      action: 'Upload',
    },
    {
      id: 'testimonial',
      label: 'Publish your first testimonial',
      hint: 'The testimonials section appears once one is published.',
      done: published > 0,
      href: '/admin/testimonials',
      action: 'Add one',
    },
    {
      id: 'password',
      label: 'Choose your own dashboard password',
      hint: 'Replace the temporary password set up by the web team.',
      done: Boolean(secrets.passwordHash),
      href: '/admin/settings#password',
      action: 'Change',
    },
    {
      id: 'credentials',
      label: 'Add your qualifications',
      hint: 'Shown on the About page under “Qualifications & experience”.',
      done: content.about.credentials.items.some((item) => item.trim()),
      href: '/admin/pages/about',
      action: 'Add',
    },
    {
      id: 'review',
      label: 'Review the copy drafted by the web team',
      hint: 'Freelance page; Legal, Beginner and Speech course pages; the About “Personal attention” item; the package descriptions.',
      done: prefs.reviewedDraftCopy,
      href: '/admin/pages',
      action: 'Review',
      manual: true,
    },
  ]

  return {
    firstName: content.brand.personName.trim().split(/\s+/)[0] || 'there',
    stats: {
      newMessages: messages.filter((m) => m.status === 'new').length,
      messagesThisMonth: messages.filter((m) => m.createdAt >= monthStart).length,
      publishedTestimonials: published,
      totalTestimonials: testimonials.length,
    },
    checklist,
    latestMessages: sortNewestFirst(messages).slice(0, 5).map(toPreview),
    calendlyUrl: settings.calendlyUrl,
    ephemeral: storeLooksEphemeral(),
  }
}

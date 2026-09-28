'use server'

import { rateLimit } from '@/lib/auth'
import { getClientIp } from '@/lib/client-ip'
import { addMessage, contactInputSchema, getSettings, InboxFullError } from '@/lib/data'
import { notifyNewMessage } from '@/lib/notify'

export type ContactField = 'name' | 'email' | 'topic' | 'message' | 'consent'

export interface ContactState {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<ContactField, string>>
  values?: Partial<Record<ContactField, string>>
}

export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  // Capped to the schema's limits: these values are echoed back when validation fails.
  const values = {
    name: String(formData.get('name') ?? '').slice(0, 120),
    email: String(formData.get('email') ?? '').slice(0, 200),
    topic: String(formData.get('topic') ?? '').slice(0, 120),
    message: String(formData.get('message') ?? '').slice(0, 5000),
    consent: formData.get('consent') === 'on' ? 'on' : '',
  }

  // 1. Validate every field in one pass, so people see all their mistakes at once.
  const source = formData.get('source') === 'freelance-page' ? 'freelance-page' : 'contact-page'
  const parsed = contactInputSchema.safeParse({ ...values, source })
  const fieldErrors: ContactState['fieldErrors'] = {}
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField
      fieldErrors[field] ??= issue.message
    }
  }
  if (!values.consent) fieldErrors.consent = 'Please tick the box so I can use your details to reply.'
  if (!parsed.success || Object.keys(fieldErrors).length > 0) return { status: 'error', fieldErrors, values }

  // 2. Spam traps — only for otherwise valid submissions: a hidden field only bots
  // fill in, and forms sent impossibly fast. Bots get a fake success so they don't retry.
  if (String(formData.get('website') ?? '').trim()) return { status: 'success' }
  const startedAt = Number(formData.get('startedAt') ?? 0)
  if (startedAt && Date.now() - startedAt < 1500) return { status: 'success' }

  // Per visitor, plus a site-wide hourly budget that holds even if addresses are rotated.
  const hour = 60 * 60 * 1000
  const allowed = (await rateLimit(`contact:${await getClientIp()}`, 5, hour)) && (await rateLimit('contact:all', 40, hour))
  if (!allowed) {
    return {
      status: 'error',
      message: 'Too many messages have been sent in a short time. Please try again later, or reach me on WhatsApp or by email.',
      values,
    }
  }

  try {
    const message = await addMessage(parsed.data)
    const settings = await getSettings()
    await notifyNewMessage(message, settings).catch((error) => console.error('[contact] email notification failed:', error))
  } catch (error) {
    if (error instanceof InboxFullError) {
      console.error('[contact] inbox full of unread messages — new message refused')
    } else {
      console.error('[contact] could not save message:', error)
    }
    return {
      status: 'error',
      message: 'Sorry — your message could not be sent right now. Please email me directly or use WhatsApp.',
      values,
    }
  }

  return { status: 'success' }
}

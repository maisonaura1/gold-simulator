'use server'

import { headers } from 'next/headers'
import { rateLimit } from '@/lib/auth'
import { addMessage, contactInputSchema, getSettings } from '@/lib/data'
import { notifyNewMessage } from '@/lib/notify'

export type ContactField = 'name' | 'email' | 'topic' | 'message' | 'consent'

export interface ContactState {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<ContactField, string>>
  values?: Partial<Record<Exclude<ContactField, 'consent'>, string>>
}

export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    topic: String(formData.get('topic') ?? ''),
    message: String(formData.get('message') ?? ''),
  }

  // Spam traps: a hidden field only bots fill in, and forms submitted impossibly fast.
  // Bots get a fake success so they don't retry.
  if (String(formData.get('website') ?? '').trim()) return { status: 'success' }
  const startedAt = Number(formData.get('startedAt') ?? 0)
  if (startedAt && Date.now() - startedAt < 2000) return { status: 'success' }

  const requestHeaders = await headers()
  const ip = (requestHeaders.get('x-forwarded-for')?.split(',')[0] ?? requestHeaders.get('x-real-ip') ?? 'unknown').trim()
  if (!rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
    return {
      status: 'error',
      message: 'You have sent several messages in a short time. Please try again later, or reach me on WhatsApp.',
      values,
    }
  }

  if (formData.get('consent') !== 'on') {
    return { status: 'error', fieldErrors: { consent: 'Please tick the box so I can use your details to reply.' }, values }
  }

  const source = formData.get('source') === 'freelance-page' ? 'freelance-page' : 'contact-page'
  const parsed = contactInputSchema.safeParse({ ...values, source })
  if (!parsed.success) {
    const fieldErrors: ContactState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField
      fieldErrors[field] ??= issue.message
    }
    return { status: 'error', fieldErrors, values }
  }

  try {
    const message = await addMessage(parsed.data)
    const settings = await getSettings()
    await notifyNewMessage(message, settings).catch((error) => console.error('[contact] email notification failed:', error))
  } catch (error) {
    console.error('[contact] could not save message:', error)
    return {
      status: 'error',
      message: 'Sorry — your message could not be sent right now. Please email me directly or use WhatsApp.',
      values,
    }
  }

  return { status: 'success' }
}

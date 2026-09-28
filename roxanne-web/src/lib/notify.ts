import 'server-only'
import type { ContactMessage, SiteSettings } from '@/content/types'

/**
 * Emails Roxanne about a new enquiry through Resend (https://resend.com) when
 * RESEND_API_KEY is set. Plain text only — nothing from the visitor is rendered as HTML.
 */
export async function notifyNewMessage(message: ContactMessage, settings: SiteSettings): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !settings.notifyByEmail || !settings.email) return

  const text = [
    `New message from your website`,
    ``,
    `Name:    ${message.name}`,
    `Email:   ${message.email}`,
    `Topic:   ${message.topic || '—'}`,
    `Source:  ${message.source}`,
    ``,
    message.message,
    ``,
    `— Reply directly to this email, or open your dashboard: /admin/messages`,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? 'Website <onboarding@resend.dev>',
      to: [settings.email],
      reply_to: message.email,
      subject: `New enquiry${message.topic ? ` — ${message.topic}` : ''} (${message.name})`.replace(/[\u0000-\u001f\u007f]+/g, ' ').slice(0, 200),
      text,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Resend responded ${res.status}`)
}

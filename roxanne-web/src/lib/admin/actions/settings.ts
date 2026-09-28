'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import type { SiteSettings } from '@/content/types'
import {
  assertAdmin,
  checkPassword,
  hashPassword,
  rateLimit,
  rotateSessions,
  startSession,
  updateSecrets,
} from '@/lib/auth'
import { getSettings, saveSettings, settingsSchema } from '@/lib/data'
import { updateAdminPrefs } from '../prefs'
import { getClientIp } from '../request'
import { actionFailure, type ActionResult, type FieldErrors } from '../types'

/* ───────────────────────────── Site settings ───────────────────────── */

export type EditableSettings = Omit<SiteSettings, 'photos'>
export type SettingsState = ActionResult<{ settings: EditableSettings }> | null

const FIELD_MESSAGES: Record<string, string> = {
  email: 'Please enter a valid email address, like name@example.com.',
  whatsappNumber: 'Use digits, spaces and + ( ) - only — for example +33 6 12 34 56 78.',
  calendlyUrl: 'Paste your Calendly link — it starts with https://calendly.com/',
  'socials.linkedin': 'Paste the full address of your LinkedIn profile, starting with https://',
  'socials.instagram': 'Paste the full address of your Instagram profile, starting with https://',
  'socials.facebook': 'Paste the full address of your Facebook page, starting with https://',
  'socials.youtube': 'Paste the full address of your YouTube channel, starting with https://',
}

function text(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

/** Friendly link input: "linkedin.com/in/me" → "https://linkedin.com/in/me"; http → https. */
function link(formData: FormData, name: string): string {
  const value = text(formData, name)
  if (!value) return ''
  if (/^http:\/\//i.test(value)) return value.replace(/^http:/i, 'https:')
  if (!/^[a-z][a-z0-9+.-]*:/i.test(value) && /^[\w-]+(\.[\w-]+)+(\/|$)/.test(value)) return `https://${value}`
  return value
}

export async function saveSiteSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await assertAdmin()
  const current = await getSettings()
  const parsed = settingsSchema.safeParse({
    email: text(formData, 'email'),
    whatsappNumber: text(formData, 'whatsappNumber'),
    showPhone: formData.get('showPhone') === 'on',
    calendlyUrl: link(formData, 'calendlyUrl'),
    socials: {
      linkedin: link(formData, 'linkedin'),
      instagram: link(formData, 'instagram'),
      facebook: link(formData, 'facebook'),
      youtube: link(formData, 'youtube'),
    },
    // Photos are managed in Dashboard → Photos; keep them as they are.
    photos: current.photos,
    notifyByEmail: formData.get('notifyByEmail') === 'on',
  })

  if (!parsed.success) {
    const fieldErrors: FieldErrors = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.')
      fieldErrors[key] ??= FIELD_MESSAGES[key] ?? issue.message
    }
    return actionFailure('Please check the highlighted fields.', fieldErrors)
  }

  try {
    const saved = await saveSettings(parsed.data)
    const settings: EditableSettings = {
      email: saved.email,
      whatsappNumber: saved.whatsappNumber,
      showPhone: saved.showPhone,
      calendlyUrl: saved.calendlyUrl,
      socials: saved.socials,
      notifyByEmail: saved.notifyByEmail,
    }
    return { ok: true, settings }
  } catch (err) {
    console.error('[dashboard] saveSettings failed', err)
    return actionFailure('Your settings couldn’t be saved. Please try again.')
  }
}

/* ─────────────────────────────── Password ──────────────────────────── */

export type PasswordState = ActionResult | null

const passwordSchema = z
  .object({
    current: z.string().min(1, 'Please enter your current password.').max(256),
    next: z
      .string()
      .min(12, 'Please use at least 12 characters.')
      .max(256, 'Please use at most 256 characters.')
      .refine((value) => value.trim().length === value.length, 'Please don’t start or end with a space.'),
    confirm: z.string().max(256),
  })
  .refine((data) => data.next === data.confirm, { path: ['confirm'], message: 'The two new passwords don’t match.' })
  .refine((data) => data.next !== data.current, {
    path: ['next'],
    message: 'Please choose a password that’s different from the current one.',
  })

export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  await assertAdmin()
  const parsed = passwordSchema.safeParse({
    current: formData.get('current') ?? '',
    next: formData.get('next') ?? '',
    confirm: formData.get('confirm') ?? '',
  })
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {}
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message
    return actionFailure('Please check the highlighted fields.', fieldErrors)
  }

  if (!(await rateLimit(`admin-password:${await getClientIp()}`, 5, 15 * 60 * 1000))) {
    return actionFailure('Too many attempts. Please wait 15 minutes before trying again.')
  }
  if ((await checkPassword(parsed.data.current)) !== 'ok') {
    return actionFailure('Please check the highlighted fields.', { current: 'That’s not your current password.' })
  }

  await updateSecrets({ passwordHash: await hashPassword(parsed.data.next) })
  // Sign out every other device, then keep this one signed in.
  await rotateSessions()
  await startSession()
  return { ok: true }
}

/* ─────────────────────────── Dashboard prefs ───────────────────────── */

export async function setDraftCopyReviewed(done: boolean): Promise<ActionResult> {
  await assertAdmin()
  const parsed = z.boolean().safeParse(done)
  if (!parsed.success) return actionFailure('This change couldn’t be saved.')
  await updateAdminPrefs({ reviewedDraftCopy: parsed.data })
  refresh()
  return { ok: true }
}

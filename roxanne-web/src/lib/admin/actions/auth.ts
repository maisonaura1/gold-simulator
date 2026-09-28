'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { checkPassword, endSession, isAdmin, rateLimit, resetRateLimit, rotateSessions, startSession } from '@/lib/auth'
import { sessionSecretConfigured } from '@/lib/session'
import { safeAdminPath } from '../paths'
import { getClientIp, sleep } from '../request'
import type { ActionFailure } from '../types'

export type LoginState = (ActionFailure & { reason: 'invalid' | 'rate-limited' | 'not-configured' }) | null

const loginSchema = z.object({
  password: z.string().min(1).max(256),
  next: z.string().max(512).optional(),
})

const LOGIN_WINDOW_MS = 15 * 60 * 1000

/** The only public Server Action of the dashboard: rate limited per IP. */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    password: formData.get('password') ?? '',
    next: formData.get('next') ?? undefined,
  })
  if (!parsed.success) return { ok: false, reason: 'invalid', error: 'Please enter your password.' }

  // Every attempt is counted before the password is checked (so parallel bursts can't
  // slip through); a successful sign-in clears this address's count. A global budget
  // also caps attempts spread over many addresses.
  const limiterKey = `admin-login:${await getClientIp()}`
  const allowed = (await rateLimit(limiterKey, 5, LOGIN_WINDOW_MS)) && (await rateLimit('admin-login:all', 50, LOGIN_WINDOW_MS))
  if (!allowed) {
    return {
      ok: false,
      reason: 'rate-limited',
      error: 'Too many attempts. For your security, please wait 15 minutes before trying again.',
    }
  }

  const result = sessionSecretConfigured() ? await checkPassword(parsed.data.password) : 'not-configured'
  if (result === 'not-configured') {
    return { ok: false, reason: 'not-configured', error: 'The dashboard password hasn’t been set up yet.' }
  }
  if (result === 'invalid') {
    // A short, slightly random pause makes guessing slower and timing less informative.
    await sleep(500 + Math.floor(Math.random() * 400))
    return { ok: false, reason: 'invalid', error: 'That password isn’t right. Please try again.' }
  }

  await resetRateLimit(limiterKey)
  await startSession()
  redirect(safeAdminPath(parsed.data.next))
}

export async function signOut(): Promise<void> {
  if (await isAdmin()) {
    // Session tokens are stateless: bump the version so a copied cookie stops working too.
    await rotateSessions()
    await endSession()
  }
  redirect('/admin/login')
}

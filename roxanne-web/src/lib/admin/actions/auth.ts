'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { checkPassword, clearFailures, endSession, isAdmin, recordFailure, startSession, tooManyFailures } from '@/lib/auth'
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

  // Only failed attempts count, so signing in and out repeatedly never locks Roxanne out.
  const limiterKey = `admin-login:${await getClientIp()}`
  if (tooManyFailures(limiterKey, 5)) {
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
    recordFailure(limiterKey, LOGIN_WINDOW_MS)
    // A short, slightly random pause makes guessing slower and timing less informative.
    await sleep(500 + Math.floor(Math.random() * 400))
    return { ok: false, reason: 'invalid', error: 'That password isn’t right. Please try again.' }
  }

  clearFailures(limiterKey)
  await startSession()
  redirect(safeAdminPath(parsed.data.next))
}

export async function signOut(): Promise<void> {
  if (await isAdmin()) await endSession()
  redirect('/admin/login')
}

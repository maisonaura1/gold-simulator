'use server'

import { z } from 'zod'
import { assertAdmin, updateSecrets } from '@/lib/auth'
import { CalendlyError, getCalendlyToken, getCalendlyUser } from '@/lib/calendly'
import { getSettings, saveSettings } from '@/lib/data'
import { revalidatePath } from 'next/cache'
import { actionFailure, type ActionResult } from '../types'

export type ConnectState = ActionResult<{ name: string }> | null

const tokenSchema = z
  .string()
  .trim()
  .min(20, 'This doesn’t look like a complete token — please copy it again.')
  .max(4000, 'This doesn’t look like a Calendly token.')
  .regex(/^[A-Za-z0-9._~+/=-]+$/, 'This doesn’t look like a Calendly token — it should not contain spaces.')

/** Checks a Personal Access Token with GET /users/me, then stores it (server-side only). */
export async function connectCalendly(_prev: ConnectState, formData: FormData): Promise<ConnectState> {
  await assertAdmin()
  const parsed = tokenSchema.safeParse(formData.get('token') ?? '')
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Please paste your token.'
    return actionFailure(message, { token: message })
  }
  try {
    const user = await getCalendlyUser(parsed.data)
    await updateSecrets({ calendlyToken: parsed.data })
    revalidatePath('/admin', 'layout')
    return { ok: true, name: user.name }
  } catch (err) {
    const message = err instanceof CalendlyError ? err.message : 'The token couldn’t be checked. Please try again.'
    return actionFailure(message, { token: message })
  }
}

export async function disconnectCalendly(): Promise<ActionResult> {
  await assertAdmin()
  await updateSecrets({ calendlyToken: undefined })
  revalidatePath('/admin', 'layout')
  return { ok: true }
}

/** Uses the Calendly scheduling page as the site's booking link (when none is set yet). */
export async function applyCalendlySchedulingLink(): Promise<ActionResult<{ url: string }>> {
  await assertAdmin()
  const connection = await getCalendlyToken()
  if (!connection) return actionFailure('Connect Calendly first.')
  try {
    const user = await getCalendlyUser(connection.token)
    const settings = await getSettings()
    await saveSettings({ ...settings, calendlyUrl: user.schedulingUrl })
    return { ok: true, url: user.schedulingUrl }
  } catch (err) {
    if (err instanceof CalendlyError) return actionFailure(err.message)
    return actionFailure('Calendly’s link couldn’t be used. Please paste it in Settings instead.')
  }
}

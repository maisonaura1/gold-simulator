'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import { assertAdmin } from '@/lib/auth'
import { deleteMessage, getMessages, setMessageStatus } from '@/lib/data'
import { actionFailure, type ActionResult } from '../types'

const idSchema = z.string().regex(/^[a-z0-9-]{1,64}$/)
const statusSchema = z.enum(['new', 'read', 'replied', 'archived'])

async function messageExists(id: string): Promise<boolean> {
  return (await getMessages()).some((message) => message.id === id)
}

export async function updateMessageStatus(id: string, status: string): Promise<ActionResult> {
  await assertAdmin()
  const parsed = z.object({ id: idSchema, status: statusSchema }).safeParse({ id, status })
  if (!parsed.success) return actionFailure('This change couldn’t be saved.')
  if (!(await messageExists(parsed.data.id))) return actionFailure('This message no longer exists.')
  await setMessageStatus(parsed.data.id, parsed.data.status)
  refresh()
  return { ok: true }
}

export async function removeMessage(id: string): Promise<ActionResult> {
  await assertAdmin()
  const parsed = idSchema.safeParse(id)
  if (!parsed.success) return actionFailure('This message couldn’t be deleted.')
  if (!(await messageExists(parsed.data))) return actionFailure('This message was already deleted.')
  await deleteMessage(parsed.data)
  refresh()
  return { ok: true }
}

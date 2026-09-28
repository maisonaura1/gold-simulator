import 'server-only'
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getStore } from './store'
import { SESSION_COOKIE, SESSION_TTL_SECONDS, readSession, signSession } from './session'

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>

interface Secrets {
  passwordHash?: string
  sessionVersion?: number
  calendlyToken?: string
}

export async function getSecrets(): Promise<Secrets> {
  return (await getStore().getJSON<Secrets>('secrets')) ?? {}
}

export async function updateSecrets(patch: Partial<Secrets>): Promise<void> {
  await getStore().setJSON('secrets', { ...(await getSecrets()), ...patch })
}

/* ───────────────────────────── Passwords ───────────────────────────── */

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scrypt(password.normalize('NFKC'), salt, 64)
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`
}

async function verifyHash(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, hashB64] = stored.split('$')
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false
  const expected = Buffer.from(hashB64, 'base64')
  const actual = await scrypt(password.normalize('NFKC'), Buffer.from(saltB64, 'base64'), expected.length)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function sha256(value: string): Buffer {
  return createHash('sha256').update(value.normalize('NFKC')).digest()
}

export type PasswordCheck = 'ok' | 'invalid' | 'not-configured'

/** A password changed in the dashboard wins over the ADMIN_PASSWORD environment variable. */
export async function checkPassword(password: string): Promise<PasswordCheck> {
  const { passwordHash } = await getSecrets()
  if (passwordHash) return (await verifyHash(password, passwordHash)) ? 'ok' : 'invalid'
  const envPassword = process.env.ADMIN_PASSWORD
  if (!envPassword) return 'not-configured'
  return timingSafeEqual(sha256(password), sha256(envPassword)) ? 'ok' : 'invalid'
}

/* ───────────────────────────── Sessions ────────────────────────────── */

export async function startSession(): Promise<void> {
  const { sessionVersion = 1 } = await getSecrets()
  const jar = await cookies()
  jar.set(SESSION_COOKIE, await signSession(sessionVersion), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
    priority: 'high',
  })
}

export async function endSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

/** Signs out every device (used after a password change). */
export async function rotateSessions(): Promise<void> {
  const { sessionVersion = 1 } = await getSecrets()
  await updateSecrets({ sessionVersion: sessionVersion + 1 })
}

/** Full check: signature, expiry and session version. Use in every admin page, action and route handler. */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies()
  const session = await readSession(jar.get(SESSION_COOKIE)?.value)
  if (!session) return false
  const { sessionVersion = 1 } = await getSecrets()
  return session.v === sessionVersion
}

/** For Server Components / pages: redirect to the login screen when not signed in. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect('/admin/login')
}

/** For Server Actions / Route Handlers: throw instead of redirecting. */
export async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error('Unauthorized')
}

/* ─────────────────────────── Rate limiting ─────────────────────────── */

const failures = new Map<string, { count: number; resetAt: number }>()

/** True once `key` has `limit` recorded failures inside the current window (successes never count). */
export function tooManyFailures(key: string, limit: number): boolean {
  const entry = failures.get(key)
  return Boolean(entry && entry.resetAt > Date.now() && entry.count >= limit)
}

export function recordFailure(key: string, windowMs: number): void {
  const now = Date.now()
  const entry = failures.get(key)
  if (!entry || entry.resetAt < now) failures.set(key, { count: 1, resetAt: now + windowMs })
  else entry.count += 1
  if (failures.size > 5000) {
    for (const [k, e] of failures) if (e.resetAt < now) failures.delete(k)
  }
}

export function clearFailures(key: string): void {
  failures.delete(key)
}

const buckets = new Map<string, { count: number; resetAt: number }>()

/**
 * Best-effort in-memory limiter (per server instance). Returns false when the
 * caller exceeded `limit` hits within `windowMs`.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k)
    }
    return true
  }
  bucket.count += 1
  return bucket.count <= limit
}

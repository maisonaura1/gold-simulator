import 'server-only'
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getStore } from './store'
import { SESSION_COOKIE, SESSION_TTL_SECONDS, readSession, signSession } from './session'

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options?: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>

// OWASP-recommended scrypt cost; parameters are stored in the hash so they can evolve.
const SCRYPT = { N: 2 ** 17, r: 8, p: 1 }
const SCRYPT_MAXMEM = 256 * 1024 * 1024

interface Secrets {
  passwordHash?: string
  sessionVersion?: number
  calendlyToken?: string
}

export async function getSecrets(): Promise<Secrets> {
  return (await getStore().getJSON<Secrets>('secrets')) ?? {}
}

export async function updateSecrets(patch: Partial<Secrets>): Promise<void> {
  await getStore().update<Secrets>('secrets', (current) => ({ ...(current ?? {}), ...patch }))
}

/* ───────────────────────────── Passwords ───────────────────────────── */

/** `scrypt$N$r$p$salt$hash` (older hashes `scrypt$salt$hash` used Node's defaults and still verify). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scrypt(password.normalize('NFKC'), salt, 64, { ...SCRYPT, maxmem: SCRYPT_MAXMEM })
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${hash.toString('base64')}`
}

async function verifyHash(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts[0] !== 'scrypt') return false
  const legacy = parts.length === 3
  const [saltB64, hashB64] = legacy ? parts.slice(1) : parts.slice(4)
  const params = legacy ? { N: 16384, r: 8, p: 1 } : { N: Number(parts[1]), r: Number(parts[2]), p: Number(parts[3]) }
  if (!saltB64 || !hashB64 || ![params.N, params.r, params.p].every(Number.isInteger)) return false
  const expected = Buffer.from(hashB64, 'base64')
  const actual = await scrypt(password.normalize('NFKC'), Buffer.from(saltB64, 'base64'), expected.length, { ...params, maxmem: SCRYPT_MAXMEM })
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function sha256(value: string): Buffer {
  return createHash('sha256').update(value.normalize('NFKC')).digest()
}

export type PasswordCheck = 'ok' | 'invalid' | 'not-configured'

export const MIN_PASSWORD_LENGTH = 12
const PLACEHOLDER_PASSWORDS = new Set(['change-me-to-a-long-password', 'password', 'changeme', 'admin'])

/** The ADMIN_PASSWORD variable, only when it is strong enough to protect a public login (fail closed). */
export function envAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD
  if (!value || value.length < MIN_PASSWORD_LENGTH || PLACEHOLDER_PASSWORDS.has(value.toLowerCase())) return null
  return value
}

/** A password changed in the dashboard wins over the ADMIN_PASSWORD environment variable. */
export async function checkPassword(password: string): Promise<PasswordCheck> {
  const { passwordHash } = await getSecrets()
  if (passwordHash) return (await verifyHash(password, passwordHash)) ? 'ok' : 'invalid'
  const envPassword = envAdminPassword()
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

/** Signs out every device (after a password change, and on sign-out: tokens are stateless). */
export async function rotateSessions(): Promise<void> {
  await getStore().update<Secrets>('secrets', (current) => ({
    ...(current ?? {}),
    sessionVersion: (current?.sessionVersion ?? 1) + 1,
  }))
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

// Counters live in the store: in memory on a single Node server, in Redis on
// serverless hosts — so limits survive cold starts and hold across instances.
function counterKey(name: string): string {
  return `rl-${createHash('sha256').update(name).digest('hex').slice(0, 40)}`
}

/**
 * Counts one hit for `name` (atomically) and returns false once more than
 * `limit` hits happened inside the current `windowMs` window.
 */
export async function rateLimit(name: string, limit: number, windowMs: number): Promise<boolean> {
  return (await getStore().hit(counterKey(name), windowMs)) <= limit
}

export async function resetRateLimit(name: string): Promise<void> {
  await getStore().resetHits(counterKey(name))
}

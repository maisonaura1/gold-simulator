/**
 * Signed session cookie for the dashboard (HMAC-SHA256 via Web Crypto, so it
 * works both in proxy.ts and in server code). No user data is stored in it.
 */
export const SESSION_COOKIE = 'rx_admin'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

interface SessionPayload {
  /** Session version — bumped when the password changes to sign everyone out. */
  v: number
  /** Expiry, seconds since epoch. */
  exp: number
}

const encoder = new TextEncoder()

function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET
  if (secret && secret.length >= 32) return secret
  if (process.env.NODE_ENV !== 'production') {
    // Development convenience only — production refuses to sign sessions without a real secret.
    return `dev-only-secret::${process.env.ADMIN_PASSWORD ?? 'roxanne'}::do-not-use-in-production`
  }
  return null
}

export function sessionSecretConfigured(): boolean {
  return getSecret() !== null
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export async function signSession(version: number): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error('SESSION_SECRET must be set (32+ characters) in production.')
  const payload: SessionPayload = { v: version, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)))
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(body)))
  return `${body}.${toBase64Url(signature)}`
}

/** Returns the payload when the token is authentic and not expired, otherwise null. */
export async function readSession(token: string | undefined | null): Promise<SessionPayload | null> {
  const secret = getSecret()
  if (!secret || !token) return null
  const [body, signature] = token.split('.')
  if (!body || !signature) return null
  try {
    const valid = await crypto.subtle.verify('HMAC', await hmacKey(secret), fromBase64Url(signature), encoder.encode(body))
    if (!valid) return null
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload
    if (typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000) return null
    if (typeof payload.v !== 'number') return null
    return payload
  } catch {
    return null
  }
}

import 'server-only'

/** Trusted-proxy aware client IP (see lib/client-ip.ts). */
export { getClientIp } from '@/lib/client-ip'

/**
 * CSRF guard for Route Handlers that change data: the Origin header must
 * match the host the request was sent to.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/**
 * For GET endpoints with side effects outside this site (e.g. downloading an
 * image): refuse requests started by another website.
 */
export function isSameSiteFetch(request: Request): boolean {
  const site = request.headers.get('sec-fetch-site')
  if (site) return site === 'same-origin'
  return isSameOrigin(request)
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

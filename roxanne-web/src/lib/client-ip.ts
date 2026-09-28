import 'server-only'
import { isIP } from 'node:net'
import { headers } from 'next/headers'

/**
 * Client IP for rate limiting. X-Forwarded-For can be forged by the visitor, so
 * only the entries added by our own infrastructure are trusted:
 *  - Vercel overwrites the header, so its first entry is the real client.
 *  - Behind reverse proxies that append to it (nginx, Render, Railway,
 *    Cloudflare…), the Nth entry from the right, N = TRUSTED_PROXY_HOPS (default 1).
 * A directly exposed `next start` has no trustworthy source — put it behind a proxy.
 * IPv6 clients are grouped by /64 (one home or phone usually owns a whole /64).
 */
export async function getClientIp(): Promise<string> {
  const list = await headers()
  const chain = (list.get('x-forwarded-for') ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  const hops = process.env.VERCEL ? chain.length : Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS) || 1)
  const candidate = chain.length > 0 ? chain[Math.max(0, chain.length - hops)] : list.get('x-real-ip')?.trim()
  if (!candidate || candidate.length > 64) return 'unknown'

  const version = isIP(candidate)
  if (version === 4) return candidate
  if (version === 6) {
    const mapped = candidate.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i)
    if (mapped) return mapped[1]
    return `${expandIPv6(candidate).slice(0, 4).join(':')}::/64`
  }
  return 'unknown'
}

function expandIPv6(ip: string): string[] {
  const [head, tail = ''] = ip.toLowerCase().split('::')
  const left = head ? head.split(':') : []
  const right = tail ? tail.split(':') : []
  const zeros = ip.includes('::') ? Array(8 - left.length - right.length).fill('0') : []
  return [...left, ...zeros, ...right].map((group) => group.replace(/^0+(?=.)/, ''))
}

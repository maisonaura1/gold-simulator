import 'server-only'
import { lookup as lookupCallback, type LookupAddress } from 'node:dns'
import { lookup } from 'node:dns/promises'
import type { IncomingMessage } from 'node:http'
import { request } from 'node:https'
import { isIP, type LookupFunction } from 'node:net'
import { sniffImageType } from '@/lib/data'

/**
 * Downloads an image from a link pasted in Dashboard → Photos so it can be
 * resized in the browser and stored like an upload (the site's security
 * policy doesn't load photos from other websites). Only public https hosts
 * are contacted — never the server's own network.
 */

const MAX_REMOTE_BYTES = 15 * 1024 * 1024
const TIMEOUT_MS = 10_000
const MAX_REDIRECTS = 3

export class RemoteImageError extends Error {}

const DOWNLOAD_FAILED =
  'We couldn’t download that image. Check the link, or save the photo on your device and use “Upload photo” instead.'

function isPrivateIPv4(ip: string): boolean {
  const [a, b] = ip.split('.').map(Number)
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  )
}

function isPrivateIPv6(ip: string): boolean {
  const value = ip.toLowerCase()
  const mapped = value.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return isPrivateIPv4(mapped[1])
  return (
    value.startsWith('::') || // unspecified, loopback, IPv4-compatible (::/96) and mapped forms
    value.startsWith('0:') || // same ranges written without compression
    value.startsWith('100::') || // discard-only 100::/64
    value.startsWith('2002:') || // 6to4 (embeds an IPv4 address)
    /^2001:0?:/.test(value) || // Teredo 2001::/32
    value.startsWith('64:ff9b:') || // NAT64
    value.startsWith('2001:db8') || // documentation
    /^f[cd]/.test(value) || // unique local fc00::/7
    /^fe[89ab]/.test(value) || // link-local fe80::/10
    value.startsWith('ff') // multicast
  )
}

async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  if (!host || host === 'localhost' || /\.(localhost|local|internal|lan|home)$/.test(host)) {
    throw new RemoteImageError('That link points to a private address.')
  }
  const version = isIP(host)
  let addresses: { address: string; family: number }[]
  try {
    addresses = version ? [{ address: host, family: version }] : await lookup(host, { all: true, verbatim: true })
  } catch {
    throw new RemoteImageError(DOWNLOAD_FAILED)
  }
  if (addresses.length === 0) throw new RemoteImageError(DOWNLOAD_FAILED)
  for (const { address, family } of addresses) {
    if (family === 4 ? isPrivateIPv4(address) : isPrivateIPv6(address)) {
      throw new RemoteImageError('That link points to a private address.')
    }
  }
}

/**
 * DNS lookup used for the actual connection: every resolved address is checked
 * again at connect time, so a hostname can't pass the check above and then
 * resolve to a private address (DNS rebinding).
 */
const publicOnlyLookup: LookupFunction = (hostname, options, callback) => {
  lookupCallback(hostname, { ...options, all: true, verbatim: true }, (error, addresses) => {
    if (error) return callback(error, '', 4)
    const list = addresses as unknown as LookupAddress[]
    const blocked = list.length === 0 || list.some(({ address, family }) => (family === 4 ? isPrivateIPv4(address) : isPrivateIPv6(address)))
    if (blocked) return callback(new Error('Blocked private address'), '', 4)
    if (options.all) return (callback as unknown as (err: null, all: LookupAddress[]) => void)(null, list)
    callback(null, list[0].address, list[0].family)
  })
}

function get(url: URL): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: 'GET',
        lookup: publicOnlyLookup,
        timeout: TIMEOUT_MS,
        headers: { Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8', 'User-Agent': 'Mozilla/5.0 (compatible; RoxanneAlexiaDashboard/1.0)' },
      },
      resolve,
    )
    req.on('timeout', () => req.destroy(new Error('timeout')))
    req.on('error', reject)
    req.end()
  })
}

async function readLimited(res: IncomingMessage, limit: number): Promise<Buffer> {
  const chunks: Buffer[] = []
  let total = 0
  const deadline = setTimeout(() => res.destroy(new Error('timeout')), TIMEOUT_MS)
  try {
    for await (const chunk of res) {
      total += (chunk as Buffer).byteLength
      if (total > limit) {
        res.destroy()
        throw new RemoteImageError('That image is too large (over 15 MB). Please choose a smaller one.')
      }
      chunks.push(chunk as Buffer)
    }
  } finally {
    clearTimeout(deadline)
  }
  return Buffer.concat(chunks)
}

export async function fetchRemoteImage(link: string): Promise<{ data: Buffer; contentType: string }> {
  let url: URL
  try {
    url = new URL(link)
  } catch {
    throw new RemoteImageError('Please paste a full link starting with https://')
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (url.protocol !== 'https:') throw new RemoteImageError('Only secure links (starting with https://) can be used.')
    if (url.username || url.password || (url.port && url.port !== '443')) {
      throw new RemoteImageError('That link can’t be used. Please copy the image address again.')
    }
    await assertPublicHost(url.hostname)

    let res: IncomingMessage
    try {
      res = await get(url)
    } catch {
      throw new RemoteImageError(DOWNLOAD_FAILED)
    }

    const status = res.statusCode ?? 0
    if (status >= 300 && status < 400) {
      res.resume()
      const location = res.headers.location
      if (!location) throw new RemoteImageError(DOWNLOAD_FAILED)
      url = new URL(location, url)
      continue
    }
    if (status < 200 || status >= 300) {
      res.resume()
      throw new RemoteImageError(`${DOWNLOAD_FAILED} (The website answered with error ${status}.)`)
    }
    if (Number(res.headers['content-length'] ?? 0) > MAX_REMOTE_BYTES) {
      res.destroy()
      throw new RemoteImageError('That image is too large (over 15 MB). Please choose a smaller one.')
    }

    let data: Buffer
    try {
      data = await readLimited(res, MAX_REMOTE_BYTES)
    } catch (error) {
      if (error instanceof RemoteImageError) throw error
      throw new RemoteImageError(DOWNLOAD_FAILED)
    }
    const contentType = sniffImageType(data)
    if (!contentType) {
      throw new RemoteImageError(
        'That link doesn’t lead to a JPG, PNG, WebP or AVIF picture. Tip: right-click the photo and choose “Copy image address”.',
      )
    }
    return { data, contentType }
  }
  throw new RemoteImageError('That link redirects too many times.')
}

import 'server-only'
import { z } from 'zod'
import { getSecrets } from './auth'

/**
 * Minimal Calendly API v2 client (Personal Access Token), used by the
 * dashboard to list upcoming meetings. The token is read from the
 * dashboard secrets (pasted in Dashboard → Meetings) or CALENDLY_TOKEN, and
 * never leaves the server.
 */

const API_BASE = 'https://api.calendly.com'
const TIMEOUT_MS = 8000

export type CalendlyErrorKind = 'invalid-token' | 'forbidden' | 'rate-limited' | 'network' | 'unexpected'

const ERROR_MESSAGES: Record<CalendlyErrorKind, string> = {
  'invalid-token':
    'Calendly didn’t accept the access token — it may have been deleted, expired or copied incompletely. Please connect again with a new token.',
  forbidden:
    'This token isn’t allowed to read your meetings. Create a new personal access token in Calendly and connect again.',
  'rate-limited': 'Calendly is receiving too many requests right now. Please try again in a minute.',
  network: 'We couldn’t reach Calendly just now. Please check again in a moment.',
  unexpected: 'Calendly sent an answer we didn’t understand. Please try again later.',
}

export class CalendlyError extends Error {
  constructor(readonly kind: CalendlyErrorKind) {
    super(ERROR_MESSAGES[kind])
    this.name = 'CalendlyError'
  }
}

export interface CalendlyUser {
  uri: string
  name: string
  schedulingUrl: string
  timezone: string | null
}

export interface CalendlyInvitee {
  name: string
  email: string
  timezone: string | null
  cancelUrl: string | null
  rescheduleUrl: string | null
  questionsAndAnswers: { question: string; answer: string }[]
}

export interface CalendlyMeeting {
  id: string
  name: string
  startTime: string
  endTime: string
  location: { type: string | null; joinUrl: string | null; details: string | null }
  invitees: CalendlyInvitee[]
  /** True when the invitee details could not be loaded for this meeting. */
  inviteesUnavailable: boolean
}

export type CalendlyTokenSource = 'dashboard' | 'env'

/* ───────────────────────────── API shapes ──────────────────────────── */

const httpsUrl = z.url({ protocol: /^https$/ })

const userResponse = z.object({
  resource: z.object({
    uri: httpsUrl,
    name: z.string(),
    scheduling_url: z.string(),
    timezone: z.string().nullish(),
  }),
})

const eventSchema = z.object({
  uri: httpsUrl,
  name: z.string().nullish(),
  status: z.string().nullish(),
  start_time: z.string(),
  end_time: z.string(),
  location: z
    .object({
      type: z.string().nullish(),
      location: z.string().nullish(),
      join_url: z.string().nullish(),
    })
    .nullish(),
})

const eventsResponse = z.object({ collection: z.array(z.unknown()) })

const inviteeSchema = z.object({
  name: z.string().nullish(),
  email: z.string().nullish(),
  status: z.string().nullish(),
  timezone: z.string().nullish(),
  cancel_url: z.string().nullish(),
  reschedule_url: z.string().nullish(),
  questions_and_answers: z
    .array(z.object({ question: z.string().nullish(), answer: z.string().nullish() }))
    .nullish(),
})

const inviteesResponse = z.object({ collection: z.array(z.unknown()) })

/* ─────────────────────────────── HTTP ──────────────────────────────── */

function isCalendlyApiUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && parsed.host === 'api.calendly.com'
  } catch {
    return false
  }
}

async function calendlyGet(token: string, url: string): Promise<unknown> {
  // The token must only ever be sent to Calendly's API.
  if (!isCalendlyApiUrl(url)) throw new CalendlyError('unexpected')
  let res: Response
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch {
    throw new CalendlyError('network')
  }
  // Calendly answers errors in JSON; anything else comes from a proxy, firewall or CDN on the way.
  if (!res.ok && !(res.headers.get('content-type') ?? '').includes('json')) throw new CalendlyError('network')
  if (res.status === 401) throw new CalendlyError('invalid-token')
  if (res.status === 403) throw new CalendlyError('forbidden')
  if (res.status === 429) throw new CalendlyError('rate-limited')
  if (res.status >= 500) throw new CalendlyError('network')
  if (!res.ok) throw new CalendlyError('unexpected')
  try {
    return await res.json()
  } catch {
    throw new CalendlyError('unexpected')
  }
}

/** Runs `fn` over `items` with at most `limit` requests in flight. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

/* ────────────────────────────── Public API ─────────────────────────── */

/** The token pasted in the dashboard wins over the CALENDLY_TOKEN environment variable. */
export async function getCalendlyToken(): Promise<{ token: string; source: CalendlyTokenSource } | null> {
  const { calendlyToken } = await getSecrets()
  if (calendlyToken) return { token: calendlyToken, source: 'dashboard' }
  const env = process.env.CALENDLY_TOKEN?.trim()
  return env ? { token: env, source: 'env' } : null
}

/** GET /users/me — also used to validate a token before saving it. */
export async function getCalendlyUser(token: string): Promise<CalendlyUser> {
  const parsed = userResponse.safeParse(await calendlyGet(token, `${API_BASE}/users/me`))
  if (!parsed.success) throw new CalendlyError('unexpected')
  const { uri, name, scheduling_url, timezone } = parsed.data.resource
  return { uri, name, schedulingUrl: scheduling_url, timezone: timezone ?? null }
}

async function getInvitees(token: string, eventUri: string): Promise<CalendlyInvitee[]> {
  const parsed = inviteesResponse.safeParse(await calendlyGet(token, `${eventUri}/invitees`))
  if (!parsed.success) throw new CalendlyError('unexpected')
  return parsed.data.collection.flatMap((raw) => {
    const invitee = inviteeSchema.safeParse(raw)
    if (!invitee.success || invitee.data.status === 'canceled') return []
    const data = invitee.data
    return [
      {
        name: data.name ?? '',
        email: data.email ?? '',
        timezone: data.timezone ?? null,
        cancelUrl: data.cancel_url && httpsUrl.safeParse(data.cancel_url).success ? data.cancel_url : null,
        rescheduleUrl:
          data.reschedule_url && httpsUrl.safeParse(data.reschedule_url).success ? data.reschedule_url : null,
        questionsAndAnswers: (data.questions_and_answers ?? []).flatMap((qa) =>
          qa.question && qa.answer ? [{ question: qa.question, answer: qa.answer }] : [],
        ),
      },
    ]
  })
}

/**
 * Active meetings from one hour ago (so a call in progress still shows its
 * join link) until `days` days from now, soonest first, with their invitees.
 */
export async function getUpcomingMeetings(token: string, userUri: string, days = 30): Promise<CalendlyMeeting[]> {
  const now = Date.now()
  const params = new URLSearchParams({
    user: userUri,
    min_start_time: new Date(now - 60 * 60 * 1000).toISOString(),
    max_start_time: new Date(now + days * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    sort: 'start_time:asc',
    count: '50',
  })
  const parsed = eventsResponse.safeParse(await calendlyGet(token, `${API_BASE}/scheduled_events?${params}`))
  if (!parsed.success) throw new CalendlyError('unexpected')

  const events = parsed.data.collection.flatMap((raw) => {
    const event = eventSchema.safeParse(raw)
    if (!event.success || event.data.status === 'canceled') return []
    if (new Date(event.data.end_time).getTime() < now) return []
    return [event.data]
  })

  return mapLimit(events, 5, async (event) => {
    let invitees: CalendlyInvitee[] = []
    let inviteesUnavailable = false
    try {
      invitees = await getInvitees(token, event.uri)
    } catch {
      inviteesUnavailable = true
    }
    const joinUrl = event.location?.join_url
    return {
      id: event.uri.split('/').pop() ?? event.uri,
      name: event.name ?? 'Meeting',
      startTime: event.start_time,
      endTime: event.end_time,
      location: {
        type: event.location?.type ?? null,
        joinUrl: joinUrl && httpsUrl.safeParse(joinUrl).success ? joinUrl : null,
        details: event.location?.location ?? null,
      },
      invitees,
      inviteesUnavailable,
    }
  })
}

export type CalendlyOverview =
  | { status: 'not-connected' }
  | { status: 'connected'; source: CalendlyTokenSource; user: CalendlyUser; meetings: CalendlyMeeting[] }
  | { status: 'error'; source: CalendlyTokenSource; kind: CalendlyErrorKind; message: string }

/** Everything the dashboard shows about Calendly — never includes the token. */
export async function getCalendlyOverview(days = 30): Promise<CalendlyOverview> {
  const connection = await getCalendlyToken()
  if (!connection) return { status: 'not-connected' }
  try {
    const user = await getCalendlyUser(connection.token)
    const meetings = await getUpcomingMeetings(connection.token, user.uri, days)
    return { status: 'connected', source: connection.source, user, meetings }
  } catch (err) {
    const kind = err instanceof CalendlyError ? err.kind : 'unexpected'
    return { status: 'error', source: connection.source, kind, message: ERROR_MESSAGES[kind] }
  }
}

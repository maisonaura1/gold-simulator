import 'server-only'
import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Tiny key/value persistence with two interchangeable back-ends:
 *  - FileStore  (default): JSON + binary files under ./data — any Node host with a disk.
 *  - RedisStore: Upstash Redis REST API — for serverless hosts such as Vercel.
 *
 * Reads use plain `fetch` without cache options, so public pages that read
 * the store are still prerendered and refreshed with revalidatePath().
 * Read-modify-write goes through `update()`, which is serialized per key
 * (in-process, plus a Redis lock across serverless instances).
 */
export interface BinaryObject {
  data: Buffer
  contentType: string
}

export interface Store {
  readonly kind: 'file' | 'redis'
  getJSON<T>(key: string): Promise<T | null>
  setJSON(key: string, value: unknown): Promise<void>
  /** Atomically read, transform and write one JSON document. */
  update<T>(key: string, fn: (current: T | null) => T | Promise<T>): Promise<T>
  deleteKey(key: string): Promise<void>
  getBinary(id: string): Promise<BinaryObject | null>
  setBinary(id: string, obj: BinaryObject): Promise<void>
  deleteBinary(id: string): Promise<void>
  /** Rate-limit counter: adds one hit and returns the count inside the current window. */
  hit(key: string, windowMs: number): Promise<number>
  resetHits(key: string): Promise<void>
}

const KEY_RE = /^[a-z0-9][a-z0-9-]{0,63}$/
function assertKey(key: string) {
  if (!KEY_RE.test(key)) throw new Error(`Invalid store key: ${key}`)
}

/* ─────────────── In-process serialization of read-modify-write ─────────────── */

const queues = new Map<string, Promise<unknown>>()

function serialized<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve()
  const run = previous.then(task, task)
  const tail = run.catch(() => undefined)
  queues.set(key, tail)
  void tail.then(() => {
    if (queues.get(key) === tail) queues.delete(key)
  })
  return run
}

/* ───────────────────────────────── Files ───────────────────────────────── */

const MAX_COUNTERS = 10_000

class FileStore implements Store {
  readonly kind = 'file' as const
  // Single-process host: counters can live in memory (bounded).
  private readonly counters = new Map<string, { count: number; resetAt: number }>()

  constructor(private readonly dir: string) {}

  private jsonPath(key: string) {
    assertKey(key)
    return path.join(this.dir, `${key}.json`)
  }

  private binPath(id: string) {
    assertKey(id)
    return path.join(this.dir, 'media', id)
  }

  private async atomicWrite(file: string, data: string | Buffer) {
    // Private to the app user: the data folder holds the password hash and messages.
    await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 })
    const tmp = `${file}.${randomUUID()}.tmp`
    await fs.writeFile(tmp, data, { mode: 0o600 })
    await fs.rename(tmp, file)
  }

  async getJSON<T>(key: string): Promise<T | null> {
    try {
      return JSON.parse(await fs.readFile(this.jsonPath(key), 'utf8')) as T
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw err
    }
  }

  async setJSON(key: string, value: unknown) {
    await serialized(key, () => this.atomicWrite(this.jsonPath(key), JSON.stringify(value, null, 2)))
  }

  update<T>(key: string, fn: (current: T | null) => T | Promise<T>): Promise<T> {
    return serialized(key, async () => {
      const next = await fn(await this.getJSON<T>(key))
      await this.atomicWrite(this.jsonPath(key), JSON.stringify(next, null, 2))
      return next
    })
  }

  async deleteKey(key: string) {
    await serialized(key, () => fs.rm(this.jsonPath(key), { force: true }))
  }

  async getBinary(id: string): Promise<BinaryObject | null> {
    try {
      const [data, meta] = await Promise.all([fs.readFile(this.binPath(id)), fs.readFile(`${this.binPath(id)}.type`, 'utf8')])
      return { data, contentType: meta.trim() }
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw err
    }
  }

  async setBinary(id: string, obj: BinaryObject) {
    await this.atomicWrite(this.binPath(id), obj.data)
    await this.atomicWrite(`${this.binPath(id)}.type`, obj.contentType)
  }

  async deleteBinary(id: string) {
    await Promise.all([fs.rm(this.binPath(id), { force: true }), fs.rm(`${this.binPath(id)}.type`, { force: true })])
  }

  async hit(key: string, windowMs: number): Promise<number> {
    assertKey(key)
    const now = Date.now()
    const entry = this.counters.get(key)
    if (entry && entry.resetAt > now) {
      entry.count += 1
      return entry.count
    }
    this.counters.delete(key)
    this.counters.set(key, { count: 1, resetAt: now + windowMs })
    if (this.counters.size > MAX_COUNTERS) {
      for (const [k, e] of this.counters) if (e.resetAt <= now) this.counters.delete(k)
      // Still too many live keys: drop the oldest (Maps iterate in insertion order).
      for (const k of this.counters.keys()) {
        if (this.counters.size <= MAX_COUNTERS) break
        this.counters.delete(k)
      }
    }
    return 1
  }

  async resetHits(key: string) {
    this.counters.delete(key)
  }
}

/* ───────────────────────────────── Redis ───────────────────────────────── */

const RELEASE_LOCK = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end"
const HIT = "local c = redis.call('incr', KEYS[1]) if c == 1 then redis.call('pexpire', KEYS[1], ARGV[1]) end return c"

class RedisStore implements Store {
  readonly kind = 'redis' as const
  private readonly prefix = 'rx:'
  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  private async command<T>(args: string[]): Promise<T> {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    })
    const payload = (await res.json().catch(() => ({}))) as { result?: T; error?: string }
    if (!res.ok || payload.error) throw new Error(`Redis ${args[0]} failed: ${payload.error ?? res.status}`)
    return payload.result as T
  }

  async getJSON<T>(key: string): Promise<T | null> {
    assertKey(key)
    const raw = await this.command<string | null>(['GET', `${this.prefix}${key}`])
    return raw == null ? null : (JSON.parse(raw) as T)
  }

  async setJSON(key: string, value: unknown) {
    assertKey(key)
    await this.command(['SET', `${this.prefix}${key}`, JSON.stringify(value)])
  }

  /** Cross-instance mutex (SET NX PX) around a GET → transform → SET. */
  update<T>(key: string, fn: (current: T | null) => T | Promise<T>): Promise<T> {
    assertKey(key)
    return serialized(key, async () => {
      const lockKey = `${this.prefix}lock:${key}`
      const token = randomUUID()
      for (let attempt = 0; ; attempt++) {
        const acquired = await this.command<string | null>(['SET', lockKey, token, 'NX', 'PX', '10000'])
        if (acquired === 'OK') break
        if (attempt >= 60) throw new Error(`Store busy: could not lock "${key}"`)
        await new Promise((resolve) => setTimeout(resolve, 40 + Math.random() * 80))
      }
      try {
        const next = await fn(await this.getJSON<T>(key))
        await this.setJSON(key, next)
        return next
      } finally {
        await this.command(['EVAL', RELEASE_LOCK, '1', lockKey, token]).catch(() => {})
      }
    })
  }

  async deleteKey(key: string) {
    assertKey(key)
    await this.command(['DEL', `${this.prefix}${key}`])
  }

  async getBinary(id: string): Promise<BinaryObject | null> {
    assertKey(id)
    const raw = await this.command<string | null>(['GET', `${this.prefix}media:${id}`])
    if (raw == null) return null
    const { contentType, base64 } = JSON.parse(raw) as { contentType: string; base64: string }
    return { data: Buffer.from(base64, 'base64'), contentType }
  }

  async setBinary(id: string, obj: BinaryObject) {
    assertKey(id)
    const value = JSON.stringify({ contentType: obj.contentType, base64: obj.data.toString('base64') })
    await this.command(['SET', `${this.prefix}media:${id}`, value])
  }

  async deleteBinary(id: string) {
    assertKey(id)
    await this.command(['DEL', `${this.prefix}media:${id}`])
  }

  /** Shared by every serverless instance, so limits hold across cold starts. */
  async hit(key: string, windowMs: number): Promise<number> {
    assertKey(key)
    return Number(await this.command<number>(['EVAL', HIT, '1', `${this.prefix}rl:${key}`, String(windowMs)]))
  }

  async resetHits(key: string) {
    assertKey(key)
    await this.command(['DEL', `${this.prefix}rl:${key}`])
  }
}

function createStore(): Store {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  if (url && token) return new RedisStore(url.replace(/\/$/, ''), token)
  return new FileStore(process.env.DATA_DIR ?? path.join(process.cwd(), 'data'))
}

let instance: Store | undefined
export function getStore(): Store {
  instance ??= createStore()
  return instance
}

/** True when the site runs on a read-only serverless disk without a database configured. */
export function storeLooksEphemeral(): boolean {
  return getStore().kind === 'file' && Boolean(process.env.VERCEL)
}

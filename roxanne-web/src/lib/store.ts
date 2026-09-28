import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Tiny key/value persistence with two interchangeable back-ends:
 *  - FileStore  (default): JSON + binary files under ./data — any Node host with a disk.
 *  - RedisStore: Upstash Redis REST API — for serverless hosts such as Vercel.
 *
 * Reads use plain `fetch` without cache options, so public pages that read
 * the store are still prerendered and refreshed with revalidatePath().
 */
export interface BinaryObject {
  data: Buffer
  contentType: string
}

export interface Store {
  readonly kind: 'file' | 'redis'
  getJSON<T>(key: string): Promise<T | null>
  setJSON(key: string, value: unknown): Promise<void>
  deleteKey(key: string): Promise<void>
  getBinary(id: string): Promise<BinaryObject | null>
  setBinary(id: string, obj: BinaryObject): Promise<void>
  deleteBinary(id: string): Promise<void>
}

const KEY_RE = /^[a-z0-9][a-z0-9-]{0,63}$/
function assertKey(key: string) {
  if (!KEY_RE.test(key)) throw new Error(`Invalid store key: ${key}`)
}

class FileStore implements Store {
  readonly kind = 'file' as const
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
    await fs.mkdir(path.dirname(file), { recursive: true })
    const tmp = `${file}.${process.pid}.${Date.now()}.tmp`
    await fs.writeFile(tmp, data)
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
    await this.atomicWrite(this.jsonPath(key), JSON.stringify(value, null, 2))
  }

  async deleteKey(key: string) {
    await fs.rm(this.jsonPath(key), { force: true })
  }

  async getBinary(id: string): Promise<BinaryObject | null> {
    try {
      const [data, meta] = await Promise.all([
        fs.readFile(this.binPath(id)),
        fs.readFile(`${this.binPath(id)}.type`, 'utf8'),
      ])
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
    await Promise.all([
      fs.rm(this.binPath(id), { force: true }),
      fs.rm(`${this.binPath(id)}.type`, { force: true }),
    ])
  }
}

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

/** Small immutable helpers for editing nested JSON content in the dashboard. */

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
export type JsonPath = (string | number)[]

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function getIn(value: unknown, path: JsonPath): unknown {
  let current = value
  for (const key of path) {
    if (Array.isArray(current) && typeof key === 'number') current = current[key]
    else if (isObject(current) && typeof key === 'string') current = current[key]
    else return undefined
  }
  return current
}

export function setIn<T>(value: T, path: JsonPath, next: unknown): T {
  if (path.length === 0) return next as T
  const [key, ...rest] = path
  if (Array.isArray(value) && typeof key === 'number') {
    const copy = [...value]
    copy[key] = setIn(copy[key], rest, next)
    return copy as T
  }
  if (isObject(value) && typeof key === 'string') {
    return { ...value, [key]: setIn(value[key], rest, next) } as T
  }
  return value
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => deepEqual(item, b[i]))
  }
  if (isObject(a) && isObject(b)) {
    const keys = Object.keys(a)
    return keys.length === Object.keys(b).length && keys.every((key) => key in b && deepEqual(a[key], b[key]))
  }
  return false
}

/** Structural copy with every string emptied — the template for a new list item. */
export function blankCopy<T>(value: T): T {
  if (typeof value === 'string') return '' as T
  if (Array.isArray(value)) return [] as T
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blankCopy(item)])) as T
  }
  return value
}

/**
 * Coerces untrusted JSON into the exact shape of a template value.
 * Unknown keys are dropped, wrong types fall back to the template, strings are
 * length-capped. Array items are validated against the template item at the
 * same index (or the last one), so heterogeneous lists keep their fields.
 */
const MAX_STRING = 20_000

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function conform<T>(template: T, candidate: unknown): T {
  if (Array.isArray(template)) {
    if (!Array.isArray(candidate)) return template
    if (template.length === 0) {
      // Empty templates are always string lists in this content model.
      return candidate.filter((item): item is string => typeof item === 'string').map(clip).slice(0, 200) as T
    }
    return candidate.slice(0, 200).map((item, i) => conform(template[Math.min(i, template.length - 1)], item)) as T
  }
  if (isPlainObject(template)) {
    if (!isPlainObject(candidate)) return template
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(template)) {
      out[key] = key in candidate ? conform((template as Record<string, unknown>)[key], candidate[key]) : (template as Record<string, unknown>)[key]
    }
    return out as T
  }
  if (typeof template === 'string') return (typeof candidate === 'string' ? clip(candidate) : template) as T
  if (typeof template === 'number') return (typeof candidate === 'number' && Number.isFinite(candidate) ? candidate : template) as T
  if (typeof template === 'boolean') return (typeof candidate === 'boolean' ? candidate : template) as T
  return template
}

function clip(value: string): string {
  return value.length > MAX_STRING ? value.slice(0, MAX_STRING) : value
}

const SAFE_HREF = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i

/** Only allow internal paths, anchors, http(s), mailto and tel links. */
export function safeHref(href: string, fallback = '/'): string {
  const trimmed = href.trim()
  return SAFE_HREF.test(trimmed) ? trimmed : fallback
}

/**
 * Validates the `next` parameter of the login page so it can only send people
 * to a dashboard page on this site (no open redirects).
 */
export function safeAdminPath(value: unknown, fallback = '/admin'): string {
  if (typeof value !== 'string' || value.length > 512) return fallback
  if (!/^\/admin(?:[/?#]|$)/.test(value)) return fallback
  if (value.includes('//') || value.includes('\\')) return fallback
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback
  if (/^\/admin\/login(?:[/?#]|$)/.test(value)) return fallback
  // Resolve "." / ".." segments the way the browser will, and re-check the result.
  const resolved = new URL(value, 'http://site.invalid')
  if (resolved.origin !== 'http://site.invalid' || !/^\/admin(?:\/|$)/.test(resolved.pathname)) return fallback
  return value
}

/** Quita emojis/símbolos del principio de los textos que vienen del backend. */
export function stripLeadingSymbols(s: string): string {
  return s.replace(/^[^\p{L}\p{N}]+/u, '').trim();
}

/** true si un hallazgo del backend es positivo (empieza por ✅). */
export function isPositiveFinding(s: string): boolean {
  return s.trim().startsWith('✅');
}

export function firstName(name: string | null | undefined): string {
  return (name ?? '').trim().split(/\s+/)[0] ?? '';
}

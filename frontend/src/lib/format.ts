// Formato de números. Precios y dólares siguen el formato de las plataformas de
// trading (punto decimal), igual que en las lecciones: 3350.40 · $10,000 · $2.50

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function fmtUsd(v: number | null | undefined, opts: { sign?: boolean; decimals?: 0 | 2 } = {}): string {
  if (v == null || !isFinite(v)) return '—';
  const f = opts.decimals === 0 ? usd0 : usd;
  const s = f.format(Math.abs(v));
  if (v < 0) return `−${s}`;
  return opts.sign && v > 0 ? `+${s}` : s;
}

export function fmtPrice(v: number | null | undefined): string {
  if (v == null || !isFinite(v) || v <= 0) return '—';
  return v.toFixed(2);
}

export function fmtPct(v: number | null | undefined, opts: { sign?: boolean; decimals?: number } = {}): string {
  if (v == null || !isFinite(v)) return '—';
  const d = opts.decimals ?? 1;
  const s = `${Math.abs(v).toFixed(d)}%`;
  if (v < 0) return `−${s}`;
  return opts.sign && v > 0 ? `+${s}` : s;
}

export function fmtRR(v: number | null | undefined): string {
  if (v == null || !isFinite(v) || v <= 0) return '—';
  return `1:${v.toFixed(v >= 10 ? 0 : 1)}`;
}

const dateFmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });
const dateTimeFmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const longDateFmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return dateFmt.format(new Date(iso));
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  return dateTimeFmt.format(new Date(iso));
}

export function fmtLongDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return longDateFmt.format(new Date(iso));
}

/** Mensaje legible a partir de un error de axios / NestJS. */
export function apiError(e: unknown, fallback = 'Algo ha fallado. Inténtalo de nuevo.'): string {
  const data = (e as { response?: { data?: { message?: unknown } } })?.response?.data;
  const msg = data?.message;
  if (Array.isArray(msg)) return msg.join(' · ');
  if (typeof msg === 'string' && msg.length > 0) return translateApiMessage(msg);
  if ((e as { code?: string })?.code === 'ECONNABORTED') return 'El servidor tarda en responder. Inténtalo de nuevo.';
  if ((e as { message?: string })?.message === 'Network Error') return 'Sin conexión con el servidor. Revisa tu internet.';
  return fallback;
}

const KNOWN: Record<string, string> = {
  'Invalid credentials': 'Email o contraseña incorrectos.',
  'Email already registered': 'Ya existe una cuenta con ese email. Inicia sesión.',
  FREE_LIMIT_REACHED: 'Has usado todas tus simulaciones gratuitas.',
  'Account not found': 'No encontramos tu cuenta de práctica.',
};

function translateApiMessage(msg: string): string {
  return KNOWN[msg] ?? msg;
}

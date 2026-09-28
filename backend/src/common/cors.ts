// Single source of truth for allowed browser origins (HTTP API + websocket)
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'https://goldtradermt.app',
  'https://www.goldtradermt.app',
  'https://frontend-eight-phi-90.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[];

// Electron desktop app serves the static export from a random localhost port
const LOCAL_ORIGIN = /^http:\/\/(127\.0\.0\.1|localhost):\d+$/;

export function corsOrigin(origin: string | undefined, cb: (err: Error | null, ok?: boolean) => void) {
  if (!origin) return cb(null, true);
  const ok = LOCAL_ORIGIN.test(origin) || ALLOWED_ORIGINS.includes(origin);
  cb(ok ? null : new Error(`CORS blocked: ${origin}`), ok);
}

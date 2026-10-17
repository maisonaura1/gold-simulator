/** URL del backend sin el sufijo /api (p. ej. https://…railway.app). */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/api\/?$/, '').replace(/\/$/, '');

/** Inicio de sesión con Google: lo gestiona el backend y vuelve a /auth/google/success. */
export const GOOGLE_AUTH_URL = `${API_URL}/api/auth/google`;

export const SITE_URL = 'https://goldtradermt.app';

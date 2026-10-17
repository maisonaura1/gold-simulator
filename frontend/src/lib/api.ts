import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import type { AuthTokens } from '@/types';
import { API_URL } from '@/lib/config';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

// Instancia sin interceptores: así la petición de refresco envía el refresh token
// y no el access token caducado.
const raw = axios.create({ baseURL: `${API_URL}/api`, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Una sola renovación en curso aunque fallen varias peticiones a la vez.
let refreshing: Promise<AuthTokens> | null = null;

function refreshTokens(): Promise<AuthTokens> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return Promise.reject(new Error('Sin refresh token'));
  refreshing ??= raw
    .post<AuthTokens>('/auth/refresh', {}, { headers: { Authorization: `Bearer ${refreshToken}` } })
    .then((r) => {
      useAuthStore.getState().setTokens(r.data);
      return r.data;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const isAuthCall = original?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const tokens = await refreshTokens();
        original.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().clearTokens();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          const next = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/auth/login?next=${next}`;
        }
      }
    }
    return Promise.reject(error);
  },
);

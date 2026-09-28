import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// One refresh at a time: concurrent 401s share the same request
let refreshing: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  refreshing ??= (async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) throw new Error('No refresh token');
    // Bare axios: the api request interceptor would replace this header with
    // the expired access token
    const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` },
      timeout: 15000,
    });
    useAuthStore.getState().setTokens(data);
    return data.accessToken as string;
  })().finally(() => { refreshing = null; });
  return refreshing;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    // Auth endpoints (login, reset…) answer 401 for bad credentials: let the
    // page show the error instead of refreshing and redirecting
    const isAuthCall = typeof original?.url === 'string' && original.url.startsWith('/auth/');
    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  },
);

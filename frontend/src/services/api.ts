import axios from 'axios';

const publicApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://bff.crxhub.org/api/v1';

const serverApiBaseUrl =
  process.env.INTERNAL_API_BASE_URL ||
  'http://127.0.0.1:8081/api/v1';

export const api = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? serverApiBaseUrl
      : publicApiBaseUrl,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      typeof window !== 'undefined' &&
      error?.response?.status === 401
    ) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      const path = window.location.pathname;

      if (!path.includes('/login')) {
        const parts = path.split('/').filter(Boolean);
        const locale =
          parts[0] === 'en' || parts[0] === 'bn'
            ? parts[0]
            : 'bn';

        window.location.href = `/${locale}/login`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

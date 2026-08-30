'use client';

import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  restore: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { access_token, data } = response.data;

    if (!access_token) {
      throw new Error('Authentication token was not returned by the server.');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(data));
    }

    set({
      user: data,
      token: access_token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  restore: async () => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('auth_token');

    if (!token) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const user = response.data?.data;

      localStorage.setItem('auth_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the API request fails, clear local authentication.
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

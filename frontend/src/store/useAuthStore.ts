import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/api';
interface AuthState {
user: User | null;
token: string | null;
isAuthenticated: boolean;
login: (email: string, password: string) => Promise<void>;
logout: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
user: null,
token: localStorage.getItem('auth_token'),
isAuthenticated: !!localStorage.getItem('auth_token'),
login: async (email, password) => {
const response = await api.post('/auth/login', { email, password });
const { access_token, data } = response.data;
localStorage.setItem('auth_token', access_token);
set({ user: data, token: access_token, isAuthenticated: true });
},
logout: () => {
localStorage.removeItem('auth_token');
set({ user: null, token: null, isAuthenticated: false });
},
}));

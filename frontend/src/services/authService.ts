import api from './api';
import type { AuthResponse, LoginCredentials, RegisterData, ApiResponse, User } from '../types';

export const authService = {
  register: async (data: RegisterData): Promise<ApiResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials, rememberMe = false): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const { data } = response.data;

    if (data.tokens) {
      const storage = rememberMe ? localStorage : sessionStorage;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      localStorage.setItem('rememberMe', String(rememberMe));
      storage.setItem('accessToken', data.tokens.accessToken);
      storage.setItem('refreshToken', data.tokens.refreshToken);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
};

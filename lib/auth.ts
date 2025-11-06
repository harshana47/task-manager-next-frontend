import api, { setAccessToken, setRefreshToken, clearTokens, getAccessToken } from './api';
import { LoginRequest, LoginResponse, User } from '@/types';

export const authApi = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    console.log('Login response:', response.data);
    console.log('Token received:', response.data.token ? 'YES' : 'NO');
    
    const { token, username, email, role } = response.data;

    console.log('Storing token as accessToken:', token?.substring(0, 20) + '...');
    setAccessToken(token);
    
    console.log('Note: Backend does not provide separate refresh token');

    const user: User = { id: 0, username, email, role };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    console.log('Login complete. Checking storage...');
    console.log('Stored accessToken:', localStorage.getItem('accessToken')?.substring(0, 20) + '...');

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      
      const token = localStorage.getItem('accessToken');
      if (token) {
        await api.post('/auth/logout', { token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!getAccessToken();
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  },
};

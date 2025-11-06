import api from './api';
import { User, PageResponse } from '@/types';

export const userApi = {
  async getUsers(page = 0, size = 10): Promise<PageResponse<User>> {
    const response = await api.get<User[]>(`/users?page=${page}&size=${size}`);
    return {
      content: response.data,
      totalPages: 1,
      totalElements: response.data.length,
      size: response.data.length,
      number: 0
    };
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(user: Omit<User, 'id'> & { password: string }): Promise<User> {
    const response = await api.post<User>('/users', user);
    return response.data;
  },

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

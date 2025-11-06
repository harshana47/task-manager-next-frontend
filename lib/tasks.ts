import api from './api';
import { Task, TaskFilters, PageResponse } from '@/types';

export const taskApi = {
  async getTasks(filters: TaskFilters = {}): Promise<PageResponse<Task>> {
    const params = new URLSearchParams();
    
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.dueBefore) params.append('dueBefore', filters.dueBefore);
    if (filters.dueAfter) params.append('dueAfter', filters.dueAfter);

    const response = await api.get<PageResponse<Task>>(`/tasks?${params.toString()}`);
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async assignTask(taskId: number, userId: number): Promise<Task> {
    const response = await api.post<Task>(`/tasks/${taskId}/assign`, { assignedUserId: userId });
    return response.data;
  },
};

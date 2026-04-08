/**
 * API Service
 * Handles all API calls to the backend
 */

import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.0.2.2:3000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'active' | 'completed' | 'paused';
  category: string;
  emotionalDifficulty: number;
  parentTaskId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
  streak: number;
  weeklyStats: {
    created: number;
    completed: number;
    bestDay: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  timezone: string;
}

// API Service class
class ApiService {
  private accessToken: string | null = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  }

  async saveTokens(accessToken: string, refreshToken: string, user: User) {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      this.accessToken = accessToken;
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  }

  async clearTokens() {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      this.accessToken = null;
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = API_URL + endpoint;

    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = 'Bearer ' + this.accessToken;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data: data.data };
      } else {
        if (response.status === 401 && endpoint !== '/auth/login') {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            return this.request<T>(endpoint, options);
          }
        }
        return { success: false, error: data.error || 'Request failed' };
      }
    } catch (error) {
      console.error('API request error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) return false;

      const response = await fetch(API_URL + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        await this.saveTokens(
          data.data.accessToken,
          data.data.refreshToken,
          data.data.user
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Auth endpoints
  async login(
    email: string,
    password: string
  ): Promise<
    ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
  > {
    const response = await this.request<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      await this.saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.user
      );
    }
    return response;
  }

  async register(
    email: string,
    password: string,
    firstName: string
  ): Promise<
    ApiResponse<{ user: User; accessToken: string; refreshToken: string }>
  > {
    const response = await this.request<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName }),
    });

    if (response.success && response.data) {
      await this.saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.user
      );
    }
    return response;
  }

  async logout(): Promise<void> {
    await this.clearTokens();
  }

  // Task endpoints
  async getTasks(): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>('/tasks', { method: 'GET' });
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await this.request<Task[]>('/tasks/' + id, {
      method: 'GET',
    });
    return {
      success: response.success,
      data: response.data?.[0],
      error: response.error,
    };
  }

  async createTask(task: {
    title: string;
    description?: string;
    category?: string;
    emotionalDifficulty?: number;
    parentTaskId?: string;
  }): Promise<ApiResponse<Task>> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(
    id: string,
    updates: Partial<Task>
  ): Promise<ApiResponse<Task>> {
    return this.request<Task>('/tasks/' + id, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<void>('/tasks/' + id, { method: 'DELETE' });
  }

  async markTaskComplete(id: string): Promise<ApiResponse<Task>> {
    return this.updateTask(id, { status: 'completed' });
  }

  // Stats endpoint
  async getTaskStats(): Promise<ApiResponse<TaskStats>> {
    return this.request<TaskStats>('/tasks/stats', { method: 'GET' });
  }
}

export const apiService = new ApiService();

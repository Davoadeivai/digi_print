// NXTBN-Style User Management API Service
import type { User, UserStats, UserPermissions } from '../types/user';
import type { UserRole } from '../types/user';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

class UserApiClient {
  private baseURL: string;
  
  constructor() {
    this.baseURL = 'http://localhost:8000';
  }
  
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
  
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const userApiClient = new UserApiClient();

/**
 * User Management Service (nxtbn-style)
 * مدیریت کاربران با الگوی nxtbn
 */
export class UserManagementService {
  /**
   * دریافت پروفایل کاربر جاری
   */
  static async getUserProfile(): Promise<ApiResponse<User>> {
    return userApiClient.get<ApiResponse<User>>('/accounts/api/profile/');
  }
  
  /**
   * ویرایش پروفایل کاربر جاری
   */
  static async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return userApiClient.patch<ApiResponse<User>>('/accounts/api/profile/', data);
  }
  
  /**
   * دریافت آمار کاربر جاری
   */
  static async getUserStats(): Promise<ApiResponse<UserStats>> {
    return userApiClient.get<ApiResponse<UserStats>>('/accounts/api/stats/');
  }
  
  /**
   * دریافت مجوزهای کاربر جاری
   */
  static async getUserPermissions(): Promise<ApiResponse<UserPermissions>> {
    return userApiClient.get<ApiResponse<UserPermissions>>('/accounts/api/permissions/');
  }
  
  /**
   * دریافت لیست تمام کاربران (فقط برای Admin)
   */
  static async getUsers(params?: { role?: UserRole }): Promise<PaginatedResponse<User>> {
    const queryParams = params?.role ? `?role=${params.role}` : '';
    return userApiClient.get<PaginatedResponse<User>>(`/accounts/api/users/${queryParams}`);
  }
  
  /**
   * دریافت جزئیات یک کاربر (فقط برای Admin)
   */
  static async getUser(id: number): Promise<ApiResponse<User>> {
    return userApiClient.get<ApiResponse<User>>(`/accounts/api/users/${id}/`);
  }
  
  /**
   * ویرایش کاربر (فقط برای Admin)
   */
  static async updateUser(id: number, data: Partial<User>): Promise<ApiResponse<User>> {
    return userApiClient.patch<ApiResponse<User>>(`/accounts/api/users/${id}/`, data);
  }
  
  /**
   * حذف کاربر (فقط برای Admin)
   */
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    return userApiClient.delete<ApiResponse<void>>(`/accounts/api/users/${id}/`);
  }
  
  /**
   * تغییر نقش کاربر (فقط برای Admin)
   */
  static async updateUserRole(userId: number, role: UserRole): Promise<ApiResponse<User>> {
    return userApiClient.patch<ApiResponse<User>>(`/accounts/api/users/${userId}/role/`, { role });
  }
  
  /**
   * آپلود آواتار کاربر
   */
  static async uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:8000/accounts/api/profile/', {
      method: 'PATCH',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('خطا در آپلود آواتار');
    }
    
    return response.json();
  }
}

export default UserManagementService;

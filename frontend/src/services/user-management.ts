// User Management Service - nxtbn-style
// Comprehensive API service for user CRUD, stats, and permissions

import { User, UserStats, UserPermissions, UserRole } from '../types/user';
import apiClient, { API_ENDPOINTS } from './api';
import { API_URL } from '../config/env';

// NXTBN-Style API Endpoints
const USER_API_ENDPOINTS = {
  ...API_ENDPOINTS.USER,
  PROFILE: '/accounts/api/profile/',
  STATS: '/accounts/api/stats/',
  PERMISSIONS: '/accounts/api/permissions/',
  LIST: '/accounts/api/users/',
  DETAIL: (id: number) => `/accounts/api/users/${id}/`,
  UPDATE_ROLE: (id: number) => `/accounts/api/users/${id}/role/`,
};

interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  role?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

/**
 * User Management Service
 * مدیریت کامل کاربران با الگوی nxtbn
 */
export class UserManagementService {
  /**
   * دریافت پروفایل کاربر جاری
   * GET /accounts/api/profile/
   */
  static async getUserProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(USER_API_ENDPOINTS.PROFILE);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در دریافت پروفایل');
    }
    return response.data;
  }

  /**
   * ویرایش پروفایل کاربر جاری
   * PATCH /accounts/api/profile/
   */
  static async updateUserProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      USER_API_ENDPOINTS.PROFILE,
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در ویرایش پروفایل');
    }
    return response.data;
  }

  /**
   * دریافت آمار کاربر جاری
   * GET /accounts/api/stats/
   */
  static async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<ApiResponse<UserStats>>(
      USER_API_ENDPOINTS.STATS
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در دریافت آمار');
    }
    return response.data;
  }

  /**
   * دریافت مجوزهای کاربر جاری
   * GET /accounts/api/permissions/
   */
  static async getUserPermissions(): Promise<UserPermissions> {
    const response = await apiClient.get<ApiResponse<UserPermissions>>(
      USER_API_ENDPOINTS.PERMISSIONS
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در دریافت مجوزها');
    }
    return response.data;
  }

  /**
   * دریافت لیست کاربران (فقط برای Admin)
   * GET /accounts/api/users/
   */
  static async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(
      USER_API_ENDPOINTS.LIST,
      params
    );
    if (!response.success) {
      throw new Error('خطا در دریافت لیست کاربران');
    }
    return response;
  }

  /**
   * دریافت جزئیات یک کاربر (فقط برای Admin)
   * GET /accounts/api/users/:id/
   */
  static async getUser(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      USER_API_ENDPOINTS.DETAIL(id)
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در دریافت اطلاعات کاربر');
    }
    return response.data;
  }

  /**
   * ویرایش کاربر (فقط برای Admin)
   * PATCH /accounts/api/users/:id/
   */
  static async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      USER_API_ENDPOINTS.DETAIL(id),
      data
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در ویرایش کاربر');
    }
    return response.data;
  }

  /**
   * حذف کاربر (فقط برای Admin)
   * DELETE /accounts/api/users/:id/
   */
  static async deleteUser(id: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(
      USER_API_ENDPOINTS.DETAIL(id)
    );
    if (!response.success) {
      throw new Error(response.message || 'خطا در حذف کاربر');
    }
  }

  /**
   * تغییر نقش کاربر (فقط برای Admin)
   * PATCH /accounts/api/users/:id/role/
   */
  static async updateUserRole(userId: number, role: UserRole): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      USER_API_ENDPOINTS.UPDATE_ROLE(userId),
      { role }
    );
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در تغییر نقش کاربر');
    }
    return response.data;
  }

  /**
   * بررسی دسترسی کاربر به یک permission
   */
  static hasPermission(user: User, permission: string): boolean {
    if (!user) return false;
    if (user.is_superuser) return true;
    // این لاجیک باید با backend هماهنگ باشد
    return false;
  }

  /**
   * بررسی نقش کاربر
   */
  static hasRole(user: User, role: UserRole): boolean {
    if (!user) return false;
    return user.role === role;
  }

  /**
   * بررسی Admin بودن کاربر
   */
  static isAdmin(user: User): boolean {
    if (!user) return false;
    return user.role === UserRole.ADMIN || user.is_superuser || user.is_store_admin;
  }

  /**
   * بررسی Order Processor بودن کاربر
   */
  static isOrderProcessor(user: User): boolean {
    if (!user) return false;
    return user.role === UserRole.ORDER_PROCESSOR || this.isAdmin(user);
  }

  /**
   * آپلود آواتار کاربر
   * PATCH /accounts/api/profile/ (with FormData)
   */
  static async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('access_token');

    const response = await fetch(`${API_URL}/accounts/api/profile/`, {
      method: 'PATCH',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('خطا در آپلود آواتار');
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      throw new Error(result.message || 'خطا در آپلود آواتار');
    }

    return { avatar: result.data.avatar };
  }

  /**
   * دریافت لیست آدرس‌های کاربر
   * GET /accounts/addresses/
   */
  static async getAddresses(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/accounts/addresses/');
    // Note: Standard ListAPIView response is usually just the list or { results: list }
    if (Array.isArray(response)) return response;
    // @ts-ignore
    return response.results || response;
  }

  /**
   * ایجاد آدرس جدید
   * POST /accounts/addresses/
   */
  static async createAddress(data: any): Promise<any> {
    return await apiClient.post<any>('/accounts/addresses/', data);
  }

  /**
   * ویرایش آدرس
   * PATCH /accounts/addresses/:id/
   */
  static async updateAddress(id: number, data: any): Promise<any> {
    return await apiClient.patch<any>(`/accounts/addresses/${id}/`, data);
  }

  /**
   * حذف آدرس
   * DELETE /accounts/addresses/:id/
   */
  static async deleteAddress(id: number): Promise<void> {
    await apiClient.delete<void>(`/accounts/addresses/${id}/`);
  }

  /**
   * تنظیم آدرس پیش‌فرض
   * POST /accounts/addresses/:id/set_default/
   */
  static async setDefaultAddress(id: number): Promise<any> {
    return await apiClient.post<any>(`/accounts/addresses/${id}/set_default/`);
  }
}

export default UserManagementService;

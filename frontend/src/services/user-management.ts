// User Management Service - nxtbn-style
// Comprehensive API service for user CRUD, stats, and permissions

import { User, UserStats, UserPermissions, UserRole } from '../types/user';

// API Endpoints
const USER_API_ENDPOINTS = {
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

// Simple API Client (matching existing api.ts pattern)
class UserApiClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    // Use environment variable for production compatibility
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.token = localStorage.getItem('access_token'); // Unified token key
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
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
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

const userApiClient = new UserApiClient();

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
    const response = await userApiClient.get<ApiResponse<User>>(USER_API_ENDPOINTS.PROFILE);
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
    const response = await userApiClient.patch<ApiResponse<User>>(
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
    const response = await userApiClient.get<ApiResponse<UserStats>>(
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
    const response = await userApiClient.get<ApiResponse<UserPermissions>>(
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
    const response = await userApiClient.get<PaginatedResponse<User>>(
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
    const response = await userApiClient.get<ApiResponse<User>>(
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
    const response = await userApiClient.patch<ApiResponse<User>>(
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
    const response = await userApiClient.delete<ApiResponse<void>>(
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
    const response = await userApiClient.patch<ApiResponse<User>>(
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
    const response = await userApiClient.get<ApiResponse<any[]>>('/accounts/addresses/');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در دریافت آدرس‌ها');
    }
    return response.data;
  }

  /**
   * ایجاد آدرس جدید
   * POST /accounts/addresses/
   */
  static async createAddress(data: any): Promise<any> {
    const response = await userApiClient.post<ApiResponse<any>>('/accounts/addresses/', data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در ایجاد آدرس');
    }
    return response.data;
  }

  /**
   * ویرایش آدرس
   * PATCH /accounts/addresses/:id/
   */
  static async updateAddress(id: number, data: any): Promise<any> {
    const response = await userApiClient.patch<ApiResponse<any>>(`/accounts/addresses/${id}/`, data);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در ویرایش آدرس');
    }
    return response.data;
  }

  /**
   * حذف آدرس
   * DELETE /accounts/addresses/:id/
   */
  static async deleteAddress(id: number): Promise<void> {
    const response = await userApiClient.delete<ApiResponse<void>>(`/accounts/addresses/${id}/`);
    if (!response.success) {
      throw new Error(response.message || 'خطا در حذف آدرس');
    }
  }

  /**
   * تنظیم آدرس پیش‌فرض
   * POST /accounts/addresses/:id/set_default/
   */
  static async setDefaultAddress(id: number): Promise<any> {
    const response = await userApiClient.post<ApiResponse<any>>(`/accounts/addresses/${id}/set_default/`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'خطا در تنظیم آدرس پیش‌فرض');
    }
    return response.data;
  }
}

export default UserManagementService;

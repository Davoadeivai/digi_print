// Django-style API Service Layer
// This simulates a Django REST Framework API structure

interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

class ApiClient {
  private config: ApiConfig;
  private token: string | null = null;

  constructor(config: ApiConfig) {
    this.config = config;
    this.token = localStorage.getItem('digiprint_auth_token');
  }

  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('digiprint_auth_token', token);
  }

  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('digiprint_auth_token');
  }

  private getHeaders(): Record<string, string> {
    const headers = { ...this.config.headers };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.config.baseURL);

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
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

import { API_URL } from '../config/env';

// API Client Instance
// API Client Instance
const apiClient = new ApiClient({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// API Endpoints (Django URL patterns style)
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/accounts/login/',
    LOGOUT: '/accounts/logout/',
    REGISTER: '/accounts/register/',
    REFRESH: '/accounts/token/refresh/',
    USER: '/accounts/profile/',
  },

  // User Management
  USER: {
    PROFILE: '/accounts/profile/',
    ADDRESSES: {
      LIST: '/accounts/addresses/',
      CREATE: '/accounts/addresses/',
      UPDATE: (id: number) => `/accounts/addresses/${id}/`,
      DELETE: (id: number) => `/accounts/addresses/${id}/`,
      SET_DEFAULT: (id: number) => `/accounts/addresses/${id}/set_default/`,
    },
  },

  // Services
  SERVICES: {
    LIST: '/services/',
    DETAIL: (id: number) => `/services/${id}/`,
    CREATE: '/services/',
    UPDATE: (id: number) => `/services/${id}/`,
    DELETE: (id: number) => `/services/${id}/`,
  },

  // Portfolio
  PORTFOLIO: {
    LIST: '/portfolio/',
    DETAIL: (id: number) => `/portfolio/${id}/`,
    CREATE: '/portfolio/',
    UPDATE: (id: number) => `/portfolio/${id}/`,
    DELETE: (id: number) => `/portfolio/${id}/`,
  },

  // Orders
  ORDERS: {
    LIST: '/orders/',
    DETAIL: (id: number) => `/orders/${id}/`,
    CREATE: '/orders/',
    UPDATE: (id: number) => `/orders/${id}/`,
    DELETE: (id: number) => `/orders/${id}/`,
  },

  // Contact
  CONTACT: {
    MESSAGES: '/contact/messages/',
    CREATE: '/contact/messages/',
    DETAIL: (id: number) => `/contact/messages/${id}/`,
    MARK_READ: (id: number) => `/contact/messages/${id}/mark_read/`,
  },

  // Company
  COMPANY: {
    SETTINGS: '/company/settings/',
    UPDATE: '/company/settings/',
  },

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter/subscribe/',
    UNSUBSCRIBE: '/newsletter/unsubscribe/',
    SUBSCRIBERS: '/newsletter/subscribers/',
  },

  // File Upload
  FILES: {
    UPLOAD: '/files/upload/',
    DELETE: (id: number) => `/files/${id}/`,
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard/',
    SERVICES: '/analytics/services/',
    ORDERS: '/analytics/orders/',
  },

  // Wallet
  WALLET: {
    CHARGE: '/wallet/charge/',
    INFO: '/wallet/',
    TRANSACTIONS: '/wallet/transactions/',
  },
};

// Django-style Serializers (Data Transformation)
export class ServiceSerializer {
  static serialize(data: any) {
    return {
      title: data.title,
      slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      short_description: data.short_description,
      features: data.features || [],
      pricing: {
        basic: Number(data.pricing?.basic) || 0,
        premium: Number(data.pricing?.premium) || 0,
        enterprise: Number(data.pricing?.enterprise) || 0,
      },
      gallery: data.gallery || [],
      specifications: data.specifications || [],
      is_active: Boolean(data.is_active),
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };
  }

  static deserialize(data: any) {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      short_description: data.short_description,
      features: data.features || [],
      pricing: data.pricing,
      gallery: data.gallery || [],
      specifications: data.specifications || [],
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };
  }
}

export class PortfolioSerializer {
  static serialize(data: any) {
    return {
      title: data.title,
      slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-'),
      category: data.category,
      client: data.client,
      year: data.year,
      description: data.description,
      challenge: data.challenge,
      solution: data.solution,
      result: data.result,
      images: data.images || [],
      tags: data.tags || [],
      is_featured: Boolean(data.is_featured),
      is_active: Boolean(data.is_active),
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };
  }

  static deserialize(data: any) {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      category: data.category,
      client: data.client,
      year: data.year,
      description: data.description,
      challenge: data.challenge,
      solution: data.solution,
      result: data.result,
      images: data.images || [],
      tags: data.tags || [],
      is_featured: data.is_featured,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };
  }
}

export class OrderSerializer {
  static serialize(data: any) {
    return {
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      service_type: data.service_type,
      project_details: data.project_details,
      budget_range: data.budget_range,
      deadline: data.deadline,
      files: data.files || [],
      special_requirements: data.special_requirements,
      status: data.status || 'pending',
      admin_notes: data.admin_notes || '',
    };
  }

  static deserialize(data: any) {
    return {
      id: data.id,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      service_type: data.service_type,
      project_details: data.project_details,
      budget_range: data.budget_range,
      deadline: data.deadline,
      files: data.files || [],
      special_requirements: data.special_requirements,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      admin_notes: data.admin_notes,
    };
  }
}

// Django-style ViewSets (API Service Classes)
export class AuthService {
  static async login(credentials: { username: string; password: string }) {
    try {
      // Define the expected response type
      interface LoginResponse {
        access: string;
        refresh: string;
        user: any;
      }
      
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        email: credentials.username, // mapping username to email as API expects email
        password: credentials.password
      });
      
      if (response.access) {
        apiClient.setAuthToken(response.access);
        // Store refresh token as well if needed, though apiClient only handles one token currently
        localStorage.setItem('refresh_token', response.refresh);
      }
      return response;
    } catch (error) {
      throw new Error('خطا در ورود به سیستم');
    }
  }

  static async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      apiClient.clearAuthToken();
    } catch (error) {
      // Even if logout fails on server, clear local token
      apiClient.clearAuthToken();
    }
  }

  static async register(userData: any) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  static async getService(id: number) {
    return apiClient.get(API_ENDPOINTS.SERVICES.DETAIL(id));
  }

  static async createService(data: any) {
    const serializedData = ServiceSerializer.serialize(data);
    return apiClient.post(API_ENDPOINTS.SERVICES.CREATE, serializedData);
  }

  static async updateService(id: number, data: any) {
    const serializedData = ServiceSerializer.serialize(data);
    return apiClient.patch(API_ENDPOINTS.SERVICES.UPDATE(id), serializedData);
  }

  static async deleteService(id: number) {
    return apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id));
  }
}

export class PortfolioService {
  static async getPortfolioItems(params?: PaginationParams) {
    return apiClient.get<PaginatedResponse<any>>(API_ENDPOINTS.PORTFOLIO.LIST, params);
  }

  static async getPortfolioItem(id: number) {
    return apiClient.get(API_ENDPOINTS.PORTFOLIO.DETAIL(id));
  }

  static async createPortfolioItem(data: any) {
    const serializedData = PortfolioSerializer.serialize(data);
    return apiClient.post(API_ENDPOINTS.PORTFOLIO.CREATE, serializedData);
  }

  static async updatePortfolioItem(id: number, data: any) {
    const serializedData = PortfolioSerializer.serialize(data);
    return apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE(id), serializedData);
  }

  static async deletePortfolioItem(id: number) {
    return apiClient.delete(API_ENDPOINTS.PORTFOLIO.DELETE(id));
  }
}

export class OrderService {
  static async getOrders(params?: PaginationParams) {
    return apiClient.get<PaginatedResponse<any>>(API_ENDPOINTS.ORDERS.LIST, params);
  }

  static async getOrder(id: number) {
    return apiClient.get(API_ENDPOINTS.ORDERS.DETAIL(id));
  }

  static async createOrder(data: any) {
    const serializedData = OrderSerializer.serialize(data);
    return apiClient.post(API_ENDPOINTS.ORDERS.CREATE, serializedData);
  }

  static async updateOrder(id: number, data: any) {
    const serializedData = OrderSerializer.serialize(data);
    return apiClient.patch(API_ENDPOINTS.ORDERS.UPDATE(id), serializedData);
  }

  static async deleteOrder(id: number) {
    return apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(id));
  }
}

export class ContactService {
  static async getMessages(params?: PaginationParams) {
    return apiClient.get<PaginatedResponse<any>>(API_ENDPOINTS.CONTACT.MESSAGES, params);
  }

  static async createMessage(data: any) {
    return apiClient.post(API_ENDPOINTS.CONTACT.CREATE, data);
  }

  static async markMessageAsRead(id: number) {
    return apiClient.post(API_ENDPOINTS.CONTACT.MARK_READ(id));
  }

  static async deleteMessage(id: number) {
    return apiClient.delete(API_ENDPOINTS.CONTACT.DETAIL(id));
  }
}

export class CompanyService {
  static async getSettings() {
    return apiClient.get(API_ENDPOINTS.COMPANY.SETTINGS);
  }

  static async updateSettings(data: any) {
    return apiClient.patch(API_ENDPOINTS.COMPANY.UPDATE, data);
  }
}

export class NewsletterService {
  static async subscribe(email: string) {
    return apiClient.post(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, { email });
  }

  static async unsubscribe(email: string) {
    return apiClient.post(API_ENDPOINTS.NEWSLETTER.UNSUBSCRIBE, { email });
  }

  static async getSubscribers(params?: PaginationParams) {
    return apiClient.get<PaginatedResponse<any>>(API_ENDPOINTS.NEWSLETTER.SUBSCRIBERS, params);
  }
}

export class FileService {
  static async uploadFile(file: File, folder?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    return fetch(`${API_ENDPOINTS.FILES.UPLOAD}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('digiprint_auth_token')}`,
      },
    }).then(response => response.json());
  }

  static async deleteFile(id: number) {
    return apiClient.delete(API_ENDPOINTS.FILES.DELETE(id));
  }
}

export class AnalyticsService {
  static async getDashboardData() {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
  }

  static async getServiceAnalytics() {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.SERVICES);
  }

  static async getOrderAnalytics() {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.ORDERS);
  }
}

export class WalletService {
  static async getWallet() {
    return apiClient.get(API_ENDPOINTS.WALLET.INFO);
  }

  static async chargeWallet(amount: number) {
    return apiClient.post(API_ENDPOINTS.WALLET.CHARGE, { amount });
  }

  static async getTransactions(params?: PaginationParams) {
    return apiClient.get<PaginatedResponse<any>>(API_ENDPOINTS.WALLET.TRANSACTIONS, params);
  }
}

// Django-style Permissions
export class Permissions {
  static canAddService(user: any): boolean {
    return user?.is_staff || user?.is_superuser;
  }

  static canEditService(user: any, service: any): boolean {
    return user?.is_staff || user?.is_superuser;
  }

  static canDeleteService(user: any, service: any): boolean {
    return user?.is_staff || user?.is_superuser;
  }

  static canViewOrders(user: any): boolean {
    return user?.is_staff || user?.is_superuser;
  }

  static canEditOrder(user: any, order: any): boolean {
    return user?.is_staff || user?.is_superuser;
  }
}

// Django-style Validators
export class Validators {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  }

  static validateRequired(value: any): boolean {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }

  static validateMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  static validateMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }
}

// Error Handling (Django-style)
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: any) => {
  if (error instanceof APIError) {
    return {
      message: error.message,
      status: error.status,
      errors: error.errors,
    };
  }

  return {
    message: 'خطای غیرمنتظره رخ داده است',
    status: 500,
    errors: null,
  };
};

// Security Service
export class SecurityService {
  static async getSessions() {
    // Mock data - در آینده باید به API واقعی متصل شود
    return Promise.resolve([
      {
        id: 1,
        device_type: 'Chrome on Windows',
        ip_address: '192.168.1.1',
        location: 'تهران، ایران',
        last_activity: new Date().toISOString(),
        is_active: true,
      },
    ]);
  }

  static async terminateSession(sessionId: number) {
    // Mock implementation
    return Promise.resolve({ success: true });
  }

  static async getSecurityLogs() {
    // Mock data
    return Promise.resolve([
      {
        id: 1,
        action: 'login_success',
        ip_address: '192.168.1.1',
        created_at: new Date().toISOString(),
      },
    ]);
  }

  static async changePassword(data: { old_password: string; new_password: string; new_password_confirm: string }) {
    return apiClient.post('/accounts/change-password/', data);
  }
}

// Export UserManagementService from the main user-management.ts file
// This avoids duplication and ensures consistency
export { UserManagementService } from './user-management';

export default apiClient;
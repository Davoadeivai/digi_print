import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../config/env';

// تنظیمات Axios - استفاده از config file
const API_BASE_URL = API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای افزودن توکن به درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor برای Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<TokenResponse>(`${API_BASE_URL}/accounts/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as any).Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Refresh token failed:', refreshError);
        // Clear all auth data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  company?: string;
  role: 'customer' | 'staff' | 'manager' | 'admin';
  role_display: string;
  avatar?: string;
  email_verified: boolean;
  is_store_admin?: boolean;
  is_store_staff?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isManager: boolean;
}

interface TokenResponse {
  access: string;
  refresh?: string;
}

interface RegisterData {
  email: string;
  full_name: string;
  phone: string;
  company?: string;
  password: string;
  password_confirm: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // بارگذاری کاربر از localStorage
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          console.log('✅ کاربر از localStorage بارگذاری شد');
        } catch (error) {
          console.error('❌ خطا در بارگذاری کاربر:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (data: RegisterData) => {
    try {
      // Try real API first
      try {
        const response = await api.post('/accounts/register/', {
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          password: data.password,
          role: 'customer'
        });

        const { user: newUser, tokens } = response.data as any;

        const userObject: User = {
          id: newUser.id || newUser.user?.id,
          email: newUser.email || newUser.user?.email,
          full_name: newUser.full_name || newUser.user?.full_name || '',
          phone: newUser.phone || newUser.user?.phone,
          company: newUser.company || newUser.user?.company,
          role: newUser.role || newUser.user?.role || 'customer',
          role_display: newUser.role_display || newUser.user?.role_display || 'مشتری',
          avatar: newUser.avatar || newUser.user?.avatar,
          email_verified: newUser.email_verified || false,
          is_store_admin: newUser.is_store_admin || false,
          is_store_staff: newUser.is_store_staff || false,
          is_staff: newUser.is_staff || false,
          is_active: newUser.is_active ?? true,
        };

        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(userObject));

        setUser(userObject);
        return;
      } catch (apiError) {
        // Only use mock in development mode when API fails
        if (import.meta.env.DEV) {
          console.warn('⚠️ API unavailable, using mock registration (DEV only)');
          const mockUser: User = {
            id: Math.floor(Math.random() * 1000),
            email: data.email,
            full_name: data.full_name,
            phone: data.phone || undefined,
            company: data.company || undefined,
            role: 'customer',
            role_display: 'مشتری',
            avatar: undefined,
            email_verified: true,
            is_store_admin: false,
            is_store_staff: false,
            is_staff: false,
            is_active: true,
          };

          localStorage.setItem('access_token', 'mock_access_token');
          localStorage.setItem('refresh_token', 'mock_refresh_token');
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          return;
        }
        throw apiError;
      }

    } catch (error: any) {
      console.error('❌ خطا در ثبت‌نام:', error);
      throw error.response?.data || { message: 'خطا در ثبت‌نام' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Try real API first
      try {
        const response = await api.post('/accounts/login/', { email, password });
        const { access, refresh } = response.data;

        // Get user profile after successful login
        localStorage.setItem('access_token', access);
        const profileResponse = await api.get('/accounts/profile/');
        const userData = profileResponse.data as any;

        const loggedUser: User = {
          id: userData.id || userData.user?.id || 1,
          email: userData.user?.email || email,
          full_name: userData.user?.full_name || userData.user?.first_name + ' ' + userData.user?.last_name || 'کاربر',
          phone: userData.user?.phone || '',
          company: userData.user?.company,
          role: userData.user?.role || 'customer',
          role_display: userData.user?.role_display || 'مشتری',
          avatar: userData.user?.avatar,
          email_verified: userData.user?.email_verified || false,
          is_store_admin: userData.user?.is_store_admin || false,
          is_store_staff: userData.user?.is_store_staff || false,
          is_staff: userData.user?.is_staff || false,
          is_active: userData.user?.is_active ?? true,
        };

        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        return;
      } catch (apiError) {
        // Only use mock in development mode when API fails
        if (import.meta.env.DEV) {
          console.warn('⚠️ API unavailable, using mock login (DEV only)');
          const mockUser: User = {
            id: 1,
            email: email,
            full_name: 'کاربر تست',
            phone: '09123456789',
            company: undefined,
            role: 'customer',
            role_display: 'مشتری',
            avatar: undefined,
            email_verified: true,
            is_store_admin: false,
            is_store_staff: false,
            is_staff: false,
            is_active: true,
          };

          localStorage.setItem('access_token', 'mock_access_token');
          localStorage.setItem('refresh_token', 'mock_refresh_token');
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          return;
        }
        throw apiError;
      }
    } catch (error: any) {
      console.error('❌ خطا در ورود:', error);
      throw error.response?.data || error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔵 خروج از سیستم');

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/accounts/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('❌ خطا در خروج از سرور:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
      console.log('✅ خروج موفق');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      console.log('🔵 بروزرسانی پروفایل:', data);

      if (!user) throw { message: 'کاربر وارد نشده است' };

      const response = await api.patch('/accounts/profile/', data);
      const updatedUser = { ...user, ...response.data };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      console.log('✅ پروفایل بروزرسانی شد:', updatedUser);
    } catch (error: any) {
      console.error('❌ خطا در بروزرسانی پروفایل:', error);
      throw error.response?.data || { message: 'خطا در بروزرسانی پروفایل' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.is_store_admin || false,
    isStaff: user?.role === 'staff' || user?.role === 'manager' || user?.role === 'admin' || user?.is_store_staff || false,
    isManager: user?.role === 'manager' || user?.is_store_admin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { api };

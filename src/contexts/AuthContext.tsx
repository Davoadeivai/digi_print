import React, { createContext, useContext, useState, useEffect } from 'react';
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
      config.headers.Authorization = `Bearer ${token}`;
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
        const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
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
  role: 'customer' | 'staff' | 'admin';
  role_display: string;
  avatar?: string;
  email_verified: boolean;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
          // در حالت شبیه‌سازی، از سرور اطلاعات نمی‌گیریم
        } catch (error) {
          console.error('خطا در بارگذاری کاربر:', error);
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
      // شبیه‌سازی ثبت‌نام موفق
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        company: data.company,
        role: 'customer',
        role_display: 'مشتری',
        email_verified: false,
      };

      const tokens = {
        access: 'mock_access_token_' + Date.now(),
        refresh: 'mock_refresh_token_' + Date.now(),
      };

      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(newUser));

      setUser(newUser);
    } catch (error: any) {
      throw error.response?.data || { message: 'خطا در ثبت‌نام' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // شبیه‌سازی ورود موفق
      // اعتبارسنجی ساده
      if (!email || !password) {
        throw { message: 'ایمیل و رمز عبور الزامی است' };
      }

      // کاربر شبیه‌سازی شده
      const loggedUser: User = {
        id: 1,
        email: email,
        full_name: 'کاربر تستی',
        phone: '09123456789',
        role: email.includes('admin') ? 'admin' : 'customer',
        role_display: email.includes('admin') ? 'مدیر' : 'مشتری',
        email_verified: true,
      };

      const tokens = {
        access: 'mock_access_token_' + Date.now(),
        refresh: 'mock_refresh_token_' + Date.now(),
      };

      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      setUser(loggedUser);
    } catch (error: any) {
      throw error.response?.data || { message: 'خطا در ورود' };
    }
  };

  const logout = async () => {
    // شبیه‌سازی خروج
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      // شبیه‌سازی بروزرسانی پروفایل
      if (!user) throw { message: 'کاربر وارد نشده است' };

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
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
    isAdmin: user?.role === 'admin' || false,
    isStaff: user?.role === 'staff' || user?.role === 'admin' || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { api };

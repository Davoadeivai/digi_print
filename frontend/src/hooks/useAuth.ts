import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface AuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  token: string | null;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export const useAuth = (): AuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // بارگذاری از localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error('ورود ناموفق');
      
      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('خوش آمدید!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ورود');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('ثبت‌نام ناموفق');
      
      const result = await response.json();
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      toast.success('ثبت‌نام موفق!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ثبت‌نام');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('خروج موفق');
  }, []);

  return { user, isAuthenticated: !!user, loading, login, register, logout, token };
};

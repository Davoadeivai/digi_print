import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface User { id: number; username: string; email: string; phone?: string; avatar?: string; }

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('ورود ناموفق');
      const data = await res.json();
      setUser(data.user || null);
      localStorage.setItem('token', data.token || '');
      toast.success('ورود موفق');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا');
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    toast.success('خروج انجام شد');
  }, []);

  return { user, login, logout, loading, isAuthenticated: !!user };
};

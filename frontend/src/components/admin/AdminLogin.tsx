import { useState } from 'react';
import { useBackend } from '../../contexts/BackendContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Shield, Lock, User } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export function AdminLogin({ onLoginSuccess, onClose }: AdminLoginProps) {
  const { login, loading } = useBackend();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await login(formData.username, formData.password);
      
      if (response.success) {
        toast.success('با موفقیت وارد شدید');
        onLoginSuccess();
      } else {
        toast.error(response.message || 'خطا در ورود');
      }
    } catch (error) {
      toast.error('خطا در ارتباط با سرور');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">ورود به پنل مدیریت</CardTitle>
          <CardDescription>
            برای دسترسی به پنل مدیریت، اطلاعات خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">نام کاربری</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="pr-10"
                  placeholder="نام کاربری خود را وارد کنید"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                className="p-0 text-sm"
                onClick={() => setShowHint(!showHint)}
              >
                راهنمای ورود
              </Button>
            </div>

            {showHint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="text-blue-800">
                  <strong>اطلاعات پیش‌فرض:</strong>
                </p>
                <p className="text-blue-700 mt-1">
                  نام کاربری: <code className="bg-blue-100 px-1 rounded">admin</code>
                </p>
                <p className="text-blue-700">
                  رمز عبور: <code className="bg-blue-100 px-1 rounded">admin</code>
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                لغو
              </Button>
              <Button
                type="submit"
                disabled={loading.auth}
                className="flex-1"
              >
                {loading.auth ? 'در حال ورود...' : 'ورود'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
            <p>این یک نسخه آزمایشی است</p>
            <p>در نسخه واقعی، سیستم احراز هویت پیچیده‌تری استفاده می‌شود</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
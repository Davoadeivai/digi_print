import { useState, useEffect, useCallback } from 'react';
import { useBackend } from '../../contexts/BackendContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Shield, Lock, User, Eye, EyeOff, X, Loader2 } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  // بستن با کلید Escape
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    // جلوگیری از اسکرول صفحه پشت مودال
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [handleEscape]);

  // اعتبارسنجی فرم
  const validateForm = (): boolean => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'نام کاربری الزامی است';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'نام کاربری باید حداقل ۳ کاراکتر باشد';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
      isValid = false;
    } else if (formData.password.length < 4) {
      newErrors.password = 'رمز عبور باید حداقل ۴ کاراکتر باشد';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(formData.username.trim(), formData.password);

      if (response.success) {
        toast.success('با موفقیت وارد شدید', {
          description: 'در حال انتقال به پنل مدیریت...'
        });
        onLoginSuccess();
      } else {
        toast.error(response.message || 'نام کاربری یا رمز عبور اشتباه است');
        // پاک کردن رمز عبور در صورت خطا
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('خطا در ارتباط با سرور', {
        description: 'لطفاً اتصال اینترنت خود را بررسی کنید'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // پاک کردن خطا هنگام تایپ
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // کلیک روی پس‌زمینه برای بستن
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // پر کردن خودکار اطلاعات پیش‌فرض
  const fillDefaultCredentials = () => {
    setFormData({
      username: 'admin',
      password: 'admin'
    });
    setErrors({ username: '', password: '' });
    toast.info('اطلاعات پیش‌فرض وارد شد');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md animate-in zoom-in-95 duration-200 relative">
        {/* دکمه بستن */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute left-2 top-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader className="text-center pt-8">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">ورود به پنل مدیریت</CardTitle>
          <CardDescription className="mt-2">
            برای دسترسی به پنل مدیریت، اطلاعات خود را وارد کنید
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* فیلد نام کاربری */}
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
                  className={`pr-10 ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="نام کاربری خود را وارد کنید"
                  autoComplete="username"
                  autoFocus
                  disabled={loading.auth}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* فیلد رمز عبور */}
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`pr-10 pl-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="رمز عبور خود را وارد کنید"
                  autoComplete="current-password"
                  disabled={loading.auth}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* راهنما */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                className="p-0 text-sm text-blue-600 hover:text-blue-700"
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? 'بستن راهنما' : 'راهنمای ورود'}
              </Button>
            </div>

            {showHint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm animate-in slide-in-from-top-2 duration-200">
                <p className="text-blue-800 font-semibold">
                  اطلاعات پیش‌فرض:
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-blue-700">
                    نام کاربری: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono">admin</code>
                  </p>
                  <p className="text-blue-700">
                    رمز عبور: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono">admin</code>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full text-blue-600 border-blue-300 hover:bg-blue-100"
                  onClick={fillDefaultCredentials}
                >
                  پر کردن خودکار
                </Button>
              </div>
            )}

            {/* دکمه‌ها */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading.auth}
              >
                لغو
              </Button>
              <Button
                type="submit"
                disabled={loading.auth}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading.auth ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  'ورود'
                )}
              </Button>
            </div>
          </form>

          {/* فوتر */}
          <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
            <p>این یک نسخه آزمایشی است</p>
            <p className="text-xs mt-1">
              در نسخه واقعی، سیستم احراز هویت پیچیده‌تری استفاده می‌شود
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
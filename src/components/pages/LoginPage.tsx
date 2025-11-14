import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { navigate } = useNavigation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // پاک کردن خطا هنگام تایپ
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل نامعتبر است';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('ورود با موفقیت انجام شد!');
      
      // هدایت به داشبورد
      navigate('dashboard');
    } catch (error: any) {
      console.error('خطا در ورود:', error);
      
      if (error.email) {
        setErrors((prev) => ({ ...prev, email: 'ایمیل یا رمز عبور اشتباه است' }));
      } else {
        toast.error(error.message || 'ایمیل یا رمز عبور اشتباه است');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">ورود به حساب کاربری</CardTitle>
          <CardDescription className="text-base">
            برای دسترسی به پنل کاربری وارد شوید
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ایمیل */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                ایمیل
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
                dir="ltr"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* رمز عبور */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                رمز عبور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="رمز عبور خود را وارد کنید"
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={loading}
                  dir="ltr"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* یادآوری و فراموشی رمز */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm cursor-pointer select-none"
                >
                  مرا به خاطر بسپار
                </Label>
              </div>
              <button
                type="button"
                onClick={() => toast.info('این قابلیت به زودی اضافه می‌شود')}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                فراموشی رمز عبور؟
              </button>
            </div>

            {/* دکمه ورود */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  در حال ورود...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  ورود
                </>
              )}
            </Button>

            {/* لینک ثبت‌نام */}
            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                حساب کاربری ندارید؟{' '}
                <button
                  type="button"
                  onClick={() => navigate('register')}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  ثبت‌نام کنید
                </button>
              </p>
            </div>

            {/* بازگشت به صفحه اصلی */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('home')}
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline inline-flex items-center gap-1"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

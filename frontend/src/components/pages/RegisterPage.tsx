import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { UserPlus, Mail, Lock, User, Phone, Building2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { navigate } = useNavigation();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    password_confirm: '',
    role: 'customer' as 'customer' | 'staff' | 'manager' | 'admin',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'نام و نام خانوادگی الزامی است';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل نامعتبر است';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تماس الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'شماره تماس باید با ۰۹ شروع شده و ۱۱ رقم باشد';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    }

    if (!formData.password_confirm) {
      newErrors.password_confirm = 'تکرار رمز عبور الزامی است';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'رمزهای عبور یکسان نیستند';
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
      await register(formData);
      toast.success('ثبت‌نام با موفقیت انجام شد!');
      
      // تأخیر کوتاه برای اطمینان از ذخیره شدن داده‌ها
      setTimeout(() => {
        navigate('dashboard');
      }, 100);
    } catch (error: any) {
      console.error('خطا در ثبت‌نام:', error);
      
      if (error.email) {
        setErrors((prev) => ({ ...prev, email: error.email[0] }));
      } else if (error.password) {
        setErrors((prev) => ({ ...prev, password: error.password[0] }));
      } else {
        toast.error(error.message || 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">ثبت‌نام مشتری</CardTitle>
          <CardDescription className="text-base">
            برای استفاده از خدمات ما، لطفاً ثبت‌نام کنید
            <br />
            <span className="text-xs text-gray-500 mt-1 inline-block">
              (همه کاربران جدید به عنوان «مشتری» ثبت می‌شوند)
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* اطلاعیه نقش کاربری */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <User className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">ثبت‌نام به عنوان مشتری</AlertTitle>
            <AlertDescription className="text-blue-700 text-sm">
              با ثبت‌نام در این صفحه، شما به عنوان <strong>مشتری</strong> در سیستم ثبت می‌شوید و دسترسی به پنل کاربری و امکانات ویژه خواهید داشت.
              <br />
              <span className="text-xs text-blue-600 mt-1 inline-block">
                💡 کارمندان و مدیران توسط مدیر سیستم از پنل ادمین تعیین می‌شوند.
              </span>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* نام کامل */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                نام و نام خانوادگی
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="مثال: علی احمدی"
                className={errors.full_name ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            {/* ایمیل و تلفن */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  ایمیل
                  <span className="text-red-500">*</span>
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
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  شماره تماس
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09123456789"
                  className={errors.phone ? 'border-red-500' : ''}
                  disabled={loading}
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* نوع حساب کاربری */}
            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                نوع حساب کاربری
                <span className="text-red-500">*</span>
              </Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="customer">مشتری</option>
                <option value="staff">کارمند</option>
                <option value="manager">مدیر</option>
                <option value="admin">مدیر کل</option>
              </select>
            </div>

            {/* نام شرکت */}
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                نام شرکت (اختیاری)
              </Label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="نام شرکت یا سازمان خود را وارد کنید"
                disabled={loading}
              />
            </div>

            {/* رمز عبور */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  رمز عبور
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="حداقل ۸ کاراکتر"
                    className={errors.password ? 'border-red-500' : ''}
                    disabled={loading}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirm" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  تکرار رمز عبور
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirm"
                    name="password_confirm"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={formData.password_confirm}
                    onChange={handleChange}
                    placeholder="رمز عبور را دوباره وارد کنید"
                    className={errors.password_confirm ? 'border-red-500' : ''}
                    disabled={loading}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password_confirm && (
                  <p className="text-sm text-red-500">{errors.password_confirm}</p>
                )}
              </div>
            </div>

            {/* نکات امنیتی */}
            <Alert>
              <AlertDescription className="text-sm">
                رمز عبور باید حداقل ۸ کاراکتر و شامل ترکیبی از حروف و اعداد باشد.
              </AlertDescription>
            </Alert>

            {/* دکمه ثبت‌نام */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  در حال ثبت‌نام...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  ثبت‌نام
                </>
              )}
            </Button>

            {/* لینک ورود */}
            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                قبلاً ثبت‌نام کرده‌اید؟{' '}
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  وارد شوید
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

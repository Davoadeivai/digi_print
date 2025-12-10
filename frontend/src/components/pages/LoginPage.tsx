import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Lock, Loader } from 'lucide-react';

export default function LoginPage() {
  const { navigate } = useNavigation();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('home');
    } catch {
      // خطا با toast نمایش داده می‌شود
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardTitle className="text-3xl text-center">ورود</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور"
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 ml-2 animate-spin" />
                  در حال ورود...
                </>
              ) : (
                'ورود'
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                حساب کاربری ندارید؟{' '}
                <button
                  type="button"
                  onClick={() => navigate('register')}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  ثبت‌نام کنید
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

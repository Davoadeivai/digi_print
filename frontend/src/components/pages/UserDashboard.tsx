import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import {
  Loader2,
  Settings,
  LogOut,
  ShoppingCart,
  TrendingUp,
  FileText,
  MapPin,
  Package,
  Activity,
  User,
} from 'lucide-react';

// Status colors and labels for orders
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  processing: 'bg-blue-100 text-blue-800 border-blue-300',
  shipped: 'bg-purple-100 text-purple-800 border-purple-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels: Record<string, string> = {
  pending: 'در انتظار پرداخت',
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
};

interface DashboardData {
  stats: {
    total_orders: number;
    total_spent: number;
    discount_percentage: number;
    addresses_count: number;
  };
  recent_orders: Array<{
    order_number: string;
    created_at: string;
    total_price: number;
    status: string;
  }>;
  recent_activities: Array<{
    activity_type_display: string;
    description?: string;
    created_at: string;
  }>;
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - در واقعیت این باید از API دریافت شود
      setDashboardData({
        stats: {
          total_orders: 0,
          total_spent: 0,
          discount_percentage: 0,
          addresses_count: 0,
        },
        recent_orders: [],
        recent_activities: [],
      });
    } catch (error) {
      console.error('خطا در بارگذاری داده‌ها:', error);
      toast.error('خطا در بارگذاری اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('با موفقیت خارج شدید');
      navigate('home');
    } catch (error) {
      console.error('خطا در خروج:', error);
    }
  };

  if (!user) {
    // به جای هدایت خودکار، یک پیام نمایش دهیم
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">لطفاً ابتدا وارد شوید</h2>
          <Button onClick={() => navigate('login')}>
            ورود به حساب کاربری
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    total_orders: 0,
    total_spent: 0,
    discount_percentage: 0,
    addresses_count: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={user.avatar} alt={user.full_name} />
                <AvatarFallback className="bg-white text-blue-600 text-2xl">
                  {user.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl mb-1">سلام، {user.full_name}</h1>
                <p className="text-blue-100">
                  {user.email}
                </p>
                <Badge className="mt-2 bg-white/20 hover:bg-white/30">
                  {user.role_display}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
                onClick={() => navigate('profile')}
              >
                <Settings className="w-4 h-4 ml-2" />
                تنظیمات
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/30 hover:bg-white/20 text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">کل سفارشات</p>
                  <p className="text-3xl">{stats.total_orders}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">کل خرید</p>
                  <p className="text-3xl">{stats.total_spent.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">تومان</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">تخفیف ویژه</p>
                  <p className="text-3xl">{stats.discount_percentage}%</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">آدرس‌ها</p>
                  <p className="text-3xl">{stats.addresses_count}</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="hover:shadow-lg transition-all cursor-pointer group border-emerald-100 bg-emerald-50/50"
            onClick={() => navigate('wallet')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-6 h-6 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">کیف پول</h3>
                <p className="text-sm text-gray-500">مدیریت موجودی و تراکنش‌ها</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer group border-rose-100 bg-rose-50/50"
            onClick={() => navigate('addresses')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">آدرس‌های من</h3>
                <p className="text-sm text-gray-500">مدیریت آدرس‌های ارسال</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer group border-blue-100 bg-blue-50/50"
            onClick={() => navigate('profile')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">اطلاعات کاربری</h3>
                <p className="text-sm text-gray-500">ویرایش مشخصات و رمز عبور</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="mb-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              سفارشات اخیر
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              فعالیت‌ها
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>سفارشات اخیر</CardTitle>
                <CardDescription>آخرین سفارشات شما</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.recent_orders && dashboardData.recent_orders.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent_orders.map((order) => (
                      <div
                        key={order.order_number}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">سفارش #{order.order_number}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <p className="font-medium">
                              {order.total_price.toLocaleString()} تومان
                            </p>
                            <Badge
                              variant="outline"
                              className={statusColors[order.status] || ''}
                            >
                              {statusLabels[order.status] || order.status}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info('صفحه جزئیات سفارش به زودی اضافه می‌شود')}
                          >
                            مشاهده
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>هنوز سفارشی ثبت نکرده‌اید</p>
                    <Button
                      className="mt-4"
                      onClick={() => navigate('order')}
                    >
                      ثبت سفارش جدید
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>فعالیت‌های اخیر</CardTitle>
                <CardDescription>تاریخچه فعالیت‌های شما</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData?.recent_activities && dashboardData.recent_activities.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent_activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Activity className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.activity_type_display}</p>
                          {activity.description && (
                            <p className="text-sm text-gray-500">{activity.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.created_at).toLocaleString('fa-IR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>هیچ فعالیتی ثبت نشده است</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
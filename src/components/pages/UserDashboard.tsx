import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import {
  User,
  Package,
  MapPin,
  LogOut,
  Settings,
  ShoppingCart,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardData {
  user: any;
  stats: {
    total_orders: number;
    total_spent: number;
    discount_percentage: number;
    addresses_count: number;
  };
  recent_orders: Array<{
    order_number: string;
    status: string;
    total_price: number;
    created_at: string;
  }>;
  recent_activities: Array<{
    activity_type: string;
    activity_type_display: string;
    description: string;
    created_at: string;
  }>;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels: Record<string, string> = {
  pending: 'در انتظار تأیید',
  confirmed: 'تأیید شده',
  in_progress: 'در حال انجام',
  completed: 'تکمیل شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
};

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
      // استفاده از داده‌های Mock به جای API
      const mockData: DashboardData = {
        user: user,
        stats: {
          total_orders: 12,
          total_spent: 48500000,
          discount_percentage: 5,
          addresses_count: 2,
        },
        recent_orders: [
          {
            order_number: 'ORD-1234',
            status: 'completed',
            total_price: 2500000,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            order_number: 'ORD-1233',
            status: 'in_progress',
            total_price: 3200000,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            order_number: 'ORD-1232',
            status: 'completed',
            total_price: 1800000,
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        recent_activities: [
          {
            activity_type: 'order_create',
            activity_type_display: 'ثبت سفارش',
            description: 'سفارش جدید ثبت شد',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            activity_type: 'profile_update',
            activity_type_display: 'بروزرسانی پروفایل',
            description: 'اطلاعات پروفایل به‌روزرسانی شد',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            activity_type: 'login',
            activity_type_display: 'ورود',
            description: 'ورود به سیستم',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('خطا در بارگذاری داشبورد:', error);
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
    navigate('login');
    return null;
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
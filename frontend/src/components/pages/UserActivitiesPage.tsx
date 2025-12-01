import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { UserManagementService } from '../../services/api';
import { toast } from 'sonner';
import {
    Loader2,
    Activity,
    LogIn,
    LogOut,
    Key,
    User,
    ShoppingCart,
    XCircle,
    Search,
    Filter,
    ArrowRight,
    Calendar,
    MapPin,
    Sparkles,
    Zap
} from 'lucide-react';

interface UserActivity {
    id: number;
    activity_type: string;
    activity_type_display: string;
    description: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
}

const activityIcons: Record<string, any> = {
    login: LogIn,
    logout: LogOut,
    password_change: Key,
    profile_update: User,
    order_create: ShoppingCart,
    order_cancel: XCircle,
};

const activityGradients: Record<string, string> = {
    login: 'from-emerald-500 to-teal-500',
    logout: 'from-gray-500 to-slate-500',
    password_change: 'from-indigo-500 to-blue-500',
    profile_update: 'from-purple-500 to-pink-500',
    order_create: 'from-orange-500 to-amber-500',
    order_cancel: 'from-rose-500 to-red-500',
};

export default function UserActivitiesPage() {
    const { user } = useAuth();
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        loadActivities();
    }, []);

    useEffect(() => {
        filterActivities();
    }, [activities, searchQuery, filterType]);

    const loadActivities = async () => {
        try {
            const mockActivities: UserActivity[] = [
                {
                    id: 1,
                    activity_type: 'login',
                    activity_type_display: 'ورود',
                    description: 'ورود به سیستم',
                    ip_address: '192.168.1.1',
                    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    created_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    activity_type: 'order_create',
                    activity_type_display: 'ثبت سفارش',
                    description: 'سفارش جدید #ORD-1234 ثبت شد',
                    ip_address: '192.168.1.1',
                    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 3,
                    activity_type: 'profile_update',
                    activity_type_display: 'بروزرسانی پروفایل',
                    description: 'اطلاعات پروفایل به‌روزرسانی شد',
                    ip_address: '192.168.1.1',
                    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 4,
                    activity_type: 'password_change',
                    activity_type_display: 'تغییر رمز عبور',
                    description: 'رمز عبور تغییر کرد',
                    ip_address: '192.168.1.1',
                    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 5,
                    activity_type: 'login',
                    activity_type_display: 'ورود',
                    description: 'ورود به سیستم',
                    ip_address: '192.168.1.2',
                    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
                    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 6,
                    activity_type: 'logout',
                    activity_type_display: 'خروج',
                    description: 'خروج از سیستم',
                    ip_address: '192.168.1.1',
                    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ];

            setActivities(mockActivities);
        } catch (error) {
            console.error('خطا در بارگذاری فعالیت‌ها:', error);
            toast.error('خطا در بارگذاری فعالیت‌ها');
        } finally {
            setLoading(false);
        }
    };

    const filterActivities = () => {
        let filtered = activities;

        if (filterType !== 'all') {
            filtered = filtered.filter(activity => activity.activity_type === filterType);
        }

        if (searchQuery) {
            filtered = filtered.filter(activity =>
                activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                activity.activity_type_display.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredActivities(filtered);
    };

    const getDeviceType = (userAgent: string): string => {
        if (userAgent.includes('iPhone') || userAgent.includes('Android')) {
            return 'موبایل';
        } else if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
            return 'تبلت';
        }
        return 'رایانه';
    };

    if (!user) {
        navigate('login');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-violet-600" />
                    <div className="absolute inset-0 blur-xl bg-violet-400 opacity-20 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-8">
            <style>{`
        @keyframes slide-in-timeline {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .timeline-item {
          animation: slide-in-timeline 0.6s ease-out;
        }
        .timeline-item:nth-child(1) { animation-delay: 0.1s; }
        .timeline-item:nth-child(2) { animation-delay: 0.2s; }
        .timeline-item:nth-child(3) { animation-delay: 0.3s; }
        .timeline-item:nth-child(4) { animation-delay: 0.4s; }
        .timeline-item:nth-child(5) { animation-delay: 0.5s; }
        .timeline-item:nth-child(6) { animation-delay: 0.6s; }
        .timeline-dot {
          animation: pulse-dot 2s infinite;
        }
        .timeline-line {
          background: linear-gradient(to bottom, 
            rgba(139, 92, 246, 0.3) 0%,
            rgba(168, 85, 247, 0.3) 50%,
            rgba(217, 70, 239, 0.3) 100%
          );
        }
      `}</style>

            <div className="container mx-auto px-4">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                {/* Header */}
                <div className="mb-8 relative">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('dashboard')}
                        className="mb-4 glass-card hover:scale-105 transition-all duration-300"
                    >
                        <ArrowRight className="w-4 h-4 ml-2" />
                        بازگشت به داشبورد
                    </Button>
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-8 h-8 text-violet-600 animate-pulse" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                            فعالیت‌های من
                        </h1>
                    </div>
                    <p className="text-gray-600 mr-11">تاریخچه فعالیت‌های حساب کاربری</p>
                </div>

                {/* Filters */}
                <div className="glass-card rounded-2xl p-6 mb-6 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="جستجو در فعالیت‌ها..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pr-10 border-2 border-violet-100 focus:border-violet-400 transition-all"
                            />
                        </div>
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="border-2 border-violet-100 focus:border-violet-400">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <SelectValue placeholder="نوع فعالیت" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">همه فعالیت‌ها</SelectItem>
                                <SelectItem value="login">ورود</SelectItem>
                                <SelectItem value="logout">خروج</SelectItem>
                                <SelectItem value="password_change">تغییر رمز عبور</SelectItem>
                                <SelectItem value="profile_update">بروزرسانی پروفایل</SelectItem>
                                <SelectItem value="order_create">ثبت سفارش</SelectItem>
                                <SelectItem value="order_cancel">لغو سفارش</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Activities Timeline */}
                <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-fuchsia-600/10">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-violet-600" />
                            تاریخچه فعالیت‌ها
                        </CardTitle>
                        <CardDescription>
                            {filteredActivities.length} فعالیت یافت شد
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {filteredActivities.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <Activity className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">هیچ فعالیتی یافت نشد</p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute right-[27px] top-0 bottom-0 w-0.5 timeline-line"></div>

                                <div className="space-y-6">
                                    {filteredActivities.map((activity, index) => {
                                        const Icon = activityIcons[activity.activity_type] || Activity;
                                        const gradientClass = activityGradients[activity.activity_type];

                                        return (
                                            <div
                                                key={activity.id}
                                                className="timeline-item relative pr-16"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                {/* Timeline Dot */}
                                                <div className="absolute right-[19px] top-6 w-4 h-4 bg-white rounded-full border-2 border-violet-400 timeline-dot z-10"></div>

                                                {/* Activity Card */}
                                                <div className="glass-card rounded-xl p-5 hover:shadow-xl transition-all duration-300 group">
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-14 h-14 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                                                            <Icon className="w-7 h-7 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <h4 className="font-semibold text-lg text-gray-800">{activity.activity_type_display}</h4>
                                                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                                                </div>
                                                                <Badge variant="outline" className="flex-shrink-0 border-violet-300 text-violet-700">
                                                                    {getDeviceType(activity.user_agent)}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{new Date(activity.created_at).toLocaleString('fa-IR')}</span>
                                                                </div>
                                                                <span>•</span>
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    <span>{activity.ip_address}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </div>
            </div>
        </div>
    );
}

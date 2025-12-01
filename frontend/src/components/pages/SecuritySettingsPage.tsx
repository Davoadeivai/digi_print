import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { UserManagementService, SecurityService } from '../../services/api';
import { toast } from 'sonner';
import {
    Loader2,
    Shield,
    Key,
    Smartphone,
    Monitor,
    Tablet,
    MapPin,
    Clock,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Eye,
    EyeOff,
    Sparkles,
    Lock,
    Zap
} from 'lucide-react';

interface Session {
    id: number;
    ip_address: string;
    device_type: string;
    location: string;
    is_active: boolean;
    last_activity: string;
    created_at: string;
}

interface SecurityLog {
    id: number;
    action: string;
    ip_address: string;
    created_at: string;
}

const deviceIcons: Record<string, any> = {
    mobile: Smartphone,
    desktop: Monitor,
    tablet: Tablet,
    unknown: Monitor,
};

const deviceGradients: Record<string, string> = {
    mobile: 'from-purple-500 to-pink-500',
    desktop: 'from-blue-500 to-cyan-500',
    tablet: 'from-amber-500 to-orange-500',
    unknown: 'from-gray-500 to-slate-500',
};

const actionLabels: Record<string, string> = {
    login_success: 'ورود موفق',
    login_failed: 'ورود ناموفق',
    logout: 'خروج',
    password_changed: 'تغییر رمز عبور',
    password_reset: 'بازیابی رمز عبور',
    email_changed: 'تغییر ایمیل',
    phone_changed: 'تغییر موبایل',
    suspicious_activity: 'فعالیت مشکوک',
};

const actionGradients: Record<string, string> = {
    login_success: 'from-emerald-500 to-teal-500',
    login_failed: 'from-rose-500 to-red-500',
    logout: 'from-gray-500 to-slate-500',
    password_changed: 'from-blue-500 to-cyan-500',
    password_reset: 'from-orange-500 to-amber-500',
    email_changed: 'from-purple-500 to-pink-500',
    phone_changed: 'from-purple-500 to-pink-500',
    suspicious_activity: 'from-red-500 to-rose-500',
};

export default function SecuritySettingsPage() {
    const { user } = useAuth();
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
    });

    useEffect(() => {
        loadSecurityData();
    }, []);

    const loadSecurityData = async () => {
        try {
            const mockSessions: Session[] = [
                {
                    id: 1,
                    ip_address: '192.168.1.1',
                    device_type: 'desktop',
                    location: 'تهران، ایران',
                    is_active: true,
                    last_activity: new Date().toISOString(),
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 2,
                    ip_address: '192.168.1.2',
                    device_type: 'mobile',
                    location: 'تهران، ایران',
                    is_active: false,
                    last_activity: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ];

            const mockLogs: SecurityLog[] = [
                {
                    id: 1,
                    action: 'login_success',
                    ip_address: '192.168.1.1',
                    created_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    action: 'password_changed',
                    ip_address: '192.168.1.1',
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    id: 3,
                    action: 'login_success',
                    ip_address: '192.168.1.2',
                    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ];

            setSessions(mockSessions);
            setSecurityLogs(mockLogs);
        } catch (error) {
            console.error('خطا در بارگذاری اطلاعات امنیتی:', error);
            toast.error('خطا در بارگذاری اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordData.old_password || !passwordData.new_password || !passwordData.new_password_confirm) {
            toast.error('لطفا تمام فیلدها را پر کنید');
            return;
        }

        if (passwordData.new_password !== passwordData.new_password_confirm) {
            toast.error('رمز عبور جدید و تکرار آن یکسان نیستند');
            return;
        }

        if (passwordData.new_password.length < 8) {
            toast.error('رمز عبور باید حداقل ۸ کاراکتر باشد');
            return;
        }

        setChangingPassword(true);
        try {
            await UserManagementService.changePassword(passwordData);
            toast.success('رمز عبور با موفقیت تغییر کرد');
            setIsPasswordDialogOpen(false);
            setPasswordData({ old_password: '', new_password: '', new_password_confirm: '' });
        } catch (error) {
            console.error('خطا در تغییر رمز عبور:', error);
            toast.error('خطا در تغییر رمز عبور');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleTerminateSession = async (id: number) => {
        if (!confirm('آیا از پایان دادن به این نشست اطمینان دارید؟')) return;

        try {
            await SecurityService.terminateSession(id);
            toast.success('نشست با موفقیت پایان یافت');
            loadSecurityData();
        } catch (error) {
            console.error('خطا در پایان دادن به نشست:', error);
            toast.error('خطا در پایان دادن به نشست');
        }
    };

    if (!user) {
        navigate('login');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
                    <div className="absolute inset-0 blur-xl bg-indigo-400 opacity-20 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 py-8">
            <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .security-item {
          animation: slide-in 0.5s ease-out;
        }
        .security-item:nth-child(1) { animation-delay: 0.1s; }
        .security-item:nth-child(2) { animation-delay: 0.2s; }
        .security-item:nth-child(3) { animation-delay: 0.3s; }
        .active-indicator {
          animation: pulse-ring 2s infinite;
        }
      `}</style>

            <div className="container mx-auto px-4">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
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
                        <Shield className="w-8 h-8 text-indigo-600 animate-pulse" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            تنظیمات امنیتی
                        </h1>
                    </div>
                    <p className="text-gray-600 mr-11">مدیریت امنیت حساب کاربری</p>
                </div>

                <Tabs defaultValue="password" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 glass-card p-2 gap-2">
                        <TabsTrigger
                            value="password"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
                        >
                            <Key className="w-4 h-4" />
                            رمز عبور
                        </TabsTrigger>
                        <TabsTrigger
                            value="sessions"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
                        >
                            <Monitor className="w-4 h-4" />
                            نشست‌های فعال
                        </TabsTrigger>
                        <TabsTrigger
                            value="logs"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
                        >
                            <Shield className="w-4 h-4" />
                            لاگ‌های امنیتی
                        </TabsTrigger>
                    </TabsList>

                    {/* Password Tab */}
                    <TabsContent value="password">
                        <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-cyan-600/10">
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Lock className="w-6 h-6 text-indigo-600" />
                                    تغییر رمز عبور
                                </CardTitle>
                                <CardDescription>
                                    برای امنیت بیشتر، رمز عبور قوی انتخاب کنید
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                            <Key className="w-5 h-5 ml-2" />
                                            تغییر رمز عبور
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass-card">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                                تغییر رمز عبور
                                            </DialogTitle>
                                            <DialogDescription>
                                                رمز عبور جدید باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="old_password">رمز عبور فعلی</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="old_password"
                                                        type={showPasswords.old ? 'text' : 'password'}
                                                        value={passwordData.old_password}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, old_password: e.target.value }))}
                                                        placeholder="رمز عبور فعلی"
                                                        className="border-2 border-indigo-100 focus:border-indigo-400 pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                                    >
                                                        {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new_password">رمز عبور جدید</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="new_password"
                                                        type={showPasswords.new ? 'text' : 'password'}
                                                        value={passwordData.new_password}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                                                        placeholder="رمز عبور جدید"
                                                        className="border-2 border-indigo-100 focus:border-indigo-400 pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                                    >
                                                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new_password_confirm">تکرار رمز عبور جدید</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="new_password_confirm"
                                                        type={showPasswords.confirm ? 'text' : 'password'}
                                                        value={passwordData.new_password_confirm}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password_confirm: e.target.value }))}
                                                        placeholder="تکرار رمز عبور جدید"
                                                        className="border-2 border-indigo-100 focus:border-indigo-400 pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                                                    >
                                                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsPasswordDialogOpen(false)}
                                                disabled={changingPassword}
                                            >
                                                انصراف
                                            </Button>
                                            <Button
                                                onClick={handlePasswordChange}
                                                disabled={changingPassword}
                                                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                                            >
                                                {changingPassword ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                                        در حال تغییر...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="w-4 h-4 ml-2" />
                                                        تغییر رمز عبور
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <div className="mt-6 p-6 glass-card rounded-xl border-2 border-indigo-200">
                                    <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        نکات امنیتی:
                                    </h4>
                                    <ul className="text-sm text-indigo-800 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>از رمز عبور قوی استفاده کنید (حداقل ۸ کاراکتر)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>از ترکیب حروف بزرگ، کوچک، اعداد و نمادها استفاده کنید</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>رمز عبور خود را به صورت دوره‌ای تغییر دهید</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>از رمز عبور یکسان در سایت‌های مختلف استفاده نکنید</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </div>
                    </TabsContent>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions">
                        <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-teal-600/10">
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Monitor className="w-6 h-6 text-blue-600" />
                                    نشست‌های فعال
                                </CardTitle>
                                <CardDescription>
                                    دستگاه‌هایی که به حساب شما دسترسی دارند
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {sessions.map((session, index) => {
                                        const DeviceIcon = deviceIcons[session.device_type] || Monitor;
                                        const gradientClass = deviceGradients[session.device_type];

                                        return (
                                            <div
                                                key={session.id}
                                                className="security-item glass-card p-5 rounded-xl hover:shadow-xl transition-all duration-300 group"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-14 h-14 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg relative`}>
                                                            <DeviceIcon className="w-7 h-7 text-white" />
                                                            {session.is_active && (
                                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white active-indicator"></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="font-semibold text-lg">
                                                                    {session.device_type === 'desktop' ? 'رایانه' : session.device_type === 'mobile' ? 'موبایل' : 'تبلت'}
                                                                </p>
                                                                {session.is_active && (
                                                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                                                                        فعال
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    <span>{session.location}</span>
                                                                </div>
                                                                <span>•</span>
                                                                <span>{session.ip_address}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                                                <Clock className="w-3 h-3" />
                                                                <span>آخرین فعالیت: {new Date(session.last_activity).toLocaleString('fa-IR')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {!session.is_active && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleTerminateSession(session.id)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-400 transition-all"
                                                        >
                                                            پایان نشست
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </div>
                    </TabsContent>

                    {/* Security Logs Tab */}
                    <TabsContent value="logs">
                        <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-cyan-600/10 via-teal-600/10 to-emerald-600/10">
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-cyan-600" />
                                    لاگ‌های امنیتی
                                </CardTitle>
                                <CardDescription>
                                    تاریخچه فعالیت‌های امنیتی حساب شما
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {securityLogs.map((log, index) => {
                                        const gradientClass = actionGradients[log.action];
                                        const isSuccess = log.action.includes('success');
                                        const isFailed = log.action.includes('failed') || log.action.includes('suspicious');

                                        return (
                                            <div
                                                key={log.id}
                                                className="security-item glass-card p-4 rounded-xl hover:shadow-lg transition-all duration-300"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center shadow-lg`}>
                                                            {isSuccess ? (
                                                                <CheckCircle2 className="w-6 h-6 text-white" />
                                                            ) : isFailed ? (
                                                                <XCircle className="w-6 h-6 text-white" />
                                                            ) : (
                                                                <Shield className="w-6 h-6 text-white" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-lg">{actionLabels[log.action] || log.action}</p>
                                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                                <span>{log.ip_address}</span>
                                                                <span>•</span>
                                                                <span>{new Date(log.created_at).toLocaleString('fa-IR')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

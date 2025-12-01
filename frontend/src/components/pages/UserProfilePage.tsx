import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, User, Briefcase, Building2, Wallet, Share2, ArrowRight, Sparkles } from 'lucide-react';

export default function UserProfilePage() {
    const { user } = useAuth();
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        birth_date: '',
        gender: '',
        job_title: '',
        department: '',
        national_code: '',
        company_name: '',
        economic_code: '',
        national_id: '',
        registration_number: '',
        iban: '',
        card_number: '',
        linkedin: '',
        instagram: '',
        telegram: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setProfileData({
                first_name: user?.full_name?.split(' ')[0] || '',
                last_name: user?.full_name?.split(' ')[1] || '',
                email: user?.email || '',
                phone: user?.phone || '',
                birth_date: '',
                gender: '',
                job_title: '',
                department: '',
                national_code: '',
                company_name: '',
                economic_code: '',
                national_id: '',
                registration_number: '',
                iban: '',
                card_number: '',
                linkedin: '',
                instagram: '',
                telegram: '',
            });
        } catch (error) {
            console.error('خطا در بارگذاری پروفایل:', error);
            toast.error('خطا در بارگذاری اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            // Mock update - در واقعیت این باید به API ارسال شود
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            toast.success('پروفایل با موفقیت به‌روزرسانی شد');
        } catch (error) {
            console.error('خطا در ذخیره پروفایل:', error);
            toast.error('خطا در ذخیره اطلاعات');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('حجم فایل نباید بیشتر از ۲ مگابایت باشد');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('فقط فایل‌های تصویری مجاز هستند');
            return;
        }

        setUploadingAvatar(true);
        try {
            // Mock upload - در واقعیت این باید به API ارسال شود
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, avatar: URL.createObjectURL(file) };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            toast.success('تصویر پروفایل با موفقیت به‌روزرسانی شد');
        } catch (error) {
            console.error('خطا در آپلود تصویر:', error);
            toast.error('خطا در آپلود تصویر');
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (!user) {
        navigate('login');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
                    <div className="absolute inset-0 blur-xl bg-purple-400 opacity-20 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3); }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .gradient-border {
          position: relative;
          background: white;
          border-radius: 1rem;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          padding: 2px;
          background: linear-gradient(135deg, #8B5CF6, #EC4899, #06B6D4);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1), 0 0 20px rgba(139, 92, 246, 0.2);
        }
      `}</style>

            <div className="container mx-auto px-4">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
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
                        <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            پروفایل کاربری
                        </h1>
                    </div>
                    <p className="text-gray-600 mr-11">مدیریت اطلاعات شخصی و حرفه‌ای</p>
                </div>

                {/* Avatar Section */}
                <div className="glass-card rounded-2xl p-6 mb-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="relative group/avatar">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover/avatar:opacity-75 transition-opacity"></div>
                            <Avatar className="w-28 h-28 border-4 border-white shadow-2xl relative">
                                <AvatarImage src={user.avatar} alt={user.full_name} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-3xl">
                                    {user.full_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {uploadingAvatar && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                                {user.full_name}
                            </h3>
                            <p className="text-gray-600 mb-3">{user.email}</p>
                            <label htmlFor="avatar-upload">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={uploadingAvatar}
                                    asChild
                                    className="gradient-border hover:scale-105 transition-transform duration-300"
                                >
                                    <span className="cursor-pointer">
                                        <Upload className="w-4 h-4 ml-2" />
                                        {uploadingAvatar ? 'در حال آپلود...' : 'تغییر تصویر'}
                                    </span>
                                </Button>
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={uploadingAvatar}
                            />
                        </div>
                    </div>
                </div>

                {/* Profile Information Tabs */}
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 glass-card p-2 gap-2">
                        <TabsTrigger
                            value="personal"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
                        >
                            <User className="w-4 h-4" />
                            اطلاعات شخصی
                        </TabsTrigger>
                        <TabsTrigger
                            value="professional"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
                        >
                            <Briefcase className="w-4 h-4" />
                            اطلاعات حرفه‌ای
                        </TabsTrigger>
                        <TabsTrigger
                            value="legal"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
                        >
                            <Building2 className="w-4 h-4" />
                            اطلاعات حقوقی
                        </TabsTrigger>
                        <TabsTrigger
                            value="financial"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
                        >
                            <Wallet className="w-4 h-4" />
                            اطلاعات مالی
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information */}
                    <TabsContent value="personal">
                        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <CardHeader className="bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10">
                                <CardTitle className="text-2xl">اطلاعات شخصی</CardTitle>
                                <CardDescription>اطلاعات پایه و شخصی خود را مدیریت کنید</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">نام</Label>
                                        <Input
                                            id="first_name"
                                            value={profileData.first_name}
                                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                                            placeholder="نام خود را وارد کنید"
                                            className="input-glow transition-all duration-300 border-2 border-purple-100 focus:border-purple-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">نام خانوادگی</Label>
                                        <Input
                                            id="last_name"
                                            value={profileData.last_name}
                                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                                            placeholder="نام خانوادگی خود را وارد کنید"
                                            className="input-glow transition-all duration-300 border-2 border-purple-100 focus:border-purple-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">ایمیل</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="example@email.com"
                                            className="input-glow transition-all duration-300 border-2 border-purple-100 focus:border-purple-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">شماره موبایل</Label>
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="09123456789"
                                            className="input-glow transition-all duration-300 border-2 border-purple-100 focus:border-purple-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date" className="text-sm font-medium text-gray-700">تاریخ تولد</Label>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={profileData.birth_date}
                                            onChange={(e) => handleInputChange('birth_date', e.target.value)}
                                            className="input-glow transition-all duration-300 border-2 border-purple-100 focus:border-purple-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">جنسیت</Label>
                                        <Select
                                            value={profileData.gender}
                                            onValueChange={(value) => handleInputChange('gender', value)}
                                        >
                                            <SelectTrigger className="input-glow transition-all duration-300 border-2 border-purple-100 focus:border-purple-400">
                                                <SelectValue placeholder="انتخاب کنید" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">مرد</SelectItem>
                                                <SelectItem value="female">زن</SelectItem>
                                                <SelectItem value="other">سایر</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Share2 className="w-4 h-4" />
                                        شبکه‌های اجتماعی
                                    </Label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Input
                                            placeholder="لینکدین"
                                            value={profileData.linkedin}
                                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                            className="input-glow transition-all duration-300 border-2 border-blue-100 focus:border-blue-400"
                                        />
                                        <Input
                                            placeholder="اینستاگرام"
                                            value={profileData.instagram}
                                            onChange={(e) => handleInputChange('instagram', e.target.value)}
                                            className="input-glow transition-all duration-300 border-2 border-pink-100 focus:border-pink-400"
                                        />
                                        <Input
                                            placeholder="تلگرام"
                                            value={profileData.telegram}
                                            onChange={(e) => handleInputChange('telegram', e.target.value)}
                                            className="input-glow transition-all duration-300 border-2 border-cyan-100 focus:border-cyan-400"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </TabsContent>

                    {/* Professional Information */}
                    <TabsContent value="professional">
                        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <CardHeader className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10">
                                <CardTitle className="text-2xl">اطلاعات حرفه‌ای</CardTitle>
                                <CardDescription>اطلاعات شغلی و سازمانی خود را وارد کنید</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="job_title" className="text-sm font-medium text-gray-700">سمت شغلی</Label>
                                        <Input
                                            id="job_title"
                                            value={profileData.job_title}
                                            onChange={(e) => handleInputChange('job_title', e.target.value)}
                                            placeholder="مثال: مدیر فروش"
                                            className="input-glow transition-all duration-300 border-2 border-blue-100 focus:border-blue-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-sm font-medium text-gray-700">دپارتمان</Label>
                                        <Input
                                            id="department"
                                            value={profileData.department}
                                            onChange={(e) => handleInputChange('department', e.target.value)}
                                            placeholder="مثال: بازاریابی"
                                            className="input-glow transition-all duration-300 border-2 border-blue-100 focus:border-blue-400"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </TabsContent>

                    {/* Legal Information */}
                    <TabsContent value="legal">
                        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <CardHeader className="bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-red-600/10">
                                <CardTitle className="text-2xl">اطلاعات حقوقی</CardTitle>
                                <CardDescription>برای مشتریان حقوقی (B2B)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="national_code" className="text-sm font-medium text-gray-700">کد ملی</Label>
                                        <Input
                                            id="national_code"
                                            value={profileData.national_code}
                                            onChange={(e) => handleInputChange('national_code', e.target.value)}
                                            placeholder="۱۰ رقم"
                                            maxLength={10}
                                            className="input-glow transition-all duration-300 border-2 border-amber-100 focus:border-amber-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">نام شرکت</Label>
                                        <Input
                                            id="company_name"
                                            value={profileData.company_name}
                                            onChange={(e) => handleInputChange('company_name', e.target.value)}
                                            placeholder="نام شرکت"
                                            className="input-glow transition-all duration-300 border-2 border-amber-100 focus:border-amber-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="economic_code" className="text-sm font-medium text-gray-700">کد اقتصادی</Label>
                                        <Input
                                            id="economic_code"
                                            value={profileData.economic_code}
                                            onChange={(e) => handleInputChange('economic_code', e.target.value)}
                                            placeholder="۱۴ رقم"
                                            maxLength={14}
                                            className="input-glow transition-all duration-300 border-2 border-amber-100 focus:border-amber-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="national_id" className="text-sm font-medium text-gray-700">شناسه ملی</Label>
                                        <Input
                                            id="national_id"
                                            value={profileData.national_id}
                                            onChange={(e) => handleInputChange('national_id', e.target.value)}
                                            placeholder="۱۱ رقم"
                                            maxLength={11}
                                            className="input-glow transition-all duration-300 border-2 border-amber-100 focus:border-amber-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="registration_number" className="text-sm font-medium text-gray-700">شماره ثبت</Label>
                                    <Input
                                        id="registration_number"
                                        value={profileData.registration_number}
                                        onChange={(e) => handleInputChange('registration_number', e.target.value)}
                                        placeholder="شماره ثبت شرکت"
                                        className="input-glow transition-all duration-300 border-2 border-amber-100 focus:border-amber-400"
                                    />
                                </div>
                            </CardContent>
                        </div>
                    </TabsContent>

                    {/* Financial Information */}
                    <TabsContent value="financial">
                        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <CardHeader className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-cyan-600/10">
                                <CardTitle className="text-2xl">اطلاعات مالی</CardTitle>
                                <CardDescription>اطلاعات بانکی برای تسویه حساب</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="iban" className="text-sm font-medium text-gray-700">شماره شبا</Label>
                                    <Input
                                        id="iban"
                                        value={profileData.iban}
                                        onChange={(e) => handleInputChange('iban', e.target.value)}
                                        placeholder="IR..."
                                        maxLength={26}
                                        className="input-glow transition-all duration-300 border-2 border-emerald-100 focus:border-emerald-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="card_number" className="text-sm font-medium text-gray-700">شماره کارت</Label>
                                    <Input
                                        id="card_number"
                                        value={profileData.card_number}
                                        onChange={(e) => handleInputChange('card_number', e.target.value)}
                                        placeholder="۱۶ رقم"
                                        maxLength={16}
                                        className="input-glow transition-all duration-300 border-2 border-emerald-100 focus:border-emerald-400"
                                    />
                                </div>
                            </CardContent>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Save Button */}
                <div className="flex justify-end mt-8">
                    <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        size="lg"
                        className="min-w-[200px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                در حال ذخیره...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 ml-2" />
                                ذخیره تغییرات
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

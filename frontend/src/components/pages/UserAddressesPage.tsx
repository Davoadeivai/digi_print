import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { UserManagementService } from '../../services/api';
import { toast } from 'sonner';
import {
    Loader2,
    Plus,
    MapPin,
    Home,
    Building2,
    Warehouse,
    Edit,
    Trash2,
    Star,
    ArrowRight,
    Phone,
    User,
    Sparkles,
    Navigation
} from 'lucide-react';

interface Address {
    id: number;
    title: string;
    receiver_name: string;
    receiver_phone: string;
    full_name: string;
    phone: string;
    address_type: string;
    province: string;
    city: string;
    address: string;
    postal_code: string;
    is_default: boolean;

}

const addressTypeIcons: Record<string, any> = {
    home: Home,
    office: Building2,
    warehouse: Warehouse,
    other: MapPin,
};

const addressTypeLabels: Record<string, string> = {
    home: 'منزل',
    office: 'محل کار',
    warehouse: 'انبار',
    other: 'سایر',
};

const addressTypeGradients: Record<string, string> = {
    home: 'from-rose-500 to-pink-500',
    office: 'from-blue-500 to-cyan-500',
    warehouse: 'from-amber-500 to-orange-500',
    other: 'from-purple-500 to-pink-500',
};

export default function UserAddressesPage() {
    const { user } = useAuth();
    const { navigate } = useNavigation();
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        receiver_name: '',
        receiver_phone: '',
        full_name: '',
        phone: '',
        address_type: 'home',
        province: '',
        city: '',
        address: '',
        postal_code: '',
        is_default: false,
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const mockAddresses: Address[] = [
                {
                    id: 1,
                    title: 'منزل',
                    receiver_name: '',
                    receiver_phone: '',
                    full_name: user?.full_name || '',
                    phone: user?.phone || '',
                    address_type: 'home',
                    province: 'تهران',
                    city: 'تهران',
                    address: 'خیابان ولیعصر، پلاک ۱۲۳',
                    postal_code: '1234567890',
                    is_default: true,
                },
                {
                    id: 2,
                    title: 'محل کار',
                    receiver_name: '',
                    receiver_phone: '',
                    full_name: user?.full_name || '',
                    phone: user?.phone || '',
                    address_type: 'office',
                    province: 'تهران',
                    city: 'تهران',
                    address: 'میدان آزادی، برج میلاد',
                    postal_code: '0987654321',
                    is_default: false,
                },
            ];
            setAddresses(mockAddresses);
        } catch (error) {
            console.error('خطا در بارگذاری آدرس‌ها:', error);
            toast.error('خطا در بارگذاری آدرس‌ها');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOpenDialog = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                title: address.title,
                receiver_name: address.receiver_name,
                receiver_phone: address.receiver_phone,
                full_name: address.full_name,
                phone: address.phone,
                address_type: address.address_type,
                province: address.province,
                city: address.city,
                address: address.address,
                postal_code: address.postal_code,
                is_default: address.is_default,
            });
        } else {
            setEditingAddress(null);
            setFormData({
                title: '',
                receiver_name: '',
                receiver_phone: '',
                full_name: user?.full_name || '',
                phone: user?.phone || '',
                address_type: 'home',
                province: '',
                city: '',
                address: '',
                postal_code: '',
                is_default: false,
            });
        }
        setIsDialogOpen(true);
    };

    const handleSaveAddress = async () => {
        if (!formData.title || !formData.full_name || !formData.phone || !formData.city || !formData.address) {
            toast.error('لطفا تمام فیلدهای الزامی را پر کنید');
            return;
        }

        setSaving(true);
        try {
            if (editingAddress) {
                await UserManagementService.updateAddress(editingAddress.id, formData);
                toast.success('آدرس با موفقیت به‌روزرسانی شد');
            } else {
                await UserManagementService.createAddress(formData);
                toast.success('آدرس جدید با موفقیت اضافه شد');
            }
            setIsDialogOpen(false);
            loadAddresses();
        } catch (error) {
            console.error('خطا در ذخیره آدرس:', error);
            toast.error('خطا در ذخیره آدرس');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        if (!confirm('آیا از حذف این آدرس اطمینان دارید؟')) return;

        try {
            await UserManagementService.deleteAddress(id);
            toast.success('آدرس با موفقیت حذف شد');
            loadAddresses();
        } catch (error) {
            console.error('خطا در حذف آدرس:', error);
            toast.error('خطا در حذف آدرس');
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await UserManagementService.setDefaultAddress(id);
            toast.success('آدرس پیش‌فرض تنظیم شد');
            loadAddresses();
        } catch (error) {
            console.error('خطا در تنظیم آدرس پیش‌فرض:', error);
            toast.error('خطا در تنظیم آدرس پیش‌فرض');
        }
    };

    if (!user) {
        navigate('login');
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
                <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-rose-600" />
                    <div className="absolute inset-0 blur-xl bg-rose-400 opacity-20 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-8">
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .address-card {
          animation: slide-in 0.5s ease-out;
        }
        .address-card:nth-child(1) { animation-delay: 0.1s; }
        .address-card:nth-child(2) { animation-delay: 0.2s; }
        .address-card:nth-child(3) { animation-delay: 0.3s; }
        .shimmer-badge {
          background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

            <div className="container mx-auto px-4">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
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
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Navigation className="w-8 h-8 text-rose-600 animate-pulse" />
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                                    آدرس‌های من
                                </h1>
                            </div>
                            <p className="text-gray-600 mr-11">مدیریت آدرس‌های ذخیره شده</p>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => handleOpenDialog()}
                                    className="bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 hover:from-rose-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    <Plus className="w-5 h-5 ml-2" />
                                    افزودن آدرس جدید
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                        {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        اطلاعات آدرس را با دقت وارد کنید
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">عنوان آدرس *</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                placeholder="مثال: منزل، محل کار"
                                                className="border-2 border-rose-100 focus:border-rose-400 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address_type">نوع آدرس</Label>
                                            <Select
                                                value={formData.address_type}
                                                onValueChange={(value) => handleInputChange('address_type', value)}
                                            >
                                                <SelectTrigger className="border-2 border-rose-100 focus:border-rose-400">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="home">منزل</SelectItem>
                                                    <SelectItem value="office">محل کار</SelectItem>
                                                    <SelectItem value="warehouse">انبار</SelectItem>
                                                    <SelectItem value="other">سایر</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-3 text-gray-700">اطلاعات گیرنده</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="full_name">نام و نام خانوادگی *</Label>
                                                <Input
                                                    id="full_name"
                                                    value={formData.full_name}
                                                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                                                    placeholder="نام گیرنده"
                                                    className="border-2 border-rose-100 focus:border-rose-400 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">شماره تماس *</Label>
                                                <Input
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    placeholder="09123456789"
                                                    className="border-2 border-rose-100 focus:border-rose-400 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="receiver_name">نام گیرنده دیگر (اختیاری)</Label>
                                                <Input
                                                    id="receiver_name"
                                                    value={formData.receiver_name}
                                                    onChange={(e) => handleInputChange('receiver_name', e.target.value)}
                                                    placeholder="در صورت تحویل به شخص دیگر"
                                                    className="border-2 border-gray-100 focus:border-gray-400 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="receiver_phone">شماره گیرنده دیگر (اختیاری)</Label>
                                                <Input
                                                    id="receiver_phone"
                                                    value={formData.receiver_phone}
                                                    onChange={(e) => handleInputChange('receiver_phone', e.target.value)}
                                                    placeholder="09123456789"
                                                    className="border-2 border-gray-100 focus:border-gray-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-3 text-gray-700">آدرس</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="province">استان</Label>
                                                <Input
                                                    id="province"
                                                    value={formData.province}
                                                    onChange={(e) => handleInputChange('province', e.target.value)}
                                                    placeholder="مثال: تهران"
                                                    className="border-2 border-rose-100 focus:border-rose-400 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">شهر *</Label>
                                                <Input
                                                    id="city"
                                                    value={formData.city}
                                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                                    placeholder="مثال: تهران"
                                                    className="border-2 border-rose-100 focus:border-rose-400 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <Label htmlFor="address">آدرس کامل *</Label>
                                            <Textarea
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                placeholder="آدرس کامل شامل خیابان، کوچه، پلاک و واحد"
                                                rows={3}
                                                className="border-2 border-rose-100 focus:border-rose-400 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <Label htmlFor="postal_code">کد پستی</Label>
                                            <Input
                                                id="postal_code"
                                                value={formData.postal_code}
                                                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                                placeholder="۱۰ رقم بدون خط تیره"
                                                maxLength={10}
                                                className="border-2 border-rose-100 focus:border-rose-400 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 border-t pt-4">
                                        <input
                                            type="checkbox"
                                            id="is_default"
                                            checked={formData.is_default}
                                            onChange={(e) => handleInputChange('is_default', e.target.checked)}
                                            className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                                        />
                                        <Label htmlFor="is_default" className="cursor-pointer">
                                            تنظیم به عنوان آدرس پیش‌فرض
                                        </Label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={saving}
                                    >
                                        انصراف
                                    </Button>
                                    <Button
                                        onClick={handleSaveAddress}
                                        disabled={saving}
                                        className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                                در حال ذخیره...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 ml-2" />
                                                ذخیره آدرس
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Addresses Grid */}
                {addresses.length === 0 ? (
                    <div className="glass-card rounded-2xl p-16 text-center">
                        <MapPin className="w-24 h-24 mx-auto mb-6 text-gray-300" />
                        <h3 className="text-2xl font-semibold mb-3 text-gray-700">هنوز آدرسی ثبت نکرده‌اید</h3>
                        <p className="text-gray-600 mb-6">برای سفارش‌های خود آدرس اضافه کنید</p>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                        >
                            <Plus className="w-4 h-4 ml-2" />
                            افزودن اولین آدرس
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {addresses.map((address, index) => {
                            const Icon = addressTypeIcons[address.address_type] || MapPin;
                            const gradientClass = addressTypeGradients[address.address_type];

                            return (
                                <div key={address.id} className="address-card glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group" style={{ animationDelay: `${index * 0.1}s` }}>
                                    {address.is_default && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <Badge className="shimmer-badge text-white border-0 shadow-lg">
                                                <Star className="w-3 h-3 ml-1 fill-current" />
                                                پیش‌فرض
                                            </Badge>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-14 h-14 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">{address.title}</h3>
                                                <p className="text-sm text-gray-500">{addressTypeLabels[address.address_type]}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-700">{address.full_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-700">{address.phone}</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                                <span className="text-gray-600 leading-relaxed">
                                                    {address.city}، {address.address}
                                                </span>
                                            </div>
                                            {address.postal_code && (
                                                <div className="text-sm text-gray-500 mr-6">
                                                    کد پستی: {address.postal_code}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                                            {!address.is_default && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSetDefault(address.id)}
                                                    className="flex-1 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700 transition-all"
                                                >
                                                    <Star className="w-4 h-4 ml-1" />
                                                    پیش‌فرض
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenDialog(address)}
                                                className="flex-1 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all"
                                            >
                                                <Edit className="w-4 h-4 ml-1" />
                                                ویرایش
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteAddress(address.id)}
                                                className="hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useBackend } from '../../contexts/BackendContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { toast } from "sonner";
import { 
  User, 
  Settings, 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  MessageSquare, 
  Mail,
  Edit,
  Trash2,
  Plus,
  Eye,
  LogOut,
  BarChart3,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { 
    user, 
    logout, 
    services, 
    portfolioItems, 
    orders, 
    contactMessages, 
    company,
    getServices,
    getPortfolioItems,
    getOrders,
    getContactMessages,
    getCompanySettings,
    createService,
    updateService,
    deleteService,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    updateOrder,
    deleteOrder,
    markMessageAsRead,
    deleteContactMessage,
    updateCompanySettings,
    loading
  } = useBackend();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingService, setEditingService] = useState<any>(null);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showPortfolioDialog, setShowPortfolioDialog] = useState(false);
  const [showCompanySettings, setShowCompanySettings] = useState(false);

  useEffect(() => {
    getServices();
    getPortfolioItems();
    getOrders();
    getContactMessages();
    getCompanySettings();
  }, []);

  const handleLogout = () => {
    logout();
    onClose();
    toast.success('با موفقیت خارج شدید');
  };

  const handleCreateService = async (formData: FormData) => {
    const serviceData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      short_description: formData.get('short_description') as string,
      features: (formData.get('features') as string).split('\n').filter(f => f.trim()),
      pricing: {
        basic: parseInt(formData.get('basic_price') as string) || 0,
        premium: parseInt(formData.get('premium_price') as string) || 0,
        enterprise: parseInt(formData.get('enterprise_price') as string) || 0
      },
      specifications: (formData.get('specifications') as string).split('\n').filter(s => s.trim()),
      meta_title: formData.get('meta_title') as string,
      meta_description: formData.get('meta_description') as string
    };

    try {
      if (editingService) {
        await updateService(editingService.id, serviceData);
        toast.success('سرویس با موفقیت بروزرسانی شد');
      } else {
        await createService(serviceData);
        toast.success('سرویس جدید با موفقیت ایجاد شد');
      }
      setShowServiceDialog(false);
      setEditingService(null);
      getServices();
    } catch (error) {
      toast.error('خطا در ذخیره سرویس');
    }
  };

  const handleCreatePortfolioItem = async (formData: FormData) => {
    const itemData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      client: formData.get('client') as string,
      year: formData.get('year') as string,
      description: formData.get('description') as string,
      challenge: formData.get('challenge') as string,
      solution: formData.get('solution') as string,
      result: formData.get('result') as string,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t),
      is_featured: formData.get('is_featured') === 'on',
      meta_title: formData.get('meta_title') as string,
      meta_description: formData.get('meta_description') as string
    };

    try {
      if (editingPortfolioItem) {
        await updatePortfolioItem(editingPortfolioItem.id, itemData);
        toast.success('آیتم پورتفولیو با موفقیت بروزرسانی شد');
      } else {
        await createPortfolioItem(itemData);
        toast.success('آیتم پورتفولیو جدید با موفقیت ایجاد شد');
      }
      setShowPortfolioDialog(false);
      setEditingPortfolioItem(null);
      getPortfolioItems();
    } catch (error) {
      toast.error('خطا در ذخیره آیتم پورتفولیو');
    }
  };

  const handleUpdateCompanySettings = async (formData: FormData) => {
    const companyData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      about: formData.get('about') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      working_hours: formData.get('working_hours') as string,
      social_media: {
        instagram: formData.get('instagram') as string,
        telegram: formData.get('telegram') as string,
        whatsapp: formData.get('whatsapp') as string,
        linkedin: formData.get('linkedin') as string
      }
    };

    try {
      await updateCompanySettings(companyData);
      toast.success('تنظیمات شرکت با موفقیت بروزرسانی شد');
      setShowCompanySettings(false);
      getCompanySettings();
    } catch (error) {
      toast.error('خطا در بروزرسانی تنظیمات');
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      pending: { label: 'در انتظار', variant: 'secondary' as const },
      in_review: { label: 'در بررسی', variant: 'default' as const },
      approved: { label: 'تایید شده', variant: 'default' as const },
      in_progress: { label: 'در حال انجام', variant: 'default' as const },
      completed: { label: 'تکمیل شده', variant: 'default' as const },
      cancelled: { label: 'لغو شده', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] h-[95vh] flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold">پنل مدیریت</h1>
              <p className="text-sm text-gray-500">خوش آمدید، {user?.first_name} {user?.last_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex">
            {/* Sidebar */}
            <div className="w-64 border-l bg-gray-50 p-4">
              <TabsList className="flex flex-col h-auto bg-transparent space-y-2 w-full">
                <TabsTrigger 
                  value="dashboard" 
                  className="w-full justify-start data-[state=active]:bg-blue-100"
                >
                  <BarChart3 className="w-4 h-4 ml-2" />
                  داشبورد
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="w-full justify-start data-[state=active]:bg-blue-100"
                >
                  <Package className="w-4 h-4 ml-2" />
                  خدمات
                </TabsTrigger>
                <TabsTrigger 
                  value="portfolio" 
                  className="w-full justify-start data-[state=active]:bg-blue-100"
                >
                  <FolderOpen className="w-4 h-4 ml-2" />
                  نمونه کارها
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="w-full justify-start data-[state=active]:bg-blue-100"
                >
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  سفارشات
                </TabsTrigger>
                <TabsTrigger 
                  value="messages" 
                  className="w-full justify-start data-[state=active]:bg-blue-100"
                >
                  <MessageSquare className="w-4 h-4 ml-2" />
                  پیام‌ها
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="w-full justify-start data-[state=active]:bg-blue-100"
                >
                  <Settings className="w-4 h-4 ml-2" />
                  تنظیمات
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
              {/* Dashboard */}
              <TabsContent value="dashboard" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">کل خدمات</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{services.length}</div>
                      <p className="text-xs text-muted-foreground">خدمات فعال</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">نمونه کارها</CardTitle>
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{portfolioItems.length}</div>
                      <p className="text-xs text-muted-foreground">پروژه‌های انجام شده</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">سفارشات</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{orders.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {orders.filter(o => o.status === 'pending').length} در انتظار
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">پیام‌ها</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{contactMessages.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {contactMessages.filter(m => !m.is_read).length} خوانده نشده
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>آخرین سفارشات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-gray-500">{order.service_type}</p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>آخرین پیام‌ها</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {contactMessages.slice(0, 5).map((message) => (
                          <div key={message.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{message.name}</p>
                              <p className="text-sm text-gray-500">{message.subject}</p>
                            </div>
                            {!message.is_read && (
                              <Badge variant="destructive">جدید</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Services */}
              <TabsContent value="services" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">مدیریت خدمات</h2>
                  <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingService(null)}>
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن خدمت جدید
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingService ? 'ویرایش خدمت' : 'افزودن خدمت جدید'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateService(new FormData(e.currentTarget));
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="title">عنوان خدمت</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            defaultValue={editingService?.title}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="short_description">توضیح کوتاه</Label>
                          <Input 
                            id="short_description" 
                            name="short_description"
                            defaultValue={editingService?.short_description}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">توضیحات کامل</Label>
                          <Textarea 
                            id="description" 
                            name="description"
                            defaultValue={editingService?.description}
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="features">ویژگی‌ها (هر خط یک ویژگی)</Label>
                          <Textarea 
                            id="features" 
                            name="features"
                            defaultValue={editingService?.features?.join('\n')}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="basic_price">قیمت پایه</Label>
                            <Input 
                              id="basic_price" 
                              name="basic_price" 
                              type="number"
                              defaultValue={editingService?.pricing?.basic}
                            />
                          </div>
                          <div>
                            <Label htmlFor="premium_price">قیمت پریمیوم</Label>
                            <Input 
                              id="premium_price" 
                              name="premium_price" 
                              type="number"
                              defaultValue={editingService?.pricing?.premium}
                            />
                          </div>
                          <div>
                            <Label htmlFor="enterprise_price">قیمت سازمانی</Label>
                            <Input 
                              id="enterprise_price" 
                              name="enterprise_price" 
                              type="number"
                              defaultValue={editingService?.pricing?.enterprise}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="specifications">مشخصات فنی (هر خط یک مشخصه)</Label>
                          <Textarea 
                            id="specifications" 
                            name="specifications"
                            defaultValue={editingService?.specifications?.join('\n')}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="meta_title">عنوان SEO</Label>
                          <Input 
                            id="meta_title" 
                            name="meta_title"
                            defaultValue={editingService?.meta_title}
                          />
                        </div>
                        <div>
                          <Label htmlFor="meta_description">توضیحات SEO</Label>
                          <Textarea 
                            id="meta_description" 
                            name="meta_description"
                            defaultValue={editingService?.meta_description}
                            rows={2}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setShowServiceDialog(false)}>
                            لغو
                          </Button>
                          <Button type="submit">
                            {editingService ? 'بروزرسانی' : 'ایجاد'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>عنوان</TableHead>
                          <TableHead>توضیح کوتاه</TableHead>
                          <TableHead>قیمت پایه</TableHead>
                          <TableHead>وضعیت</TableHead>
                          <TableHead>عملیات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.title}</TableCell>
                            <TableCell>{service.short_description}</TableCell>
                            <TableCell>{service.pricing?.basic?.toLocaleString()} تومان</TableCell>
                            <TableCell>
                              <Badge variant={service.is_active ? "default" : "secondary"}>
                                {service.is_active ? 'فعال' : 'غیرفعال'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingService(service);
                                    setShowServiceDialog(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    if (confirm('آیا مطمئن هستید؟')) {
                                      await deleteService(service.id);
                                      toast.success('خدمت حذف شد');
                                      getServices();
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Portfolio */}
              <TabsContent value="portfolio" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">مدیریت نمونه کارها</h2>
                  <Dialog open={showPortfolioDialog} onOpenChange={setShowPortfolioDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingPortfolioItem(null)}>
                        <Plus className="w-4 h-4 ml-2" />
                        افزودن نمونه کار
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingPortfolioItem ? 'ویرایش نمونه کار' : 'افزودن نمونه کار جدید'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCreatePortfolioItem(new FormData(e.currentTarget));
                      }} className="space-y-4">
                        <div>
                          <Label htmlFor="title">عنوان پروژه</Label>
                          <Input 
                            id="title" 
                            name="title" 
                            defaultValue={editingPortfolioItem?.title}
                            required 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">دسته‌بندی</Label>
                            <Input 
                              id="category" 
                              name="category"
                              defaultValue={editingPortfolioItem?.category}
                            />
                          </div>
                          <div>
                            <Label htmlFor="client">مشتری</Label>
                            <Input 
                              id="client" 
                              name="client"
                              defaultValue={editingPortfolioItem?.client}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="year">سال انجام</Label>
                          <Input 
                            id="year" 
                            name="year"
                            defaultValue={editingPortfolioItem?.year}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">توضیحات</Label>
                          <Textarea 
                            id="description" 
                            name="description"
                            defaultValue={editingPortfolioItem?.description}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="challenge">چالش</Label>
                          <Textarea 
                            id="challenge" 
                            name="challenge"
                            defaultValue={editingPortfolioItem?.challenge}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="solution">راه‌حل</Label>
                          <Textarea 
                            id="solution" 
                            name="solution"
                            defaultValue={editingPortfolioItem?.solution}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="result">نتیجه</Label>
                          <Textarea 
                            id="result" 
                            name="result"
                            defaultValue={editingPortfolioItem?.result}
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="tags">برچسب‌ها (با کاما جدا کنید)</Label>
                          <Input 
                            id="tags" 
                            name="tags"
                            defaultValue={editingPortfolioItem?.tags?.join(', ')}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="is_featured" 
                            name="is_featured"
                            defaultChecked={editingPortfolioItem?.is_featured}
                          />
                          <Label htmlFor="is_featured">نمونه کار ویژه</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setShowPortfolioDialog(false)}>
                            لغو
                          </Button>
                          <Button type="submit">
                            {editingPortfolioItem ? 'بروزرسانی' : 'ایجاد'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>عنوان</TableHead>
                          <TableHead>دسته‌بندی</TableHead>
                          <TableHead>مشتری</TableHead>
                          <TableHead>سال</TableHead>
                          <TableHead>وضعیت</TableHead>
                          <TableHead>عملیات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {portfolioItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.year}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Badge variant={item.is_active ? "default" : "secondary"}>
                                  {item.is_active ? 'فعال' : 'غیرفعال'}
                                </Badge>
                                {item.is_featured && (
                                  <Badge variant="default">ویژه</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingPortfolioItem(item);
                                    setShowPortfolioDialog(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    if (confirm('آیا مطمئن هستید؟')) {
                                      await deletePortfolioItem(item.id);
                                      toast.success('نمونه کار حذف شد');
                                      getPortfolioItems();
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders */}
              <TabsContent value="orders" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">مدیریت سفارشات</h2>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>شماره سفارش</TableHead>
                          <TableHead>نام مشتری</TableHead>
                          <TableHead>نوع خدمت</TableHead>
                          <TableHead>تاریخ ایجاد</TableHead>
                          <TableHead>وضعیت</TableHead>
                          <TableHead>عملیات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{order.customer_name}</TableCell>
                            <TableCell>{order.service_type}</TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString('fa-IR')}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={order.status}
                                  onValueChange={async (newStatus) => {
                                    await updateOrder(order.id, { status: newStatus as any });
                                    toast.success('وضعیت سفارش بروزرسانی شد');
                                    getOrders();
                                  }}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">در انتظار</SelectItem>
                                    <SelectItem value="in_review">در بررسی</SelectItem>
                                    <SelectItem value="approved">تایید شده</SelectItem>
                                    <SelectItem value="in_progress">در حال انجام</SelectItem>
                                    <SelectItem value="completed">تکمیل شده</SelectItem>
                                    <SelectItem value="cancelled">لغو شده</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    if (confirm('آیا مطمئن هستید؟')) {
                                      await deleteOrder(order.id);
                                      toast.success('سفارش حذف شد');
                                      getOrders();
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Messages */}
              <TabsContent value="messages" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">مدیریت پیام‌ها</h2>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>نام فرستنده</TableHead>
                          <TableHead>ایمیل</TableHead>
                          <TableHead>موضوع</TableHead>
                          <TableHead>تاریخ</TableHead>
                          <TableHead>وضعیت</TableHead>
                          <TableHead>عملیات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contactMessages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="font-medium">{message.name}</TableCell>
                            <TableCell>{message.email}</TableCell>
                            <TableCell>{message.subject}</TableCell>
                            <TableCell>
                              {new Date(message.created_at).toLocaleDateString('fa-IR')}
                            </TableCell>
                            <TableCell>
                              <Badge variant={message.is_read ? "default" : "destructive"}>
                                {message.is_read ? 'خوانده شده' : 'خوانده نشده'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {!message.is_read && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      await markMessageAsRead(message.id);
                                      toast.success('پیام به عنوان خوانده شده علامت‌گذاری شد');
                                      getContactMessages();
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    if (confirm('آیا مطمئن هستید؟')) {
                                      await deleteContactMessage(message.id);
                                      toast.success('پیام حذف شد');
                                      getContactMessages();
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings" className="mt-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">تنظیمات شرکت</h2>
                  <Button onClick={() => setShowCompanySettings(true)}>
                    <Edit className="w-4 h-4 ml-2" />
                    ویرایش تنظیمات
                  </Button>
                </div>

                {company && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>اطلاعات شرکت</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>نام شرکت</Label>
                          <p className="mt-1 text-gray-900">{company.name}</p>
                        </div>
                        <div>
                          <Label>توضیحات</Label>
                          <p className="mt-1 text-gray-900">{company.description}</p>
                        </div>
                        <div>
                          <Label>درباره ما</Label>
                          <p className="mt-1 text-gray-900">{company.about}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>اطلاعات تماس</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>شماره تلفن</Label>
                          <p className="mt-1 text-gray-900">{company.phone}</p>
                        </div>
                        <div>
                          <Label>ایمیل</Label>
                          <p className="mt-1 text-gray-900">{company.email}</p>
                        </div>
                        <div>
                          <Label>آدرس</Label>
                          <p className="mt-1 text-gray-900">{company.address}</p>
                        </div>
                        <div>
                          <Label>ساعات کاری</Label>
                          <p className="mt-1 text-gray-900">{company.working_hours}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>شبکه‌های اجتماعی</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>اینستاگرام</Label>
                          <p className="mt-1 text-gray-900">{company.social_media.instagram}</p>
                        </div>
                        <div>
                          <Label>تلگرام</Label>
                          <p className="mt-1 text-gray-900">{company.social_media.telegram}</p>
                        </div>
                        <div>
                          <Label>واتساپ</Label>
                          <p className="mt-1 text-gray-900">{company.social_media.whatsapp}</p>
                        </div>
                        <div>
                          <Label>لینکدین</Label>
                          <p className="mt-1 text-gray-900">{company.social_media.linkedin}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Company Settings Dialog */}
                <Dialog open={showCompanySettings} onOpenChange={setShowCompanySettings}>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>ویرایش تنظیمات شرکت</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateCompanySettings(new FormData(e.currentTarget));
                    }} className="space-y-4">
                      <div>
                        <Label htmlFor="name">نام شرکت</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          defaultValue={company?.name}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">توضیحات</Label>
                        <Input 
                          id="description" 
                          name="description"
                          defaultValue={company?.description}
                        />
                      </div>
                      <div>
                        <Label htmlFor="about">درباره ما</Label>
                        <Textarea 
                          id="about" 
                          name="about"
                          defaultValue={company?.about}
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">شماره تلفن</Label>
                          <Input 
                            id="phone" 
                            name="phone"
                            defaultValue={company?.phone}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">ایمیل</Label>
                          <Input 
                            id="email" 
                            name="email"
                            type="email"
                            defaultValue={company?.email}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">آدرس</Label>
                        <Textarea 
                          id="address" 
                          name="address"
                          defaultValue={company?.address}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="working_hours">ساعات کاری</Label>
                        <Input 
                          id="working_hours" 
                          name="working_hours"
                          defaultValue={company?.working_hours}
                        />
                      </div>
                      <Separator />
                      <h3 className="text-lg font-semibold">شبکه‌های اجتماعی</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="instagram">اینستاگرام</Label>
                          <Input 
                            id="instagram" 
                            name="instagram"
                            defaultValue={company?.social_media.instagram}
                          />
                        </div>
                        <div>
                          <Label htmlFor="telegram">تلگرام</Label>
                          <Input 
                            id="telegram" 
                            name="telegram"
                            defaultValue={company?.social_media.telegram}
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatsapp">واتساپ</Label>
                          <Input 
                            id="whatsapp" 
                            name="whatsapp"
                            defaultValue={company?.social_media.whatsapp}
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">لینکدین</Label>
                          <Input 
                            id="linkedin" 
                            name="linkedin"
                            defaultValue={company?.social_media.linkedin}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowCompanySettings(false)}>
                          لغو
                        </Button>
                        <Button type="submit">
                          بروزرسانی
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
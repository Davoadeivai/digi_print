import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useBackend } from '../../contexts/BackendContext';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  ArrowRight, 
  ShoppingCart, 
  Upload, 
  FileText, 
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  Star,
  Shield,
  Phone,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { toast } from "sonner";

export function OrderPage() {
  const { pageData, goBack } = useNavigation();
  const { createOrder } = useBackend();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    service: pageData?.service || '',
    package: pageData?.package || '',
    basePrice: pageData?.price || 0,
    // Personal Info
    name: '',
    email: '',
    phone: '',
    company: '',
    // Project Details
    projectTitle: '',
    description: '',
    deadline: '',
    priority: 'normal',
    // Additional Services
    additionalServices: [] as string[],
    // Files
    attachments: [] as File[],
    // Payment
    paymentMethod: '',
    discountCode: ''
  });

  const steps = [
    { id: 1, title: 'انتخاب خدمت', icon: ShoppingCart },
    { id: 2, title: 'جزئیات پروژه', icon: FileText },
    { id: 3, title: 'فایل‌ها', icon: Upload },
    { id: 4, title: 'پرداخت', icon: CreditCard }
  ];

  const additionalServices = [
    { id: 'express', title: 'تحویل فوری (۲۴ ساعته)', price: 50000 },
    { id: 'revisions', title: 'ویرایش اضافی (۲ بار)', price: 30000 },
    { id: 'source', title: 'فایل‌های منبع (PSD/AI)', price: 40000 },
    { id: 'consultation', title: 'مشاوره تخصصی', price: 25000 },
    { id: 'print', title: 'آماده‌سازی برای چاپ', price: 35000 }
  ];

  const calculateTotal = () => {
    let total = orderData.basePrice;
    orderData.additionalServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) total += service.price;
    });
    return total;
  };

  const handleAdditionalServiceChange = (serviceId: string, checked: boolean) => {
    setOrderData(prev => ({
      ...prev,
      additionalServices: checked 
        ? [...prev.additionalServices, serviceId]
        : prev.additionalServices.filter(id => id !== serviceId)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setOrderData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setOrderData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const submitOrder = async () => {
    try {
      // Calculate total price
      const additionalPrice = orderData.additionalServices.reduce((total, serviceId) => {
        const service = additionalServices.find(s => s.id === serviceId);
        return total + (service?.price || 0);
      }, 0);
      
      const totalPrice = orderData.basePrice + additionalPrice;
      
      const orderRequest = {
        customer_name: orderData.name,
        customer_email: orderData.email,
        customer_phone: orderData.phone,
        service_type: `${orderData.service} - ${orderData.package}`,
        project_details: `عنوان: ${orderData.projectTitle}\n\nتوضیحات: ${orderData.description}\n\nشرکت: ${orderData.company}\n\nخدمات اضافی: ${orderData.additionalServices.join(', ')}\n\nقیمت کل: ${totalPrice.toLocaleString()} تومان`,
        budget_range: `${totalPrice.toLocaleString()} تومان`,
        deadline: orderData.deadline,
        files: orderData.attachments.map(file => file.name),
        special_requirements: `اولویت: ${orderData.priority}\nروش پرداخت: ${orderData.paymentMethod}\nکد تخفیف: ${orderData.discountCode || 'ندارد'}`
      };

      const response = await createOrder(orderRequest);
      
      if (response.success) {
        toast.success('سفارش شما با موفقیت ثبت شد!', {
          description: `شماره سفارش: #${response.data.id} - ما در اسرع وقت با شما تماس خواهیم گرفت.`
        });
        goBack();
      } else {
        throw new Error(response.message || 'خطا در ثبت سفارش');
      }
    } catch (error) {
      toast.error('خطا در ثبت سفارش', {
        description: 'لطفاً مجدداً تلاش کنید.'
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 rtl-text">
            <button onClick={goBack} className="hover:text-primary transition-colors">
              خانه
            </button>
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span className="text-foreground">ثبت سفارش</span>
          </div>
          
          <div className="text-center space-y-4 rtl-text">
            <Badge className="glass">
              <ShoppingCart className="w-4 h-4 ml-2" />
              سفارش آنلاین
            </Badge>
            <h1 className="text-4xl font-bold gradient-text">ثبت سفارش جدید</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              فرم زیر را تکمیل کنید تا سفارش شما در اسرع وقت بررسی و شروع شود
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8 glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mr-3 rtl-text">
                      <div className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                        {step.title}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-20 h-1 mx-4 ${
                        step.id < currentStep ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <h2 className="text-xl font-semibold rtl-text">
                  {steps.find(s => s.id === currentStep)?.title}
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Service Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 rtl-text">
                        <Label>نوع خدمت *</Label>
                        <Select 
                          value={orderData.service} 
                          onValueChange={(value) => setOrderData(prev => ({ ...prev, service: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="خدمت مورد نظر را انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="چاپ دیجیتال">چاپ دیجیتال</SelectItem>
                            <SelectItem value="طراحی گرافیک">طراحی گرافیک</SelectItem>
                            <SelectItem value="بسته‌بندی">بسته‌بندی</SelectItem>
                            <SelectItem value="تبلیغات">تبلیغات</SelectItem>
                            <SelectItem value="عکاسی محصول">عکاسی محصول</SelectItem>
                            <SelectItem value="طراحی دیجیتال">طراحی دیجیتال</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 rtl-text">
                        <Label>نوع پکیج *</Label>
                        <Select 
                          value={orderData.package} 
                          onValueChange={(value) => setOrderData(prev => ({ ...prev, package: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="پکیج مورد نظر را انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">پایه</SelectItem>
                            <SelectItem value="premium">حرفه‌ای</SelectItem>
                            <SelectItem value="enterprise">سازمانی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 rtl-text">
                        <Label>نام و نام خانوادگی *</Label>
                        <Input
                          placeholder="نام خود را وارد کنید"
                          value={orderData.name}
                          onChange={(e) => setOrderData(prev => ({ ...prev, name: e.target.value }))}
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2 rtl-text">
                        <Label>ایمیل *</Label>
                        <Input
                          type="email"
                          placeholder="ایمیل خود را وارد کنید"
                          value={orderData.email}
                          onChange={(e) => setOrderData(prev => ({ ...prev, email: e.target.value }))}
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 rtl-text">
                        <Label>شماره تماس *</Label>
                        <Input
                          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                          value={orderData.phone}
                          onChange={(e) => setOrderData(prev => ({ ...prev, phone: e.target.value }))}
                          className="text-right"
                        />
                      </div>

                      <div className="space-y-2 rtl-text">
                        <Label>نام شرکت</Label>
                        <Input
                          placeholder="نام شرکت (اختیاری)"
                          value={orderData.company}
                          onChange={(e) => setOrderData(prev => ({ ...prev, company: e.target.value }))}
                          className="text-right"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Project Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2 rtl-text">
                      <Label>عنوان پروژه *</Label>
                      <Input
                        placeholder="عنوان پروژه خود را وارد کنید"
                        value={orderData.projectTitle}
                        onChange={(e) => setOrderData(prev => ({ ...prev, projectTitle: e.target.value }))}
                        className="text-right"
                      />
                    </div>

                    <div className="space-y-2 rtl-text">
                      <Label>توضیحات پروژه *</Label>
                      <Textarea
                        placeholder="لطفاً جزئیات پروژه خود را به طور کامل شرح دهید..."
                        value={orderData.description}
                        onChange={(e) => setOrderData(prev => ({ ...prev, description: e.target.value }))}
                        rows={6}
                        className="text-right resize-none"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2 rtl-text">
                        <Label>مهلت تحویل *</Label>
                        <Input
                          type="date"
                          value={orderData.deadline}
                          onChange={(e) => setOrderData(prev => ({ ...prev, deadline: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2 rtl-text">
                        <Label>اولویت پروژه</Label>
                        <Select 
                          value={orderData.priority} 
                          onValueChange={(value) => setOrderData(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">کم</SelectItem>
                            <SelectItem value="normal">متوسط</SelectItem>
                            <SelectItem value="high">بالا</SelectItem>
                            <SelectItem value="urgent">فوری</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Additional Services */}
                    <div className="space-y-4">
                      <Label className="rtl-text">خدمات اضافی</Label>
                      <div className="space-y-3">
                        {additionalServices.map((service) => (
                          <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={orderData.additionalServices.includes(service.id)}
                                onCheckedChange={(checked) => handleAdditionalServiceChange(service.id, checked as boolean)}
                              />
                              <div className="rtl-text">
                                <div className="font-medium">{service.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {service.price.toLocaleString('fa-IR')} تومان
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: File Upload */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="rtl-text">فایل‌های پروژه</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <div className="space-y-2 rtl-text">
                          <p className="text-muted-foreground">
                            فایل‌های خود را اینجا بکشید یا کلیک کنید
                          </p>
                          <p className="text-xs text-muted-foreground">
                            فرمت‌های مجاز: JPG, PNG, PDF, AI, PSD - حداکثر ۱۰ مگابایت
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf,.ai,.psd"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Uploaded Files */}
                    {orderData.attachments.length > 0 && (
                      <div className="space-y-3">
                        <Label className="rtl-text">فایل‌های آپلود شده</Label>
                        {orderData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium">{file.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile(index)}
                            >
                              حذف
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="rtl-text">روش پرداخت</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { id: 'online', title: 'پرداخت آنلاین', desc: 'با کارت بانکی' },
                          { id: 'transfer', title: 'واریز بانکی', desc: 'به حساب شرکت' },
                          { id: 'cash', title: 'نقدی', desc: 'هنگام تحویل' },
                          { id: 'installment', title: 'اقساطی', desc: 'پرداخت به اقساط' }
                        ].map((method) => (
                          <Card 
                            key={method.id}
                            className={`p-4 cursor-pointer transition-all ${
                              orderData.paymentMethod === method.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setOrderData(prev => ({ ...prev, paymentMethod: method.id }))}
                          >
                            <div className="rtl-text">
                              <div className="font-medium">{method.title}</div>
                              <div className="text-sm text-muted-foreground">{method.desc}</div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 rtl-text">
                      <Label>کد تخفیف</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="کد تخفیف خود را وارد کنید"
                          value={orderData.discountCode}
                          onChange={(e) => setOrderData(prev => ({ ...prev, discountCode: e.target.value }))}
                          className="text-right"
                        />
                        <Button variant="outline">اعمال</Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                    مرحله قبل
                  </Button>

                  {currentStep < 4 ? (
                    <Button onClick={nextStep}>
                      مرحله بعد
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  ) : (
                    <Button onClick={submitOrder} className="hover-scale glow">
                      ثبت سفارش
                      <CheckCircle className="w-4 h-4 mr-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Price Summary */}
            <Card className="glass sticky top-24">
              <CardHeader>
                <h3 className="font-semibold rtl-text">خلاصه سفارش</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 rtl-text">
                  <div className="flex justify-between">
                    <span>خدمت پایه:</span>
                    <span>{orderData.basePrice.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  
                  {orderData.additionalServices.map(serviceId => {
                    const service = additionalServices.find(s => s.id === serviceId);
                    return service ? (
                      <div key={serviceId} className="flex justify-between text-sm">
                        <span>{service.title}:</span>
                        <span>{service.price.toLocaleString('fa-IR')} تومان</span>
                      </div>
                    ) : null;
                  })}
                  
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>مجموع:</span>
                    <span className="gradient-text">{calculateTotal().toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground rtl-text">
                    <Shield className="w-4 h-4" />
                    <span>گارانتی کیفیت</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground rtl-text">
                    <Clock className="w-4 h-4" />
                    <span>تحویل به موقع</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground rtl-text">
                    <Star className="w-4 h-4" />
                    <span>پشتیبانی ۲۴ ساعته</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="space-y-4 rtl-text">
                <h3 className="font-semibold">نیاز به کمک دارید؟</h3>
                <p className="text-sm text-muted-foreground">
                  تیم پشتیبانی ما آماده کمک به شماست
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 ml-2" />
                    ۰۲۱-۱۲۳۴۵۶۷۸
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="w-4 h-4 ml-2" />
                    support@digichapograph.com
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Calendar,
  User,
  Building,
  FileText,
  CheckCircle,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import { toast } from 'sonner';
import { useBackend } from '../contexts/BackendContext';

export function Contact() {
  const { createContactMessage } = useBackend();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create contact message in backend
      await createContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `درخواست ${formData.service} از ${formData.company || 'مشتری'}`,
        message: `${formData.message}\n\nبودجه: ${formData.budget}\nشرکت: ${formData.company}`
      });
      
      toast.success('درخواست شما با موفقیت ارسال شد!', {
        description: 'ما در اسرع وقت با شما تماس خواهیم گرفت.',
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        budget: ''
      });
    } catch (error) {
      toast.error('خطا در ارسال درخواست', {
        description: 'لطفاً مجدداً تلاش کنید.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'تلفن تماس',
      content: '۰۲۱-۱۲۳۴۵۶۷۸',
      subtitle: 'پاسخگویی ۲۴ ساعته',
      color: 'from-green-500 to-emerald-600',
      action: 'tel:+982112345678'
    },
    {
      icon: Mail,
      title: 'ایمیل',
      content: 'info@digichapograph.com',
      subtitle: 'پاسخ در کمتر از ۲ ساعت',
      color: 'from-blue-500 to-cyan-600',
      action: 'mailto:info@digichapograph.com'
    },
    {
      icon: MapPin,
      title: 'آدرس',
      content: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      subtitle: 'مراجعه حضوری با هماهنگی قبلی',
      color: 'from-purple-500 to-pink-600',
      action: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: 'ساعات کاری',
      content: 'شنبه تا پنج‌شنبه',
      subtitle: '۸:۰۰ صبح تا ۶:۰۰ عصر',
      color: 'from-orange-500 to-red-600',
      action: null
    }
  ];

  const services = [
    'چاپ دیجیتال',
    'طراحی گرافیک',
    'بسته‌بندی',
    'تبلیغات',
    'عکاسی محصول',
    'طراحی دیجیتال',
    'مشاوره',
    'سایر'
  ];

  const budgetRanges = [
    'زیر ۵ میلیون تومان',
    '۵ تا ۱۰ میلیون تومان',
    '۱۰ تا ۲۰ میلیون تومان',
    '۲۰ تا ۵۰ میلیون تومان',
    'بالای ۵۰ میلیون تومان',
    'نیاز به مشاوره دارم'
  ];

  const socialLinks = [
    { icon: Instagram, label: 'اینستاگرام', href: '#', color: 'from-pink-500 to-purple-600' },
    { icon: Linkedin, label: 'لینکدین', href: '#', color: 'from-blue-600 to-blue-700' },
    { icon: Twitter, label: 'توییتر', href: '#', color: 'from-sky-400 to-blue-500' }
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 rtl-text">
          <Badge className="glass">
            <MessageCircle className="w-4 h-4 ml-2" />
            تماس با ما
          </Badge>
          <h2 className="text-4xl lg:text-5xl gradient-text">
            آماده شروع پروژه هستید؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            با ما در تماس باشید تا ایده‌هایتان را به واقعیت تبدیل کنیم
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold rtl-text">اطلاعات تماس</h3>
              
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="group hover-scale overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 rtl-text">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-full h-full text-white" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="font-semibold">{info.title}</h4>
                          {info.action ? (
                            <a 
                              href={info.action}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.content}</p>
                          )}
                          <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold rtl-text">شبکه‌های اجتماعی</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="group relative"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-full h-full text-white" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <Card className="glass">
              <CardContent className="p-6 rtl-text">
                <h4 className="font-semibold mb-4">چرا دیجی چاپوگراف؟</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">پاسخ در کمتر از ۲ ساعت</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">مشاوره رایگان</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">۱۵ سال تجربه</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">رضایت ۹۸٪ مشتریان</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <h3 className="text-2xl font-semibold rtl-text">درخواست پروژه</h3>
                <p className="text-muted-foreground rtl-text">
                  فرم زیر را تکمیل کنید تا بتوانیم بهترین راه‌حل را برای شما ارائه دهیم
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 rtl-text">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        نام و نام خانوادگی *
                      </Label>
                      <Input
                        id="name"
                        placeholder="نام خود را وارد کنید"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2 rtl-text">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        ایمیل *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="ایمیل خود را وارد کنید"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 rtl-text">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        شماره تماس *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2 rtl-text">
                      <Label htmlFor="company" className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        نام شرکت
                      </Label>
                      <Input
                        id="company"
                        placeholder="نام شرکت (اختیاری)"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="text-right"
                      />
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 rtl-text">
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        نوع خدمت *
                      </Label>
                      <Select 
                        value={formData.service} 
                        onValueChange={(value) => handleInputChange('service', value)}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="خدمت مورد نظر را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service, index) => (
                            <SelectItem key={index} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 rtl-text">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        بودجه تقریبی
                      </Label>
                      <Select 
                        value={formData.budget} 
                        onValueChange={(value) => handleInputChange('budget', value)}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="بودجه تقریبی خود را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range, index) => (
                            <SelectItem key={index} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 rtl-text">
                    <Label htmlFor="message" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      توضیحات پروژه *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="لطفاً جزئیات پروژه خود را شرح دهید..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      rows={5}
                      className="text-right resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="hover-scale glow group min-w-48"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin ml-2"></div>
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          ارسال درخواست
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <Card className="overflow-hidden">
            <div className="h-64 bg-muted relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center">
                <div className="text-center space-y-2 rtl-text">
                  <MapPin className="w-12 h-12 mx-auto text-primary" />
                  <h4 className="text-xl font-semibold">مکان ما روی نقشه</h4>
                  <p className="text-muted-foreground">تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
                  <Button variant="outline" className="mt-4">
                    مشاهده در نقشه
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
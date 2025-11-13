import { useNavigation, ServiceDetail } from '../../contexts/NavigationContext';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Clock, 
  Award,
  Download,
  Phone,
  Mail,
  Calculator,
  Image as ImageIcon,
  FileText,
  Target
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function ServiceDetailPage() {
  const { pageData, goBack, navigate } = useNavigation();
  const service = pageData as ServiceDetail;

  if (!service) {
    return <div>خدمت پیدا نشد</div>;
  }

  const packageFeatures = {
    basic: [
      'طراحی اولیه',
      'یک بار ویرایش',
      'فایل نهایی با کیفیت متوسط',
      'پشتیبانی ۷ روزه',
      'تحویل در ۵ روز کاری'
    ],
    premium: [
      'طراحی حرفه‌ای',
      'سه بار ویرایش',
      'فایل نهایی با کیفیت بالا',
      'پشتیبانی ۳۰ روزه',
      'تحویل در ۳ روز کاری',
      'مشاوره رایگان',
      'فایل‌های اضافی'
    ],
    enterprise: [
      'طراحی اختصاصی',
      'ویرایش نامحدود',
      'فایل نهایی با بالاترین کیفیت',
      'پشتیبانی ۹۰ روزه',
      'تحویل در ۲ روز کاری',
      'مشاوره تخصصی',
      'تمام فایل‌های منبع',
      'مدیر پروژه اختصاصی',
      'گارانتی رضایت'
    ]
  };

  const testimonials = [
    {
      name: 'احمد رضایی',
      company: 'شرکت تجاری آریا',
      rating: 5,
      comment: 'کیفیت کار بی‌نظیر و تحویل به موقع. کاملاً راضی هستم.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk4MjQ4NDJ8MA&ixlib=rb-4.1.0&q=80&w=150'
    },
    {
      name: 'سارا محمدی',
      company: 'استودیو طراحی نوین',
      rating: 5,
      comment: 'تیم حرفه‌ای و خلاق. نتیجه فراتر از انتظار بود.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTgyNDg0M3ww&ixlib=rb-4.1.0&q=80&w=150'
    }
  ];

  const relatedServices = [
    { title: 'طراحی لوگو', price: 'از ۲۰۰ هزار تومان' },
    { title: 'طراحی کارت ویزیت', price: 'از ۵۰ هزار تومان' },
    { title: 'طراحی بروشور', price: 'از ۱۵۰ هزار تومان' }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 rtl-text">
          <button onClick={goBack} className="hover:text-primary transition-colors">
            خانه
          </button>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <button onClick={() => navigate('services')} className="hover:text-primary transition-colors">
            خدمات
          </button>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-foreground">{service.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header */}
            <div className="space-y-6 rtl-text">
              <Badge className="glass">
                <Star className="w-4 h-4 ml-2" />
                خدمت پرطرفدار
              </Badge>
              <h1 className="text-4xl font-bold gradient-text">{service.title}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Gallery */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold rtl-text">نمونه کارها</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {service.gallery.map((image, index) => (
                  <Card key={index} className="overflow-hidden hover-scale group">
                    <div className="aspect-video relative overflow-hidden">
                      <ImageWithFallback
                        src={image}
                        alt={`نمونه کار ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Features & Benefits */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold rtl-text">ویژگی‌ها و مزایا</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {service.features.map((feature, index) => (
                  <Card key={index} className="p-6 hover-scale">
                    <div className="flex items-start gap-4 rtl-text">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature}</h3>
                        <p className="text-sm text-muted-foreground">
                          جزئیات بیشتر در مورد این ویژگی و نحوه کمک آن به پروژه شما
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold rtl-text">مشخصات فنی</h2>
              <Card className="p-6">
                <div className="space-y-4 rtl-text">
                  {service.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Process */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold rtl-text">فرآیند کار</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { step: '۱', title: 'مشاوره اولیه', desc: 'بررسی نیازها و اهداف' },
                  { step: '۲', title: 'طراحی مفهومی', desc: 'ایده‌پردازی و concept' },
                  { step: '۳', title: 'اجرا و تولید', desc: 'پیاده‌سازی نهایی' },
                  { step: '۴', title: 'تحویل و پشتیبانی', desc: 'تحویل کار و follow up' }
                ].map((item, index) => (
                  <Card key={index} className="p-6 text-center hover-scale">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">{item.step}</span>
                    </div>
                    <h3 className="font-semibold mb-2 rtl-text">{item.title}</h3>
                    <p className="text-sm text-muted-foreground rtl-text">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold rtl-text">نظرات مشتریان</h2>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-6 hover-scale">
                    <div className="flex items-start gap-4 rtl-text">
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <span className="text-sm text-muted-foreground">- {testimonial.company}</span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground">{testimonial.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Pricing Packages */}
            <Card className="glass sticky top-24">
              <CardHeader>
                <h3 className="text-xl font-semibold rtl-text">پکیج‌های قیمت</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(service.pricing).map(([type, price]) => (
                  <Card key={type} className={`p-4 border-2 ${type === 'premium' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <div className="space-y-4 rtl-text">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {type === 'basic' ? 'پایه' : type === 'premium' ? 'حرفه‌ای' : 'سازمانی'}
                        </h4>
                        {type === 'premium' && (
                          <Badge className="bg-primary text-primary-foreground">محبوب</Badge>
                        )}
                      </div>
                      <div className="text-2xl font-bold gradient-text">
                        {price.toLocaleString('fa-IR')} تومان
                      </div>
                      <ul className="space-y-2">
                        {packageFeatures[type as keyof typeof packageFeatures].map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full hover-scale"
                        variant={type === 'premium' ? 'default' : 'outline'}
                        onClick={() => navigate('order', { service: service.title, package: type, price })}
                      >
                        انتخاب پکیج
                      </Button>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold rtl-text">اقدامات سریع</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start rtl-text" size="sm">
                  <Calculator className="w-4 h-4 ml-2" />
                  محاسبه قیمت آنلاین
                </Button>
                <Button variant="outline" className="w-full justify-start rtl-text" size="sm">
                  <Download className="w-4 h-4 ml-2" />
                  دانلود نمونه کار
                </Button>
                <Button variant="outline" className="w-full justify-start rtl-text" size="sm">
                  <FileText className="w-4 h-4 ml-2" />
                  مشاهده پورتفولیو
                </Button>
              </div>
              <Separator />
              <div className="space-y-3">
                <Button className="w-full hover-scale glow group">
                  <Phone className="w-4 h-4 ml-2" />
                  تماس فوری
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 ml-2" />
                  ارسال پیام
                </Button>
              </div>
            </Card>

            {/* Related Services */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold rtl-text">خدمات مرتبط</h3>
              <div className="space-y-3">
                {relatedServices.map((relatedService, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <span className="text-sm rtl-text">{relatedService.title}</span>
                    <span className="text-xs text-muted-foreground">{relatedService.price}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="space-y-4 rtl-text">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm">پاسخگویی ۲۴ ساعته</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm">گارانتی کیفیت</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm">تحویل به موقع</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
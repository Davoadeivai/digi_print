import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  PrinterIcon, 
  Palette, 
  Package, 
  Megaphone, 
  Camera, 
  Monitor,
  ArrowLeft,
  Star,
  CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigation } from '../contexts/NavigationContext';

export function Services() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const { navigate } = useNavigation();

  const services = [
    {
      icon: PrinterIcon,
      title: 'چاپ دیجیتال',
      subtitle: 'چاپ با کیفیت بالا',
      description: 'چاپ انواع کاتالوگ، بروشور، پوستر، کارت ویزیت و ... با کیفیت فوق‌العاده و قیمت مناسب',
      features: ['چاپ رنگی و سیاه سفید', 'انواع کاغذ و متریال', 'تیراژ کم و زیاد', 'تحویل فوری'],
      image: 'https://images.unsplash.com/photo-1581508512961-0e3b9524db40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcHJpbnRpbmclMjBwcmVzcyUyMG1vZGVybnxlbnwxfHx8fDE3NTk4MjQ4MzN8MA&ixlib=rb-4.1.0&q=80&w=600',
      color: 'from-blue-500 to-purple-600',
      price: 'از ۵۰۰ تومان'
    },
    {
      icon: Palette,
      title: 'طراحی گرافیک',
      subtitle: 'خلاقیت بی‌حد و حصر',
      description: 'طراحی لوگو، هویت بصری، بسته‌بندی و تمام نیازهای گرافیکی شما توسط طراحان حرفه‌ای',
      features: ['طراحی لوگو و هویت بصری', 'طراحی بسته‌بندی', 'طراحی تبلیغاتی', 'ویرایش عکس'],
      image: 'https://images.unsplash.com/photo-1759158963837-ce2f1524b813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwd29ya3NwYWNlJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzU5NzI1NzkzfDA&ixlib=rb-4.1.0&q=80&w=600',
      color: 'from-purple-500 to-pink-600',
      price: 'از ۲۰۰ هزار تومان'
    },
    {
      icon: Package,
      title: 'بسته‌بندی',
      subtitle: 'حرفه‌ای و جذاب',
      description: 'طراحی و تولید انواع بسته‌بندی محصولات با کیفیت بالا و طراحی منحصر به فرد',
      features: ['طراحی جعبه', 'چاپ روی بسته‌بندی', 'مواد مختلف', 'سفارشی‌سازی کامل'],
      image: 'https://images.unsplash.com/photo-1668775589972-3aa874ea191b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMHBhY2thZ2luZyUyMGRlc2lnbnxlbnwxfHx8fDE3NTk4MjQ4Mzl8MA&ixlib=rb-4.1.0&q=80&w=600',
      color: 'from-green-500 to-emerald-600',
      price: 'از ۱۵۰ هزار تومان'
    },
    {
      icon: Megaphone,
      title: 'تبلیغات',
      subtitle: 'بازاریابی موثر',
      description: 'طراحی و اجرای کمپین‌های تبلیغاتی، بنر، استند و تابلوهای تبلیغاتی',
      features: ['طراحی بنر', 'تابلو و استند', 'تبلیغات محیطی', 'کمپین‌های دیجیتال'],
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlcnRpc2luZyUyMGJhbm5lcnxlbnwxfHx8fDE3NTk4MjQ4NDV8MA&ixlib=rb-4.1.0&q=80&w=600',
      color: 'from-orange-500 to-red-600',
      price: 'از ۳۰۰ هزار تومان'
    },
    {
      icon: Camera,
      title: 'عکاسی محصول',
      subtitle: 'کیفیت حرفه‌ای',
      description: 'عکاسی محصولات برای کاتالوگ، وب‌سایت و شبکه‌های اجتماعی با کیفیت استودیویی',
      features: ['عکاسی استودیویی', 'ویرایش و روتوش', 'پس‌زمینه‌های مختلف', 'عکس ۳۶۰ درجه'],
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU5ODI0ODQ2fDA&ixlib=rb-4.1.0&q=80&w=600',
      color: 'from-teal-500 to-cyan-600',
      price: 'از ۱۰۰ هزار تومان'
    },
    {
      icon: Monitor,
      title: 'طراحی دیجیتال',
      subtitle: 'وب و موبایل',
      description: 'طراحی رابط کاربری، وب‌سایت، اپلیکیشن موبایل و محتوای دیجیتال',
      features: ['طراحی UI/UX', 'طراحی وب‌سایت', 'اپلیکیشن موبایل', 'محتوای دیجیتال'],
      image: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBsYXB0b3B8ZW58MXx8fHwxNzU5ODI0ODQ3fDA&ixlib=rb-4.1.0&q=80&w=600',
      color: 'from-indigo-500 to-purple-600',
      price: 'از ۵۰۰ هزار تومان'
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 rtl-text">
          <Badge className="glass">
            <Star className="w-4 h-4 ml-2" />
            خدمات ما
          </Badge>
          <h2 className="text-4xl lg:text-5xl gradient-text">
            خدمات کامل و حرفه‌ای
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            از ایده تا اجرا، تمام نیازهای چاپ و طراحی شما را با کیفیت بی‌نظیر پوشش می‌دهیم
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredService === index;
            
            return (
              <Card 
                key={index}
                className="group relative overflow-hidden hover-scale cursor-pointer h-full"
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {service.price}
                    </Badge>
                  </div>
                  <div className="space-y-2 rtl-text mt-4">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-6 rtl-text">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className="flex items-center gap-2 text-sm"
                        style={{
                          opacity: isHovered ? 1 : 0.7,
                          transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
                          transition: `all 0.3s ease ${featureIndex * 0.1}s`
                        }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group/btn hover:border-primary hover:text-primary"
                      onClick={() => navigate('service-detail', {
                        id: service.title.toLowerCase().replace(/\s+/g, '-'),
                        title: service.title,
                        description: service.description,
                        features: service.features,
                        pricing: {
                          basic: 200000,
                          premium: 500000,
                          enterprise: 1000000
                        },
                        gallery: [service.image, service.image, service.image, service.image],
                        specifications: [
                          'کیفیت بالای چاپ و طراحی',
                          'استفاده از جدیدترین تکنولوژی',
                          'پشتیبانی کامل پس از تحویل',
                          'گارانتی کیفیت محصولات'
                        ]
                      })}
                    >
                      مشاهده جزئیات
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-colors duration-300"></div>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center space-y-6">
          <Card className="max-w-4xl mx-auto p-8 glass">
            <div className="space-y-4 rtl-text">
              <h3 className="text-2xl font-semibold">خدمت خاصی نیاز دارید؟</h3>
              <p className="text-muted-foreground">
                تیم ما آماده ارائه راه‌حل‌های سفارشی برای نیازهای منحصر به فرد شماست
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="hover-scale glow group"
                  onClick={() => navigate('contact')}
                >
                  مشاوره رایگان
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="hover-scale"
                  onClick={() => navigate('portfolio')}
                >
                  مشاهده نمونه کارها
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
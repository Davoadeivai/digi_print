import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Linkedin, 
  Twitter,
  Send,
  ArrowUp,
  Heart,
  Star,
  Award,
  Users,
  CheckCircle
} from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'خانه', href: '#home' },
    { label: 'درباره ما', href: '#about' },
    { label: 'خدمات', href: '#services' },
    { label: 'نمونه کارها', href: '#portfolio' },
    { label: 'تماس با ما', href: '#contact' }
  ];

  const services = [
    { label: 'چاپ دیجیتال', href: '#' },
    { label: 'طراحی گرافیک', href: '#' },
    { label: 'بسته‌بندی', href: '#' },
    { label: 'تبلیغات', href: '#' },
    { label: 'عکاسی محصول', href: '#' },
    { label: 'طراحی دیجیتال', href: '#' }
  ];

  const socialLinks = [
    { 
      icon: Instagram, 
      label: 'اینستاگرام', 
      href: '#', 
      color: 'from-pink-500 to-purple-600',
      followers: '۲۵K'
    },
    { 
      icon: Linkedin, 
      label: 'لینکدین', 
      href: '#', 
      color: 'from-blue-600 to-blue-700',
      followers: '۵K'
    },
    { 
      icon: Twitter, 
      label: 'توییتر', 
      href: '#', 
      color: 'from-sky-400 to-blue-500',
      followers: '۸K'
    }
  ];

  const stats = [
    { icon: Users, number: '۲۵۰۰+', label: 'مشتری راضی' },
    { icon: Award, number: '۱۵+', label: 'سال تجربه' },
    { icon: Star, number: '۹۸٪', label: 'رضایت مندی' },
    { icon: CheckCircle, number: '۵۰۰+', label: 'پروژه موفق' }
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}>
        </div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-white/10">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto glass border-white/20">
              <div className="p-8 text-center space-y-6">
                <div className="space-y-4 rtl-text">
                  <Badge className="glass">
                    <Send className="w-4 h-4 ml-2" />
                    خبرنامه
                  </Badge>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">
                    از آخرین اخبار و تخفیف‌ها باخبر باشید
                  </h3>
                  <p className="text-white/70 max-w-2xl mx-auto">
                    عضو خبرنامه ما شوید تا از جدیدترین خدمات، نمونه کارها و تخفیف‌های ویژه مطلع شوید
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input 
                    placeholder="ایمیل خود را وارد کنید"
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-right"
                  />
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none">
                    <Send className="w-4 h-4 ml-2" />
                    عضویت
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="space-y-4 rtl-text">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">DG</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">دیجی چاپوگراف</h3>
                      <p className="text-white/60 text-sm">چاپ و گرافیک دیجیتال</p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 leading-relaxed">
                    پیشرو در صنعت چاپ و طراحی گرافیک با بیش از ۱۵ سال تجربه در ارائه خدمات با کیفیت جهانی
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <IconComponent className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                        <div className="text-white font-bold text-lg">{stat.number}</div>
                        <div className="text-white/60 text-xs">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6 rtl-text">
                <h4 className="text-lg font-semibold text-white">دسترسی سریع</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-white/70 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div className="space-y-6 rtl-text">
                <h4 className="text-lg font-semibold text-white">خدمات ما</h4>
                <ul className="space-y-3">
                  {services.map((service, index) => (
                    <li key={index}>
                      <a 
                        href={service.href}
                        className="text-white/70 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block"
                      >
                        {service.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Social */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white rtl-text">تماس با ما</h4>
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/70">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <span>info@digichapograph.com</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/70">
                    <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                    <span className="rtl-text">تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <h5 className="text-white font-medium rtl-text">شبکه‌های اجتماعی</h5>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <div key={index} className="group relative">
                          <a
                            href={social.href}
                            className="block"
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="w-full h-full text-white" />
                            </div>
                          </a>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {social.followers}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-white/60 text-sm rtl-text">
                <span>© ۱۴۰۲ دیجی چاپوگراف. تمام حقوق محفوظ است.</span>
                <span className="hidden md:inline">|</span>
                <span className="flex items-center gap-1">
                  ساخته شده با
                  <Heart className="w-4 h-4 text-red-500" />
                  توسط تیم دیجی چاپوگراف
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex gap-4 text-sm text-white/60">
                  <a href="#" className="hover:text-white transition-colors">حریم خصوصی</a>
                  <a href="#" className="hover:text-white transition-colors">شرایط استفاده</a>
                  <a href="#" className="hover:text-white transition-colors">سوالات متداول</a>
                </div>
                
                <Button
                  onClick={scrollToTop}
                  size="icon"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl float-animation"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-500/10 rounded-full blur-xl float-animation" style={{ animationDelay: '2s' }}></div>
    </footer>
  );
}
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Send,
  ArrowUp,
  Heart,
  CreditCard,
  ShieldCheck,
  Globe,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('با تشکر! شما در خبرنامه عضو شدید.');
    setEmail('');
  };

  const quickLinks = [
    { label: 'صفحه اصلی', href: '/' },
    { label: 'محصولات ما', href: '/products' },
    { label: 'درباره ما', href: '/about' },
    { label: 'تماس با ما', href: '/contact' },
    { label: 'قوانین و مقررات', href: '/terms' },
  ];

  const services = [
    { label: 'چاپ دیجیتال فوری', href: '/products?type=digital' },
    { label: 'چاپ افست تیراژ بالا', href: '/products?type=offset' },
    { label: 'طراحی بسته بندی', href: '/services/packaging' },
    { label: 'چاپ لیبل و استیکر', href: '/category/label' },
    { label: 'کارت ویزیت لوکس', href: '/category/card' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-700' },
  ];

  return (
    <footer className="relative bg-[#0f1016] text-white pt-20 overflow-hidden font-sans border-t border-white/5">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Newsletter Section - Premium Glass Card */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden group">
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-xl shadow-purple-900/20">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                عضویت در خبرنامه ویژه
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm md:text-base">
                با عضویت در خبرنامه، از آخرین تخفیف‌ها، مقالات آموزشی و محصولات جدید زودتر از دیگران مطلع شوید.
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    type="email"
                    placeholder="ایمیل خود را وارد کنید..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-purple-500 h-12 rounded-xl transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all text-base"
                >
                  عضویت
                  <Send className="w-4 h-4 mr-2 rotate-180" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="font-bold text-lg">DG</span>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                چاپوگراف
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              اولین و بزرگترین پلتفرم چاپ آنلاین در ایران. ما کیفیت، سرعت و قیمت مناسب را تضمین می‌کنیم. ایده‌های خود را با ما به واقعیت تبدیل کنید.
            </p>
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-white/10 hover:scale-110 ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-500" />
              دسترسی سریع
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 text-sm group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-purple-500 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-pink-500" />
              خدمات مشتریان
            </h4>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index}>
                  <a href={service.href} className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 text-sm group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-pink-500 transition-colors" />
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-500" />
              اطلاعات تماس
            </h4>

            <div className="space-y-4">
              <a href="tel:02112345678" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group p-3 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="text-xs text-gray-500 mb-0.5">شماره تماس</div>
                  <span className="font-bold dir-ltr block">۰۲۱-۱۲۳۴۵۶۷۸</span>
                </div>
              </a>

              <div className="flex items-center gap-4 text-gray-400 group p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="text-xs text-gray-500 mb-0.5">ساعات کاری</div>
                  <span className="font-bold">شنبه تا چهارشنبه ۸:۰۰ - ۱۷:۰۰</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-400 group p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="text-xs text-gray-500 mb-0.5">آدرس دفتر مرکزی</div>
                  <span className="font-bold">تهران، خیابان انقلاب، پلاک ۱۱۰</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
          <div className="text-sm text-gray-500 text-center md:text-right">
            © {new Date().getFullYear()} تمامی حقوق برای <span className="text-white font-medium">دیجی چاپوگراف</span> محفوظ است.
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">پرداخت امن</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">نماد اعتماد</span>
            </div>
          </div>

          <Button
            onClick={scrollToTop}
            size="icon"
            variant="ghost"
            className="rounded-full bg-white/5 text-white hover:bg-purple-600 hover:text-white transition-all absolute left-4 bottom-4 md:static"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
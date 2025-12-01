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
    { icon: CheckCircle, number: '۱۵۰۰+', label: 'پروژه تکمیل شده' },
    { icon: Award, number: '۱۵+', label: 'جایزه طراحی' },
    { icon: Star, number: '۴.۹', label: 'امتیاز مشتریان' }
  ];

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Social */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              دیجی چاپوگراف
            </h3>
            <p className="text-slate-400 leading-relaxed">
              ارائه دهنده خدمات چاپ و طراحی با بالاترین کیفیت و بهترین قیمت. ما به شما کمک می‌کنیم تا دیده شوید.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative inline-block">
              دسترسی سریع
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-purple-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:w-3 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative inline-block">
              خدمات ما
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-pink-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href={service.href} className="text-slate-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                    <CheckCircle className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative inline-block">
              آمار ما
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h4>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/10">
                    <stat.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
            <span>© ۱۴۰۲ دیجی چاپوگراف. تمام حقوق محفوظ است.</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="flex items-center gap-1">
              ساخته شده با
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              توسط تیم دیجی چاپوگراف
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">حریم خصوصی</a>
              <a href="#" className="hover:text-white transition-colors">شرایط استفاده</a>
              <a href="#" className="hover:text-white transition-colors">سوالات متداول</a>
            </div>

            <Button
              onClick={scrollToTop}
              size="icon"
              variant="outline"
              className="rounded-full border-white/20 text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl float-animation pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl float-animation pointer-events-none" style={{ animationDelay: '2s' }}></div>
    </footer>
  );
}
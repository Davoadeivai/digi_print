import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { PriceCalculator } from '../PriceCalculator';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  ArrowRight,
  Calculator,
  Phone,
  Mail,
  MessageCircle,
  TrendingUp,
  Clock,
  Shield,
  Award
} from 'lucide-react';

export default function PriceCalculatorPage() {
  const { navigate, goBack } = useNavigation();

  const handleAddToOrder = (calculatedData: any) => {
    // هدایت به صفحه سفارش با داده‌های محاسبه شده
    navigate('order', {
      calculatedPrice: calculatedData
    });
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
            <span className="text-foreground">محاسبه قیمت</span>
          </div>
          
          <div className="text-center space-y-4 rtl-text mb-8">
            <Badge className="glass">
              <Calculator className="w-4 h-4 ml-2" />
              ماشین حساب قیمت
            </Badge>
            <h1 className="text-4xl font-bold gradient-text">محاسبه آنلاین قیمت چاپ</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              با وارد کردن مشخصات پروژه خود، قیمت تقریبی را به صورت آنی دریافت کنید
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: TrendingUp, title: 'محاسبه دقیق', desc: 'بر اساس فرمول‌های استاندارد' },
              { icon: Clock, title: 'سریع و آسان', desc: 'در چند ثانیه' },
              { icon: Shield, title: 'قیمت شفاف', desc: 'بدون هزینه پنهان' },
              { icon: Award, title: 'تخفیف تیراژ', desc: 'تا 30% تخفیف' }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="glass">
                  <CardContent className="p-4 text-center space-y-2 rtl-text">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.desc}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <PriceCalculator onAddToOrder={handleAddToOrder} showAddToOrder={true} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Table Guide */}
            <Card className="glass">
              <CardContent className="p-6 space-y-4 rtl-text">
                <h3 className="font-semibold text-lg">راهنمای قیمت‌گذاری</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium mb-2">📏 اندازه کاغذ</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• A4: محبوب‌ترین اندازه</div>
                      <div>• A5: نیم A4 (کتاب، بروشور)</div>
                      <div>• A3: دو برابر A4 (پوستر)</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium mb-2">📄 نوع کاغذ</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• گلاسه: براق و با کیفیت</div>
                      <div>• تحریر: مناسب نوشتن</div>
                      <div>• کارتن: ضخیم و محکم</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium mb-2">⚖️ گرماژ</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• 80-100 گرم: معمولی</div>
                      <div>• 120-150 گرم: استاندارد</div>
                      <div>• 200-300 گرم: کارت ویزیت</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium mb-2">🎨 رنگ</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• سیاه و سفید: ارزان‌تر</div>
                      <div>• CMYK: چاپ رنگی استاندارد</div>
                      <div>• رنگ اختصاصی: کیفیت بالاتر</div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium mb-2 text-green-700">💰 تخفیف تیراژ</div>
                    <div className="text-xs text-green-600 space-y-1">
                      <div>• 100+ : 5% تخفیف</div>
                      <div>• 500+ : 10% تخفیف</div>
                      <div>• 1000+ : 15% تخفیف</div>
                      <div>• 5000+ : 25% تخفیف</div>
                      <div>• 10000+ : 30% تخفیف</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="glass bg-gradient-to-br from-primary/10 to-purple-500/10">
              <CardContent className="p-6 space-y-4 rtl-text">
                <h3 className="font-semibold">نیاز به مشاوره دارید؟</h3>
                <p className="text-sm text-muted-foreground">
                  تیم ما آماده است تا در انتخاب بهترین گزینه به شما کمک کند
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 ml-2" />
                    ۰۲۱-۱۲۳۴۵۶۷۸
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="w-4 h-4 ml-2" />
                    info@digichapograph.com
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 ml-2" />
                    پشتیبانی آنلاین
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Order */}
            <Card className="glass">
              <CardContent className="p-6 space-y-4 rtl-text">
                <h3 className="font-semibold">سفارش سریع</h3>
                <p className="text-sm text-muted-foreground">
                  آیا از قیمت راضی هستید؟ همین الان سفارش دهید!
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('order')}
                >
                  ثبت سفارش
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Common Sizes Quick Reference */}
        <Card className="glass mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 rtl-text">محصولات پرکاربرد</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'کارت ویزیت',
                  specs: 'A6 - کارتن 300 گرم - سلفون مات',
                  price: 'از 50,000 تومان (500 عدد)'
                },
                {
                  title: 'تراکت A5',
                  specs: 'A5 - گلاسه 120 گرم - چاپ دورو',
                  price: 'از 80,000 تومان (1000 عدد)'
                },
                {
                  title: 'پوستر A3',
                  specs: 'A3 - گلاسه 150 گرم - CMYK',
                  price: 'از 120,000 تومان (100 عدد)'
                },
                {
                  title: 'کاتالوگ A4',
                  specs: 'A4 - گلاسه 150 گرم - چاپ رنگی',
                  price: 'از 200,000 تومان (200 عدد)'
                },
                {
                  title: 'بروشور A4',
                  specs: 'A4 - مات 120 گرم - طلاکوب',
                  price: 'از 300,000 تومان (500 عدد)'
                },
                {
                  title: 'فلایر A6',
                  specs: 'A6 - تحریر 100 گرم - یک‌رو',
                  price: 'از 30,000 تومان (500 عدد)'
                }
              ].map((product, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 space-y-2 rtl-text">
                    <h4 className="font-semibold">{product.title}</h4>
                    <p className="text-xs text-muted-foreground">{product.specs}</p>
                    <div className="text-sm text-primary font-medium">{product.price}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

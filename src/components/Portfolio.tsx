import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Filter, 
  Eye, 
  Heart, 
  Share2,
  ArrowLeft,
  Star
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigation } from '../contexts/NavigationContext';

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('همه');
  const { navigate } = useNavigation();

  const filters = [
    'همه',
    'طراحی گرافیک',
    'چاپ دیجیتال',
    'بسته‌بندی',
    'تبلیغات',
    'عکاسی',
    'طراحی دیجیتال'
  ];

  const portfolioItems = [
    {
      id: 'brand-identity-tech',
      title: 'هویت بصری شرکت تکنولوژی پیشرو',
      category: 'طراحی گرافیک',
      client: 'شرکت تکنولوژی پیشرو',
      year: '۱۴۰۲',
      image: 'https://images.unsplash.com/photo-1670341445726-8a9f4169da8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGxvZ28lMjBkZXNpZ258ZW58MXx8fHwxNzU5ODI2NzI3fDA&ixlib=rb-4.1.0&q=80&w=600',
      description: 'طراحی هویت بصری کامل برای یک شرکت فناوری پیشرو شامل لوگو، کارت ویزیت، سربرگ و راهنمای استفاده از برند',
      challenge: 'ایجاد هویت بصری مدرن و قابل اعتماد که نشان‌دهنده پیشرفت و نوآوری در حوزه فناوری باشد',
      solution: 'استفاده از طراحی مینیمال با رنگ‌های آبی و خاکستری، تایپوگرافی مدرن و عناصر بصری که حس فناوری و پیشرفت را منتقل می‌کند',
      result: 'افزایش ۴۰٪ در شناخت برند و بهبود تصویر حرفه‌ای شرکت در بازار',
      tags: ['برندینگ', 'لوگو', 'هویت بصری', 'فناوری'],
      images: [
        'https://images.unsplash.com/photo-1670341445726-8a9f4169da8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGxvZ28lMjBkZXNpZ258ZW58MXx8fHwxNzU5ODI2NzI3fDA&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjBkZXNpZ24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1717994818194-c5a474939403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludCUyMGNhdGFsb2clMjBicm9jaHVyZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1626253934161-08cfea22e968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBib3h8ZW58MXx8fHwxNzU5ODQyMzg4fDA&ixlib=rb-4.1.0&q=80&w=800'
      ],
      featured: true,
      likes: 127,
      views: 1834
    },
    {
      id: 'product-catalog',
      title: 'کاتالوگ محصولات شرکت صنعتی',
      category: 'چاپ دیجیتال',
      client: 'گروه صنعتی آریا',
      year: '۱۴۰۲',
      image: 'https://images.unsplash.com/photo-1717994818194-c5a474939403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludCUyMGNhdGFsb2clMjBicm9jaHVyZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=600',
      description: 'طراحی و چاپ کاتالوگ ۱۰۰ صفحه‌ای محصولات صنعتی با کیفیت بالا و طراحی حرفه‌ای',
      challenge: 'نمایش بیش از ۲۰۰ محصول صنعتی به شکلی جذاب و سازمان‌یافته که خواندن و یافتن محصولات آسان باشد',
      solution: 'استفاده از سیستم شبکه‌بندی منظم، تصاویر با کیفیت بالا، رنگ‌بندی مناسب و ایجاد ایندکس کامل',
      result: 'افزایش ۶۰٪ در فروش محصولات و بهبود تجربه مشتریان در انتخاب محصولات',
      tags: ['کاتالوگ', 'چاپ', 'محصولات صنعتی', 'طراحی'],
      images: [
        'https://images.unsplash.com/photo-1717994818194-c5a474939403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludCUyMGNhdGFsb2clMjBicm9jaHVyZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=800',
        'https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjBkZXNpZ24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=800'
      ],
      featured: false,
      likes: 89,
      views: 1245
    },
    {
      id: 'luxury-packaging',
      title: 'بسته‌بندی لوکس محصولات آرایشی',
      category: 'بسته‌بندی',
      client: 'برند زیبایی گلدن',
      year: '۱۴۰۱',
      image: 'https://images.unsplash.com/photo-1626253934161-08cfea22e968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBib3h8ZW58MXx8fHwxNzU5ODQyMzg4fDA&ixlib=rb-4.1.0&q=80&w=600',
      description: 'طراحی و تولید بسته‌بندی لوکس برای مجموعه محصولات آرایشی با استفاده از مواد درجه یک',
      challenge: 'ایجاد بسته‌بندی که احساس لوکس و کیفیت را منتقل کند و در عین حال عملکرد مناسبی داشته باشد',
      solution: 'استفاده از طلاکوب، UV لک، کاغذ با کیفیت بالا و طراحی مینیمال با عناصر طلایی',
      result: 'افزایش ۷۵٪ در فروش محصولات و کسب جایزه بهترین بسته‌بندی سال',
      tags: ['بسته‌بندی', 'لوکس', 'آرایشی', 'طلاکوب'],
      images: [
        'https://images.unsplash.com/photo-1626253934161-08cfea22e968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBib3h8ZW58MXx8fHwxNzU5ODQyMzg4fDA&ixlib=rb-4.1.0&q=80&w=800'
      ],
      featured: true,
      likes: 156,
      views: 2103
    },
    {
      id: 'restaurant-branding',
      title: 'برندینگ کامل رستوران',
      category: 'طراحی گرافیک',
      client: 'رستوران سنتی کوهستان',
      year: '۱۴۰۲',
      image: 'https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjBkZXNpZ24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=600',
      description: 'طراحی کامل هویت بصری رستوران شامل لوگو، منو، یونیفرم، تابلو و تمام مواد تبلیغاتی',
      challenge: 'ایجاد هویت بصری که حس سنتی و گرم خانواده را منتقل کند و در عین حال مدرن باشد',
      solution: 'ترکیب عناصر سنتی ایرانی با طراحی مدرن، استفاده از رنگ‌های گرم و تایپوگرافی مناسب',
      result: 'افزایش ۵۰٪ در تعداد مشتریان و کسب عنوان بهترین طراحی رستوران سال',
      tags: ['رستوران', 'برندینگ', 'سنتی', 'منو'],
      images: [
        'https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjBkZXNpZ24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=800'
      ],
      featured: false,
      likes: 94,
      views: 1567
    }
  ];

  const filteredItems = activeFilter === 'همه' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const featuredItems = portfolioItems.filter(item => item.featured);

  const handleItemClick = (item: any) => {
    navigate('portfolio-detail', item);
  };

  return (
    <section id="portfolio" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 rtl-text">
          <Badge className="glass">
            <Star className="w-4 h-4 ml-2" />
            نمونه کارها
          </Badge>
          <h2 className="text-4xl lg:text-5xl gradient-text">
            پورتفولیوی ما
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            مجموعه‌ای از بهترین پروژه‌هایی که با افتخار برای مشتریانمان اجرا کرده‌ایم
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8 rtl-text">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <h3 className="text-2xl font-semibold">پروژه‌های ویژه</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="group overflow-hidden hover-scale cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                      <Button size="icon" variant="secondary" className="glass">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="glass">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="glass">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-primary">ویژه</Badge>
                </div>
                <CardContent className="p-6 rtl-text">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-sm text-muted-foreground">{item.year}</span>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {item.views.toLocaleString('fa-IR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {item.likes.toLocaleString('fa-IR')}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="group/btn">
                        مشاهده
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6 rtl-text">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">فیلتر بر اساس دسته:</span>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className="hover-scale"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden hover-scale cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative aspect-video overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Button size="icon" variant="secondary" className="glass">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="glass">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {item.featured && (
                  <Badge className="absolute top-4 right-4 bg-primary">ویژه</Badge>
                )}
              </div>
              <CardContent className="p-6 rtl-text">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{item.category}</Badge>
                    <span className="text-sm text-muted-foreground">{item.year}</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views.toLocaleString('fa-IR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {item.likes.toLocaleString('fa-IR')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover-scale">
            مشاهده بیشتر
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid md:grid-cols-4 gap-8">
          {[
            { number: '۵۰۰+', label: 'پروژه تکمیل شده' },
            { number: '۲۰۰+', label: 'مشتری راضی' },
            { number: '۵۰+', label: 'جایزه دریافتی' },
            { number: '۱۵+', label: 'سال تجربه' }
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-3xl font-bold gradient-text">{stat.number}</div>
              <div className="text-muted-foreground rtl-text">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
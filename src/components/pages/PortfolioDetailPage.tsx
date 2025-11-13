import { useState } from 'react';
import { useNavigation, PortfolioDetail } from '../../contexts/NavigationContext';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  ArrowRight, 
  Calendar, 
  User, 
  Building,
  Target,
  Lightbulb,
  TrendingUp,
  Share2,
  Heart,
  Eye,
  Download,
  ArrowLeft
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function PortfolioDetailPage() {
  const { pageData, goBack, navigate } = useNavigation();
  const portfolio = pageData as PortfolioDetail;
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!portfolio) {
    return <div>پروژه پیدا نشد</div>;
  }

  const projectStats = [
    { label: 'مدت اجرا', value: '۲ ماه', icon: Calendar },
    { label: 'تیم پروژه', value: '۵ نفر', icon: User },
    { label: 'نوع پروژه', value: portfolio.category, icon: Building },
    { label: 'سال', value: portfolio.year, icon: Target }
  ];

  const relatedProjects = [
    {
      title: 'پروژه مشابه ۱',
      image: 'https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjBkZXNpZ24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=400',
      category: 'طراحی گرافیک'
    },
    {
      title: 'پروژه مشابه ۲',
      image: 'https://images.unsplash.com/photo-1670341445726-8a9f4169da8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGxvZ28lMjBkZXNpZ258ZW58MXx8fHwxNzU5ODI2NzI3fDA&ixlib=rb-4.1.0&q=80&w=400',
      category: 'برندینگ'
    },
    {
      title: 'پروژه مشابه ۳',
      image: 'https://images.unsplash.com/photo-1717994818194-c5a474939403?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmludCUyMGNhdGFsb2clMjBicm9jaHVyZXxlbnwxfHx8fDE3NTk4NDIzODd8MA&ixlib=rb-4.1.0&q=80&w=400',
      category: 'چاپ'
    }
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
          <button onClick={() => navigate('portfolio')} className="hover:text-primary transition-colors">
            نمونه کارها
          </button>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-foreground">{portfolio.title}</span>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Main Image Gallery */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <ImageWithFallback
                  src={portfolio.images[selectedImage]}
                  alt={portfolio.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="glass"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="icon" variant="secondary" className="glass">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {portfolio.images.map((image, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden cursor-pointer hover-scale transition-all ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="aspect-square">
                    <ImageWithFallback
                      src={image}
                      alt={`تصویر ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-8">
            <div className="space-y-4 rtl-text">
              <Badge className="glass">{portfolio.category}</Badge>
              <h1 className="text-3xl font-bold gradient-text">{portfolio.title}</h1>
              <p className="text-muted-foreground leading-relaxed">
                {portfolio.description}
              </p>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4">
              {projectStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="p-4 text-center">
                    <IconComponent className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm text-muted-foreground rtl-text">{stat.label}</div>
                    <div className="font-semibold rtl-text">{stat.value}</div>
                  </Card>
                );
              })}
            </div>

            {/* Client Info */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <div className="space-y-4 rtl-text">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  اطلاعات کارفرما
                </h3>
                <div>
                  <div className="font-medium">{portfolio.client}</div>
                  <div className="text-sm text-muted-foreground">نام شرکت/سازمان</div>
                </div>
                <div>
                  <div className="font-medium">{portfolio.year}</div>
                  <div className="text-sm text-muted-foreground">سال اجرا</div>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <div className="space-y-3">
              <h4 className="font-semibold rtl-text">تگ‌ها</h4>
              <div className="flex flex-wrap gap-2">
                {portfolio.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="hover-scale cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full hover-scale glow group">
                درخواست پروژه مشابه
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 ml-2" />
                دانلود کیس استادی
              </Button>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Challenge */}
            <Card className="p-8">
              <div className="space-y-6 rtl-text">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">چالش پروژه</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {portfolio.challenge}
                </p>
              </div>
            </Card>

            {/* Solution */}
            <Card className="p-8">
              <div className="space-y-6 rtl-text">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">راه‌حل ارائه شده</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {portfolio.solution}
                </p>
              </div>
            </Card>

            {/* Results */}
            <Card className="p-8">
              <div className="space-y-6 rtl-text">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">نتایج حاصله</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {portfolio.result}
                </p>
              </div>
            </Card>

            {/* Process Timeline */}
            <Card className="p-8">
              <div className="space-y-6 rtl-text">
                <h2 className="text-2xl font-semibold">مراحل اجرای پروژه</h2>
                <div className="space-y-6">
                  {[
                    { step: '۱', title: 'تحقیق و تحلیل', desc: 'بررسی نیازها و تحلیل رقبا', status: 'completed' },
                    { step: '۲', title: 'مفهوم‌سازی', desc: 'ایده‌پردازی و طراحی مفهومی', status: 'completed' },
                    { step: '۳', title: 'طراحی اولیه', desc: 'ایجاد طرح‌های اولیه', status: 'completed' },
                    { step: '۴', title: 'بازبینی و بهبود', desc: 'اعمال نظرات و بهینه‌سازی', status: 'completed' },
                    { step: '۵', title: 'تولید نهایی', desc: 'آماده‌سازی فایل‌های نهایی', status: 'completed' },
                    { step: '۶', title: 'تحویل و پشتیبانی', desc: 'تحویل پروژه و ارائه پشتیبانی', status: 'completed' }
                  ].map((phase, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{phase.step}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{phase.title}</h3>
                        <p className="text-sm text-muted-foreground">{phase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Metrics */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 rtl-text">آمار پروژه</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rtl-text">
                  <span className="text-sm text-muted-foreground">بازدید</span>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">۱,۲۳۴</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rtl-text">
                  <span className="text-sm text-muted-foreground">پسندیده‌ها</span>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">۸۹</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rtl-text">
                  <span className="text-sm text-muted-foreground">اشتراک‌گذاری</span>
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">۲۳</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Related Projects */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 rtl-text">پروژه‌های مشابه</h3>
              <div className="space-y-4">
                {relatedProjects.map((project, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 rtl-text">
                      <h4 className="text-sm font-medium">{project.title}</h4>
                      <p className="text-xs text-muted-foreground">{project.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact CTA */}
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <div className="space-y-4 rtl-text">
                <h3 className="font-semibold">پروژه مشابهی در نظر دارید؟</h3>
                <p className="text-sm text-white/90">
                  با تیم ما در تماس باشید تا بهترین راه‌حل را برای شما ارائه دهیم
                </p>
                <Button variant="secondary" className="w-full">
                  شروع پروژه جدید
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Palette, 
  PrinterIcon, 
  Lightbulb, 
  Users, 
  Target, 
  Trophy,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigation } from '../contexts/NavigationContext';

export function About() {
  const [activeTab, setActiveTab] = useState('story');
  const { navigate } = useNavigation();

  const tabs = [
    { id: 'story', label: 'داستان ما', icon: Lightbulb },
    { id: 'mission', label: 'ماموریت', icon: Target },
    { id: 'team', label: 'تیم ما', icon: Users },
    { id: 'achievements', label: 'دستاوردها', icon: Trophy }
  ];

  const features = [
    {
      icon: Palette,
      title: 'طراحی خلاقانه',
      description: 'تیم طراحان حرفه‌ای ما با خلاقیت بی‌حد و حصر، طرح‌هایی منحصر به فرد برای شما ایجاد می‌کنند.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: PrinterIcon,
      title: 'چاپ با کیفیت',
      description: 'با استفاده از جدیدترین تکنولوژی‌های چاپ، محصولاتی با کیفیت عالی تحویل می‌دهیم.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      title: 'تحویل به موقع',
      description: 'متعهد به زمان‌بندی پروژه‌ها هستیم و همیشه محصولات را در موعد مقرر تحویل می‌دهیم.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const achievements = [
    { number: '۲۵۰۰+', label: 'پروژه تکمیل شده' },
    { number: '۹۸٪', label: 'رضایت مشتریان' },
    { number: '۱۵+', label: 'سال تجربه' },
    { number: '۵۰+', label: 'تیم متخصص' }
  ];

  const teamMembers = [
    { name: 'علی احمدی', role: 'مدیر عامل', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk4MjQ4NDJ8MA&ixlib=rb-4.1.0&q=80&w=300' },
    { name: 'سارا رضایی', role: 'مدیر طراحی', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTgyNDg0M3ww&ixlib=rb-4.1.0&q=80&w=300' },
    { name: 'محمد نوری', role: 'مدیر تولید', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMG1vZGVybnxlbnwxfHx8fDE3NTk4MjQ4NDR8MA&ixlib=rb-4.1.0&q=80&w=300' }
  ];

  const tabContent = {
    story: (
      <div className="space-y-6 rtl-text">
        <p className="text-lg leading-relaxed text-muted-foreground">
          دیجی چاپوگراف در سال ۱۳۸۷ با هدف ارائه خدمات چاپ و طراحی گرافیک با کیفیت آغاز به کار کرد. 
          ما با شروعی کوچک در یک مغازه ۳۰ متری، امروز به یکی از پیشروترین شرکت‌های چاپ دیجیتال کشور تبدیل شده‌ایم.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          رویای ما همیشه این بوده که بتوانیم خلاقیت و تکنولوژی را با هم ترکیب کنیم تا محصولاتی 
          بی‌نظیر و فراتر از انتظار مشتریانمان تولید کنیم.
        </p>
      </div>
    ),
    mission: (
      <div className="space-y-6 rtl-text">
        <p className="text-lg leading-relaxed text-muted-foreground">
          ماموریت ما ایجاد پلی میان ایده‌های خلاقانه و محصولات ملموس است. ما معتقدیم که هر کسب‌وکاری 
          مستحق هویت بصری منحصر به فرد و قدرتمندی است که داستان برندش را به بهترین شکل بازگو کند.
        </p>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>ارائه خدمات با کیفیت جهانی</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>پیشگامی در استفاده از فناوری‌های نوین</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>حفظ محیط زیست در فرآیند تولید</span>
          </li>
        </ul>
      </div>
    ),
    team: (
      <div className="grid md:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="overflow-hidden hover-scale group">
            <div className="relative h-48 overflow-hidden">
              <ImageWithFallback
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <CardContent className="p-4 rtl-text">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    achievements: (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <Card key={index} className="p-6 text-center glass hover-scale group">
            <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
              {achievement.number}
            </div>
            <div className="text-sm text-muted-foreground">{achievement.label}</div>
          </Card>
        ))}
      </div>
    )
  };

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 rtl-text">
          <Badge className="glass">
            <Users className="w-4 h-4 ml-2" />
            درباره دیجی چاپوگراف
          </Badge>
          <h2 className="text-4xl lg:text-5xl gradient-text">
            داستان یک رویای بزرگ
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            از یک ایده کوچک تا پیشروترین شرکت چاپ دیجیتال، ما همیشه به دنبال تحقق رویاهای شما بوده‌ایم
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="relative p-8 hover-scale group overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className="relative z-10 space-y-4 rtl-text">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs Section */}
        <div className="space-y-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="hover-scale group"
                >
                  <IconComponent className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Tab Content */}
          <Card className="p-8 glass">
            <div className="min-h-[300px]">
              {tabContent[activeTab as keyof typeof tabContent]}
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 space-y-6">
          <h3 className="text-2xl font-semibold rtl-text">آماده همکاری با ما هستید؟</h3>
          <Button 
            size="lg" 
            className="hover-scale glow group"
            onClick={() => navigate('contact')}
          >
            ارتباط با ما
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
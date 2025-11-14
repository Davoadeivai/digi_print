import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Phone, Mail, Clock, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useBackend } from '../contexts/BackendContext';
import { useAuth } from '../contexts/AuthContext';
import { AdminLogin } from './admin/AdminLogin';
import { AdminPanel } from './admin/AdminPanel';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { navigate, currentPage } = useNavigation();
  const { isAuthenticated, user, logout } = useBackend();
  const { user: appUser, logout: appLogout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'خانه', page: 'home' },
    { name: 'درباره ما', page: 'about' },
    { name: 'خدمات', page: 'services' },
    { name: 'نمونه کارها', page: 'portfolio' },
    { name: 'تماس', page: 'contact' },
  ];

  const handleNavClick = (page: string) => {
    if (currentPage === 'home') {
      // If on home page, scroll to section
      const element = document.getElementById(page === 'home' ? 'home' : page);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other pages, navigate to home first then scroll
      navigate('home');
      setTimeout(() => {
        const element = document.getElementById(page === 'home' ? 'home' : page);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b' 
        : 'bg-white/90 backdrop-blur border-b'
    }`}>
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className={`flex items-center justify-between py-2 text-sm border-b transition-all duration-300 ${
          isScrolled ? 'opacity-0 h-0 py-0 overflow-hidden' : 'opacity-100'
        }`}>
          <div className="flex items-center gap-6 text-muted-foreground rtl-text">
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
            </div>
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              <span>info@digichapograph.com</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground rtl-text">
              <Clock className="h-4 w-4" />
              <span>دوشنبه تا شنبه: ۸:۰۰ - ۱۸:۰۰</span>
            </div>
            <Badge variant="secondary" className="glass">
              <Sparkles className="w-3 h-3 ml-1" />
              تخفیف ۲۰٪ پروژه‌های جدید
            </Badge>
          </div>
        </div>

        {/* Main navigation */}
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-4'
        }`}>
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('home')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover-scale">
              <span className="text-white font-bold text-lg">DG</span>
            </div>
            <div className="rtl-text">
              <h1 className="text-xl font-bold gradient-text">دیجی چاپوگراف</h1>
              <p className="text-xs text-muted-foreground">چاپ و گرافیک دیجیتال</p>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.page)}
                className="text-foreground hover:text-primary transition-all duration-300 relative group py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* User auth controls (customer login/register or dashboard/logout) */}
            {appUser ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {appUser.full_name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('dashboard')}
                  className="flex items-center gap-2"
                >
                  حساب کاربری
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await appLogout();
                    navigate('home');
                  }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  خروج
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('login')}
                  className="text-muted-foreground hover:text-primary"
                >
                  ورود
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('register')}
                  className="border-primary text-primary"
                >
                  ثبت نام
                </Button>
              </div>
            )}

            {/* Admin controls using BackendContext */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdminPanel(true)}
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  پنل مدیریت
                </Button>
                <span className="text-sm text-muted-foreground">
                  خوش آمدید، {user?.first_name}
                </span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Shield className="w-4 h-4" />
                ورود مدیر
              </Button>
            )}

            <Button 
              className="hidden md:flex hover-scale glow group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => navigate('order')}
            >
              درخواست قیمت
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover-scale">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass">
                <div className="flex flex-col gap-6 mt-8 rtl-text">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">DG</span>
                    </div>
                    <div>
                      <h2 className="font-bold">دیجی چاپوگراف</h2>
                      <p className="text-xs text-muted-foreground">منوی اصلی</p>
                    </div>
                  </div>
                  
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        handleNavClick(item.page);
                        setIsOpen(false);
                      }}
                      className="text-lg hover:text-primary transition-colors hover:translate-x-2 duration-300 py-2 text-right w-full"
                    >
                      {item.name}
                    </button>
                  ))}
                  
                  <div className="mt-6 space-y-4">
                    <Button 
                      className="w-full hover-scale bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={() => {
                        navigate('order');
                        setIsOpen(false);
                      }}
                    >
                      درخواست قیمت
                    </Button>
                    
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>info@digichapograph.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onLoginSuccess={() => {
            setShowAdminLogin(false);
            setShowAdminPanel(true);
          }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </header>
  );
}
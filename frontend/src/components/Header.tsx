import { useState, useEffect, useCallback, useReducer } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { 
  Menu, 
  Phone, 
  Mail, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  Shield, 
  Search,
  ChevronDown,
  X,
  User,
  LogOut,
  Package,
  Settings
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useNavigation } from '../contexts/NavigationContext';
import { useBackend } from '../contexts/BackendContext';
import { useAuth } from '../contexts/AuthContext';
import { AdminLogin } from './admin/AdminLogin';
import { AdminPanel } from './admin/AdminPanel';
import { SearchDialog } from './SearchDialog';

// ==================== Types ====================
type ModalType = 'adminLogin' | 'adminPanel' | 'search' | null;

interface NavItem {
  id: string;
  name: string;
  page: string;
  data?: Record<string, string>;
  children?: NavItem[];
}

interface HeaderState {
  isMenuOpen: boolean;
  isScrolled: boolean;
  modal: ModalType;
  expandedMenu: string | null;
}

type HeaderAction =
  | { type: 'SET_MENU_OPEN'; payload: boolean }
  | { type: 'SET_SCROLLED'; payload: boolean }
  | { type: 'OPEN_MODAL'; payload: ModalType }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_EXPANDED_MENU'; payload: string | null };

// ==================== Constants ====================
const BRAND = {
  name: 'دیجی چاپوگراف',
  shortName: 'DG',
  tagline: 'چاپ و گرافیک دیجیتال',
} as const;

const CONTACT_INFO = {
  phone: '۰۲۱-۱۲۳۴۵۶۷۸',
  email: 'info@digichapograph.com',
  workingHours: 'دوشنبه تا شنبه: ۸:۰۰ - ۱۸:۰۰',
} as const;

const PRODUCT_CATEGORIES = [
  { id: '1', name: 'لیبل و برچسب', slug: 'label', icon: '🏷️' },
  { id: '2', name: 'جعبه و کارتن', slug: 'box', icon: '📦' },
  { id: '3', name: 'ساک دستی', slug: 'bag', icon: '🛍️' },
  { id: '4', name: 'بسته‌بندی محصولات', slug: 'packaging', icon: '🎁' },
  { id: '5', name: 'لیوان کاغذی', slug: 'cup', icon: '☕' },
  { id: '6', name: 'کاتالوگ و بروشور', slug: 'catalog', icon: '📖' },
  { id: '7', name: 'کارت ویزیت', slug: 'card', icon: '💳' },
];

const NAVIGATION: NavItem[] = [
  { id: 'home', name: 'خانه', page: 'home' },
  { 
    id: 'products', 
    name: 'محصولات', 
    page: 'category',
    children: PRODUCT_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      page: 'category',
      data: { slug: cat.slug }
    }))
  },
  { id: 'services', name: 'خدمات', page: 'services' },
  { id: 'portfolio', name: 'نمونه کارها', page: 'portfolio' },
  { id: 'contact', name: 'تماس', page: 'contact' },
];

// ==================== Reducer ====================
const initialState: HeaderState = {
  isMenuOpen: false,
  isScrolled: false,
  modal: null,
  expandedMenu: null,
};

function headerReducer(state: HeaderState, action: HeaderAction): HeaderState {
  switch (action.type) {
    case 'SET_MENU_OPEN':
      return { ...state, isMenuOpen: action.payload };
    case 'SET_SCROLLED':
      return { ...state, isScrolled: action.payload };
    case 'OPEN_MODAL':
      return { ...state, modal: action.payload };
    case 'CLOSE_MODAL':
      return { ...state, modal: null };
    case 'SET_EXPANDED_MENU':
      return { ...state, expandedMenu: action.payload };
    default:
      return state;
  }
}

// ==================== Custom Hooks ====================
function useScrollDetection(threshold: number, onScroll: (isScrolled: boolean) => void) {
  useEffect(() => {
    const handleScroll = () => {
      onScroll(window.scrollY > threshold);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, onScroll]);
}

function useKeyboardShortcut(key: string, callback: () => void, options?: { ctrl?: boolean }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const ctrlPressed = options?.ctrl ? (event.ctrlKey || event.metaKey) : true;
      
      if (ctrlPressed && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options?.ctrl]);
}

function useSmartNavigation() {
  const { navigate, currentPage } = useNavigation();

  const navigateToSection = useCallback((page: string, data?: Record<string, string>) => {
    if (page === 'category' && data?.slug) {
      navigate('category', data);
      return;
    }

    const scrollToElement = (elementId: string) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const targetId = page === 'home' ? 'home' : page;

    if (currentPage === 'home') {
      scrollToElement(targetId);
    } else {
      navigate('home');
      setTimeout(() => scrollToElement(targetId), 100);
    }
  }, [navigate, currentPage]);

  return { navigate, navigateToSection, currentPage };
}

// ==================== Sub Components ====================

// Top Bar Component
interface TopBarProps {
  visible: boolean;
}

function TopBar({ visible }: TopBarProps) {
  return (
    <div className={`
      flex items-center justify-between py-2 text-sm border-b 
      transition-all duration-300
      ${visible ? 'opacity-100' : 'opacity-0 h-0 py-0 overflow-hidden'}
    `}>
      <div className="flex items-center gap-6 text-muted-foreground rtl-text">
        <a 
          href={`tel:${CONTACT_INFO.phone}`}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Phone className="h-4 w-4" />
          <span>{CONTACT_INFO.phone}</span>
        </a>
        <a 
          href={`mailto:${CONTACT_INFO.email}`}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Mail className="h-4 w-4" />
          <span>{CONTACT_INFO.email}</span>
        </a>
      </div>
      
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground rtl-text">
          <Clock className="h-4 w-4" />
          <span>{CONTACT_INFO.workingHours}</span>
        </div>
        <Badge variant="secondary" className="glass">
          <Sparkles className="w-3 h-3 ml-1" />
          تخفیف ۲۰٪ پروژه‌های جدید
        </Badge>
      </div>
    </div>
  );
}

// Logo Component
interface LogoProps {
  onClick: () => void;
}

function Logo({ onClick }: LogoProps) {
  return (
    <div 
      className="flex items-center gap-3 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative w-12 h-12">
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover-scale shadow-lg group-hover:shadow-xl transition-shadow">
          <span className="text-white font-bold text-lg">{BRAND.shortName}</span>
        </div>
        <div className="absolute inset-0 border-2 border-purple-400 rounded-xl opacity-0 group-hover:opacity-100 scale-110 transition-all" />
      </div>
      
      <div className="rtl-text hidden sm:block">
        <h1 className="text-xl font-bold gradient-text group-hover:text-primary transition-colors">
          {BRAND.name}
        </h1>
        <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
      </div>
    </div>
  );
}

// Products Dropdown Component
interface ProductsDropdownProps {
  onSelect: (slug: string) => void;
}

function ProductsDropdown({ onSelect }: ProductsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 py-2 text-foreground hover:text-primary transition-all duration-300 relative group">
        <span>محصولات</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
      </button>

      <div className={`
        absolute top-full right-0 mt-2 w-64
        bg-white rounded-xl shadow-2xl border border-gray-100
        transition-all duration-200 z-50
        ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
      `}>
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-xl">
          <h3 className="text-white font-bold text-sm">دسته‌بندی محصولات</h3>
        </div>

        {/* Items */}
        <div className="p-2 max-h-72 overflow-y-auto">
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onSelect(category.slug);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors text-right group/item"
            >
              <span className="text-xl">{category.icon}</span>
              <span className="flex-1 text-gray-700 group-hover/item:text-purple-600 font-medium text-sm">
                {category.name}
              </span>
              <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400 group-hover/item:text-purple-600" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 rounded-b-xl border-t">
          <button 
            onClick={() => {
              onSelect('all');
              setIsOpen(false);
            }}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            مشاهده همه محصولات ←
          </button>
        </div>
      </div>
    </div>
  );
}

// Desktop Navigation Component
interface DesktopNavProps {
  currentPage: string;
  onNavigate: (page: string, data?: Record<string, string>) => void;
}

function DesktopNav({ currentPage, onNavigate }: DesktopNavProps) {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {NAVIGATION.map((item) => {
        // Products dropdown
        if (item.children) {
          return (
            <ProductsDropdown 
              key={item.id}
              onSelect={(slug) => onNavigate('category', { slug })}
            />
          );
        }

        // Regular nav items
        const isActive = currentPage === item.page;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.page, item.data)}
            className={`
              relative py-2 transition-all duration-300 group
              ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'}
            `}
          >
            {item.name}
            <span className={`
              absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 
              transition-all duration-300
              ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
            `} />
          </button>
        );
      })}
    </nav>
  );
}

// Search Button Component
interface SearchButtonProps {
  onClick: () => void;
}

function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="hover-scale"
          >
            <Search className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>جستجو (Ctrl+K)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// User Controls Component
interface UserControlsProps {
  user: any;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onDashboard: () => void;
}

function UserControls({ user, onLogin, onRegister, onLogout, onDashboard }: UserControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogin}
          className="text-muted-foreground hover:text-primary"
        >
          ورود
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegister}
          className="border-primary text-primary"
        >
          ثبت نام
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:block relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {user.full_name?.charAt(0) || 'U'}
        </div>
        <span className="text-sm text-gray-700 font-medium">
          {user.full_name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <p className="font-medium text-gray-800">{user.full_name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="py-2">
              <button
                onClick={() => { onDashboard(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>حساب کاربری</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>سفارش‌های من</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>تنظیمات</span>
              </button>
            </div>

            <div className="py-2 border-t">
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج از حساب</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Admin Controls Component
interface AdminControlsProps {
  isAuthenticated: boolean;
  user: any;
  onLoginClick: () => void;
  onPanelClick: () => void;
}

function AdminControls({ isAuthenticated, user, onLoginClick, onPanelClick }: AdminControlsProps) {
  if (isAuthenticated) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPanelClick}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          پنل مدیریت
        </Button>
        <span className="text-sm text-muted-foreground">
          خوش آمدید، {user?.first_name}
        </span>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onLoginClick}
      className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary"
    >
      <Shield className="w-4 h-4" />
      ورود مدیر
    </Button>
  );
}

// Mobile Navigation Component
interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  navigation: NavItem[];
  onNavigate: (page: string, data?: Record<string, string>) => void;
  expandedMenu: string | null;
  onExpandMenu: (id: string | null) => void;
}

function MobileNav({ 
  isOpen, 
  onOpenChange, 
  navigation, 
  onNavigate,
  expandedMenu,
  onExpandMenu
}: MobileNavProps) {
  const handleNavClick = (item: NavItem) => {
    if (item.children) {
      onExpandMenu(expandedMenu === item.id ? null : item.id);
    } else {
      onNavigate(item.page, item.data);
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden hover-scale">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-80 p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">{BRAND.shortName}</span>
              </div>
              <div>
                <h2 className="text-white font-bold">{BRAND.name}</h2>
                <p className="text-purple-100 text-xs">منوی اصلی</p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            {navigation.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  className="w-full flex items-center justify-between px-6 py-4 text-gray-700 hover:bg-purple-50 transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                  {item.children && (
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform ${
                        expandedMenu === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Sub Menu */}
                {item.children && expandedMenu === item.id && (
                  <div className="bg-gray-50 py-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onNavigate('category', { slug: cat.slug });
                          onOpenChange(false);
                        }}
                        className="w-full flex items-center gap-3 px-8 py-3 text-gray-600 hover:text-purple-600 hover:bg-white transition-colors"
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => {
                onNavigate('order');
                onOpenChange(false);
              }}
            >
              درخواست قیمت
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
            
            <div className="space-y-2 pt-4 border-t">
              <a 
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>{CONTACT_INFO.phone}</span>
              </a>
              <a 
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                <span>{CONTACT_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ==================== Main Header Component ====================
export function Header() {
  // State Management
  const [state, dispatch] = useReducer(headerReducer, initialState);
  const { isMenuOpen, isScrolled, modal, expandedMenu } = state;

  // Contexts
  const { isAuthenticated, user: adminUser } = useBackend();
  const { user: appUser, logout: appLogout } = useAuth();
  
  // Navigation
  const { navigate, navigateToSection, currentPage } = useSmartNavigation();

  // Scroll Detection
  useScrollDetection(50, useCallback((scrolled: boolean) => {
    dispatch({ type: 'SET_SCROLLED', payload: scrolled });
  }, []));

  // Keyboard Shortcut
  useKeyboardShortcut('k', () => {
    dispatch({ type: 'OPEN_MODAL', payload: 'search' });
  }, { ctrl: true });

  // Handlers
  const handleNavigate = useCallback((page: string, data?: Record<string, string>) => {
    navigateToSection(page, data);
    dispatch({ type: 'SET_MENU_OPEN', payload: false });
  }, [navigateToSection]);

  const handleUserLogout = useCallback(async () => {
    await appLogout();
    navigate('home');
  }, [appLogout, navigate]);

  const handleAdminLoginSuccess = useCallback(() => {
    dispatch({ type: 'OPEN_MODAL', payload: 'adminPanel' });
  }, []);

  return (
    <header className={`
      sticky top-0 z-50 w-full transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b' 
        : 'bg-white/90 backdrop-blur border-b'
      }
    `}>
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <TopBar visible={!isScrolled} />

        {/* Main Navigation */}
        <div className={`
          flex items-center justify-between transition-all duration-300
          ${isScrolled ? 'py-3' : 'py-4'}
        `}>
          {/* Logo */}
          <Logo onClick={() => navigate('home')} />

          {/* Desktop Navigation */}
          <DesktopNav 
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <SearchButton 
              onClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'search' })} 
            />

            {/* User Controls */}
            <UserControls
              user={appUser}
              onLogin={() => navigate('login')}
              onRegister={() => navigate('register')}
              onLogout={handleUserLogout}
              onDashboard={() => navigate('dashboard')}
            />

            {/* Admin Controls */}
            <AdminControls
              isAuthenticated={isAuthenticated}
              user={adminUser}
              onLoginClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'adminLogin' })}
              onPanelClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'adminPanel' })}
            />

            {/* Order Button */}
            <Button 
              className="hidden md:flex hover-scale glow group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => navigate('order')}
            >
              درخواست قیمت
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Mobile Menu */}
            <MobileNav
              isOpen={isMenuOpen}
              onOpenChange={(open) => dispatch({ type: 'SET_MENU_OPEN', payload: open })}
              navigation={NAVIGATION}
              onNavigate={handleNavigate}
              expandedMenu={expandedMenu}
              onExpandMenu={(id) => dispatch({ type: 'SET_EXPANDED_MENU', payload: id })}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === 'adminLogin' && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      )}

      {modal === 'adminPanel' && (
        <AdminPanel
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        />
      )}

      <SearchDialog 
        open={modal === 'search'} 
        onOpenChange={() => dispatch({ type: 'CLOSE_MODAL' })} 
      />
    </header>
  );
}

export default Header;
# 📚 مستندات کامل Frontend - پروژه دیجی چاپ و گرافیک

## 📋 فهرست مطالب
- [معماری کلی](#معماری-کلی)
- [فایل‌های اصلی](#فایل‌های-اصلی)
- [کامپوننت‌های UI](#کامپوننت‌های-ui)
- [صفحات (Pages)](#صفحات-pages)
- [سرویس‌ها و API](#سرویس‌ها-و-api)
- [Context ها](#context-ها)
- [استایل‌ها](#استایل‌ها)

---

## 🏗️ معماری کلی

پروژه Frontend با استفاده از **React 18**, **TypeScript**, و **Vite 5** ساخته شده است.

### ساختار کلی پروژه
```
frontend/
├── src/
│   ├── components/        # کامپوننت‌های React
│   │   ├── ui/           # کامپوننت‌های پایه UI
│   │   ├── pages/        # صفحات اپلیکیشن
│   │   ├── admin/        # پنل مدیریت
│   │   └── auth/         # احراز هویت
│   ├── contexts/         # React Contexts
│   ├── services/         # سرویس‌های API
│   ├── types/           # تعاریف TypeScript
│   ├── utils/           # توابع کمکی
│   └── styles/          # فایل‌های CSS
├── public/              # فایل‌های استاتیک
└── index.html          # HTML اصلی
```

---

## 📄 فایل‌های اصلی

### 📄 `src/main.tsx`
**مسیر**: `frontend/src/main.tsx`  
**وظیفه**: نقطه ورود اصلی اپلیکیشن

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**عملکرد**: رندر کامپوننت App در DOM

---

### 📄 `src/App.tsx`
**مسیر**: `frontend/src/App.tsx`  
**خطوط**: 1-193  
**وظیفه**: کامپوننت اصلی و مسیریابی

#### ساختار کلی:

##### 1. Imports (خطوط 1-23)
```typescript
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
```
**وظیفه**: وارد کردن تمام کامپوننت‌های صفحه اصلی

##### 2. Providers (خطوط 183-191)
```typescript
export default function App() {
  return (
    <AuthProvider>
      <BackendProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </BackendProvider>
    </AuthProvider>
  );
}
```
**وظیفه**: 
- `AuthProvider` (خارجی‌ترین): مدیریت احراز هویت کاربران
- `BackendProvider` (میانی): مدیریت ارتباط با Backend
- `NavigationProvider` (داخلی‌ترین): مدیریت مسیریابی

##### 3. Routing Logic (خطوط 44-162)
```typescript
const renderPage = () => {
  switch (currentPage) {
    case 'register':
      return (<><Header /><RegisterPage /><Footer /></>);
    case 'login':
      return (<><Header /><LoginPage /><Footer /></>);
    case 'dashboard':
      return (<><Header /><UserDashboard /><Footer /></>);
    // ...
  }
};
```

**صفحات موجود**:
- `home`: صفحه اصلی (Hero + About + Services + Portfolio + Contact)
- `register`: ثبت‌نام کاربر
- `login`: ورود کاربر
- `dashboard`: داشبورد کاربر
- `products`: لیست محصولات
- `category`: دسته‌بندی محصولات
- `label`: صفحه لیبل
- `order`: صفحه سفارش
- `price-calculator`: ماشین حساب قیمت
- `wallet`: کیف پول کاربر
- `addresses`: آدرس‌های کاربر

---

## 🧩 کامپوننت‌های UI

### 📄 `src/components/Header.tsx`
**مسیر**: `frontend/src/components/Header.tsx`  
**خطوط**: 1-798  
**وظیفه**: نوار ناوبری (Navbar) اصلی سایت

این کامپوننت یکی از پیچیده‌ترین و مهم‌ترین کامپوننت‌های پروژه است.

#### ساختار کامل:

##### 1. Types و Interfaces (خطوط 29-52)
```typescript
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
```
**وظیفه**: تعریف انواع داده‌ها برای مدیریت state

##### 2. Constants (خطوط 54-93)
```typescript
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
  // ...
];

const NAVIGATION: NavItem[] = [
  { id: 'home', name: 'خانه', page: 'home' },
  { id: 'products', name: 'محصولات', page: 'category', children: [...] },
  { id: 'services', name: 'خدمات', page: 'services' },
  { id: 'portfolio', name: 'نمونه کارها', page: 'portfolio' },
  { id: 'contact', name: 'تماس', page: 'contact' },
];
```
**وظیفه**: تعریف اطلاعات ثابت برند، تماس، و منوها

##### 3. Reducer (خطوط 95-118)
```typescript
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
    // ...
  }
}
```
**وظیفه**: مدیریت state با الگوی Reducer برای بهینه‌سازی

##### 4. Custom Hooks (خطوط 120-176)

**useScrollDetection** (خطوط 121-131):
```typescript
function useScrollDetection(threshold: number, onScroll: (isScrolled: boolean) => void) {
  useEffect(() => {
    const handleScroll = () => {
      onScroll(window.scrollY > threshold);
    };
    // ...
  }, [threshold, onScroll]);
}
```
**وظیفه**: تشخیص اسکرول صفحه برای تغییر استایل Header

**useKeyboardShortcut** (خطوط 133-147):
```typescript
function useKeyboardShortcut(key: string, callback: () => void, options?: { ctrl?: boolean }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (ctrlPressed && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };
    // ...
  }, [key, callback, options?.ctrl]);
}
```
**وظیفه**: اضافه کردن میانبر کیبورد (مثلاً Ctrl+K برای جستجو)

**useSmartNavigation** (خطوط 149-176):
```typescript
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
    // ...
  }, [navigate, currentPage]);

  return { navigate, navigateToSection, currentPage };
}
```
**وظیفه**: مدیریت هوشمند ناوبری (اسکرول در صفحه فعلی یا تغییر صفحه)

##### 5. Sub Components

**TopBar** (خطوط 185-221):
```typescript
function TopBar({ visible }: TopBarProps) {
  return (
    <div className={`transition-all ${visible ? 'opacity-100' : 'opacity-0 h-0'}`}>
      <div className="flex items-center gap-6">
        <a href={`tel:${CONTACT_INFO.phone}`}>
          <Phone className="h-4 w-4" />
          <span>{CONTACT_INFO.phone}</span>
        </a>
        <a href={`mailto:${CONTACT_INFO.email}`}>
          <Mail className="h-4 w-4" />
          <span>{CONTACT_INFO.email}</span>
        </a>
      </div>
      <Badge>تخفیف ۲۰٪ پروژه‌های جدید</Badge>
    </div>
  );
}
```
**وظیفه**: نمایش اطلاعات تماس و تخفیف‌ها در بالای Header  
**ویژگی**: مخفی می‌شود هنگام اسکرول

**Logo** (خطوط 228-249):
```typescript
function Logo({ onClick }: LogoProps) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={onClick}>
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
        <span className="text-white font-bold text-lg">{BRAND.shortName}</span>
      </div>
      <div className="rtl-text hidden sm:block">
        <h1 className="text-xl font-bold gradient-text">{BRAND.name}</h1>
        <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
      </div>
    </div>
  );
}
```
**وظیفه**: نمایش لوگو و نام برند  
**خطوط کلیدی**:
- خط 234-236: لوگوی گرادیانت با حروف اختصاری
- خط 241-245: نام کامل برند (مخفی در موبایل)

**ProductsDropdown** (خطوط 256-316):
```typescript
function ProductsDropdown({ onSelect }: ProductsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1">
        <span>محصولات</span>
        <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500">
          <h3 className="text-white font-bold">دسته‌بندی محصولات</h3>
        </div>

        {/* Items */}
        <div className="p-2">
          {PRODUCT_CATEGORIES.map((category) => (
            <button onClick={() => onSelect(category.slug)}>
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```
**وظیفه**: منوی کشویی محصولات  
**خطوط کلیدی**:
- خط 262-263: باز شدن با hover
- خط 271-275: انیمیشن نمایش/مخفی شدن
- خط 284-298: لیست دسته‌بندی‌ها با آیکون

**DesktopNav** (خطوط 325-362):
```typescript
function DesktopNav({ currentPage, onNavigate }: DesktopNavProps) {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {NAVIGATION.map((item) => {
        if (item.children) {
          return <ProductsDropdown key={item.id} onSelect={(slug) => onNavigate('category', { slug })} />;
        }

        const isActive = currentPage === item.page;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.page, item.data)}
            className={`relative py-2 transition-all ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'}`}
          >
            {item.name}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500
              ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>
        );
      })}
    </nav>
  );
}
```
**وظیفه**: منوی ناوبری دسکتاپ  
**ویژگی**: خط 327 - مخفی در موبایل (lg:flex)

**UserControls** (خطوط 400-491):
```typescript
function UserControls({ user, onLogin, onRegister, onLogout, onDashboard }: UserControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" onClick={onLogin}>ورود</Button>
        <Button variant="outline" onClick={onRegister}>ثبت نام</Button>
      </div>
    );
  }

  return (
    <div className="hidden md:block relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
          {user.full_name?.charAt(0) || 'U'}
        </div>
        <span>{user.full_name}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl">
          <div className="px-4 py-3 bg-gray-50">
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <button onClick={onDashboard}>
            <User className="w-4 h-4" />
            <span>حساب کاربری</span>
          </button>
          
          <button onClick={onLogout}>
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب</span>
          </button>
        </div>
      )}
    </div>
  );
}
```
**وظیفه**: کنترل‌های کاربر (ورود/ثبت‌نام یا منوی پروفایل)  
**خطوط کلیدی**:
- خط 403-423: نمایش دکمه‌های ورود/ثبت‌نام برای کاربر مهمان
- خط 427-489: منوی کشویی پروفایل برای کاربر لاگین شده

**MobileNav** (خطوط 544-663):
```typescript
function MobileNav({ isOpen, onOpenChange, navigation, onNavigate, expandedMenu, onExpandMenu }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg">
                <span className="text-white font-bold">{BRAND.shortName}</span>
              </div>
              <h2 className="text-white font-bold">{BRAND.name}</h2>
            </div>
            <button onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            {navigation.map((item) => (
              <div key={item.id}>
                <button onClick={() => handleNavClick(item)}>
                  <span>{item.name}</span>
                  {item.children && <ChevronDown />}
                </button>

                {/* Sub Menu */}
                {item.children && expandedMenu === item.id && (
                  <div className="bg-gray-50 py-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <button onClick={() => onNavigate('category', { slug: cat.slug })}>
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
          <div className="border-t p-4">
            <Button onClick={() => onNavigate('order')}>
              درخواست قیمت
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```
**وظیفه**: منوی همبرگری موبایل  
**ویژگی**: Drawer از سمت راست با منوی تو در تو

##### 6. Main Header Component (خطوط 667-796)
```typescript
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

  return (
    <header className={`sticky top-0 z-50 w-full transition-all
      ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur'}`}>
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <TopBar visible={!isScrolled} />

        {/* Main Navigation */}
        <div className={`flex items-center justify-between ${isScrolled ? 'py-3' : 'py-4'}`}>
          {/* Logo */}
          <Logo onClick={() => navigate('home')} />

          {/* Desktop Navigation */}
          <DesktopNav currentPage={currentPage} onNavigate={handleNavigate} />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <SearchButton onClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'search' })} />
            <UserControls user={appUser} onLogin={() => navigate('login')} onRegister={() => navigate('register')} onLogout={handleUserLogout} onDashboard={() => navigate('dashboard')} />
            <AdminControls isAuthenticated={isAuthenticated} user={adminUser} onLoginClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'adminLogin' })} onPanelClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'adminPanel' })} />
            <Button onClick={() => navigate('order')}>درخواست قیمت</Button>
            <MobileNav isOpen={isMenuOpen} onOpenChange={(open) => dispatch({ type: 'SET_MENU_OPEN', payload: open })} navigation={NAVIGATION} onNavigate={handleNavigate} expandedMenu={expandedMenu} onExpandMenu={(id) => dispatch({ type: 'SET_EXPANDED_MENU', payload: id })} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === 'adminLogin' && <AdminLogin onLoginSuccess={handleAdminLoginSuccess} onClose={() => dispatch({ type: 'CLOSE_MODAL' })} />}
      {modal === 'adminPanel' && <AdminPanel onClose={() => dispatch({ type: 'CLOSE_MODAL' })} />}
      <SearchDialog open={modal === 'search'} onOpenChange={() => dispatch({ type: 'CLOSE_MODAL' })} />
    </header>
  );
}
```

**خلاصه عملکرد Header**:
1. **Sticky Header**: همیشه در بالای صفحه می‌ماند
2. **Responsive**: دارای منوی دسکتاپ و موبایل جداگانه
3. **Dynamic Styling**: استایل تغییر می‌کند با اسکرول
4. **User Management**: نمایش متفاوت برای کاربر مهمان و لاگین شده
5. **Admin Panel**: دسترسی به پنل مدیریت
6. **Search**: جستجو با میانبر Ctrl+K
7. **Products Dropdown**: منوی کشویی دسته‌بندی محصولات

---

### 📄 کامپوننت‌های دیگر

#### `src/components/Hero.tsx`
**وظیفه**: بخش Hero (بنر اصلی) صفحه  
**محتوا**: عنوان اصلی، توضیحات، و دکمه‌های CTA

#### `src/components/About.tsx`
**وظیفه**: بخش درباره ما  
**محتوا**: معرفی شرکت و خدمات

#### `src/components/Services.tsx`
**وظیفه**: نمایش لیست خدمات  
**محتوا**: کارت‌های خدمات با آیکون و توضیحات

#### `src/components/Portfolio.tsx`
**وظیفه**: نمایش نمونه کارها  
**محتوا**: گالری تصاویر پروژه‌های انجام شده

#### `src/components/Contact.tsx`
**وظیفه**: فرم تماس با ما  
**محتوا**: فرم ارسال پیام + اطلاعات تماس

#### `src/components/Footer.tsx`
**وظیفه**: فوتر سایت  
**محتوا**: لینک‌ها، اطلاعات تماس، شبکه‌های اجتماعی

---

## 📄 صفحات (Pages)

### `src/components/pages/UserDashboard.tsx`
**وظیفه**: داشبورد کاربر  
**محتوا**:
- اطلاعات کاربر
- آمار سفارشات
- لینک‌های سریع (کیف پول، آدرس‌ها، سفارشات)

### `src/components/pages/LoginPage.tsx`
**وظیفه**: صفحه ورود  
**محتوا**: فرم ورود با ایمیل و رمز عبور

### `src/components/pages/RegisterPage.tsx`
**وظیفه**: صفحه ثبت‌نام  
**محتوا**: فرم ثبت‌نام کاربر جدید

### `src/components/pages/ProductsPage.tsx`
**وظیفه**: لیست محصولات  
**محتوا**: نمایش محصولات با فیلتر و جستجو

### `src/components/pages/LabelPage.tsx`
**وظیفه**: صفحه محصول لیبل  
**محتوا**: جزئیات و سفارش لیبل

### `src/components/pages/OrderPage.tsx`
**وظیفه**: صفحه ثبت سفارش  
**محتوا**: فرم سفارش با انتخاب محصول و مشخصات

### `src/components/pages/PriceCalculatorPage.tsx`
**وظیفه**: ماشین حساب قیمت  
**محتوا**: محاسبه قیمت بر اساس تیراژ و مشخصات

### `src/components/pages/UserWalletPage.tsx`
**وظیفه**: کیف پول کاربر  
**محتوا**: موجودی، تراکنش‌ها، شارژ کیف پول

### `src/components/pages/UserAddressesPage.tsx`
**وظیفه**: مدیریت آدرس‌ها  
**محتوا**: لیست آدرس‌ها، افزودن/ویرایش/حذف

---

## 🔌 سرویس‌ها و API

### 📄 `src/services/api.ts`
**وظیفه**: کلاینت اصلی API و تمام درخواست‌های HTTP

#### ساختار:

```typescript
class ApiClient {
  private baseURL: string;
  
  async get(endpoint: string) { /* ... */ }
  async post(endpoint: string, data: any) { /* ... */ }
  async put(endpoint: string, data: any) { /* ... */ }
  async delete(endpoint: string) { /* ... */ }
}

// Services
class AuthService {
  async login(email: string, password: string) { /* ... */ }
  async register(userData: any) { /* ... */ }
  async logout() { /* ... */ }
}

class ProductService {
  async getProducts() { /* ... */ }
  async getProductBySlug(slug: string) { /* ... */ }
  async getCategories() { /* ... */ }
}

class OrderService {
  async createOrder(orderData: any) { /* ... */ }
  async getOrders() { /* ... */ }
  async getOrderById(id: string) { /* ... */ }
}

class UserManagementService {
  async getProfile() { /* ... */ }
  async updateProfile(data: any) { /* ... */ }
  async getAddresses() { /* ... */ }
  async createAddress(data: any) { /* ... */ }
}
```

**وظایف**:
- مدیریت توکن JWT
- ارسال درخواست‌های HTTP
- مدیریت خطاها
- Refresh token

---

## 🌐 Context ها

### 📄 `src/contexts/AuthContext.tsx`
**وظیفه**: مدیریت احراز هویت کاربران

```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}
```

**عملکرد**:
- ذخیره اطلاعات کاربر در state
- مدیریت توکن‌ها در localStorage
- بررسی وضعیت لاگین

### 📄 `src/contexts/NavigationContext.tsx`
**وظیفه**: مدیریت مسیریابی بدون React Router

```typescript
interface NavigationContextType {
  currentPage: string;
  navigate: (page: string, data?: any) => void;
  pageData: any;
}
```

**عملکرد**:
- تغییر صفحه فعلی
- ذخیره داده‌های صفحه
- مدیریت history

### 📄 `src/contexts/BackendContext.tsx`
**وظیفه**: مدیریت ارتباط با Backend و احراز هویت ادمین

```typescript
interface BackendContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
```

---

## 🎨 استایل‌ها

### 📄 `src/index.css`
**مسیر**: `frontend/src/index.css`  
**حجم**: ~94KB  
**وظیفه**: استایل‌های اصلی پروژه

**بخش‌های کلیدی**:
- Tailwind directives
- Custom CSS variables
- RTL support
- Animations
- Responsive utilities
- Component-specific styles

### 📄 `src/styles/globals.css`
**وظیفه**: استایل‌های سراسری اضافی

### 📄 `src/styles/fonts.css`
**وظیفه**: تعریف فونت‌های فارسی

---

## 📊 خلاصه آمار Frontend

- **تعداد کل فایل‌های TypeScript/TSX**: 134 فایل
- **تعداد Components**: 75+ کامپوننت
- **تعداد Pages**: 12 صفحه
- **تعداد Services**: 5 سرویس
- **تعداد Contexts**: 3 context
- **حجم CSS**: ~94KB

---

## 🔑 ویژگی‌های کلیدی

1. **TypeScript**: Type-safety در تمام پروژه
2. **Responsive Design**: پشتیبانی کامل از موبایل و دسکتاپ
3. **RTL Support**: پشتیبانی کامل از راست به چپ
4. **Component-Based**: معماری مبتنی بر کامپوننت
5. **Custom Hooks**: استفاده از hooks سفارشی
6. **State Management**: مدیریت state با Context API و Reducer
7. **API Integration**: ارتباط کامل با Backend
8. **Authentication**: سیستم احراز هویت JWT
9. **Animations**: انیمیشن‌های روان با Tailwind و CSS
10. **Accessibility**: توجه به دسترسی‌پذیری

---

**تاریخ ایجاد مستند**: 2025-12-02  
**نسخه**: 1.0.0

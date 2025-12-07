import { createContext, useContext, useState, ReactNode } from 'react';

export type Page =
  | 'home' | 'about' | 'services' | 'service-detail' | 'portfolio' | 'portfolio-detail'
  | 'contact' | 'order' | 'pricing' | 'price-calculator' | 'blog' | 'gallery'
  | 'register' | 'login' | 'dashboard' | 'profile' | 'my-orders' | 'wallet' | 'addresses'
  | 'activities' | 'security'
  | 'products' | 'product-detail' | 'category' | 'label' | 'label-category';

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricing: { basic: number; premium: number; enterprise: number };
  gallery: string[];
  specifications: string[];
}

export interface PortfolioDetail {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  images: string[];
  tags: string[];
}

interface NavigationContextType {
  currentPage: Page;
  navigate: (page: Page, data?: any) => void;
  pageData: any;
  goBack: () => void;
  history: { page: Page; data?: any }[];
}

const NavigationContext = createContext<NavigationContextType | null>(null);

import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const navigateRouter = useNavigate();
  const location = useLocation();
  const [pageData, setPageData] = useState<any>(null);
  // history is managed by router now, but we keep this state for compatibility if needed. 
  // Ideally we should remove it, but let's keep it simple for now or mock it.
  const [history, setHistory] = useState<{ page: Page; data?: any }[]>([{ page: 'home' }]);

  // Derive currentPage from location.pathname
  const getCurrentPage = (path: string): Page => {
    if (path === '/' || path === '') return 'home';
    if (path.startsWith('/register')) return 'register';
    if (path.startsWith('/login')) return 'login';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/services')) return path.includes('/') ? 'service-detail' : 'services';
    if (path.startsWith('/portfolio')) return path.includes('/') ? 'portfolio-detail' : 'portfolio';
    if (path.startsWith('/products')) return 'products';
    if (path.startsWith('/category')) return 'category';
    if (path.startsWith('/label-category')) return 'label-category';
    if (path.startsWith('/label')) return 'label';
    if (path.startsWith('/order')) return 'order';
    if (path.startsWith('/price-calculator')) return 'price-calculator';
    if (path.startsWith('/wallet')) return 'wallet';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/activities')) return 'activities';
    if (path.startsWith('/security')) return 'security';
    if (path.startsWith('/addresses')) return 'addresses';
    if (path.startsWith('/contact')) return 'contact';

    return 'home'; // Default
  };

  const currentPage = getCurrentPage(location.pathname);

  const navigate = (page: Page, data?: any) => {
    setPageData(data);
    let path = '/';
    switch (page) {
      case 'home': path = '/'; break;
      case 'register': path = '/register'; break;
      case 'login': path = '/login'; break;
      case 'dashboard': path = '/dashboard'; break;
      case 'services': path = '/services'; break;
      case 'service-detail': path = `/services/${data?.id || ''}`; break;
      case 'portfolio': path = '/portfolio'; break;
      case 'portfolio-detail': path = `/portfolio/${data?.id || ''}`; break;
      case 'products': path = '/products'; break;
      case 'category': path = `/category/${data?.slug || ''}`; break;
      case 'label-category': path = `/label-category/${data?.slug || ''}`; break;
      case 'label': path = `/label/${data?.slug || ''}`; break;
      case 'order': path = '/order'; break;
      case 'price-calculator': path = '/price-calculator'; break;
      case 'wallet': path = '/wallet'; break;
      case 'profile': path = '/profile'; break;
      case 'activities': path = '/activities'; break;
      case 'security': path = '/security'; break;
      case 'addresses': path = '/addresses'; break;
      case 'contact': path = '/contact'; break;
      default: path = '/';
    }
    navigateRouter(path);
  };

  const goBack = () => {
    navigateRouter(-1);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigate, pageData, goBack, history }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
}

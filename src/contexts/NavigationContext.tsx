import { createContext, useContext, useState, ReactNode } from 'react';

export type Page = 
  | 'home'
  | 'about'
  | 'services'
  | 'service-detail'
  | 'portfolio'
  | 'portfolio-detail'
  | 'contact'
  | 'order'
  | 'pricing'
  | 'blog'
  | 'gallery';

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricing: {
    basic: number;
    premium: number;
    enterprise: number;
  };
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

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);
  const [history, setHistory] = useState<{ page: Page; data?: any }[]>([{ page: 'home' }]);

  const navigate = (page: Page, data?: any) => {
    setHistory(prev => [...prev, { page, data }]);
    setCurrentPage(page);
    setPageData(data);
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousPage = newHistory[newHistory.length - 1];
      
      setHistory(newHistory);
      setCurrentPage(previousPage.page);
      setPageData(previousPage.data);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <NavigationContext.Provider value={{
      currentPage,
      navigate,
      pageData,
      goBack,
      history
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
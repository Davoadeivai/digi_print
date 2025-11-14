import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Django-style Models
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  role: 'customer' | 'staff' | 'manager' | 'admin';
  role_display: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  features: string[];
  pricing: {
    basic: number;
    premium: number;
    enterprise: number;
  };
  gallery: string[];
  specifications: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  meta_title: string;
  meta_description: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  client: string;
  year: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  images: string[];
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  meta_title: string;
  meta_description: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  project_details: string;
  budget_range: string;
  deadline: string;
  files: string[];
  special_requirements: string;
  status: 'pending' | 'in_review' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  admin_notes: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  admin_notes: string;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  about: string;
  phone: string;
  email: string;
  address: string;
  social_media: {
    instagram: string;
    telegram: string;
    whatsapp: string;
    linkedin: string;
  };
  working_hours: string;
  logo: string;
  favicon: string;
}

export interface NewsletterSubscription {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

// Backend Context Interface
interface BackendContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<ApiResponse<{user: User; token: string}>>;
  logout: () => void;
  register: (userData: Partial<User> & {password: string}) => Promise<ApiResponse<User>>;
  
  // Services
  services: Service[];
  getServices: () => Promise<PaginatedResponse<Service>>;
  getService: (id: number) => Promise<ApiResponse<Service>>;
  createService: (serviceData: Partial<Service>) => Promise<ApiResponse<Service>>;
  updateService: (id: number, serviceData: Partial<Service>) => Promise<ApiResponse<Service>>;
  deleteService: (id: number) => Promise<ApiResponse<null>>;
  
  // Portfolio
  portfolioItems: PortfolioItem[];
  getPortfolioItems: () => Promise<PaginatedResponse<PortfolioItem>>;
  getPortfolioItem: (id: number) => Promise<ApiResponse<PortfolioItem>>;
  createPortfolioItem: (itemData: Partial<PortfolioItem>) => Promise<ApiResponse<PortfolioItem>>;
  updatePortfolioItem: (id: number, itemData: Partial<PortfolioItem>) => Promise<ApiResponse<PortfolioItem>>;
  deletePortfolioItem: (id: number) => Promise<ApiResponse<null>>;
  
  // Orders
  orders: Order[];
  getOrders: () => Promise<PaginatedResponse<Order>>;
  getOrder: (id: number) => Promise<ApiResponse<Order>>;
  createOrder: (orderData: Partial<Order>) => Promise<ApiResponse<Order>>;
  updateOrder: (id: number, orderData: Partial<Order>) => Promise<ApiResponse<Order>>;
  deleteOrder: (id: number) => Promise<ApiResponse<null>>;
  
  // Contact Messages
  contactMessages: ContactMessage[];
  getContactMessages: () => Promise<PaginatedResponse<ContactMessage>>;
  createContactMessage: (messageData: Partial<ContactMessage>) => Promise<ApiResponse<ContactMessage>>;
  markMessageAsRead: (id: number) => Promise<ApiResponse<ContactMessage>>;
  deleteContactMessage: (id: number) => Promise<ApiResponse<null>>;
  
  // Company Settings
  company: Company | null;
  getCompanySettings: () => Promise<ApiResponse<Company>>;
  updateCompanySettings: (companyData: Partial<Company>) => Promise<ApiResponse<Company>>;
  
  // Newsletter
  newsletterSubscriptions: NewsletterSubscription[];
  subscribeToNewsletter: (email: string) => Promise<ApiResponse<NewsletterSubscription>>;
  unsubscribeFromNewsletter: (email: string) => Promise<ApiResponse<null>>;
  
  // Loading states
  loading: {
    services: boolean;
    portfolio: boolean;
    orders: boolean;
    auth: boolean;
    company: boolean;
  };
}

const BackendContext = createContext<BackendContextType | null>(null);

// Mock database simulation using localStorage
class MockDatabase {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`digiprint_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    localStorage.setItem(`digiprint_${key}`, JSON.stringify(value));
  }

  static getServices(): Service[] {
    return this.getItem('services', [
      {
        id: 1,
        title: 'چاپ دیجیتال',
        slug: 'digital-printing',
        description: 'خدمات چاپ دیجیتال با کیفیت بالا و سرعت مناسب',
        short_description: 'چاپ دیجیتال حرفه‌ای',
        features: ['کیفیت بالا', 'سرعت مناسب', 'قیمت مناسب'],
        pricing: { basic: 50000, premium: 150000, enterprise: 300000 },
        gallery: [],
        specifications: ['رزولوشن 300dpi', 'فرمت‌های مختلف'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        meta_title: 'چاپ دیجیتال',
        meta_description: 'خدمات چاپ دیجیتال حرفه‌ای'
      }
    ]);
  }

  static setServices(services: Service[]): void {
    this.setItem('services', services);
  }

  static getPortfolioItems(): PortfolioItem[] {
    return this.getItem('portfolio', [
      {
        id: 1,
        title: 'پروژه طراحی برند شرکت ABC',
        slug: 'abc-brand-design',
        category: 'طراحی برند',
        client: 'شرکت ABC',
        year: '1403',
        description: 'طراحی هویت بصری کامل برای شرکت ABC',
        challenge: 'ایجاد هویت بصری منحصر به فرد',
        solution: 'طراحی لوگو و ست اداری کامل',
        result: 'افزایش شناخت برند تا 200%',
        images: [],
        tags: ['طراحی', 'برند', 'لوگو'],
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        meta_title: 'پروژه طراحی برند ABC',
        meta_description: 'طراحی هویت بصری کامل'
      }
    ]);
  }

  static setPortfolioItems(items: PortfolioItem[]): void {
    this.setItem('portfolio', items);
  }

  static getOrders(): Order[] {
    return this.getItem('orders', []);
  }

  static setOrders(orders: Order[]): void {
    this.setItem('orders', orders);
  }

  static getContactMessages(): ContactMessage[] {
    return this.getItem('contact_messages', []);
  }

  static setContactMessages(messages: ContactMessage[]): void {
    this.setItem('contact_messages', messages);
  }

  static getCompany(): Company {
    return this.getItem('company', {
      id: 1,
      name: 'دیجی چاپوگراف',
      description: 'شرکت چاپ و گرافیک دیجیتال',
      about: 'ما در دیجی چاپوگراف با بیش از 10 سال تجربه، خدمات چاپ و طراحی گرافیک ارائه می‌دهیم.',
      phone: '09123456789',
      email: 'info@digichapograph.com',
      address: 'تهران، خیابان ولیعصر، پلاک 123',
      social_media: {
        instagram: '@digichapograph',
        telegram: '@digichapograph',
        whatsapp: '09123456789',
        linkedin: 'digichapograph'
      },
      working_hours: 'شنبه تا پنج‌شنبه: 8 الی 18',
      logo: '',
      favicon: ''
    });
  }

  static setCompany(company: Company): void {
    this.setItem('company', company);
  }

  static getNewsletterSubscriptions(): NewsletterSubscription[] {
    return this.getItem('newsletter', []);
  }

  static setNewsletterSubscriptions(subscriptions: NewsletterSubscription[]): void {
    this.setItem('newsletter', subscriptions);
  }

  static getUser(): User | null {
    return this.getItem('user', null);
  }

  static setUser(user: User | null): void {
    this.setItem('user', user);
  }
}

export function BackendProvider({ children }: { children: ReactNode }) {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState({
    services: false,
    portfolio: false,
    orders: false,
    auth: false,
    company: false,
  });

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setServices(MockDatabase.getServices());
      setPortfolioItems(MockDatabase.getPortfolioItems());
      setOrders(MockDatabase.getOrders());
      setContactMessages(MockDatabase.getContactMessages());
      setCompany(MockDatabase.getCompany());
      setNewsletterSubscriptions(MockDatabase.getNewsletterSubscriptions());
      setUser(MockDatabase.getUser());
    };

    initializeData();
  }, []);

  // Utility function for potential API delay (currently disabled for faster UI)
  const delay = async (_ms: number) => Promise.resolve();

  // Auth methods
  const login = async (username: string, password: string): Promise<ApiResponse<{user: User; token: string}>> => {
    setLoading(prev => ({ ...prev, auth: true }));
    await delay(1000);
    
    // Mock authentication
    if (username === 'admin' && password === 'admin') {
      const user: User = {
        id: 1,
        username: 'admin',
        email: 'admin@digichapograph.com',
        first_name: 'ادمین',
        last_name: 'سیستم',
        is_staff: true,
        is_active: true,
        date_joined: new Date().toISOString(),
        last_login: new Date().toISOString(),
        role: 'admin',
        role_display: 'مدیر کل'
      };
      
      setUser(user);
      MockDatabase.setUser(user);
      setLoading(prev => ({ ...prev, auth: false }));
      
      return {
        success: true,
        data: { user, token: 'mock-jwt-token-12345' }
      };
    }
    
    setLoading(prev => ({ ...prev, auth: false }));
    return {
      success: false,
      message: 'نام کاربری یا رمز عبور اشتباه است'
    };
  };

  const logout = () => {
    setUser(null);
    MockDatabase.setUser(null);
  };

  const register = async (userData: Partial<User> & {password: string}): Promise<ApiResponse<User>> => {
    setLoading(prev => ({ ...prev, auth: true }));
    await delay(1000);
    
    const role = userData.role || 'staff';
    const roleDisplayMap: Record<User['role'], string> = {
      customer: 'مشتری',
      staff: 'کارمند',
      manager: 'مدیر',
      admin: 'مدیر کل',
    };

    const newUser: User = {
      id: Date.now(),
      username: userData.username || '',
      email: userData.email || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      is_staff: role === 'staff' || role === 'manager' || role === 'admin',
      is_active: true,
      date_joined: new Date().toISOString(),
      role,
      role_display: roleDisplayMap[role],
    };
    
    setLoading(prev => ({ ...prev, auth: false }));
    return {
      success: true,
      data: newUser
    };
  };

  // Services methods
  const getServices = async (): Promise<PaginatedResponse<Service>> => {
    setLoading(prev => ({ ...prev, services: true }));
    await delay(500);
    
    const allServices = MockDatabase.getServices();
    setServices(allServices);
    setLoading(prev => ({ ...prev, services: false }));
    
    return {
      success: true,
      data: {
        results: allServices,
        count: allServices.length,
        next: null,
        previous: null
      }
    };
  };

  const getService = async (id: number): Promise<ApiResponse<Service>> => {
    await delay(300);
    const service = services.find(s => s.id === id);
    
    if (service) {
      return { success: true, data: service };
    }
    
    return { success: false, message: 'سرویس یافت نشد' };
  };

  const createService = async (serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
    await delay(800);
    
    const newService: Service = {
      id: Date.now(),
      title: serviceData.title || '',
      slug: serviceData.slug || serviceData.title?.toLowerCase().replace(/\s+/g, '-') || '',
      description: serviceData.description || '',
      short_description: serviceData.short_description || '',
      features: serviceData.features || [],
      pricing: serviceData.pricing || { basic: 0, premium: 0, enterprise: 0 },
      gallery: serviceData.gallery || [],
      specifications: serviceData.specifications || [],
      is_active: serviceData.is_active !== undefined ? serviceData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      meta_title: serviceData.meta_title || serviceData.title || '',
      meta_description: serviceData.meta_description || serviceData.short_description || ''
    };
    
    const updatedServices = [...services, newService];
    setServices(updatedServices);
    MockDatabase.setServices(updatedServices);
    
    return { success: true, data: newService };
  };

  const updateService = async (id: number, serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
    await delay(800);
    
    const serviceIndex = services.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      return { success: false, message: 'سرویس یافت نشد' };
    }
    
    const updatedService = {
      ...services[serviceIndex],
      ...serviceData,
      updated_at: new Date().toISOString()
    };
    
    const updatedServices = [...services];
    updatedServices[serviceIndex] = updatedService;
    setServices(updatedServices);
    MockDatabase.setServices(updatedServices);
    
    return { success: true, data: updatedService };
  };

  const deleteService = async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    
    const updatedServices = services.filter(s => s.id !== id);
    setServices(updatedServices);
    MockDatabase.setServices(updatedServices);
    
    return { success: true, data: null };
  };

  // Portfolio methods
  const getPortfolioItems = async (): Promise<PaginatedResponse<PortfolioItem>> => {
    setLoading(prev => ({ ...prev, portfolio: true }));
    await delay(500);
    
    const allItems = MockDatabase.getPortfolioItems();
    setPortfolioItems(allItems);
    setLoading(prev => ({ ...prev, portfolio: false }));
    
    return {
      success: true,
      data: {
        results: allItems,
        count: allItems.length,
        next: null,
        previous: null
      }
    };
  };

  const getPortfolioItem = async (id: number): Promise<ApiResponse<PortfolioItem>> => {
    await delay(300);
    const item = portfolioItems.find(p => p.id === id);
    
    if (item) {
      return { success: true, data: item };
    }
    
    return { success: false, message: 'آیتم پورتفولیو یافت نشد' };
  };

  const createPortfolioItem = async (itemData: Partial<PortfolioItem>): Promise<ApiResponse<PortfolioItem>> => {
    await delay(800);
    
    const newItem: PortfolioItem = {
      id: Date.now(),
      title: itemData.title || '',
      slug: itemData.slug || itemData.title?.toLowerCase().replace(/\s+/g, '-') || '',
      category: itemData.category || '',
      client: itemData.client || '',
      year: itemData.year || new Date().getFullYear().toString(),
      description: itemData.description || '',
      challenge: itemData.challenge || '',
      solution: itemData.solution || '',
      result: itemData.result || '',
      images: itemData.images || [],
      tags: itemData.tags || [],
      is_featured: itemData.is_featured || false,
      is_active: itemData.is_active !== undefined ? itemData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      meta_title: itemData.meta_title || itemData.title || '',
      meta_description: itemData.meta_description || itemData.description || ''
    };
    
    const updatedItems = [...portfolioItems, newItem];
    setPortfolioItems(updatedItems);
    MockDatabase.setPortfolioItems(updatedItems);
    
    return { success: true, data: newItem };
  };

  const updatePortfolioItem = async (id: number, itemData: Partial<PortfolioItem>): Promise<ApiResponse<PortfolioItem>> => {
    await delay(800);
    
    const itemIndex = portfolioItems.findIndex(p => p.id === id);
    if (itemIndex === -1) {
      return { success: false, message: 'آیتم پورتفولیو یافت نشد' };
    }
    
    const updatedItem = {
      ...portfolioItems[itemIndex],
      ...itemData,
      updated_at: new Date().toISOString()
    };
    
    const updatedItems = [...portfolioItems];
    updatedItems[itemIndex] = updatedItem;
    setPortfolioItems(updatedItems);
    MockDatabase.setPortfolioItems(updatedItems);
    
    return { success: true, data: updatedItem };
  };

  const deletePortfolioItem = async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    
    const updatedItems = portfolioItems.filter(p => p.id !== id);
    setPortfolioItems(updatedItems);
    MockDatabase.setPortfolioItems(updatedItems);
    
    return { success: true, data: null };
  };

  // Orders methods
  const getOrders = async (): Promise<PaginatedResponse<Order>> => {
    setLoading(prev => ({ ...prev, orders: true }));
    await delay(500);
    
    const allOrders = MockDatabase.getOrders();
    setOrders(allOrders);
    setLoading(prev => ({ ...prev, orders: false }));
    
    return {
      success: true,
      data: {
        results: allOrders,
        count: allOrders.length,
        next: null,
        previous: null
      }
    };
  };

  const getOrder = async (id: number): Promise<ApiResponse<Order>> => {
    await delay(300);
    const order = orders.find(o => o.id === id);
    
    if (order) {
      return { success: true, data: order };
    }
    
    return { success: false, message: 'سفارش یافت نشد' };
  };

  const createOrder = async (orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    await delay(1000);
    
    const newOrder: Order = {
      id: Date.now(),
      customer_name: orderData.customer_name || '',
      customer_email: orderData.customer_email || '',
      customer_phone: orderData.customer_phone || '',
      service_type: orderData.service_type || '',
      project_details: orderData.project_details || '',
      budget_range: orderData.budget_range || '',
      deadline: orderData.deadline || '',
      files: orderData.files || [],
      special_requirements: orderData.special_requirements || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      admin_notes: ''
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    MockDatabase.setOrders(updatedOrders);
    
    return { success: true, data: newOrder };
  };

  const updateOrder = async (id: number, orderData: Partial<Order>): Promise<ApiResponse<Order>> => {
    await delay(800);
    
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return { success: false, message: 'سفارش یافت نشد' };
    }
    
    const updatedOrder = {
      ...orders[orderIndex],
      ...orderData,
      updated_at: new Date().toISOString()
    };
    
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = updatedOrder;
    setOrders(updatedOrders);
    MockDatabase.setOrders(updatedOrders);
    
    return { success: true, data: updatedOrder };
  };

  const deleteOrder = async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    
    const updatedOrders = orders.filter(o => o.id !== id);
    setOrders(updatedOrders);
    MockDatabase.setOrders(updatedOrders);
    
    return { success: true, data: null };
  };

  // Contact Messages methods
  const getContactMessages = async (): Promise<PaginatedResponse<ContactMessage>> => {
    await delay(500);
    
    const allMessages = MockDatabase.getContactMessages();
    setContactMessages(allMessages);
    
    return {
      success: true,
      data: {
        results: allMessages,
        count: allMessages.length,
        next: null,
        previous: null
      }
    };
  };

  const createContactMessage = async (messageData: Partial<ContactMessage>): Promise<ApiResponse<ContactMessage>> => {
    await delay(800);
    
    const newMessage: ContactMessage = {
      id: Date.now(),
      name: messageData.name || '',
      email: messageData.email || '',
      phone: messageData.phone || '',
      subject: messageData.subject || '',
      message: messageData.message || '',
      is_read: false,
      created_at: new Date().toISOString(),
      admin_notes: ''
    };
    
    const updatedMessages = [...contactMessages, newMessage];
    setContactMessages(updatedMessages);
    MockDatabase.setContactMessages(updatedMessages);
    
    return { success: true, data: newMessage };
  };

  const markMessageAsRead = async (id: number): Promise<ApiResponse<ContactMessage>> => {
    await delay(300);
    
    const messageIndex = contactMessages.findIndex(m => m.id === id);
    if (messageIndex === -1) {
      return { success: false, message: 'پیام یافت نشد' };
    }
    
    const updatedMessage = {
      ...contactMessages[messageIndex],
      is_read: true
    };
    
    const updatedMessages = [...contactMessages];
    updatedMessages[messageIndex] = updatedMessage;
    setContactMessages(updatedMessages);
    MockDatabase.setContactMessages(updatedMessages);
    
    return { success: true, data: updatedMessage };
  };

  const deleteContactMessage = async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    
    const updatedMessages = contactMessages.filter(m => m.id !== id);
    setContactMessages(updatedMessages);
    MockDatabase.setContactMessages(updatedMessages);
    
    return { success: true, data: null };
  };

  // Company Settings methods
  const getCompanySettings = async (): Promise<ApiResponse<Company>> => {
    setLoading(prev => ({ ...prev, company: true }));
    await delay(500);
    
    const companyData = MockDatabase.getCompany();
    setCompany(companyData);
    setLoading(prev => ({ ...prev, company: false }));
    
    return { success: true, data: companyData };
  };

  const updateCompanySettings = async (companyData: Partial<Company>): Promise<ApiResponse<Company>> => {
    setLoading(prev => ({ ...prev, company: true }));
    await delay(800);
    
    const updatedCompany = {
      ...company!,
      ...companyData
    };
    
    setCompany(updatedCompany);
    MockDatabase.setCompany(updatedCompany);
    setLoading(prev => ({ ...prev, company: false }));
    
    return { success: true, data: updatedCompany };
  };

  // Newsletter methods
  const subscribeToNewsletter = async (email: string): Promise<ApiResponse<NewsletterSubscription>> => {
    await delay(500);
    
    // Check if already subscribed
    const existingSubscription = newsletterSubscriptions.find(sub => sub.email === email);
    if (existingSubscription) {
      return { success: false, message: 'این ایمیل قبلاً عضو خبرنامه است' };
    }
    
    const newSubscription: NewsletterSubscription = {
      id: Date.now(),
      email,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    const updatedSubscriptions = [...newsletterSubscriptions, newSubscription];
    setNewsletterSubscriptions(updatedSubscriptions);
    MockDatabase.setNewsletterSubscriptions(updatedSubscriptions);
    
    return { success: true, data: newSubscription };
  };

  const unsubscribeFromNewsletter = async (email: string): Promise<ApiResponse<null>> => {
    await delay(500);
    
    const updatedSubscriptions = newsletterSubscriptions.filter(sub => sub.email !== email);
    setNewsletterSubscriptions(updatedSubscriptions);
    MockDatabase.setNewsletterSubscriptions(updatedSubscriptions);
    
    return { success: true, data: null };
  };

  const contextValue: BackendContextType = {
    // Auth
    user,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    
    // Services
    services,
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    
    // Portfolio
    portfolioItems,
    getPortfolioItems,
    getPortfolioItem,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    
    // Orders
    orders,
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    
    // Contact Messages
    contactMessages,
    getContactMessages,
    createContactMessage,
    markMessageAsRead,
    deleteContactMessage,
    
    // Company Settings
    company,
    getCompanySettings,
    updateCompanySettings,
    
    // Newsletter
    newsletterSubscriptions,
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
    
    // Loading states
    loading
  };

  return (
    <BackendContext.Provider value={contextValue}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error('useBackend must be used within BackendProvider');
  }
  return context;
}
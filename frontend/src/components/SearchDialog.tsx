import React, { useState, useEffect } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Badge } from './ui/badge';
import { Search, Tag, Package, Clock, Star, Phone, Mail, FileText, Home, User, ShoppingBag } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'product' | 'category' | 'page' | 'service';
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { navigate } = useNavigation();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Static pages and navigation
  const staticResults: SearchResult[] = [
    {
      id: 'home',
      title: 'خانه',
      description: 'صفحه اصلی دیجی چاپوگراف',
      type: 'page',
      icon: <Home className="w-4 h-4" />,
      action: () => navigate('home'),
      keywords: ['صفحه اصلی', 'خانه', 'فروشگاه']
    },
    {
      id: 'products',
      title: 'محصولات',
      description: 'تمامی محصولات چاپی',
      type: 'page',
      icon: <Package className="w-4 h-4" />,
      action: () => navigate('category', { slug: 'label' }),
      keywords: ['محصولات', 'چاپ', 'لیبل', 'برچسب']
    },
    {
      id: 'services',
      title: 'خدمات',
      description: 'خدمات چاپ و طراحی',
      type: 'page',
      icon: <FileText className="w-4 h-4" />,
      action: () => navigate('services'),
      keywords: ['خدمات', 'طراحی', 'چاپ']
    },
    {
      id: 'portfolio',
      title: 'نمونه کارها',
      description: 'نمونه کارهای انجام شده',
      type: 'page',
      icon: <Package className="w-4 h-4" />,
      action: () => navigate('portfolio'),
      keywords: ['نمونه کار', 'پورتفولیو', 'کارهای ما']
    },
    {
      id: 'contact',
      title: 'تماس با ما',
      description: 'اطلاعات تماس و آدرس',
      type: 'page',
      icon: <Phone className="w-4 h-4" />,
      action: () => navigate('contact'),
      keywords: ['تماس', 'ارتباط', 'آدرس', 'تلفن']
    },
    {
      id: 'order',
      title: 'درخواست قیمت',
      description: 'ثبت سفارش و استعلام قیمت',
      type: 'page',
      icon: <ShoppingBag className="w-4 h-4" />,
      action: () => navigate('order'),
      keywords: ['سفارش', 'قیمت', 'استعلام', 'خرید']
    },
    {
      id: 'login',
      title: 'ورود',
      description: 'ورود به حساب کاربری',
      type: 'page',
      icon: <User className="w-4 h-4" />,
      action: () => navigate('login'),
      keywords: ['ورود', 'لاگین', 'حساب کاربری']
    }
  ];

  // Fetch products and categories from API
  const fetchSearchData = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(staticResults);
      return;
    }

    setLoading(true);
    try {
      const results: SearchResult[] = [...staticResults];

      // Search products
      try {
        const productsResponse = await fetch(`/api/v1/products/?search=${encodeURIComponent(query)}`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const products = (productsData.results || productsData).slice(0, 5);
          
          products.forEach((product: any) => {
            results.push({
              id: `product-${product.id}`,
              title: product.name,
              description: product.short_description,
              type: 'product',
              icon: <Package className="w-4 h-4" />,
              action: () => navigate('label', { slug: product.slug }),
              keywords: [product.name, product.short_description, 'لیبل', 'برچسب', 'چاپ']
            });
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }

      // Search categories
      try {
        const categoriesResponse = await fetch(`/api/v1/categories/?search=${encodeURIComponent(query)}`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const categories = (categoriesData.results || categoriesData).slice(0, 3);
          
          categories.forEach((category: any) => {
            results.push({
              id: `category-${category.id}`,
              title: category.name,
              description: category.description,
              type: 'category',
              icon: <Tag className="w-4 h-4" />,
              action: () => navigate('category', { slug: category.slug }),
              keywords: [category.name, category.description, 'دسته‌بندی', 'گروه']
            });
          });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(staticResults);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchResults(staticResults);
  }, []);

  const handleSearch = (value: string) => {
    fetchSearchData(value);
  };

  const handleSelect = (result: SearchResult) => {
    result.action();
    onOpenChange(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4 text-purple-600" />;
      case 'category':
        return <Tag className="w-4 h-4 text-blue-600" />;
      case 'page':
        return <FileText className="w-4 h-4 text-green-600" />;
      default:
        return <Search className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return 'محصول';
      case 'category':
        return 'دسته‌بندی';
      case 'page':
        return 'صفحه';
      default:
        return type;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border shadow-md" shouldFilter={false}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="جستجوی محصولات، صفحات و..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onValueChange={handleSearch}
          />
        </div>
        <CommandList>
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="mr-2 text-muted-foreground">در حال جستجو...</span>
              </div>
            ) : (
              <div className="text-center py-6">
                <Search className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">موردی یافت نشد</p>
                <p className="text-sm text-muted-foreground mt-1">
                  با کلمات کلیدی دیگری尝试 کنید
                </p>
              </div>
            )}
          </CommandEmpty>

          {/* Products Group */}
          {searchResults.filter(r => r.type === 'product').length > 0 && (
            <CommandGroup heading="محصولات">
              {searchResults.filter(r => r.type === 'product').map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getIconForType(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{result.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Categories Group */}
          {searchResults.filter(r => r.type === 'category').length > 0 && (
            <CommandGroup heading="دسته‌بندی‌ها">
              {searchResults.filter(r => r.type === 'category').map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getIconForType(result.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{result.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Pages Group */}
          {searchResults.filter(r => r.type === 'page').length > 0 && (
            <CommandGroup heading="صفحات">
              {searchResults.filter(r => r.type === 'page').map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {result.icon}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{result.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Quick Actions */}
          <CommandGroup heading="دسترسی سریع">
            <CommandItem
              onSelect={() => {
                navigate('order');
                onOpenChange(false);
              }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">درخواست قیمت جدید</p>
                <p className="text-xs text-muted-foreground">ثبت سفارش فوری</p>
              </div>
            </CommandItem>
            
            <CommandItem
              onSelect={() => {
                navigate('contact');
                onOpenChange(false);
              }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
            >
              <Phone className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">تماس با کارشناس</p>
                <p className="text-xs text-muted-foreground">۰۲۱-۱۲۳۴۵۶۷۸</p>
              </div>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                window.open('tel:02112345678', '_self');
                onOpenChange(false);
              }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent rounded-md transition-colors"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">تماس تلفنی فوری</p>
                <p className="text-xs text-muted-foreground">اتصال خودکار</p>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

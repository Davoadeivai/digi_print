import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Search,
  Filter,
  Clock,
  Zap,
  Package,
  Star,
  Tag,
  ChevronRight,
  Phone,
  MessageCircle,
  Truck,
  Sparkles,
  Award,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { getRandomImage } from '../../utils/images';

interface LabelProduct {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  image_url?: string;
  print_type: string;
  min_quantity: number;
  max_quantity: number;
  delivery_time_hours: number;
  base_price: number;
  is_featured: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  children?: Category[];
  product_count: number;
}

export default function LabelCategoryPage() {
  const { navigate, pageData } = useNavigation();
  const slug = pageData?.slug || 'label';
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<LabelProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);

      // Try to fetch categories
      try {
        const categoriesResponse = await fetch(`/api/v1/categories/`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const categoryData = (categoriesData.results || categoriesData).find((cat: any) => cat.slug === slug);

          if (categoryData) {
            setCategory(categoryData);

            // Fetch products for this category
            const productsResponse = await fetch(`/api/v1/products/?category=${categoryData.id}`);
            if (productsResponse.ok) {
              const productsData = await productsResponse.json();
              setProducts(productsData.results || productsData || []);
            }
          }
        }
      } catch (error) {
        console.log('Categories API not available, using fallback');
      }

      // If no category found, use fallback data
      if (!category) {
        setCategory({
          id: 1,
          name: 'لیبل و برچسب',
          slug: 'label',
          description: 'چاپ انواع لیبل و برچسب با کیفیت بالا و قیمت مناسب',
          product_count: 0
        });

        // Try to fetch all products as fallback
        try {
          const productsResponse = await fetch(`/api/v1/products/`);
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            setProducts(productsData.results || productsData || []);
          }
        } catch (error) {
          console.log('Products API not available');
        }
      }

    } catch (error) {
      console.error('Error loading category:', error);
      // Set fallback category
      setCategory({
        id: 1,
        name: 'محصولات',
        slug: slug,
        description: 'مشاهده تمام محصولات',
        product_count: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.short_description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterType === 'all' ||
        (filterType === 'digital' && product.print_type === 'digital') ||
        (filterType === 'offset' && product.print_type === 'offset') ||
        (filterType === 'featured' && product.is_featured);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.base_price - b.base_price;
        case 'price_high':
          return b.base_price - a.base_price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'delivery_time':
          return a.delivery_time_hours - b.delivery_time_hours;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-40 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl mb-8"></div>
            <div className="h-10 bg-slate-200 rounded-xl w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-white rounded-2xl shadow-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Tag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">دسته‌بندی یافت نشد</h1>
          <p className="text-gray-600 mb-8">متأسفانه دسته‌بندی مورد نظر شما یافت نشد</p>
          <Button
            onClick={() => navigate('products')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت به محصولات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2">
              <Sparkles className="w-4 h-4 ml-2 inline animate-pulse" />
              {products.length} محصول موجود
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              {category.name}
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-3xl mx-auto">
              {category.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20">
                <Zap className="w-8 h-8 mb-3 mx-auto text-yellow-300 group-hover:animate-bounce" />
                <div className="text-3xl font-bold mb-1">2 ساعته</div>
                <div className="text-sm text-white/80 font-medium">تحویل فوری</div>
              </div>

              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20">
                <Package className="w-8 h-8 mb-3 mx-auto text-blue-300 group-hover:animate-bounce" />
                <div className="text-3xl font-bold mb-1">{products.length}+</div>
                <div className="text-sm text-white/80 font-medium">نوع محصول</div>
              </div>

              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20">
                <Award className="w-8 h-8 mb-3 mx-auto text-green-300 group-hover:animate-bounce" />
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm text-white/80 font-medium">کیفیت تضمینی</div>
              </div>

              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20">
                <Truck className="w-8 h-8 mb-3 mx-auto text-purple-300 group-hover:animate-bounce" />
                <div className="text-3xl font-bold mb-1">سراسری</div>
                <div className="text-sm text-white/80 font-medium">ارسال رایگان</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input
                placeholder="جستجوی محصول..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl transition-all"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl">
                <SelectValue placeholder="نوع چاپ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه محصولات</SelectItem>
                <SelectItem value="digital">چاپ دیجیتال</SelectItem>
                <SelectItem value="offset">چاپ افست</SelectItem>
                <SelectItem value="featured">محصولات ویژه</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl">
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">جدیدترین</SelectItem>
                <SelectItem value="price_low">ارزانترین</SelectItem>
                <SelectItem value="price_high">گرانترین</SelectItem>
                <SelectItem value="name">الفبا</SelectItem>
                <SelectItem value="delivery_time">سریعترین تحویل</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-12 border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl transition-all">
              <Filter className="w-5 h-5 ml-2" />
              فیلترهای پیشرفته
            </Button>
          </div>
        </div>

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
              دسته‌بندی‌های مرتبط
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.children.map((child) => (
                <Card
                  key={child.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border-2 border-transparent hover:border-indigo-200"
                  onClick={() => navigate('category', { slug: child.slug })}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors">{child.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{child.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                        {child.product_count} محصول
                      </Badge>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              محصولات ({filteredAndSortedProducts.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingCart className="w-5 h-5" />
              <span>آماده سفارش</span>
            </div>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="text-gray-300 mb-6">
                <Search className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">محصولی یافت نشد</h3>
              <p className="text-gray-600 mb-6">با تغییر فیلترها یا جستجوی خود دوباره تلاش کنید</p>
              <Button
                onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                پاک کردن فیلترها
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white border-2 border-transparent hover:border-indigo-200 hover:-translate-y-3"
                  onClick={() => navigate('label', { slug: product.slug })}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                    <img
                      src={product.image_url || getRandomImage(product.id)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = getRandomImage(product.id);
                        if (target.src !== window.location.origin + fallback) {
                          target.src = fallback;
                        }
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {product.is_featured && (
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg animate-pulse">
                        <Star className="w-3 h-3 ml-1 fill-current" />
                        ویژه
                      </Badge>
                    )}
                    <Badge className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 border-0 shadow-lg">
                      {product.print_type === 'digital' ? '🖨️ دیجیتال' : '📰 افست'}
                    </Badge>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Button className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl">
                        مشاهده سریع
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {product.short_description}
                    </p>

                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">{product.delivery_time_hours}h</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Package className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">{product.min_quantity}+</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">قیمت از</div>
                        <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {product.base_price.toLocaleString()}
                          <span className="text-sm font-normal text-gray-500 mr-1">تومان</span>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105">
                        <ChevronRight className="w-4 h-4 mr-1" />
                        جزئیات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <CardContent className="p-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
                  <Sparkles className="w-3 h-3 ml-1" />
                  پیشنهاد ویژه
                </Badge>
                <h2 className="text-4xl font-black mb-4">آماده سفارش هستید؟</h2>
                <p className="text-white/90 text-lg mb-8">
                  با کارشناسان ما تماس بگیرید و سفارش خود را در سریع‌ترین زمان ممکن با بهترین قیمت ثبت کنید
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl h-12 px-6">
                    <Phone className="w-5 h-5 ml-2" />
                    تماس فوری
                  </Button>
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 h-12 px-6">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    مشاوره رایگان
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-4xl font-black mb-2">۲۴/۷</div>
                  <div className="text-sm text-white/80">پشتیبانی آنلاین</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-4xl font-black mb-2">۱۰۰٪</div>
                  <div className="text-sm text-white/80">رضایت مشتری</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-4xl font-black mb-2">۵۰٪</div>
                  <div className="text-sm text-white/80">تخفیف حجمی</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="text-4xl font-black mb-2">سراسری</div>
                  <div className="text-sm text-white/80">ارسال رایگان</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

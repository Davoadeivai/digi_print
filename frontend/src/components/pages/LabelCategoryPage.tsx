import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
  DollarSign,
  ChevronRight,
  Phone,
  MessageCircle,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';

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
  const slug = pageData?.slug;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<LabelProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      
      // دریافت اطلاعات دسته‌بندی - ابتدا با slug پیدا کردن
      const categoriesResponse = await fetch(`http://127.0.0.1:8000/api/v1/categories/`);
      if (!categoriesResponse.ok) throw new Error('دسته‌بندی‌ها یافت نشد');
      const categoriesData = await categoriesResponse.json();
      
      // پیدا کردن دسته‌بندی با slug مورد نظر
      const categoryData = categoriesData.results.find((cat: any) => cat.slug === slug);
      if (!categoryData) throw new Error('دسته‌بندی یافت نشد');
      
      setCategory(categoryData);

      // دریافت محصولات دسته‌بندی
      const productsResponse = await fetch(`http://127.0.0.1:8000/api/v1/products/?category=${categoryData.id}`);
      if (!productsResponse.ok) throw new Error('محصولات یافت نشد');
      const productsData = await productsResponse.json();
      setProducts(productsData.results || []);

    } catch (error) {
      toast.error('خطا در بارگذاری اطلاعات');
      console.error(error);
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
          return 0; // created_at (newest first)
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">دسته‌بندی یافت نشد</h1>
          <Button onClick={() => navigate('category', { slug: 'label' })}>
            بازگشت به محصولات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Tag className="w-3 h-3 ml-1" />
              {category.product_count} محصول
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {category.name}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {category.description}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Zap className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">2 ساعته</div>
                <div className="text-sm text-white/80">تحویل فوری</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Package className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">10+</div>
                <div className="text-sm text-white/80">نوع لیبل</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <DollarSign className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">ارزان</div>
                <div className="text-sm text-white/80">قیمت مناسب</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Truck className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">سراسری</div>
                <div className="text-sm text-white/80">ارسال به سراسر کشور</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="جستجوی محصول..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
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
              <SelectTrigger>
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

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فیلترها
            </Button>
          </div>
        </div>

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">دسته‌بندی‌های مرتبط</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.children.map((child) => (
                <Card 
                  key={child.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('category', { slug: child.slug })}
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{child.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{child.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{child.product_count} محصول</Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              محصولات ({filteredAndSortedProducts.length})
            </h2>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-600">با تغییر فیلترها یا جستجوی خود دوباره تلاش کنید</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                  onClick={() => navigate('label', { slug: product.slug })}
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Tag className="w-12 h-12 text-purple-400" />
                      </div>
                    )}
                    {product.is_featured && (
                      <Badge className="absolute top-3 right-3 bg-yellow-500">
                        <Star className="w-3 h-3 ml-1" />
                        ویژه
                      </Badge>
                    )}
                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                      {product.print_type === 'digital' ? 'دیجیتال' : 'افست'}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{product.delivery_time_hours} ساعت</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package className="w-4 h-4" />
                        <span>{product.min_quantity}+</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {product.base_price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">تومان از</div>
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        مشاهده جزئیات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  آماده سفارش هستید؟
                </h2>
                <p className="text-white/90 mb-6">
                  با کارشناسان ما تماس بگیرید و سفارش خود را در سریع‌ترین زمان ممکن ثبت کنید
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100">
                    <Phone className="w-4 h-4 ml-2" />
                    تماس فوری
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    <MessageCircle className="w-4 h-4 ml-2" />
                    مشاوره رایگان
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">۲۴ ساعت</div>
                  <div className="text-sm text-white/80">پشتیبانی آنلاین</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">۱۰۰٪</div>
                  <div className="text-sm text-white/80">رضایت مشتری</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">۵۰٪</div>
                  <div className="text-sm text-white/80">تخفیف حجمی</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">سراسر کشور</div>
                  <div className="text-sm text-white/80">ارسال سریع</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

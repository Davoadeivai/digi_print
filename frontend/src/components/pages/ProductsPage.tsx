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
  DollarSign,
  ChevronRight,
  Phone,
  MessageCircle,
  Truck,
  BarChart3,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { getRandomImage } from '../../utils/images';

interface Product {
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

export default function ProductsPage() {
  const { navigate } = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const productsResponse = await fetch('/api/v1/products/');
      if (!productsResponse.ok) throw new Error('محصولات یافت نشد');
      const productsData = await productsResponse.json();
      setProducts(productsData.results || productsData);

      const categoriesResponse = await fetch('/api/v1/categories/');
      if (!categoriesResponse.ok) throw new Error('دسته‌بندی‌ها یافت نشد');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.results || categoriesData);

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
          return 0;
      }
    });

  const getStockPercentage = (productId: number) => {
    return 30 + (productId % 60);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Tag className="w-3 h-3 ml-1" />
              {products.length} محصول
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              محصولات چاپی
            </h1>
            <p className="text-xl text-white/90 mb-8">
              تمام خدمات چاپ دیجیتال و افست با بهترین کیفیت و قیمت
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Zap className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">2 ساعته</div>
                <div className="text-sm text-white/80">تحویل فوری</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <Package className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">{products.length}+</div>
                <div className="text-sm text-white/80">نوع محصول</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <DollarSign className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">مناسب</div>
                <div className="text-sm text-white/80">قیمت رقابتی</div>
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
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">دسته‌بندی‌ها</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('category', { slug: category.slug })}
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{category.product_count} محصول</Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredAndSortedProducts.map((product) => {
                const stockPercentage = getStockPercentage(product.id);
                const isLowStock = stockPercentage < 30;

                return (
                  <Card
                    key={product.id}
                    className="product-card group relative cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-purple-200"
                    onClick={() => navigate('label', { slug: product.slug })}
                  >
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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

                      {/* Overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badges - Only show on image */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {product.is_featured && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                            <Star className="w-3 h-3 ml-1 fill-current" />
                            ویژه
                          </Badge>
                        )}
                        <Badge className="bg-white/95 backdrop-blur-sm text-gray-800 border-0">
                          {product.print_type === 'digital' ? '🖨️ دیجیتال' : '📰 افست'}
                        </Badge>
                      </div>

                      {/* Quick Info on Hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-between text-white text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{product.delivery_time_hours}h</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>{product.min_quantity}+</span>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isLowStock ? 'bg-red-500/80' : 'bg-green-500/80'}`}>
                            <BarChart3 className="w-3 h-3" />
                            <span className="text-xs">{isLowStock ? 'محدود' : 'موجود'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section - Clean & Minimal */}
                    <CardContent className="p-5">
                      {/* Category Tag */}
                      <Badge variant="outline" className="text-xs mb-3 border-purple-200 text-purple-600">
                        <Tag className="w-3 h-3 ml-1" />
                        {product.category.name}
                      </Badge>

                      {/* Title */}
                      <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Rating - Compact */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">(4.0)</span>
                      </div>

                      {/* Description - Short */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {product.short_description}
                      </p>

                      {/* Expandable Details Section - ACCORDION */}
                      <div className="mb-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const card = e.currentTarget.closest('.product-card');
                            card?.classList.toggle('details-expanded');
                          }}
                          className="w-full flex items-center justify-between py-2.5 px-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg transition-all text-sm font-medium text-purple-700 group/accordion"
                        >
                          <span className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            جزئیات بیشتر
                          </span>
                          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/accordion:-rotate-90" />
                        </button>

                        {/* Collapsible Content */}
                        <div className="accordion-content overflow-hidden transition-all duration-300 max-h-0">
                          <div className="pt-3 space-y-2.5">
                            {/* Delivery Time */}
                            <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span className="text-xs text-gray-600">زمان تحویل</span>
                              </div>
                              <span className="text-sm font-bold text-purple-600">
                                {product.delivery_time_hours} ساعت
                              </span>
                            </div>

                            {/* Quantity Range */}
                            <div className="flex items-center justify-between p-2.5 bg-pink-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-pink-600" />
                                <span className="text-xs text-gray-600">محدوده تعداد</span>
                              </div>
                              <span className="text-sm font-bold text-pink-600">
                                {product.min_quantity} - {product.max_quantity}
                              </span>
                            </div>

                            {/* Stock Status */}
                            <div className="p-2.5 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4 text-gray-600" />
                                  <span className="text-xs text-gray-600">وضعیت موجودی</span>
                                </div>
                                <span className={`text-xs font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
                                  {isLowStock ? 'محدود' : 'موجود'}
                                </span>
                              </div>
                              <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`absolute top-0 right-0 h-full rounded-full transition-all ${isLowStock ? 'bg-red-500' : 'bg-green-500'
                                    }`}
                                  style={{ width: `${stockPercentage}%` }}
                                />
                              </div>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-0">
                                <Award className="w-3 h-3 ml-1" />
                                کیفیت تضمینی
                              </Badge>
                              {product.base_price > 50000 && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-0">
                                  <Truck className="w-3 h-3 ml-1" />
                                  ارسال رایگان
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">قیمت از</div>
                          <div className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {product.base_price.toLocaleString()}
                            <span className="text-xs font-normal text-gray-500 mr-1">تومان</span>
                          </div>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-105"
                          size="sm"
                        >
                          <ChevronRight className="w-4 h-4 mr-1" />
                          مشاهده
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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

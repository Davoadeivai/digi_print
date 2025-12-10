import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Calculator, 
  Upload, 
  Clock, 
  CheckCircle, 
  Star, 
  Shield, 
  Zap, 
  Package,
  Tag,
  DollarSign,
  Ruler,
  Palette,
  Truck,
  Phone,
  MessageCircle,
  ArrowRight,
  FileText,
  Users,
  Sparkles,
  ThumbsUp,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';
import { useProductData } from '../../hooks/useProductData';
import { usePriceCalculator } from '../../hooks/usePriceCalculator';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import ReviewForm from '../ReviewForm';

interface LabelProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  image_url?: string;
  print_type: string;
  min_quantity: number;
  max_quantity: number;
  delivery_time_hours: number;
  base_price: number;
  price_per_extra?: number;
  has_design_service: boolean;
  has_online_calculator: boolean;
  has_file_upload: boolean;
  is_featured: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  available_papers?: Array<{
    id: number;
    name: string;
    gram_weight: number;
    price_per_sheet: number;
    is_fancy: boolean;
    texture: string;
  }>;
}

interface PriceCalculator {
  quantity: number;
  size_width: number;
  size_height: number;
  paper_type_id?: number;
  include_design: boolean;
  has_lamination: boolean;
  has_uv_coating: boolean;
}

export default function LabelPage() {
  const { navigate, pageData } = useNavigation();
  const slug = pageData?.slug;
  const [activeTab, setActiveTab] = useState('overview');

  // استفاده از Custom Hooks
  const { product, loading, error: productError } = useProductData(slug);
  const { 
    calculatorData, 
    setCalculatorData, 
    calculatedPrice, 
    calculating, 
    error: calculatorError,
    calculatePrice 
  } = usePriceCalculator(product?.id);
  const { isFavorite, addToWishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleWishlist = () => {
    if (!product) return;
    
    if (isFavorite(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        product_id: product.id,
        name: product.name,
        image: product.image_url || '',
        price: product.base_price,
        id: product.id
      });
    }
  };

  const handleAddToCart = () => {
    if (!product || !calculatedPrice) {
      toast.error('لطفا ابتدا قیمت را محاسبه کنید');
      return;
    }

    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      product_id: product.id,
      quantity: calculatorData.quantity,
      size_width: calculatorData.size_width,
      size_height: calculatorData.size_height,
      price: calculatedPrice.unit_price,
      options: {
        design: calculatorData.include_design,
        lamination: calculatorData.has_lamination,
        uv_coating: calculatorData.has_uv_coating
      }
    };

    addItem(cartItem);
    toast.success(`${calculatorData.quantity} عدد به سبد خرید اضافه شد`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {productError || 'محصول یافت نشد'}
          </h1>
          <Button onClick={() => navigate('category', { slug: 'label' })}>
            بازگشت به محصولات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                <Tag className="w-3 h-3 ml-1" />
                {product?.category.name}
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              {product?.name}
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              {product?.short_description}
            </p>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Clock className="w-6 h-6 mb-2 text-yellow-300" />
                <div className="text-2xl font-bold">{product?.delivery_time_hours}h</div>
                <div className="text-sm text-white/80">تحویل فوری</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Package className="w-6 h-6 mb-2 text-blue-300" />
                <div className="text-2xl font-bold">{product?.min_quantity}+</div>
                <div className="text-sm text-white/80">تیراژ</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Zap className="w-6 h-6 mb-2 text-green-300" />
                <div className="text-2xl font-bold">{product?.print_type === 'digital' ? 'دیجیتال' : 'افست'}</div>
                <div className="text-sm text-white/80">نوع چاپ</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <DollarSign className="w-6 h-6 mb-2 text-purple-300" />
                <div className="text-2xl font-bold">{product?.base_price.toLocaleString()}</div>
                <div className="text-sm text-white/80">قیمت پایه</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl p-1">
                <TabsTrigger value="overview" className="rounded-lg">
                  <FileText className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">مرور</span>
                </TabsTrigger>
                <TabsTrigger value="features" className="rounded-lg">
                  <Shield className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">ویژگی‌ها</span>
                </TabsTrigger>
                <TabsTrigger value="papers" className="rounded-lg">
                  <Palette className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">کاغذ‌ها</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg">
                  <Star className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">نظرات</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {product?.image_url && (
                  <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      {product.is_featured && (
                        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-pulse">
                          <Star className="w-3 h-3 ml-1 fill-current" />
                          ویژه
                        </Badge>
                      )}
                    </div>
                  </Card>
                )}

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Tag className="w-6 h-6 text-purple-600" />
                      توضیحات کامل
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>{product?.description}</p>
                      <Separator />
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">کیفیت تضمینی</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">تحویل سریع</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">قیمت منطقی</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6 mt-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Shield className="w-6 h-6 text-purple-600" />
                      مزایا و ویژگی‌های محصول
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">چاپ با کیفیت بالا</h4>
                          <p className="text-sm text-gray-600">کیفیت چاپ عالی با رنگ‌های زنده و ماندگار</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                        <Zap className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">تحویل فوری</h4>
                          <p className="text-sm text-gray-600">تحویل سریع در کوتاه‌ترین زمان ممکن</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                        <DollarSign className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">قیمت مناسب</h4>
                          <p className="text-sm text-gray-600">بهترین قیمت با کیفیت عالی</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-xl">
                        <Users className="w-6 h-6 text-pink-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">مشاوره رایگان</h4>
                          <p className="text-sm text-gray-600">مشاوره تخصصی قبل از چاپ</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Papers Tab */}
              <TabsContent value="papers" className="space-y-6 mt-6">
                {product?.available_papers && product.available_papers.length > 0 ? (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Palette className="w-6 h-6 text-purple-600" />
                        انواع کاغذ قابل استفاده
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.available_papers.map((paper) => (
                          <div key={paper.id} className="border-2 border-gray-200 hover:border-purple-400 rounded-xl p-5 transition-all hover:shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-gray-900">{paper.name}</h4>
                              {paper.is_fancy && (
                                <Badge className="bg-purple-100 text-purple-700">فانتزی</Badge>
                              )}
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-purple-500" />
                                <span>گرماژ: {paper.gram_weight} گرم</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-purple-500" />
                                <span>بافت: {paper.texture}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-purple-500" />
                                <span>قیمت: {paper.price_per_sheet.toLocaleString()} تومان</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-lg">
                    <CardContent className="p-8 text-center text-gray-500">
                      اطلاعات کاغذ موجود نیست
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <ReviewForm productId={product.id} />
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Star className="w-6 h-6 text-purple-600" />
                      نظرات مشتریان
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>مح</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">محمد احمدی</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">محصول فوق‌العاده بود. کیفیت چاپ عالی و تحویل به موقع.</p>
                          <p className="text-xs text-gray-500 mt-2">۳ روز پیش</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Calculator Card */}
            <Card className="shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  ماشین حساب قیمت
                </CardTitle>
                <CardDescription className="text-white/80">
                  محاسبه دقیق قیمت سفارش
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    تعداد (عدد)
                  </label>
                  <input
                    type="number"
                    min={product?.min_quantity}
                    max={product?.max_quantity}
                    value={calculatorData.quantity}
                    onChange={(e) => setCalculatorData({...calculatorData, quantity: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-purple-500 rounded-lg transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    حداقل {product?.min_quantity} - حداکثر {product?.max_quantity}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">عرض (سم)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorData.size_width}
                      onChange={(e) => setCalculatorData({...calculatorData, size_width: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border-2 border-gray-300 focus:border-purple-500 rounded-lg transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">ارتفاع (سم)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorData.size_height}
                      onChange={(e) => setCalculatorData({...calculatorData, size_height: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border-2 border-gray-300 focus:border-purple-500 rounded-lg transition-all"
                    />
                  </div>
                </div>

                {product?.has_design_service && (
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-all border-2 border-transparent hover:border-purple-300">
                    <input
                      type="checkbox"
                      checked={calculatorData.include_design}
                      onChange={(e) => setCalculatorData({...calculatorData, include_design: e.target.checked})}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">شامل طراحی</span>
                  </label>
                )}

                <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-all border-2 border-transparent hover:border-purple-300">
                  <input
                    type="checkbox"
                    checked={calculatorData.has_lamination}
                    onChange={(e) => setCalculatorData({...calculatorData, has_lamination: e.target.checked})}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">لمینت</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-all border-2 border-transparent hover:border-purple-300">
                  <input
                    type="checkbox"
                    checked={calculatorData.has_uv_coating}
                    onChange={(e) => setCalculatorData({...calculatorData, has_uv_coating: e.target.checked})}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">پوشش UV</span>
                </label>

                {calculatorError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-sm text-red-700">{calculatorError}</p>
                  </div>
                )}

                <Button 
                  onClick={calculatePrice} 
                  disabled={calculating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {calculating ? (
                    <>
                      <Zap className="w-4 h-4 ml-2 animate-spin" />
                      در حال محاسبه...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 ml-2" />
                      محاسبه قیمت
                    </>
                  )}
                </Button>

                {calculatedPrice && (
                  <div className="mt-4 p-5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200 space-y-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-medium mb-2">قیمت کل:</p>
                      <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {calculatedPrice.total_price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">تومان</p>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-2 text-center text-sm">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">قیمت واحد</p>
                        <p className="font-bold text-purple-600">{calculatedPrice.unit_price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">زمان تحویل</p>
                        <p className="font-bold text-pink-600">{calculatedPrice.delivery_time_hours}h</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  اقدامات سریع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!calculatedPrice}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-11 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  افزودن به سبد خرید
                </Button>
                <Button
                  onClick={handleWishlist}
                  variant="outline"
                  className={`w-full h-11 border-2 font-semibold transition-all ${
                    product && isFavorite(product.id)
                      ? 'bg-red-50 border-red-500 text-red-600 hover:bg-red-100'
                      : 'border-gray-300 hover:border-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 ml-2 ${
                      product && isFavorite(product.id) ? 'fill-current' : ''
                    }`} 
                  />
                  {product && isFavorite(product.id) 
                    ? 'حذف از علاقه‌مندی‌ها' 
                    : 'افزودن به علاقه‌مندی‌ها'
                  }
                </Button>
                <Button variant="outline" className="w-full h-11 border-2 hover:border-purple-500 hover:bg-purple-50 font-semibold transition-all">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  مشاوره رایگان
                </Button>
                <Button variant="outline" className="w-full h-11 border-2 hover:border-pink-500 hover:bg-pink-50 font-semibold transition-all">
                  <Phone className="w-4 h-4 ml-2" />
                  تماس با کارشناس
                </Button>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="shadow-xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg">اطلاعات تماس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Phone className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">تلفن</p>
                    <p className="font-semibold text-gray-900">۰۲۱-۸۸۸۳۶۴۳۹</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Truck className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">ارسال</p>
                    <p className="font-semibold text-gray-900">سراسر کشور</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">تحویل</p>
                    <p className="font-semibold text-gray-900">فوری در تهران</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
      `}</style>
    </div>
  );
}

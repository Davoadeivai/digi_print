import React, { useState, useEffect } from 'react';
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
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

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
  const [product, setProduct] = useState<LabelProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculatorData, setCalculatorData] = useState<PriceCalculator>({
    quantity: 100,
    size_width: 5,
    size_height: 5,
    include_design: false,
    has_lamination: false,
    has_uv_coating: false
  });
  const [calculatedPrice, setCalculatedPrice] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/products/${slug}/`);
      if (!response.ok) throw new Error('محصول یافت نشد');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error('خطا در بارگذاری محصول');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    if (!product) return;

    try {
      setCalculating(true);
      const response = await fetch(`/api/v1/products/${product.id}/calculate_price/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          ...calculatorData
        })
      });

      if (!response.ok) throw new Error('خطا در محاسبه قیمت');
      const data = await response.json();
      setCalculatedPrice(data);
    } catch (error) {
      toast.error('خطا در محاسبه قیمت');
      console.error(error);
    } finally {
      setCalculating(false);
    }
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">محصول یافت نشد</h1>
          <Button onClick={() => navigate('category', { slug: 'label' })}>
            بازگشت به محصولات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              {product.category.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {product.name}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {product.short_description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                <span>تحویل {product.delivery_time_hours} ساعته</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Package className="w-4 h-4" />
                <span>تیراژ {product.min_quantity} تا {product.max_quantity}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4" />
                <span>چاپ {product.print_type === 'digital' ? 'دیجیتال' : 'افست'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Image */}
            {product.image_url && (
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.is_featured && (
                    <Badge className="absolute top-4 right-4 bg-yellow-500">
                      <Star className="w-3 h-3 ml-1" />
                      ویژه
                    </Badge>
                  )}
                </div>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  توضیحات محصول
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-purple max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  ویژگی‌های محصول
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">چاپ با کیفیت بالا</h4>
                      <p className="text-sm text-gray-600">کیفیت چاپ عالی با رنگ‌های زنده و ماندگار</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">تحویل فوری</h4>
                      <p className="text-sm text-gray-600">تحویل سریع در کوتاه‌ترین زمان ممکن</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">قیمت مناسب</h4>
                      <p className="text-sm text-gray-600">بهترین قیمت با کیفیت عالی</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">مشاوره رایگان</h4>
                      <p className="text-sm text-gray-600">مشاوره تخصصی قبل از چاپ</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Papers */}
            {product.available_papers && product.available_papers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    انواع کاغذ قابل استفاده
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.available_papers.map((paper) => (
                      <div key={paper.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{paper.name}</h4>
                          {paper.is_fancy && (
                            <Badge variant="secondary">فانتزی</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>گرماژ: {paper.gram_weight} گرم</p>
                          <p>بافت: {paper.texture}</p>
                          <p>قیمت هر برگ: {paper.price_per_sheet.toLocaleString()} تومان</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-600" />
                  ماشین حساب قیمت
                </CardTitle>
                <CardDescription>
                  قیمت دقیق سفارش خود را آنلاین محاسبه کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">تعداد</label>
                  <input
                    type="number"
                    min={product.min_quantity}
                    max={product.max_quantity}
                    value={calculatorData.quantity}
                    onChange={(e) => setCalculatorData({...calculatorData, quantity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    حداقل {product.min_quantity} - حداکثر {product.max_quantity}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">عرض (سانتی‌متر)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorData.size_width}
                      onChange={(e) => setCalculatorData({...calculatorData, size_width: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ارتفاع (سانتی‌متر)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorData.size_height}
                      onChange={(e) => setCalculatorData({...calculatorData, size_height: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {product.has_design_service && (
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">شامل طراحی</label>
                    <input
                      type="checkbox"
                      checked={calculatorData.include_design}
                      onChange={(e) => setCalculatorData({...calculatorData, include_design: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">لمینت</label>
                  <input
                    type="checkbox"
                    checked={calculatorData.has_lamination}
                    onChange={(e) => setCalculatorData({...calculatorData, has_lamination: e.target.checked})}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">پوشش UV</label>
                  <input
                    type="checkbox"
                    checked={calculatorData.has_uv_coating}
                    onChange={(e) => setCalculatorData({...calculatorData, has_uv_coating: e.target.checked})}
                    className="rounded"
                  />
                </div>

                <Button 
                  onClick={calculatePrice} 
                  disabled={calculating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {calculating ? 'در حال محاسبه...' : 'محاسبه قیمت'}
                </Button>

                {calculatedPrice && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">قیمت کل:</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {calculatedPrice.total_price.toLocaleString()} تومان
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        قیمت واحد: {calculatedPrice.unit_price.toLocaleString()} تومان
                      </p>
                      <p className="text-sm text-gray-600">
                        زمان تحویل: {calculatedPrice.delivery_time_hours} ساعت
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>اقدامات سریع</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Upload className="w-4 h-4 ml-2" />
                  آپلود فایل و سفارش
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  مشاوره رایگان
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 ml-2" />
                  تماس با کارشناس
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات تماس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">۰۲۱-۸۸۸۳۶۴۳۹</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">ارسال به سراسر کشور</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">تحویل فوری در تهران</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Trash2, 
  Plus, 
  Minus,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { navigate } = useNavigation();
  const { items, totalPrice, removeItem, updateQuantity, checkout } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('لطفا ابتدا وارد شوید');
      navigate('login');
      return;
    }

    try {
      const orderId = await checkout();
      navigate('order-tracking', { orderId });
    } catch {
      // خطا با toast نمایش داده می‌شود
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">سبد خرید خالی است</h1>
          <Button
            onClick={() => navigate('category', { slug: 'label' })}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            شروع خرید
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          سبد خرید ({items.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.product_name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <p>سایز: {item.size_width} × {item.size_height} سم</p>
                        <p>قیمت واحد: {item.price.toLocaleString()} تومان</p>
                        {item.options.design && <Badge className="w-fit">طراحی</Badge>}
                        {item.options.lamination && <Badge className="w-fit">لمینت</Badge>}
                        {item.options.uv_coating && <Badge className="w-fit">UV</Badge>}
                      </div>
                      <p className="text-lg font-bold text-purple-600">
                        {(item.price * item.quantity).toLocaleString()} تومان
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card className="shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle>خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">مجموع:</span>
                  <span className="font-bold text-lg">
                    {totalPrice.toLocaleString()} تومان
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ارسال:</span>
                  <span>رایگان</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-bold">مبلغ نهایی:</span>
                  <span className="text-2xl font-black text-purple-600">
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 font-bold"
                >
                  ثبت سفارش
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

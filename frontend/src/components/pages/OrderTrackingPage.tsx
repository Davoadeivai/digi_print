import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  Package,
  MapPin,
  Phone,
  Download,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderStatus {
  id: number;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
  estimated_delivery: string;
  current_location?: string;
  tracking_updates: Array<{
    timestamp: string;
    status: string;
    description: string;
  }>;
}

export default function OrderTrackingPage() {
  const { navigate, pageData } = useNavigation();
  const orderId = pageData?.orderId;
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingCode, setTrackingCode] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const fetchOrder = async (id: string | number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/orders/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('سفارش یافت نشد');
      
      const data: OrderStatus = await response.json();
      setOrder(data);
    } catch (error) {
      toast.error('خطا در بارگذاری سفارش');
    } finally {
      setLoading(false);
    }
  };

  const trackOrder = async () => {
    if (!trackingCode.trim()) {
      toast.error('کد پیگیری را وارد کنید');
      return;
    }

    await fetchOrder(trackingCode);
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800'
  };

  const statusLabels = {
    pending: 'در انتظار تأیید',
    confirmed: 'تأیید شده',
    processing: 'در حال پردازش',
    shipped: 'ارسال شده',
    delivered: 'تحویل داده شده'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          پیگیری سفارش
        </h1>
        
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="کد پیگیری یا شماره سفارش را وارد کنید"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 outline-none"
              />
              <Button 
                onClick={trackOrder} 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'جستجو'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && !order ? (
          <div className="text-center py-20">
            <Loader className="w-12 h-12 text-purple-600 mx-auto animate-spin" />
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Order Header */}
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>سفارش #{order.order_number}</CardTitle>
                    <p className="text-sm text-white/80 mt-1">
                      تاریخ سفارش: {new Date(order.created_at).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">تاریخ تحویل</p>
                    <p className="font-semibold text-lg">
                      {new Date(order.estimated_delivery).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">موقعیت</p>
                    <p className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      {order.current_location || 'آپلود شده'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">نوع ارسال</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      پست فوری
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">کد پیگیری</p>
                    <p className="font-semibold font-mono text-sm">{order.order_number}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  تاریخچه سفارش
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.tracking_updates.map((update, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        {index < order.tracking_updates.length - 1 && (
                          <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-gray-300 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-semibold text-gray-900">{update.status}</p>
                        <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(update.timestamp).toLocaleString('fa-IR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 ml-2" />
                دانلود فاکتور
              </Button>
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4 ml-2" />
                تماس با پشتیبانی
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

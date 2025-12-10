import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  product_id: number;
  product_name: string;
  quantity: number;
  size_width: number;
  size_height: number;
  price: number;
  options: {
    design: boolean;
    lamination: boolean;
    uv_coating: boolean;
  };
}

interface UseCartReturn {
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<string>;
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('خطا در بارگذاری سبد خرید');
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    toast.success('به سبد خرید اضافه شد ✓');
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('از سبد خرید حذف شد');
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const checkout = useCallback(async (): Promise<string> => {
    if (items.length === 0) {
      toast.error('سبد خرید خالی است');
      throw new Error('سبد خرید خالی است');
    }

    try {
      const response = await fetch('/api/v1/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ items })
      });

      if (!response.ok) throw new Error('خطا در ثبت سفارش');
      
      const data = await response.json();
      clearCart();
      toast.success('سفارش با موفقیت ثبت شد!');
      return data.order_id;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ثبت سفارش');
      throw error;
    }
  }, [items, clearCart]);

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, totalPrice, itemCount, addItem, removeItem, updateQuantity, clearCart, checkout };
};

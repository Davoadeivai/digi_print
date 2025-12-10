import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  size_width?: number;
  size_height?: number;
  price: number;
  options?: { design?: boolean; lamination?: boolean; uv_coating?: boolean; };
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      return [...prev, item];
    });
    toast.success('افزودن به سبد خرید انجام شد');
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('حذف از سبد خرید انجام شد');
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.success('سبد خرید خالی شد');
  }, []);

  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const checkout = useCallback(async () => {
    if (items.length === 0) { toast.error('سبد خرید خالی است'); return; }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ items })
      });
      if (!res.ok) throw new Error('خطا در ثبت سفارش');
      clearCart();
      toast.success('سفارش ثبت شد');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطا';
      toast.error(msg);
    }
  }, [items, clearCart]);

  return { items, addItem, removeItem, updateQuantity, clearCart, totalPrice, itemCount, checkout };
};

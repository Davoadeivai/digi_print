import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  product_id: number;
  quantity: number;
  size_width: number;
  size_height: number;
  price: number;
  options: { design: boolean; lamination: boolean; uv_coating: boolean; };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('cart');
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch { setItems([]); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const exist = prev.find(i => i.id === item.id);
      if (exist) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      return [...prev, item];
    });
    toast.success('به سبد خرید اضافه شد');
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('از سبد حذف شد');
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => { setItems([]); toast.success('سبد خرید خالی شد'); }, []);

  const checkout = useCallback(async () => {
    if (items.length === 0) { toast.error('سبد خرید خالی است'); return; }
    try {
      const res = await fetch('/api/v1/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ items })
      });
      if (!res.ok) throw new Error('خطا در ثبت سفارش');
      clearCart();
      toast.success('سفارش ثبت شد');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا در پرداخت');
    }
  }, [items, clearCart]);

  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, checkout, totalPrice, itemCount };
}

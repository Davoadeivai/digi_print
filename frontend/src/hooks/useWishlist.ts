import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface WishlistItem {
  product_id: number;
  name: string;
  image: string;
  price: number;
  slug: string;
}

interface UseWishlistReturn {
  items: WishlistItem[];
  isFavorite: (productId: number) => boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: number) => void;
  count: number;
}

export const useWishlist = (): UseWishlistReturn => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        console.error('خطا در بارگذاری علاقه‌مندی‌ها');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const isFavorite = useCallback((productId: number) => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    if (isFavorite(item.product_id)) {
      toast.info('این محصول قبلا ذخیره شده است');
      return;
    }
    setItems(prev => [...prev, item]);
    toast.success('به علاقه‌مندی‌ها اضافه شد ♡');
  }, [isFavorite]);

  const removeFromWishlist = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.product_id !== productId));
    toast.success('از علاقه‌مندی‌ها حذف شد');
  }, []);

  return {
    items,
    isFavorite,
    addToWishlist,
    removeFromWishlist,
    count: items.length
  };
};

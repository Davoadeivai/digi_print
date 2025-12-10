import { useState, useEffect, useCallback } from 'react';
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

interface UseProductDataReturn {
  product: LabelProduct | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const productCache = new Map<string, { data: LabelProduct; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProductData = (slug?: string): UseProductDataReturn => {
  const [product, setProduct] = useState<LabelProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    // بررسی Cache
    const cached = productCache.get(slug);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setProduct(cached.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/v1/products/${slug}/`);
      
      if (!response.ok) {
        throw new Error('محصول یافت نشد');
      }
      
      const data: LabelProduct = await response.json();
      setProduct(data);
      
      // ذخیره در Cache
      productCache.set(slug, { data, timestamp: Date.now() });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در بارگذاری محصول';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
};

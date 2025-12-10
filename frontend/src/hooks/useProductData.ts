import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface LabelProduct {
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
  category: { id: number; name: string; slug: string; };
  available_papers?: Array<{
    id: number;
    name: string;
    gram_weight: number;
    price_per_sheet: number;
    is_fancy: boolean;
    texture: string;
  }>;
}

const productCache = new Map<string, { data: LabelProduct; ts: number }>();
const CACHE_MS = 5 * 60 * 1000;

export const useProductData = (slug?: string) => {
  const [product, setProduct] = useState<LabelProduct | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const cached = productCache.get(slug);
    if (cached && Date.now() - cached.ts < CACHE_MS) {
      setProduct(cached.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/v1/products/${slug}/`);
      if (!res.ok) throw new Error('محصول یافت نشد');
      const data = await res.json();
      setProduct(data);
      productCache.set(slug, { data, ts: Date.now() });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطا';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
};

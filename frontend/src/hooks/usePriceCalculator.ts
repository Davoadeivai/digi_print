import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface PriceCalculator {
  quantity: number;
  size_width: number;
  size_height: number;
  paper_type_id?: number;
  include_design: boolean;
  has_lamination: boolean;
  has_uv_coating: boolean;
}

interface CalculatedPrice {
  total_price: number;
  unit_price: number;
  delivery_time_hours: number;
  breakdown?: Record<string, any>;
}

export const usePriceCalculator = (productId?: number) => {
  const [calculatorData, setCalculatorData] = useState<PriceCalculator>({
    quantity: 100,
    size_width: 5,
    size_height: 5,
    include_design: false,
    has_lamination: false,
    has_uv_coating: false
  });
  const [calculatedPrice, setCalculatedPrice] = useState<CalculatedPrice | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = useCallback(async () => {
    if (!productId) {
      setError('محصول انتخاب نشده');
      return;
    }
    try {
      setCalculating(true);
      setError(null);
      const res = await fetch(`/api/v1/products/${productId}/calculate_price/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, ...calculatorData })
      });
      if (!res.ok) throw new Error('خطا در محاسبه قیمت');
      const data = await res.json();
      setCalculatedPrice(data);
      toast.success('قیمت محاسبه شد');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطا';
      setError(msg);
      toast.error(msg);
    } finally {
      setCalculating(false);
    }
  }, [productId, calculatorData]);

  return { calculatorData, setCalculatorData, calculatedPrice, calculating, error, calculatePrice };
};

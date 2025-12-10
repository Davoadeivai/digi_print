import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface PriceCalculator {
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
  breakdown?: {
    base_price: number;
    design_price?: number;
    lamination_price?: number;
    uv_price?: number;
  };
}

interface UsePriceCalculatorReturn {
  calculatorData: PriceCalculator;
  setCalculatorData: (data: PriceCalculator) => void;
  calculatedPrice: CalculatedPrice | null;
  calculating: boolean;
  error: string | null;
  calculatePrice: () => Promise<void>;
}

export const usePriceCalculator = (productId?: number): UsePriceCalculatorReturn => {
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

      const response = await fetch(`/api/v1/products/${productId}/calculate_price/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          ...calculatorData
        })
      });

      if (!response.ok) {
        throw new Error('خطا در محاسبه قیمت');
      }

      const data: CalculatedPrice = await response.json();
      setCalculatedPrice(data);
      toast.success('قیمت محاسبه شد ✓');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در محاسبه قیمت';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCalculating(false);
    }
  }, [productId, calculatorData]);

  return {
    calculatorData,
    setCalculatorData,
    calculatedPrice,
    calculating,
    error,
    calculatePrice
  };
};

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import {
  Calculator,
  FileText,
  Palette,
  Layers,
  Package,
  Sparkles,
  TrendingDown,
  Info,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// تعریف اندازه‌های کاغذ (بر حسب سانتی‌متر)
const PAPER_SIZES = {
  'A6': { width: 10.5, height: 14.8, label: 'A6 (10.5×14.8 سانتی‌متر)', basePrice: 500 },
  'A5': { width: 14.8, height: 21, label: 'A5 (14.8×21 سانتی‌متر)', basePrice: 800 },
  'A4': { width: 21, height: 29.7, label: 'A4 (21×29.7 سانتی‌متر)', basePrice: 1200 },
  'A3': { width: 29.7, height: 42, label: 'A3 (29.7×42 سانتی‌متر)', basePrice: 2000 },
  'A2': { width: 42, height: 59.4, label: 'A2 (42×59.4 سانتی‌متر)', basePrice: 3500 },
  'custom': { width: 0, height: 0, label: 'اندازه سفارشی', basePrice: 0 }
};

// انواع کاغذ
const PAPER_TYPES = {
  'glossy': { label: 'گلاسه (براق)', multiplier: 1.0 },
  'matte': { label: 'مات', multiplier: 1.1 },
  'tahrir': { label: 'تحریر', multiplier: 0.8 },
  'kraft': { label: 'کرافت', multiplier: 1.2 },
  'carton': { label: 'کارتن', multiplier: 1.5 },
  'bristol': { label: 'بریستول', multiplier: 1.3 }
};

// گرماژ کاغذ (گرم بر متر مربع)
const PAPER_WEIGHTS = {
  '80': { label: '80 گرم', multiplier: 0.8 },
  '100': { label: '100 گرم', multiplier: 0.9 },
  '120': { label: '120 گرم', multiplier: 1.0 },
  '150': { label: '150 گرم', multiplier: 1.2 },
  '200': { label: '200 گرم', multiplier: 1.4 },
  '250': { label: '250 گرم', multiplier: 1.6 },
  '300': { label: '300 گرم', multiplier: 1.8 }
};

// تعداد رنگ
const COLOR_MODES = {
  'bw': { label: 'سیاه و سفید', multiplier: 0.5 },
  '1color': { label: 'تک‌رنگ', multiplier: 0.7 },
  '2color': { label: 'دو رنگ', multiplier: 0.85 },
  'cmyk': { label: 'چهار رنگ (CMYK)', multiplier: 1.0 },
  'cmyk+spot': { label: 'چهار رنگ + رنگ اختصاصی', multiplier: 1.3 }
};

// سلفون و لمینت
const LAMINATION_TYPES = {
  'none': { label: 'بدون سلفون', price: 0 },
  'glossy': { label: 'سلفون براق', price: 500 },
  'matte': { label: 'سلفون مات', price: 600 },
  'uv': { label: 'لمینت UV', price: 1200 },
  'thermal': { label: 'لمینت حرارتی', price: 800 }
};

// پرس و خدمات ویژه
const SPECIAL_SERVICES = {
  'gold_foil': { label: 'طلاکوب', price: 2000 },
  'embossing': { label: 'پرس برجسته', price: 1500 },
  'die_cut': { label: 'برش خورده', price: 1000 },
  'rounded_corners': { label: 'گوشه گرد', price: 300 }
};

// تخفیف تیراژ
const getTirageDiscount = (quantity: number): number => {
  if (quantity >= 10000) return 0.30; // 30% تخفیف
  if (quantity >= 5000) return 0.25;  // 25% تخفیف
  if (quantity >= 2000) return 0.20;  // 20% تخفیف
  if (quantity >= 1000) return 0.15;  // 15% تخفیف
  if (quantity >= 500) return 0.10;   // 10% تخفیف
  if (quantity >= 100) return 0.05;   // 5% تخفیف
  return 0;
};

interface PriceCalculatorProps {
  onAddToOrder?: (calculatedData: any) => void;
  showAddToOrder?: boolean;
}

export function PriceCalculator({ onAddToOrder, showAddToOrder = false }: PriceCalculatorProps) {
  const [paperSize, setPaperSize] = useState<string>('A4');
  const [customWidth, setCustomWidth] = useState<number>(0);
  const [customHeight, setCustomHeight] = useState<number>(0);
  const [paperType, setPaperType] = useState<string>('glossy');
  const [paperWeight, setPaperWeight] = useState<string>('120');
  const [colorMode, setColorMode] = useState<string>('cmyk');
  const [quantity, setQuantity] = useState<number>(100);
  const [lamination, setLamination] = useState<string>('none');
  const [specialServices, setSpecialServices] = useState<string[]>([]);
  const [sides, setSides] = useState<string>('single'); // یک‌رو یا دو رو
  
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  // محاسبه قیمت
  useEffect(() => {
    calculatePrice();
  }, [paperSize, customWidth, customHeight, paperType, paperWeight, colorMode, quantity, lamination, specialServices, sides]);

  const calculatePrice = () => {
    // محاسبه سطح کاغذ
    let area: number;
    let basePrice: number;
    
    if (paperSize === 'custom') {
      if (!customWidth || !customHeight) {
        setTotalPrice(0);
        setPricePerUnit(0);
        return;
      }
      area = (customWidth * customHeight) / 100; // تبدیل به متر مربع
      // قیمت پایه برای کاغذ سفارشی = 1000 تومان در هر 100 سانتی‌متر مربع
      basePrice = area * 10000;
    } else {
      const size = PAPER_SIZES[paperSize as keyof typeof PAPER_SIZES];
      area = (size.width * size.height) / 100;
      basePrice = size.basePrice;
    }

    // اعمال ضرایب
    const paperTypeMultiplier = PAPER_TYPES[paperType as keyof typeof PAPER_TYPES].multiplier;
    const paperWeightMultiplier = PAPER_WEIGHTS[paperWeight as keyof typeof PAPER_WEIGHTS].multiplier;
    const colorModeMultiplier = COLOR_MODES[colorMode as keyof typeof COLOR_MODES].multiplier;
    const sidesMultiplier = sides === 'double' ? 1.7 : 1.0; // چاپ دو رو 70% گرانتر

    // قیمت واحد قبل از خدمات اضافی
    let unitPrice = basePrice * paperTypeMultiplier * paperWeightMultiplier * colorModeMultiplier * sidesMultiplier;

    // اضافه کردن هزینه سلفون (به ازای هر برگ)
    const laminationPrice = LAMINATION_TYPES[lamination as keyof typeof LAMINATION_TYPES].price;
    unitPrice += laminationPrice;

    // اضافه کردن خدمات ویژه (به ازای هر برگ)
    specialServices.forEach(serviceKey => {
      const service = SPECIAL_SERVICES[serviceKey as keyof typeof SPECIAL_SERVICES];
      if (service) {
        unitPrice += service.price;
      }
    });

    // محاسبه قیمت کل
    let total = unitPrice * quantity;

    // اعمال تخفیف تیراژ
    const discountPercent = getTirageDiscount(quantity);
    const discountAmount = total * discountPercent;
    
    setDiscount(discountAmount);
    setTotalPrice(total - discountAmount);
    setPricePerUnit(unitPrice);
  };

  const handleSpecialServiceToggle = (serviceKey: string) => {
    setSpecialServices(prev => 
      prev.includes(serviceKey) 
        ? prev.filter(s => s !== serviceKey)
        : [...prev, serviceKey]
    );
  };

  const handleAddToOrder = () => {
    if (totalPrice === 0) {
      toast.error('لطفاً تمام مشخصات را وارد کنید');
      return;
    }

    const orderData = {
      paperSize: paperSize === 'custom' 
        ? `سفارشی (${customWidth}×${customHeight})` 
        : PAPER_SIZES[paperSize as keyof typeof PAPER_SIZES].label,
      paperType: PAPER_TYPES[paperType as keyof typeof PAPER_TYPES].label,
      paperWeight: PAPER_WEIGHTS[paperWeight as keyof typeof PAPER_WEIGHTS].label,
      colorMode: COLOR_MODES[colorMode as keyof typeof COLOR_MODES].label,
      quantity,
      sides: sides === 'double' ? 'دو رو' : 'یک رو',
      lamination: LAMINATION_TYPES[lamination as keyof typeof LAMINATION_TYPES].label,
      specialServices: specialServices.map(key => 
        SPECIAL_SERVICES[key as keyof typeof SPECIAL_SERVICES].label
      ),
      pricePerUnit,
      totalPrice,
      discount
    };

    if (onAddToOrder) {
      onAddToOrder(orderData);
    }
    
    toast.success('محاسبات به سفارش اضافه شد!');
  };

  const discountPercent = getTirageDiscount(quantity);

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div className="rtl-text">
              <CardTitle>ماشین حساب قیمت چاپ</CardTitle>
              <CardDescription>محاسبه دقیق قیمت بر اساس مشخصات</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* اندازه کاغذ */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 rtl-text">
              <FileText className="w-4 h-4" />
              اندازه کاغذ
            </Label>
            <Select value={paperSize} onValueChange={setPaperSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAPER_SIZES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {paperSize === 'custom' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2 rtl-text">
                  <Label className="text-sm">عرض (سانتی‌متر)</Label>
                  <Input
                    type="number"
                    value={customWidth || ''}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    placeholder="عرض"
                    className="text-right"
                  />
                </div>
                <div className="space-y-2 rtl-text">
                  <Label className="text-sm">ارتفاع (سانتی‌متر)</Label>
                  <Input
                    type="number"
                    value={customHeight || ''}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    placeholder="ارتفاع"
                    className="text-right"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* نوع کاغذ */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 rtl-text">
              <Layers className="w-4 h-4" />
              نوع کاغذ
            </Label>
            <Select value={paperType} onValueChange={setPaperType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAPER_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* گرماژ کاغذ */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 rtl-text">
              <Package className="w-4 h-4" />
              گرماژ کاغذ
            </Label>
            <Select value={paperWeight} onValueChange={setPaperWeight}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PAPER_WEIGHTS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* رنگ */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 rtl-text">
              <Palette className="w-4 h-4" />
              تعداد رنگ
            </Label>
            <Select value={colorMode} onValueChange={setColorMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COLOR_MODES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* یک‌رو یا دو رو */}
          <div className="space-y-3">
            <Label className="rtl-text">نوع چاپ</Label>
            <Select value={sides} onValueChange={setSides}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">یک رو</SelectItem>
                <SelectItem value="double">دو رو</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* تیراژ */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 rtl-text">
              <Package className="w-4 h-4" />
              تیراژ (تعداد)
            </Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="تعداد"
              min="1"
              className="text-right"
            />
            {discountPercent > 0 && (
              <Alert className="bg-green-50 border-green-200">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <AlertDescription className="rtl-text text-green-700">
                  با این تیراژ {(discountPercent * 100).toFixed(0)}% تخفیف دریافت می‌کنید!
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* سلفون */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 rtl-text">
              <Sparkles className="w-4 h-4" />
              سلفون / لمینت
            </Label>
            <Select value={lamination} onValueChange={setLamination}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LAMINATION_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                    {value.price > 0 && ` (+${value.price.toLocaleString('fa-IR')} تومان)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* خدمات ویژه */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 rtl-text">
              <Sparkles className="w-4 h-4" />
              خدمات ویژه
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(SPECIAL_SERVICES).map(([key, value]) => (
                <Card
                  key={key}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                    specialServices.includes(key) ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => handleSpecialServiceToggle(key)}
                >
                  <div className="space-y-1 rtl-text">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{value.label}</span>
                      {specialServices.includes(key) && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      +{value.price.toLocaleString('fa-IR')} تومان
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نتیجه محاسبات */}
      <Card className="glass border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="rtl-text">نتیجه محاسبات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rtl-text">
            <div className="flex justify-between text-muted-foreground">
              <span>قیمت هر برگ:</span>
              <span>{pricePerUnit.toLocaleString('fa-IR')} تومان</span>
            </div>
            
            <div className="flex justify-between text-muted-foreground">
              <span>تعداد:</span>
              <span>{quantity.toLocaleString('fa-IR')} عدد</span>
            </div>

            {discount > 0 && (
              <>
                <div className="flex justify-between text-muted-foreground">
                  <span>قیمت قبل از تخفیف:</span>
                  <span>{(totalPrice + discount).toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    تخفیف تیراژ ({(discountPercent * 100).toFixed(0)}%):
                  </span>
                  <span>-{discount.toLocaleString('fa-IR')} تومان</span>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-between items-center text-xl">
              <span>قیمت کل:</span>
              <span className="gradient-text">
                {totalPrice.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>

          {showAddToOrder && (
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={handleAddToOrder}
              disabled={totalPrice === 0}
            >
              افزودن به سفارش
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          )}

          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription className="rtl-text text-xs">
              قیمت‌های محاسبه شده تقریبی است و ممکن است بسته به شرایط پروژه تغییر کند.
              برای اطلاع از قیمت دقیق با ما تماس بگیرید.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

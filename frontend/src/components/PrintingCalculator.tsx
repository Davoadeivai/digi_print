import React, { useState } from 'react';

// انواع کاغذ
const paperTypes = [
  { id: 'a4', name: 'A4 (210 × 297 mm)', width: 210, height: 297 },
  { id: 'a3', name: 'A3 (297 × 420 mm)', width: 297, height: 420 },
  { id: 'a2', name: 'A2 (420 × 594 mm)', width: 420, height: 594 },
  { id: 'a1', name: 'A1 (594 × 841 mm)', width: 594, height: 841 },
  { id: 'custom', name: 'سفارشی', width: 0, height: 0 },
];

// انواع جنس کاغذ
const paperMaterials = [
  { id: 'glossy', name: 'گلاسه', priceMultiplier: 1.5 },
  { id: 'matte', name: 'مات', priceMultiplier: 1.3 },
  { id: 'regular', name: 'معمولی', priceMultiplier: 1 },
];

// قیمت پایه برای هر متر مربع (تومان)
const BASE_PRICE_PER_SQM = 50000;

const PrintingCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    paperType: 'a4',
    customWidth: '',
    customHeight: '',
    material: 'regular',
    quantity: 1,
    finalWidth: '',
    finalHeight: '',
    bleed: 3, // حاشیه برش به میلی‌متر
    colorType: 'full', // full, single, two
  });

  const [result, setResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bleed' || name === 'quantity' ? Number(value) : value
    }));
  };

  const calculate = () => {
    // انتخاب سایز کاغذ
    let paperWidth, paperHeight;
    
    if (formData.paperType === 'custom') {
      paperWidth = Number(formData.customWidth);
      paperHeight = Number(formData.customHeight);
    } else {
      const selectedPaper = paperTypes.find(p => p.id === formData.paperType);
      paperWidth = selectedPaper?.width || 210;
      paperHeight = selectedPaper?.height || 297;
    }

    const finalWidth = Number(formData.finalWidth) + (formData.bleed * 2);
    const finalHeight = Number(formData.finalHeight) + (formData.bleed * 2);

    // محاسبه تعداد در هر ورق
    const horizontalFit = Math.floor(paperWidth / finalWidth);
    const verticalFit = Math.floor(paperHeight / finalHeight);
    const itemsPerSheet = horizontalFit * verticalFit;

    // تعداد ورق مورد نیاز
    const sheetsNeeded = Math.ceil(formData.quantity / itemsPerSheet);

    // محاسبه مساحت کل (به متر مربع)
    const totalArea = (paperWidth * paperHeight * sheetsNeeded) / 1000000; // تبدیل به متر مربع
    
    // محاسبه قیمت
    const material = paperMaterials.find(m => m.id === formData.material) || paperMaterials[2];
    const colorMultiplier = formData.colorType === 'full' ? 4 : (formData.colorType === 'two' ? 2 : 1);
    const totalPrice = Math.ceil(totalArea * BASE_PRICE_PER_SQM * material.priceMultiplier * colorMultiplier);

    // محاسبه ضایعات
    const usedArea = (finalWidth * finalHeight * formData.quantity) / 1000000;
    const wastePercentage = ((totalArea - usedArea) / totalArea) * 100;

    setResult({
      sheetsNeeded,
      itemsPerSheet,
      totalArea: totalArea.toFixed(2),
      totalPrice: totalPrice.toLocaleString(),
      wastePercentage: wastePercentage.toFixed(1),
      finalDimensions: {
        width: formData.finalWidth,
        height: formData.finalHeight,
        withBleed: {
          width: finalWidth,
          height: finalHeight
        }
      }
    });
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-xl max-w-6xl w-full mx-auto my-4 sm:my-6 md:my-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800 dark:text-white">
        محاسبه‌گر چاپ و برش کاغذ
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* سمت چپ - تنظیمات اصلی */}
        <div className="space-y-3 sm:space-y-4">
          {/* نوع کاغذ */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
              نوع کاغذ:
            </label>
            <select 
              name="paperType" 
              value={formData.paperType}
              onChange={handleChange}
              className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {paperTypes.map(paper => (
                <option key={paper.id} value={paper.id} className="bg-gray-800 text-white">
                  {paper.name}
                </option>
              ))}
            </select>
          </div>

          {/* ابعاد سفارشی */}
          {formData.paperType === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
                  عرض (میلی‌متر):
                </label>
                <input
                  type="number"
                  name="customWidth"
                  value={formData.customWidth}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="عرض"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
                  ارتفاع (میلی‌متر):
                </label>
                <input
                  type="number"
                  name="customHeight"
                  value={formData.customHeight}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="ارتفاع"
                />
              </div>
            </div>
          )}

          {/* جنس کاغذ */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
              جنس کاغذ:
            </label>
            <select 
              name="material" 
              value={formData.material}
              onChange={handleChange}
              className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {paperMaterials.map(mat => (
                <option key={mat.id} value={mat.id} className="bg-gray-800 text-white">
                  {mat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* سمت راست - تنظیمات چاپ */}
        <div className="space-y-3 sm:space-y-4">
          {/* ابعاد نهایی */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
              ابعاد نهایی (میلی‌متر):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <input
                  type="number"
                  name="finalWidth"
                  value={formData.finalWidth}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="عرض"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="number"
                  name="finalHeight"
                  value={formData.finalHeight}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="ارتفاع"
                />
              </div>
            </div>
          </div>

          {/* تعداد */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
              تعداد:
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-white/10 backdrop-blur-sm border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* حاشیه برش */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
              حاشیه برش (میلی‌متر):
            </label>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="range"
                name="bleed"
                min="0"
                max="10"
                value={formData.bleed}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm sm:text-base font-medium min-w-[2rem] text-center">
                {formData.bleed}
              </span>
            </div>
          </div>

          {/* نوع چاپ */}
          <div className="space-y-1">
            <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
              نوع چاپ:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, colorType: 'full'})}
                className={`p-2 sm:p-2.5 text-xs sm:text-sm rounded-lg border transition-all ${
                  formData.colorType === 'full' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                چهار رنگ
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, colorType: 'two'})}
                className={`p-2 sm:p-2.5 text-xs sm:text-sm rounded-lg border transition-all ${
                  formData.colorType === 'two' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                دو رنگ
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, colorType: 'single'})}
                className={`p-2 sm:p-2.5 text-xs sm:text-sm rounded-lg border transition-all ${
                  formData.colorType === 'single' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                تک رنگ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* دکمه محاسبه */}
      <div className="mt-6 sm:mt-8 text-center">
        <button
          onClick={calculate}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800"
        >
          محاسبه
        </button>
      </div>

      {/* نتایج */}
      {result && (
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all animate-fadeIn">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            نتایج محاسبه:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">تعداد ورق مورد نیاز:</span>
                <span className="font-medium text-blue-600">{result.sheetsNeeded} ورق</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">تعداد در هر ورق:</span>
                <span className="font-medium text-blue-600">{result.itemsPerSheet} عدد</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">مساحت کل:</span>
                <span className="font-medium text-blue-600">{result.totalArea} متر مربع</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">درصد ضایعات:</span>
                <span className={`font-medium ${result.wastePercentage > 20 ? 'text-red-500' : 'text-green-500'}`}>
                  {result.wastePercentage}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">هزینه تخمینی:</span>
                <span className="font-medium text-blue-600">{result.totalPrice} تومان</span>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  ابعاد با حاشیه: {result.finalDimensions.withBleed.width} × {result.finalDimensions.withBleed.height} میلی‌متر
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintingCalculator;

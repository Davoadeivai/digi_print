import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import PrintingCalculator from './components/PrintingCalculator';

function TestApp(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">محاسبه‌گر چاپ و برش کاغذ</h1>
          <p className="text-gray-600 dark:text-gray-300">محاسبه دقیق هزینه و تعداد ورق‌های مورد نیاز برای چاپ</p>
        </header>
        
        <PrintingCalculator />
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} - تمامی حقوق محفوظ است</p>
        </footer>
      </div>
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#e2e8f0',
          borderRadius: '8px',
          color: '#334155'
        }}>
          <p>مراحل بعدی:</p>
          <ol style={{ textAlign: 'right', marginRight: '20px' }}>
            <li>بررسی کنسول مرورگر (F12) برای مشاهده خطاها</li>
            <li>اطمینان از صحت مسیر فایل‌ها</li>
            <li>بررسی اتصال به اینترنت برای بارگذاری فونت‌ها و منابع خارجی</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

const rootElement: HTMLElement | null = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <TestApp />
    </StrictMode>
  );
}
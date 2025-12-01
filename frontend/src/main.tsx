
import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, { hasError: boolean }> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          direction: 'rtl'
        }}>
          <h2>خطایی رخ داده است</h2>
          <p>لطفاً صفحه را مجدداً بارگذاری کنید یا با پشتیبانی تماس بگیرید.</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            برای مشاهده جزئیات خطا، کنسول را باز کنید (F12)
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            تلاش مجدد
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'sans-serif',
    direction: 'rtl'
  }}>
    <div>
      <h2>در حال بارگذاری...</h2>
      <p>لطفاً شکیبا باشید</p>
    </div>
  </div>
);

// Main App Render
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </StrictMode>
  );
} else {
  console.error('Element with id "root" not found in the document.');
}
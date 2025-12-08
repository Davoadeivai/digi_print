import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Toaster } from './components/ui/sonner';
import { NavigationProvider } from './contexts/NavigationContext';
import { BackendProvider } from './contexts/BackendContext';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { PortfolioDetailPage } from './components/pages/PortfolioDetailPage';
import { OrderPage } from './components/pages/OrderPage';
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import UserDashboard from './components/pages/UserDashboard';
import PriceCalculatorPage from './components/pages/PriceCalculatorPage';
import UserWalletPage from './components/pages/UserWalletPage';
import UserAddressesPage from './components/pages/UserAddressesPage';
import UserProfilePage from './components/pages/UserProfilePage';
import UserActivitiesPage from './components/pages/UserActivitiesPage';
import SecuritySettingsPage from './components/pages/SecuritySettingsPage';
import LabelPage from './components/pages/LabelPage';
import LabelCategoryPage from './components/pages/LabelCategoryPage';
import ProductsPage from './components/pages/ProductsPage';
import HomePage from './components/pages/HomePage';

function CatchAllRoute() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  
  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/services" element={<HomePage />} /> {/* Anchor link in Home usually, or separate page if exists. Mapping to Home for now as per original structure */}
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/portfolio" element={<HomePage />} /> {/* Anchor link in Home */}
          <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:slug" element={<LabelCategoryPage />} />
          <Route path="/label-category/:slug" element={<LabelCategoryPage />} />
          <Route path="/label/:slug" element={<LabelPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/price-calculator" element={<PriceCalculatorPage />} />
          <Route path="/wallet" element={<UserWalletPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/activities" element={<UserActivitiesPage />} />
          <Route path="/security" element={<SecuritySettingsPage />} />
          <Route path="/addresses" element={<UserAddressesPage />} />
          <Route path="/contact" element={<HomePage />} /> {/* Anchor link in Home */}
          <Route path="*" element={<CatchAllRoute />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            direction: 'rtl',
            textAlign: 'right'
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BackendProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </BackendProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

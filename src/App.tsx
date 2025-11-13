import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { BackendProvider } from './contexts/BackendContext';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { PortfolioDetailPage } from './components/pages/PortfolioDetailPage';
import { OrderPage } from './components/pages/OrderPage';

function AppContent() {
  const { currentPage } = useNavigation();

  // Home Page Content
  const HomePage = () => (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );

  // Render based on current page
  const renderPage = () => {
    switch (currentPage) {
      case 'service-detail':
        return (
          <>
            <Header />
            <ServiceDetailPage />
            <Footer />
          </>
        );
      case 'portfolio-detail':
        return (
          <>
            <Header />
            <PortfolioDetailPage />
            <Footer />
          </>
        );
      case 'order':
        return (
          <>
            <Header />
            <OrderPage />
            <Footer />
          </>
        );
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
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
    <BackendProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </BackendProvider>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { HomeFeatured } from './components/HomeFeatured';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { LookbookPage } from './components/LookbookPage';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { BrandedLoader } from './components/BrandedLoader';

// Modals & Drawers
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FAQModal } from './components/FAQModal';
import { ContactModal } from './components/ContactModal';

const MainApp: React.FC = () => {
  const { activeView, selectedProduct, products, settings, setIsAdminOpen } = useStore();
  const [initialLoading, setInitialLoading] = useState(true);

  // Direct URL routing listener: If visitor enters /admin or #admin
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin' || path.startsWith('/admin/')) {
        setIsAdminOpen(true);
      }
    };
    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, [setIsAdminOpen]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'shop':
        return <ShopPage />;
      case 'product':
        return selectedProduct ? (
          <ProductDetailPage product={selectedProduct} />
        ) : (
          <ProductDetailPage product={products[0]} />
        );
      case 'lookbook':
        return <LookbookPage />;
      case 'about':
        return <AboutPage />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <CategoryGrid />
            <HomeFeatured />
          </>
        );
    }
  };

  return (
    <>
      {/* Branded Loading Screen with animated T-shirt & progress bar */}
      {initialLoading && (
        <BrandedLoader
          brandName={settings.storeName}
          tagline="GETTING YOUR STYLE READY..."
          onComplete={() => setInitialLoading(false)}
        />
      )}

      <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#111111]">
        {/* Navigation */}
        <Navbar />

        {/* Main Dynamic View */}
        <main className="flex-1">
          {renderActiveView()}
        </main>

        {/* Global Modals & Drawers */}
        <CartDrawer />
        <WishlistDrawer />
        <QuickViewModal />
        <SearchModal />
        <AuthModal />
        <CheckoutModal />
        <OrderTrackingModal />
        <SizeGuideModal />
        <AdminDashboard />
        <FAQModal />
        <ContactModal />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

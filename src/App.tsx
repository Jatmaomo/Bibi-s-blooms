import React, { useState, useEffect, useCallback } from 'react';
import { PageView, Product, CartItem } from './types';
import {
  subscribeToProducts,
  testConnection,
  seedProductsIfEmpty,
  getProductsFromFirestore,
} from './lib/firebase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ShopPage } from './components/ShopPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { FirebaseStatusModal } from './components/FirebaseStatusModal';
import { CartDrawer } from './components/CartDrawer';
import { ReviewsPage } from './components/ReviewsPage';
import { Sparkles, ArrowRight, ShoppingBag, Star, MessageSquare } from 'lucide-react';
import { WHATSAPP_INTL } from './lib/formatters';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isFirebaseStatusOpen, setIsFirebaseStatusOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Products Data
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Simple Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Initialize and Subscribe to Firestore in Real Time
  useEffect(() => {
    // 1. Verify Firestore connectivity per Firebase skill guidelines
    testConnection();

    // 2. Real-time Firestore onSnapshot Subscription
    // Any change made in Admin Dashboard (add, edit price, delete) reflects instantly!
    const unsubscribe = subscribeToProducts(
      (updatedProducts) => {
        setProducts(updatedProducts);
        setIsLoadingProducts(false);
      },
      (error) => {
        console.warn('Firestore subscription notice:', error);
        setIsLoadingProducts(false);
      }
    );

    // 3. Route check: /admin or #admin
    if (
      window.location.pathname === '/admin' ||
      window.location.hash === '#admin'
    ) {
      setCurrentPage('admin');
    }

    const handlePopState = () => {
      if (
        window.location.pathname === '/admin' ||
        window.location.hash === '#admin'
      ) {
        setCurrentPage('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Manual refresh helper if needed
  const handleRefreshProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const items = await getProductsFromFirestore();
      setProducts(items);
    } catch (err) {
      console.error('Failed to refetch:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Synchronize URL hash when navigating to/from admin
  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    if (page === 'admin') {
      window.location.hash = '#admin';
    } else if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filter featured products for Home Page
  const featuredProducts = products.filter((p) => p.featured);
  const displayFeatured =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#f3f4f6]">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSetup={() => setIsFirebaseStatusOpen(true)}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero onNavigate={handleNavigate} />

            {/* Featured Products Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#c5a059]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curated Selection</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-luxury text-white tracking-wide mt-1">
                    Featured Products
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg">
                    Distinctive signature garments retrieved in real time directly from our Firebase Firestore menswear database.
                  </p>
                </div>

                <button
                  id="view-all-shop-btn"
                  onClick={() => handleNavigate('shop')}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c5a059] hover:text-[#d6b268] transition-colors"
                >
                  <span>Explore Full Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Featured Products Grid */}
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg aspect-[3/4] animate-pulse"
                    />
                  ))}
                </div>
              ) : displayFeatured.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {displayFeatured.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  No featured items currently listed.
                </div>
              )}

              {/* Ready-To-Wear Highlight Banner (Selling ready wears, not sewing) */}
              <div className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#121318] to-[#0a0a0d] border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-xs uppercase font-bold tracking-widest text-[#c5a059]">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Ready-To-Wear Collection • Not Sewing</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-luxury text-white">
                    Immediate Dispatch Ready Wears
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
                    No waiting weeks for tailors or dealing with sewing delays. Every piece at Bibi&apos;s Blooms is a premium ready-made luxury wear, cut and packaged to perfection for swift delivery to your doorstep.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleNavigate('shop')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-[#c5a059]/20 transition-transform hover:-translate-y-0.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Browse Ready Wears</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('reviews')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Star className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />
                    <span>Read Customer Reviews</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'shop' && (
          <ShopPage
            products={products}
            isLoading={isLoadingProducts}
            onViewDetails={(p) => setSelectedProduct(p)}
            onRefresh={handleRefreshProducts}
            isLive={true}
          />
        )}

        {currentPage === 'reviews' && <ReviewsPage />}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'admin' && (
          <AdminDashboard
            products={products}
            isLoading={isLoadingProducts}
            onRefreshProducts={handleRefreshProducts}
            onOpenSetup={() => setIsFirebaseStatusOpen(true)}
            onExitAdmin={() => handleNavigate('shop')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSetup={() => setIsFirebaseStatusOpen(true)}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Firebase Live Status Modal */}
      <FirebaseStatusModal
        isOpen={isFirebaseStatusOpen}
        onClose={() => setIsFirebaseStatusOpen(false)}
        productCount={products.length}
      />

      {/* Order Bag / Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

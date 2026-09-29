import React, { useState, useEffect, useCallback } from 'react';
import { PageView, Product, CartItem, CATEGORIES, ProductCategory } from './types';
import {
  subscribeToProducts,
  testConnection,
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
import { CartPage } from './components/CartPage';
import { ReviewsPage } from './components/ReviewsPage';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Star,
  MessageSquare,
  Truck,
  Shirt,
  Crown,
  Layers,
  Footprints,
  Watch,
  Briefcase,
  BedDouble,
  ChevronRight,
} from 'lucide-react';
import { WHATSAPP_INTL } from './lib/formatters';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFirebaseStatusOpen, setIsFirebaseStatusOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Products Data
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Persistent Cart State across page reloads and browsing sessions
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bibis_blooms_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bibis_blooms_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Unable to persist cart to localStorage', e);
    }
  }, [cartItems]);

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
  const handleNavigate = (page: PageView, category?: string) => {
    setCurrentPage(page);
    if (category !== undefined) {
      setSelectedCategory(category);
    }
    if (page === 'admin') {
      window.location.hash = '#admin';
    } else if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category metadata for "What We Offer" section
  const categoryOfferings: {
    name: ProductCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    badge?: string;
  }[] = [
    {
      name: 'Roundnecks',
      label: 'Roundnecks',
      icon: Shirt,
      description: 'Heavyweight ribbed crewnecks & luxury cotton tees',
    },
    {
      name: 'Polos',
      label: 'Polos',
      icon: Shirt,
      description: 'Mercerized knit & textured executive collars',
    },
    {
      name: 'Baggy Jeans',
      label: 'Baggy Jeans',
      icon: Layers,
      description: 'Vintage relaxed wash & wide-leg street silhouettes',
    },
    {
      name: 'Caps',
      label: 'Caps',
      icon: Crown,
      description: 'Structured snapbacks & luxury embroidered headwear',
    },
    {
      name: 'Slides',
      label: 'Slides',
      icon: Footprints,
      description: 'Butter-soft leather & contoured ergonomic comfort',
    },
    {
      name: 'Wristwatches',
      label: 'Wristwatches',
      icon: Watch,
      description: 'Executive chronographs, Hublot, Poedagar & Valenzo timepieces',
    },
    {
      name: 'Cross Bags',
      label: 'Cross Bags',
      icon: Briefcase,
      description: 'Tactile Goyad side bags & compact luxury organizers',
    },
    {
      name: 'Duvet',
      label: 'Duvets',
      icon: BedDouble,
      description: 'Plush hotel-grade duvets, bedroom sets & luxury bedding',
      badge: 'New',
    },
  ];

  // Cart operations
  const handleAddToCart = (product: Product, size?: string) => {
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      }
      return [...prev, { product, selectedSize, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
      return;
    }
    setCartItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], quantity: newQty };
      return copy;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filter featured products for Home Page
  const featuredProducts = products.filter((p) => p.featured);
  const displayFeatured =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

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

            {/* What We Offer / Category Showcase Section */}
            <section className="border-b border-zinc-800/80 bg-gradient-to-b from-[#0b0c10] via-[#101116] to-[#0b0c10] py-12 sm:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-800/80 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#c5a059]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>THE GENTLEMEN&apos;S ESSENTIALS</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-luxury text-white tracking-wide mt-1 uppercase">
                      WHAT WE OFFER
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl font-medium leading-relaxed">
                      Explore our full range of curated items — from everyday essentials, denim, slides, and watches to premium luxury duvets.
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('shop', 'All')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c5a059] hover:text-[#d6b268] transition-colors self-start md:self-auto cursor-pointer"
                  >
                    <span>View All Collections</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 8 Category Tiles Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
                  {categoryOfferings.map((cat) => {
                    const Icon = cat.icon;
                    const count = products.filter(
                      (p) =>
                        p.category === cat.name ||
                        (cat.name === 'Duvet' &&
                          (p.category === 'Duvet' || p.category.toLowerCase().includes('duvet')))
                    ).length;

                    return (
                      <button
                        key={cat.name}
                        onClick={() => handleNavigate('shop', cat.name)}
                        className="group relative flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl bg-[#121318] hover:bg-[#181920] border border-zinc-800/90 hover:border-[#c5a059]/60 transition-all duration-200 hover:shadow-lg hover:shadow-[#c5a059]/10 cursor-pointer"
                      >
                        {cat.badge && (
                          <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#c5a059] text-black uppercase tracking-wider">
                            {cat.badge}
                          </span>
                        )}

                        <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] mb-2.5 transition-transform group-hover:scale-110">
                          <Icon className="w-5 h-5 text-[#c5a059]" />
                        </div>

                        <span className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#c5a059] transition-colors leading-tight">
                          {cat.label}
                        </span>

                        <span className="text-[10px] text-zinc-400 mt-1 font-mono">
                          {count > 0 ? `${count} piece${count > 1 ? 's' : ''}` : 'In Stock'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Featured Products Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#c5a059]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>BIBI’S BLOOMS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-luxury text-white tracking-wide mt-1 uppercase">
                    THE GENTLEMEN’S PLUG.
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 max-w-xl font-medium leading-relaxed">
                    Premium pieces for the modern gentleman. Easy to wear. Easy to style. Impossible to ignore!
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#c5a059] font-serif italic mt-1">
                    &ldquo;Luxury isn’t expensive. It’s intentional.&rdquo;
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
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  No featured items currently listed.
                </div>
              )}

              {/* Delivery Banner: From Our Store To Your Door */}
              <div className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#121318] to-[#0a0a0d] border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="space-y-3 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-xs uppercase font-bold tracking-widest text-[#c5a059]">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Nationwide Delivery Available</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-luxury text-white uppercase tracking-wide">
                    FROM OUR STORE TO YOUR DOOR.
                  </h3>
                  <div className="space-y-1 text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                    <p className="font-semibold text-zinc-200">
                      Found something you like? Don’t overthink it.
                    </p>
                    <p className="text-zinc-400">
                      Place your order, sit pretty, and we’ll get it dispatched to you. Nationwide delivery available.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleNavigate('shop')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-[#c5a059]/20 transition-transform hover:-translate-y-0.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Browse Collection</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('reviews')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Star className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />
                    <span>What Our Customers Are Saying</span>
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
            onAddToCart={handleAddToCart}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
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
        onAddToCart={handleAddToCart}
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

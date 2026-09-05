import React, { useState } from 'react';
import { PageView } from '../types';
import { Logo } from './Logo';
import {
  Menu,
  X,
  ShoppingBag,
  Shield,
  MessageCircle,
  Flame,
} from 'lucide-react';
import { WHATSAPP_INTL } from '../lib/formatters';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenSetup: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSetup,
  cartCount = 0,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; page: PageView; badge?: number }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Cart', page: 'cart', badge: cartCount },
    { label: 'Reviews', page: 'reviews' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#27272a]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Logo
            size="md"
            showTagline={false}
            onClick={() => handleNavClick('home')}
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3.5 py-2 text-sm font-medium tracking-wider uppercase transition-all duration-200 rounded-md relative flex items-center gap-1.5 ${
                    active
                      ? 'text-[#c5a059] font-semibold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#c5a059] text-black">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#c5a059] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Status */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Firebase Live Status Pill */}
            <button
              onClick={onOpenSetup}
              id="firebase-status-pill-desktop"
              title="Firebase Firestore Connected - Real-time synchronization active"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-[#c5a059]/40 text-[#c5a059] bg-[#c5a059]/10 hover:bg-[#c5a059]/20 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Firebase Live</span>
            </button>

            {/* WhatsApp Quick Order Inquiry */}
            <a
              href={`https://wa.me/${WHATSAPP_INTL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-wider uppercase text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-[#c5a059]/60 rounded-md transition-all bg-zinc-900/40"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>07054022430</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => handleNavClick('cart')}
              id="cart-btn-desktop"
              className="relative p-2 text-zinc-300 hover:text-[#c5a059] hover:bg-white/[0.04] rounded-md transition-colors"
              title="View Cart & Order"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c5a059] text-black text-[11px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('cart')}
              id="cart-btn-mobile"
              className="relative p-2 text-zinc-300 hover:text-[#c5a059]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c5a059] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#c5a059]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0b0c10] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium tracking-wide uppercase ${
                  currentPage === item.page
                    ? 'text-[#c5a059] bg-[#c5a059]/10 font-bold'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#c5a059] text-black">
                    {item.badge}
                  </span>
                ) : (
                  currentPage === item.page && (
                    <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                  )
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSetup();
              }}
              className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
            >
              <span className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Firebase Firestore</span>
              </span>
              <span className="text-emerald-400 font-semibold">Live Connected</span>
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_INTL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-zinc-900 hover:bg-zinc-800 text-sm text-zinc-200 border border-zinc-700/80"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: 07054022430</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

import React from 'react';
import { PageView } from '../types';
import { Logo } from './Logo';
import { MessageCircle, Mail, Shield, ArrowUp } from 'lucide-react';
import { WHATSAPP_PHONE, WHATSAPP_INTL, CONTACT_EMAIL } from '../lib/formatters';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenSetup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSetup }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#07080a] border-t border-zinc-800/80 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} onClick={() => onNavigate('home')} />
            <p className="max-w-md text-xs leading-relaxed text-zinc-400">
              Everything a well-dressed man needs, in one place. From your everyday roundnecks and polos to baggy jeans, caps, slides, watches and cross bags,{' '}
              <span className="text-[#c5a059] font-bold">Bibi’s Blooms</span> is here to keep your wardrobe looking good.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_INTL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {WHATSAPP_PHONE}</span>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Email Us</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">
              Navigation
            </h4>
            <ul className="space-y-2">
              {(['home', 'shop', 'cart', 'reviews', 'about', 'contact'] as PageView[]).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => {
                      onNavigate(page);
                      scrollToTop();
                    }}
                    className="hover:text-[#c5a059] uppercase tracking-wider text-xs transition-colors capitalize"
                  >
                    {page === 'cart' ? 'Shopping Cart' : page}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Brand Values */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">
              Ready-To-Wear
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Quality pieces. Easy shopping. Nationwide delivery. Everything you need to keep your style on point.
            </p>
            <div className="pt-2 text-[11px] text-[#c5a059]">
              <span>Roundnecks • Polos • Baggy Jeans • Caps • Slides • Watches • Cross Bags</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright, Discreet Admin Arrow & Back to top */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <p>
              &copy; {new Date().getFullYear()}{' '}
              <span className="text-[#c5a059] font-semibold">
                Bibi&apos;s Blooms
              </span>
              . All rights reserved. &ldquo;Love, Joy and Blooms... ♥&rdquo;
            </p>
            {/* Discreet Admin Link - Subtle laptop emoji so only admin notices it at the bottom */}
            <button
              onClick={() => {
                onNavigate('admin');
                scrollToTop();
              }}
              title="Admin Portal"
              aria-label="Admin Portal"
              className="text-zinc-600 hover:text-[#c5a059] opacity-40 hover:opacity-100 transition-all p-1 rounded hover:bg-zinc-900 flex items-center cursor-pointer ml-1 text-xs"
            >
              <span className="text-[12px] leading-none select-none">💻</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

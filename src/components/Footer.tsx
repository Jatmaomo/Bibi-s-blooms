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
              Bibi’s blooms is a men’s wear brand created for the everyday man who loves to look good. We offer good-quality roundnecks, polos, baggy jeans, caps, slides, wristwatches and cross bags, all carefully picked to give you pieces you’ll genuinely love to wear.
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
              {(['home', 'shop', 'reviews', 'about', 'contact'] as PageView[]).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => {
                      onNavigate(page);
                      scrollToTop();
                    }}
                    className="hover:text-[#c5a059] uppercase tracking-wider text-xs transition-colors capitalize"
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Management */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white">
              Administration
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onNavigate('admin');
                    scrollToTop();
                  }}
                  className="hover:text-[#c5a059] uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5 text-zinc-300"
                >
                  <Shield className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} Bibi&apos;s Blooms. All rights reserved. &ldquo;Love, Joy and Blooms... ♥&rdquo;
          </p>

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

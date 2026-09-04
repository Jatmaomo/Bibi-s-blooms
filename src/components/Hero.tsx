import React from 'react';
import { PageView } from '../types';
import { Logo } from './Logo';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { WHATSAPP_INTL } from '../lib/formatters';

interface HeroProps {
  onNavigate: (page: PageView) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0b0c10] via-[#101116] to-[#0b0c10] py-16 sm:py-24 border-b border-zinc-800/80">
      {/* Subtle luxury geometric background accents */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c5a059] rounded-full blur-[140px] opacity-20" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Brand Logo Banner with vertical luxury presentation */}
        <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
          <Logo size="hero" orientation="vertical" showTagline={false} />
        </div>

        {/* Brand Tagline */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 shadow-[0_0_20px_rgba(197,160,89,0.25)] backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059] animate-pulse" />
            <span className="text-xs sm:text-sm font-serif italic text-[#c5a059] tracking-wider drop-shadow-[0_0_10px_rgba(197,160,89,0.4)]">
              &ldquo;Love, Joy and Blooms... ♥&rdquo;
            </span>
          </div>
        </div>

        {/* Main Headline in modern Outfit font and luxury gold with aura */}
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-black font-['Outfit',sans-serif] uppercase tracking-[0.04em] sm:tracking-[0.06em] mb-5 leading-tight max-w-4xl mx-auto text-[#c5a059] drop-shadow-[0_0_20px_rgba(197,160,89,0.55)]"
          style={{
            textShadow:
              '0 0 20px rgba(197, 160, 89, 0.6), 0 0 42px rgba(197, 160, 89, 0.35)',
          }}
        >
          Hello handsome you are about to look so good
        </h1>

        {/* Subtitle / Positioning */}
        <p className="max-w-2xl text-sm sm:text-base md:text-lg text-zinc-300 font-normal leading-relaxed mb-10">
          <span className="text-[#c5a059] font-bold drop-shadow-[0_0_12px_rgba(197,160,89,0.6)] [text-shadow:0_0_14px_rgba(197,160,89,0.45)]">
            Bibi’s blooms
          </span>{' '}
          is a men’s wear brand created for the everyday man who loves to look good. We offer good-quality roundnecks, polos, baggy jeans, caps, slides, wristwatches and cross bags, all carefully picked to give you pieces you’ll genuinely love to wear.
        </p>

        {/* Action Buttons (Strictly Black and Gold) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            id="hero-shop-now-btn"
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-sm tracking-widest uppercase transition-all duration-200 shadow-[0_0_25px_rgba(197,160,89,0.35)] flex items-center justify-center gap-2.5 group"
          >
            <span>SHOP WEARS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent("Hi Bibi, I’d like to shop for some wears.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-black/80 hover:bg-zinc-900 text-[#c5a059] hover:text-[#d6b268] border border-[#c5a059]/50 hover:border-[#c5a059] text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(197,160,89,0.15)]"
          >
            <MessageCircle className="w-4 h-4 text-[#c5a059]" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { PageView } from '../types';
import { Logo } from './Logo';
import {
  ArrowRight,
  Sparkles,
  MessageCircle,
  Shield,
  Shirt,
  Crown,
  Gem,
  ShoppingBag,
} from 'lucide-react';
import { WHATSAPP_INTL } from '../lib/formatters';

interface HeroProps {
  onNavigate: (page: PageView) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const brandPillars = [
    {
      icon: Shield,
      label: 'PREMIUM QUALITY',
    },
    {
      icon: Shirt,
      label: 'CAREFULLY PICKED',
    },
    {
      icon: Crown,
      label: 'MADE FOR MEN',
    },
    {
      icon: Gem,
      label: 'STYLE THAT SPEAKS',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0b0c10] py-14 sm:py-20 border-b border-zinc-800/80">
      {/* Subtle luxury ambient depth */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#c5a059]/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Brand Logo Presentation */}
        <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
          <Logo size="hero" orientation="vertical" showTagline={false} />
        </div>

        {/* Hero Title Matching Official Flyer: Hello HANDSOME */}
        <div className="mb-6 space-y-1">
          <div className="font-['Playfair_Display'] italic text-2xl sm:text-3xl md:text-4xl text-[#dfbe77]">
            Hello
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit',sans-serif] uppercase tracking-[0.06em] leading-none text-[#c5a059]">
            HANDSOME
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-zinc-300 uppercase pt-2">
            You Are About To Look So Good!
          </p>
        </div>

        {/* 4 Brand Pillars (From Official WhatsApp Flyer) */}
        <div className="w-full max-w-3xl my-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-xl bg-[#121318]/90 border border-[#c5a059]/30 shadow-lg">
            {brandPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.label}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-black/40 border border-zinc-800/80 hover:border-[#c5a059]/50 transition-colors group"
                >
                  <Icon className="w-6 h-6 text-[#c5a059] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-200 text-center leading-tight">
                    {pillar.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Signature Tagline */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="text-xs sm:text-sm font-serif italic text-[#c5a059] tracking-wider">
              &ldquo;Love, Joy and Blooms... ♥&rdquo;
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          </div>
        </div>

        {/* About Section Teaser */}
        <div className="max-w-2xl text-center space-y-3 mb-10">
          <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#c5a059] block">
            About Us
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-['Outfit',sans-serif] uppercase tracking-wide text-white">
            More Than Style. It&apos;s A Lifestyle.
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            Everything a well-dressed man needs, in one place. From your everyday roundnecks and polos to baggy jeans, caps, slides, watches and cross bags,{' '}
            <strong className="text-[#c5a059] font-bold">Bibi’s Blooms</strong> is here to keep your wardrobe looking good.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            id="hero-shop-now-btn"
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-2.5 group"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>SHOP WEARS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent("Hi Bibi, I’d like to shop for some wears.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-black/80 hover:bg-zinc-900 text-[#c5a059] hover:text-[#d6b268] border border-[#c5a059]/50 hover:border-[#c5a059] text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#c5a059]" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

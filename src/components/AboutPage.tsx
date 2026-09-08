import React from 'react';
import { Logo } from './Logo';
import { Sparkles, Layers, Truck, MessageCircle } from 'lucide-react';
import { WHATSAPP_INTL } from '../lib/formatters';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="text-center flex flex-col items-center mb-12">
        <Logo size="lg" showTagline={false} className="mb-4" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#c5a059] mb-2">
          Love, Joy and Blooms... ♥
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-luxury text-white tracking-wider">
          ABOUT <span className="text-[#c5a059]">BIBI&apos;S BLOOMS</span>
        </h1>
        <div className="w-16 h-0.5 bg-[#c5a059] mt-4" />
      </div>

      <div className="bg-[#121318] border border-zinc-800 rounded-xl p-8 sm:p-12 shadow-xl space-y-6 text-zinc-300 leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-extrabold font-luxury text-white tracking-wide uppercase">
            LOOK GOOD. FEEL GOOD. SHOW UP.
          </h2>
          <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-light">
            At <strong className="text-[#c5a059] font-bold">Bibi’s blooms</strong>, we believe looking good shouldn’t have to feel like hard work.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
            We bring you carefully selected men’s wears that make getting dressed easier! From everyday essentials to pieces that make you stand out without trying too hard.
          </p>
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-xs font-semibold uppercase tracking-wider text-[#dfbe77]">
            Good style. Good quality. Good energy.
          </div>
        </div>

        <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#c5a059]">
            FROM OUR STORE TO YOUR DOOR.
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300">
            Found something you like? Don’t overthink it. Place your order, sit pretty, and we’ll get it dispatched to you. Nationwide delivery available.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80">
          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <Layers className="w-6 h-6 text-[#c5a059] mb-2" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">VARIETY</h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Tops, round necks, trousers, baggy jeans, shoes, slides and waist watches all in one place.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <Sparkles className="w-6 h-6 text-[#c5a059] mb-2" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">STYLE</h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Easy-to-wear pieces and accessories to help you put a clean fit together.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <Truck className="w-6 h-6 text-[#c5a059] mb-2" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">CONVENIENCE</h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Shop what you love, place your order and get your pieces delivered to you.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Experience <span className="text-[#c5a059]">Bibi&apos;s Blooms</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Browse our ready-to-wear wears catalog or chat directly with Bibi.
            </p>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent("Hi Bibi, I’d like to shop for some wears.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded bg-[#c5a059] hover:bg-[#d6b268] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

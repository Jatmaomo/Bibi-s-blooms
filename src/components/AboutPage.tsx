import React from 'react';
import { Logo } from './Logo';
import { Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
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
          ABOUT BIBI&apos;S BLOOMS
        </h1>
        <div className="w-16 h-0.5 bg-[#c5a059] mt-4" />
      </div>

      <div className="bg-[#121318] border border-zinc-800 rounded-xl p-8 sm:p-12 shadow-xl space-y-6 text-zinc-300 leading-relaxed">
        <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-light">
          <strong className="text-white font-semibold">Bibi&apos;s Blooms</strong> is a men&apos;s fashion brand focused on quality, style, and confidence in ready-to-wear garments.
        </p>

        <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
          Our brand is dedicated to curating ready-made menswear pieces that celebrate refined masculinity, sharp styling, and distinctive elegance. From authentic Nigerian native wear, regal Agbada, and classic Senator sets to tailored Kaftans and modern shirts, every garment is finished to the highest standards and ready for immediate delivery. We sell ready-to-wear wears—eliminating tailoring delays so you look distinguished instantly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80">
          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <CheckCircle2 className="w-6 h-6 text-[#c5a059] mb-2" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quality</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Carefully chosen premium fabrics and resilient craftsmanship.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <Sparkles className="w-6 h-6 text-[#c5a059] mb-2" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Style</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Contemporary cuts honoring timeless traditional aesthetics.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col items-center text-center">
            <CheckCircle2 className="w-6 h-6 text-[#c5a059] mb-2" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Confidence</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Impeccable fits that instill commanding poise and dignity.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Experience Bibi&apos;s Blooms
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

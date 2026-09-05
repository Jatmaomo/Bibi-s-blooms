import React, { useState } from 'react';

export const OFFICIAL_LOGO_URL = 'https://i.postimg.cc/26BVc637/IMG-20260904-WA0000.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
  orientation?: 'horizontal' | 'vertical';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
  orientation = 'horizontal',
}) => {
  const [imageError, setImageError] = useState(false);

  // Dimension scaling for the emblem
  const imageSizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    hero: 'w-28 h-28 sm:w-36 sm:h-36',
  }[size];

  const titleSizeClasses = {
    sm: 'text-base font-bold tracking-wider',
    md: 'text-lg sm:text-xl font-bold tracking-widest',
    lg: 'text-2xl sm:text-3xl font-bold tracking-widest',
    hero: 'text-3xl sm:text-5xl font-extrabold tracking-[0.2em]',
  }[size];

  const isVertical = orientation === 'vertical';

  return (
    <div
      onClick={onClick}
      className={`inline-flex ${isVertical ? 'flex-col items-center text-center' : 'items-center text-left'} gap-3.5 sm:gap-4 group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Brand Emblem with attractive luxury gold framing and radial shimmer */}
      <div className="relative flex-shrink-0">
        {/* Ambient golden halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#c5a059]/40 via-[#d6b268]/20 to-transparent blur-md group-hover:blur-lg transition-all duration-300 transform scale-110 opacity-75" />

        {/* Outer metallic bezel */}
        <div
          className={`relative ${imageSizeClasses} rounded-full overflow-hidden p-[2px] bg-gradient-to-br from-[#d6b268] via-[#c5a059] to-[#846b32] shadow-[0_0_20px_rgba(197,160,89,0.35)] transition-transform duration-300 group-hover:scale-105`}
        >
          {/* Inner image container */}
          <div className="w-full h-full rounded-full overflow-hidden bg-[#0c0d12] flex items-center justify-center border border-black/40">
            {!imageError ? (
              <img
                src={OFFICIAL_LOGO_URL}
                alt="Bibi's Blooms Logo"
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Luxury fallback vector monogram if image fails */
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1d24] to-[#0a0a0d] text-[#c5a059]">
                <span className="font-luxury font-black text-xs sm:text-base tracking-widest">BB</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Brand Typography - Clean, High-Fashion Luxury Aesthetics */}
      <div className={`flex flex-col ${isVertical ? 'items-center text-center' : 'text-left'}`}>
        <span
          className={`font-luxury uppercase text-[#c5a059] group-hover:text-[#dfbc74] transition-colors leading-tight tracking-[0.14em] font-bold ${titleSizeClasses}`}
        >
          Bibi's Blooms
        </span>
        <span className="text-[10px] sm:text-xs text-zinc-300 group-hover:text-[#d6b268] font-semibold uppercase tracking-[0.3em] mt-0.5 transition-colors">
          Gentlemen&apos;s Plug
        </span>
        {showTagline && (
          <span className="text-[11px] sm:text-xs text-[#c5a059] font-medium tracking-widest italic mt-1 opacity-90">
            Love, Joy and Blooms... ♥
          </span>
        )}
      </div>
    </div>
  );
};


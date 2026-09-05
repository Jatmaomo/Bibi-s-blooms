import React, { useState } from 'react';
import { Product } from '../types';
import { formatNaira, getWhatsAppOrderUrl } from '../lib/formatters';
import { Eye, MessageCircle, Sparkles, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart?: (product: Product, size?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';

  const whatsAppUrl = getWhatsAppOrderUrl(product.name, product.price, undefined, product.category);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
      onAddToCart(product, defaultSize);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="group relative flex flex-col bg-[#121318] border border-zinc-800/80 hover:border-[#c5a059]/60 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        {/* Placeholder skeleton while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <span className="text-zinc-700 text-xs">Loading image...</span>
          </div>
        )}

        <img
          src={imageError ? fallbackImage : product.image_url}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#c5a059] border border-[#c5a059]/50 rounded-full shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase bg-black/70 backdrop-blur-md text-zinc-300 border border-zinc-700/60 rounded">
          {product.category}
        </div>

        {/* Hover Quick Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="px-4 py-2 bg-[#0b0c10]/90 hover:bg-[#c5a059] text-white hover:text-black text-xs font-semibold uppercase tracking-wider rounded border border-[#c5a059]/60 transition-all flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Info */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h3
          onClick={() => onViewDetails(product)}
          className="text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-[#c5a059] transition-colors line-clamp-1 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-1">
          {product.description || "Carefully picked ready-to-wear piece from Bibi's Blooms gentlemen's collection."}
        </p>

        {/* Sizes preview if available */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 mr-1">Sizes:</span>
            {product.sizes.map((size) => (
              <span
                key={size}
                className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-zinc-900 text-zinc-300 border border-zinc-800 rounded"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-wider uppercase text-zinc-400">Price</span>
            <span className="text-lg sm:text-xl font-bold text-[#c5a059] tracking-tight">
              {formatNaira(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails(product)}
              className="p-2 text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
              title="View Product Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {onAddToCart ? (
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#c5a059] hover:bg-[#d6b268] text-black text-xs font-bold uppercase tracking-wider rounded transition-all shadow-sm"
                title="Add to Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{added ? 'Added ✓' : 'Add to Cart'}</span>
              </button>
            ) : (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#c5a059] hover:bg-[#d6b268] text-black text-xs font-bold uppercase tracking-wider rounded transition-all shadow-sm"
                title="Order on WhatsApp"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </a>
            )}

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-400 hover:text-emerald-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
              title="Quick Order via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

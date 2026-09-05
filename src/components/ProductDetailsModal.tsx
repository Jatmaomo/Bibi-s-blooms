import React, { useState } from 'react';
import { Product } from '../types';
import { formatNaira, getWhatsAppOrderUrl, WHATSAPP_PHONE } from '../lib/formatters';
import { X, MessageCircle, Check, Sparkles, ShieldCheck, Ruler, ShoppingBag } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, size: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [copied, setCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const whatsAppUrl = getWhatsAppOrderUrl(product.name, product.price, selectedSize, product.category);

  const fallbackImage =
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedSize || (product.sizes?.[0] || 'Standard'));
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#121318] border border-[#c5a059]/40 rounded-xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black text-zinc-300 hover:text-white rounded-full border border-zinc-700 transition-colors"
          aria-label="Close details modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Large Product Image */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-full bg-zinc-950 overflow-hidden">
            <img
              src={product.image_url || fallbackImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
              referrerPolicy="no-referrer"
            />
            {product.featured && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#c5a059] border border-[#c5a059]/50 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Piece</span>
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Ordering */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Tag */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-widest bg-zinc-900 text-[#c5a059] border border-[#c5a059]/30 rounded">
                  {product.category}
                </span>
                <span className="text-xs text-zinc-500 tracking-wider">
                  Code: #{product.id.slice(0, 8)}
                </span>
              </div>

              {/* Product Title */}
              <h2 className="text-2xl sm:text-3xl font-bold font-luxury text-white leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-zinc-800">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#c5a059] tracking-tight">
                  {formatNaira(product.price)}
                </span>
                <span className="text-xs text-zinc-400 uppercase tracking-wider">
                  Ready-To-Wear
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Description
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {product.description ||
                    "Carefully picked ready-to-wear piece from Bibi's Blooms. Quality materials, comfortable modern fit, ready for immediate dispatch."}
                </p>
              </div>

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>Available Sizes</span>
                    </h4>
                    <span className="text-xs text-zinc-400">
                      Selected: <strong className="text-white">{selectedSize || 'None'}</strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] py-2 px-3 text-sm font-semibold tracking-wider rounded border transition-all ${
                            isSelected
                              ? 'border-[#c5a059] bg-[#c5a059] text-black shadow-[0_0_12px_rgba(197,160,89,0.3)]'
                              : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quality Guarantee Note */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                <span>
                  Authentic{' '}
                  <span className="text-[#c5a059] font-bold">
                    Bibi&apos;s Blooms
                  </span>{' '}
                  piece. Carefully picked and inspected for quality, in stock for prompt dispatch.
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-800">
              {/* Add to Cart Button */}
              {onAddToCart && (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-[#c5a059]/20 transition-all transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5 text-black" />
                  <span>{justAdded ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </button>
              )}

              {/* WhatsApp Order Button */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-6 rounded-lg ${
                  onAddToCart
                    ? 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500 text-zinc-100'
                    : 'bg-gradient-to-r from-[#c5a059] to-[#d6b268] text-black'
                } font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Order via WhatsApp ({WHATSAPP_PHONE})</span>
              </a>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                <span>Instant response via WhatsApp</span>
                <button
                  onClick={handleCopyLink}
                  className="hover:text-zinc-300 transition-colors flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <span>Share Product</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

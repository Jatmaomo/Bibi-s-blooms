import React from 'react';
import { CartItem } from '../types';
import { formatNaira, WHATSAPP_PHONE, WHATSAPP_INTL } from '../lib/formatters';
import { X, Trash2, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleOrderAllOnWhatsApp = () => {
    if (cartItems.length === 0) return;

    let message = "Hi Bibi, I’d like to shop for some wears.\n\n";
    message += "I would like to order the following ready-to-wear pieces from your collection:\n\n";
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.product.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ${formatNaira(item.product.price * item.quantity)}\n`;
    });
    message += `\nEstimated Total: ${formatNaira(totalAmount)}\n`;
    message += `\nPlease provide payment and delivery details. (Ready-to-wear pieces, not sewing)`;

    window.open(`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121318] border-l border-zinc-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
              <h2 className="text-lg font-bold font-luxury text-white">
                Selected Pieces ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${idx}`}
                  className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg flex items-center gap-3"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded bg-black flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-zinc-400 block">
                      Size: <strong className="text-white">{item.selectedSize}</strong>
                    </span>
                    <span className="text-xs font-mono font-bold text-[#c5a059]">
                      {formatNaira(item.product.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center text-zinc-500">
                <ShoppingBag className="w-12 h-12 opacity-30 mb-3" />
                <p className="text-sm">No items in your order bag yet.</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Browse the collection and select your preferred size.
                </p>
              </div>
            )}
          </div>

          {/* Footer Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400 uppercase tracking-wider text-xs">
                  Estimated Total:
                </span>
                <span className="text-xl font-bold font-mono text-[#c5a059]">
                  {formatNaira(totalAmount)}
                </span>
              </div>

              <button
                onClick={handleOrderAllOnWhatsApp}
                className="w-full py-3.5 px-4 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Order on WhatsApp ({WHATSAPP_PHONE})</span>
              </button>

              <button
                onClick={onClearCart}
                className="w-full text-center text-xs text-zinc-500 hover:text-zinc-400 py-1"
              >
                Clear all items
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

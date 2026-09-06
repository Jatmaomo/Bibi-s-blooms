import React, { useState } from 'react';
import { CartItem } from '../types';
import {
  formatNaira,
  WHATSAPP_PHONE,
  SNAPCHAT_USERNAME,
  OrderChannel,
  dispatchOrder,
} from '../lib/formatters';
import { X, Trash2, MessageCircle, ShoppingBag, Ghost, CheckCircle2 } from 'lucide-react';

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
  const [drawerChannel, setDrawerChannel] = useState<OrderChannel>('whatsapp');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleOrderAll = () => {
    if (cartItems.length === 0) return;

    let message = "Hi Bibi, I’d like to shop for some wears.\n\n";
    message += "I would like to order the following pieces from your collection:\n\n";
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.product.name}\n`;
      if (item.product.description && item.product.description.trim()) {
        message += `   • Details: ${item.product.description.trim()}\n`;
      }
      message += `   • Size: ${item.selectedSize} | Qty: ${item.quantity} | ${formatNaira(item.product.price * item.quantity)}\n\n`;
    });
    message += `Estimated Total: ${formatNaira(totalAmount)}\n\n`;
    message += `Please provide payment and delivery details.`;

    dispatchOrder(drawerChannel, message, (msg) => {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(null), 5000);
    });
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
            <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 space-y-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400 uppercase tracking-wider text-xs">
                  Estimated Total:
                </span>
                <span className="text-xl font-bold font-mono text-[#c5a059]">
                  {formatNaira(totalAmount)}
                </span>
              </div>

              {/* Destination Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-400 mb-1.5">
                  Order Destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDrawerChannel('whatsapp')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      drawerChannel === 'whatsapp'
                        ? 'bg-emerald-950/60 border-emerald-500 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <MessageCircle
                      className={`w-3.5 h-3.5 ${
                        drawerChannel === 'whatsapp' ? 'text-emerald-400' : 'text-zinc-400'
                      }`}
                    />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawerChannel('snapchat')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      drawerChannel === 'snapchat'
                        ? 'bg-amber-950/60 border-amber-400 text-white'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <Ghost
                      className={`w-3.5 h-3.5 ${
                        drawerChannel === 'snapchat' ? 'text-amber-300' : 'text-zinc-400'
                      }`}
                    />
                    <span>Snapchat</span>
                  </button>
                </div>
              </div>

              {toastMsg && (
                <div className="p-2.5 bg-amber-950/70 border border-amber-500/60 rounded-lg text-amber-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="leading-tight">{toastMsg}</span>
                </div>
              )}

              <button
                onClick={handleOrderAll}
                className={`w-full py-3.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer ${
                  drawerChannel === 'whatsapp'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                    : 'bg-[#FFFC00] hover:bg-yellow-300 text-black shadow-yellow-400/20'
                }`}
              >
                {drawerChannel === 'whatsapp' ? (
                  <>
                    <MessageCircle className="w-4 h-4 text-black" />
                    <span>Order on WhatsApp ({WHATSAPP_PHONE})</span>
                  </>
                ) : (
                  <>
                    <Ghost className="w-4 h-4 text-black" />
                    <span>Order on Snapchat (@{SNAPCHAT_USERNAME})</span>
                  </>
                )}
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

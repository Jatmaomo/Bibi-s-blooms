import React, { useState } from 'react';
import { CartItem, PageView } from '../types';
import { formatNaira, WHATSAPP_PHONE, WHATSAPP_INTL } from '../lib/formatters';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onNavigate: (page: PageView) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;

    let message = "Hello Bibi, I would like to place an order for ready-to-wear wears from Bibi's Blooms:\n\n";
    message += "🛍️ ORDER PIECES:\n";
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.product.name}\n`;
      message += `   • Category: ${item.product.category}\n`;
      message += `   • Size: ${item.selectedSize}\n`;
      message += `   • Quantity: ${item.quantity}\n`;
      message += `   • Price: ${formatNaira(item.product.price * item.quantity)}\n\n`;
    });

    message += `💰 ESTIMATED TOTAL: ${formatNaira(totalAmount)}\n`;

    if (deliveryLocation.trim()) {
      message += `📍 DELIVERY LOCATION: ${deliveryLocation.trim()}\n`;
    }

    if (customerNote.trim()) {
      message += `📝 NOTE: ${customerNote.trim()}\n`;
    }

    message += "\nPlease provide your account details and delivery schedule. (Ready-to-wear wears, not sewing)";

    window.open(`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#c5a059]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Gentlemen&apos;s Order Bag</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-luxury text-white tracking-wide mt-1">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review your selected ready-to-wear menswear pieces before direct WhatsApp checkout.
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-zinc-400 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="py-20 text-center flex flex-col items-center justify-center bg-[#121318] border border-zinc-800/80 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
          <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#c5a059] mb-4">
            <ShoppingBag className="w-10 h-10 opacity-60" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-luxury text-white mb-2">
            Your Cart is Currently Empty
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mb-8">
            You haven&apos;t added any ready-to-wear pieces yet. Browse our collection of roundnecks, polos, baggy jeans, caps, slides, and accessories.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Ready Wears</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Cart Grid: Items on Left, Summary on Right */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${index}`}
                className="bg-[#121318] border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
              >
                {/* Image & Product Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-black border border-zinc-800 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#c5a059]">
                      {item.product.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-luxury truncate">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300">
                        Size: <strong className="text-white">{item.selectedSize}</strong>
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        {formatNaira(item.product.price)} each
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Item Total */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-mono font-bold text-xs text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 block sm:hidden">Total</span>
                    <span className="text-base sm:text-lg font-bold font-mono text-[#c5a059]">
                      {formatNaira(item.product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors rounded"
                    title="Remove item from bag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Back to Shopping Button */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-400 hover:text-[#c5a059] uppercase transition-colors"
              >
                <span>&larr; Continue Shopping Ready Wears</span>
              </button>
            </div>
          </div>

          {/* Order Summary & WhatsApp Checkout Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#121318] border border-zinc-800 rounded-xl p-6 shadow-xl sticky top-28 space-y-6">
              <h2 className="text-lg font-bold font-luxury text-white pb-3 border-b border-zinc-800 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-mono text-[#c5a059]">
                  {totalItemsCount} {totalItemsCount === 1 ? 'piece' : 'pieces'}
                </span>
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Bag Subtotal:</span>
                  <span className="font-mono text-white font-bold">{formatNaira(totalAmount)}</span>
                </div>

                <div className="flex items-start justify-between text-zinc-400 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Truck className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>Delivery:</span>
                  </div>
                  <span className="text-right text-zinc-400 text-[11px] max-w-[140px]">
                    Confirmed with Bibi on WhatsApp
                  </span>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="font-bold text-white text-base">Estimated Total:</span>
                  <span className="text-2xl font-mono font-black text-[#c5a059]">
                    {formatNaira(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Delivery Note & Location Input */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#c5a059]" />
                    <span>Delivery Location (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lekki, Lagos or Abuja"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-400 mb-1">
                    Order Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Need urgent dispatch today"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-4 px-4 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/20 transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>CHECKOUT ON WHATSAPP</span>
              </button>

              <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                Clicking checkout opens WhatsApp directly with Bibi ({WHATSAPP_PHONE}) with your order prefilled.
              </p>

              {/* Assurance Trust Badges */}
              <div className="pt-4 border-t border-zinc-800/80 space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                  <span>100% Ready-to-wear wears • Immediate dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059] flex-shrink-0" />
                  <span>Authentic Bibi&apos;s Blooms quality assurance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

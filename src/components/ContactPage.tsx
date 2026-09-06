import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  Ghost,
} from 'lucide-react';
import {
  WHATSAPP_PHONE,
  WHATSAPP_INTL,
  SNAPCHAT_URL,
  SNAPCHAT_USERNAME,
  CONTACT_EMAIL,
} from '../lib/formatters';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Trigger WhatsApp with the inquiry message starting with the requested greeting
    const formatted = `Hi Bibi, I’d like to shop for some wears.\nMy name is ${name || 'Customer'}.\n\nInquiry:\n${message}`;
    window.open(`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(formatted)}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      {/* Header */}
      <div className="text-center flex flex-col items-center mb-12">
        <Logo size="lg" showTagline={false} className="mb-4" />
        <span className="text-xs uppercase font-bold tracking-widest text-[#c5a059] mb-2">
          Love, Joy and Blooms... ♥
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-luxury text-white tracking-wider">
          GET IN TOUCH
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-md">
          Reach out directly to{' '}
          <span className="text-[#c5a059] font-bold">
            Bibi&apos;s Blooms
          </span>{' '}
          to shop for ready-to-wear wears, ask about available sizes, or arrange delivery.
        </p>
        <div className="w-16 h-0.5 bg-[#c5a059] mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Direct Contact Info */}
        <div className="bg-[#121318] border border-zinc-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-luxury text-[#c5a059]">
              Bibi&apos;s Blooms
            </h2>

            {/* WhatsApp Box */}
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                  WhatsApp
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-zinc-100">
                  {WHATSAPP_PHONE}
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Available for instant chat, orders & sizing support
                </p>
              </div>
            </div>

            {/* Snapchat Box */}
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/40">
                <Ghost className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                  Snapchat
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-zinc-100">
                  @{SNAPCHAT_USERNAME}
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Direct message us on Snapchat for quick orders and inquiries
                </p>
              </div>
            </div>

            {/* Email Box */}
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-amber-950/60 text-[#c5a059] border border-[#c5a059]/30">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                  Email
                </span>
                <span className="text-sm sm:text-base font-mono font-semibold text-zinc-100 break-all">
                  {CONTACT_EMAIL}
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  For corporate contracts, bridal parties & official correspondence
                </p>
              </div>
            </div>
          </div>

          {/* Direct Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <a
              id="contact-whatsapp-btn"
              href={`https://wa.me/${WHATSAPP_INTL}?text=Hello%20Bibi's%20Blooms,%20I%20would%20like%20to%20place%20an%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              id="contact-snapchat-btn"
              href={SNAPCHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-lg bg-[#FFFC00] hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-yellow-500/20"
            >
              <Ghost className="w-4 h-4 text-black" />
              <span>Chat on Snapchat (@{SNAPCHAT_USERNAME})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              id="contact-email-btn"
              href={`mailto:${CONTACT_EMAIL}?subject=Inquiry%20-%20Bibi's%20Blooms%20Men's%20Fashion`}
              className="w-full py-3 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-zinc-700 transition-all"
            >
              <Mail className="w-4 h-4 text-[#c5a059]" />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        {/* Right Column: Quick Consultation Form */}
        <div className="bg-[#121318] border border-zinc-800 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold font-luxury text-white mb-1">
              Direct Message
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Fill out this quick form and click send to initiate an order or ready-to-wear sizing inquiry with Bibi.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Muhammad Aliyu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-md text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Message / Order Requirements
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the ready-to-wear pieces you'd like to order (e.g. Baggy jeans in size 34 and a black polo)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded-md text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send via WhatsApp</span>
              </button>

              {submitted && (
                <div className="p-3 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Opening WhatsApp conversation with Bibi&apos;s Blooms...</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Flame, CheckCircle, Database, Shield, Radio, Sparkles } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface FirebaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCount: number;
}

export const FirebaseStatusModal: React.FC<FirebaseStatusModalProps> = ({
  isOpen,
  onClose,
  productCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#121318] border border-[#c5a059]/40 rounded-xl shadow-2xl p-6 z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#c5a059]">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-luxury text-white">
                Firebase Firestore Live
              </h3>
              <p className="text-xs text-zinc-400">
                Active Cloud Database &amp; Real-time Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Cards */}
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400">Firebase Project:</span>
            <span className="font-mono text-white font-semibold">
              {firebaseConfig.projectId}
            </span>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400">Firestore Collection:</span>
            <span className="font-mono text-[#c5a059] font-semibold">
              /products ({productCount} items)
            </span>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400">Sync Protocol:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Firestore onSnapshot (Realtime)</span>
            </span>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400">Security Mode:</span>
            <span className="inline-flex items-center gap-1 text-zinc-300 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Read, Admin Auth Write</span>
            </span>
          </div>
        </div>

        {/* Realtime explanation */}
        <div className="p-3.5 rounded-lg bg-[#c5a059]/10 border border-[#c5a059]/20 text-xs space-y-1.5 text-zinc-300">
          <div className="flex items-center gap-1.5 font-bold text-[#c5a059]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automatic Real-Time Propagation</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Any product added, price changed, or deletion in the Admin Dashboard is instantly pushed to the Firestore cloud database and updates all public visitors without refreshing the page.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

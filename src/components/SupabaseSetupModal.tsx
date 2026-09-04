import React, { useState } from 'react';
import {
  X,
  Database,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Key,
  FolderLock,
  Save,
  Radio,
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveLocalSupabaseCredentials,
  SUPABASE_SETUP_SQL,
  isSupabaseConfigured,
  fetchProductsFromSupabase,
} from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  if (!isOpen) return null;

  const currentCreds = getSupabaseCredentials();
  const [urlInput, setUrlInput] = useState(currentCreds.url);
  const [keyInput, setKeyInput] = useState(currentCreds.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveCredentials = async () => {
    saveLocalSupabaseCredentials(urlInput.trim(), keyInput.trim());
    setSaveStatus('Credentials saved successfully!');
    setIsTesting(true);
    setTestResult(null);

    const result = await fetchProductsFromSupabase();
    setIsTesting(false);
    if (result.isLive) {
      setTestResult({
        success: true,
        message: `Successfully connected to Supabase! Loaded ${result.products.length} products.`,
      });
      onConfigUpdated();
    } else {
      setTestResult({
        success: false,
        message:
          result.error ||
          'Connected, but products table was not found or permissions denied. Did you run the SQL script below?',
      });
    }

    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#121318] border border-[#c5a059]/40 rounded-xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-luxury text-white">
                Supabase Backend Configuration
              </h2>
              <p className="text-xs text-zinc-400">
                Live Database, Storage Bucket &amp; Real-time Synchronization
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

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm text-zinc-300">
          {/* Status Alert */}
          <div
            className={`p-4 rounded-lg border flex items-center justify-between gap-3 ${
              isSupabaseConfigured()
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Radio
                className={`w-4 h-4 ${
                  isSupabaseConfigured() ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
                }`}
              />
              <span className="font-semibold text-xs uppercase tracking-wider">
                {isSupabaseConfigured()
                  ? 'Supabase Connection Configured'
                  : 'Supabase Credentials Pending'}
              </span>
            </div>
            <span className="text-xs opacity-80">
              {isSupabaseConfigured() ? 'Active' : 'Using Local/Demo Data'}
            </span>
          </div>

          {/* Quick Connect Inputs */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold tracking-wider text-[#c5a059] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Supabase API Keys</span>
              </h3>
              <span className="text-[11px] text-zinc-500">
                Configured via .env or directly below
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  VITE_SUPABASE_URL
                </label>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-[#c5a059] rounded font-mono text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  VITE_SUPABASE_ANON_KEY (Public Key)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-[#c5a059] rounded font-mono text-xs text-white focus:outline-none"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Never use the service_role key. Only use the anon / public API key.
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveCredentials}
                  disabled={isTesting}
                  className="px-4 py-2 bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-wider rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save &amp; Test Connection</span>
                </button>
                {saveStatus && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {saveStatus}
                  </span>
                )}
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded text-xs border ${
                    testResult.success
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      : 'bg-red-950/60 border-red-800 text-red-300'
                  }`}
                >
                  {testResult.message}
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-200 flex items-center gap-1.5">
              <FolderLock className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>How to Setup in 3 Minutes</span>
            </h3>

            <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-300">
              <li>
                Create a free project at{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#c5a059] underline hover:text-[#d6b268] inline-flex items-center gap-1"
                >
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                In your Supabase project, click on <strong>SQL Editor</strong> in the left sidebar.
              </li>
              <li>
                Copy and run the SQL setup script below. It creates the <code>products</code> table,
                storage bucket <code>product-images</code>, Row Level Security policies, and Realtime!
              </li>
              <li>
                Go to <strong>Project Settings → API</strong> to copy your <code>Project URL</code> and <code>anon public</code> key.
              </li>
              <li>
                Paste them above or declare them in <code>.env.example</code>.
              </li>
            </ol>
          </div>

          {/* Copyable SQL Script */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                SQL Setup Script (Tables, Storage &amp; RLS)
              </span>
              <button
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-[#c5a059] transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-black border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto max-h-52 leading-relaxed">
              {SUPABASE_SETUP_SQL}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

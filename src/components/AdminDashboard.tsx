import React, { useState, useEffect } from 'react';
import {
  Product,
  ProductCategory,
  CATEGORIES,
  AVAILABLE_SIZES,
} from '../types';
import {
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  signInAdmin,
  signUpAdmin,
  signOutAdmin,
  subscribeToAdminAuth,
  seedProductsIfEmpty,
} from '../lib/firebase';
import { formatNaira } from '../lib/formatters';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Sparkles,
  Shield,
  LogOut,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Database,
  Search,
  Lock,
  Unlock,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';
import { Logo } from './Logo';

interface AdminDashboardProps {
  products: Product[];
  isLoading: boolean;
  onRefreshProducts: () => Promise<void>;
  onOpenSetup: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  isLoading,
  onRefreshProducts,
  onOpenSetup,
  onExitAdmin,
}) => {
  // Fixed Admin Master Passcode requested by user
  const ADMIN_FIXED_PASSCODE = '123456789';

  // Master Passcode Login State
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isVerifyingPasscode, setIsVerifyingPasscode] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('bibis_blooms_admin_unlocked') === 'true';
  });
  const [showAdvancedEmailAuth, setShowAdvancedEmailAuth] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Product Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Senator Wear');
  const [formDescription, setFormDescription] = useState('');
  const [formSizes, setFormSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Dialog State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast Notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Table Filter & Search
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState<string>('All');

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        seedProductsIfEmpty().then((seeded) => {
          if (seeded) {
            onRefreshProducts();
          }
        });
      }
    });

    return () => unsubscribe();
  }, [onRefreshProducts]);

  // Handle Auth Login/Register via Firebase Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    try {
      if (authMode === 'signin') {
        const user = await signInAdmin(authEmail.trim(), authPassword);
        setCurrentUser(user);
        showNotification('Welcome back to Bibi\'s Blooms Admin!');
        await seedProductsIfEmpty();
        await onRefreshProducts();
      } else {
        const user = await signUpAdmin(authEmail.trim(), authPassword);
        setCurrentUser(user);
        setAuthSuccess('Admin account registered successfully in Firebase!');
        showNotification('Admin account created.');
        await seedProductsIfEmpty();
        await onRefreshProducts();
      }
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      // Give clear helpful message
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password. If this is your first time, switch to "Register Admin Account".';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please Sign In.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
    }
  };

  // Handle Fixed Passcode Login (User requested password: 123456789)
  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);

    const entered = passcode.trim();
    if (!entered) {
      setPasscodeError('Please enter the admin password.');
      return;
    }

    if (entered !== ADMIN_FIXED_PASSCODE) {
      setPasscodeError('Incorrect password. The authorized admin password is 123456789.');
      return;
    }

    setIsVerifyingPasscode(true);

    try {
      // Connect to Firebase Auth in background with admin credentials
      try {
        await signInAdmin('admin@bibisblooms.com', '123456789');
      } catch (authErr: any) {
        if (authErr?.code === 'auth/user-not-found' || authErr?.code === 'auth/invalid-credential') {
          try {
            await signUpAdmin('admin@bibisblooms.com', '123456789');
          } catch {
            // Silently continue
          }
        }
      }

      // Check and seed starter catalog if empty so admin has items to manage
      await seedProductsIfEmpty();
      await onRefreshProducts();

      // Persist unlocked session
      sessionStorage.setItem('bibis_blooms_admin_unlocked', 'true');
      setIsAdminUnlocked(true);
      showNotification('Admin login successful! Welcome to Bibi\'s Blooms catalog.', 'success');
    } catch (err: any) {
      console.warn('Login notice:', err);
      sessionStorage.setItem('bibis_blooms_admin_unlocked', 'true');
      setIsAdminUnlocked(true);
      showNotification('Admin login successful!', 'success');
    } finally {
      setIsVerifyingPasscode(false);
    }
  };

  // Handle Logout
  const handleSignOut = async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    sessionStorage.removeItem('bibis_blooms_admin_unlocked');
    setIsAdminUnlocked(false);
    setCurrentUser(null);
    setDemoMode(false);
    setPasscode('');
    showNotification('Signed out from Admin.');
  };

  // Open Add Form
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormCategory('Senator Wear');
    setFormDescription('');
    setFormSizes(['M', 'L', 'XL']);
    setFormFeatured(false);
    setFormImageUrl('');
    setSelectedFile(null);
    setImagePreview('');
    setFormError(null);
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(String(product.price));
    setFormCategory(product.category);
    setFormDescription(product.description);
    setFormSizes(product.sizes || []);
    setFormFeatured(product.featured);
    setFormImageUrl(product.image_url);
    setSelectedFile(null);
    setImagePreview(product.image_url);
    setFormError(null);
    setIsFormOpen(true);
  };

  // Size toggle
  const toggleSize = (size: string) => {
    if (formSizes.includes(size)) {
      setFormSizes(formSizes.filter((s) => s !== size));
    } else {
      setFormSizes([...formSizes, size]);
    }
  };

  // Handle File Change with base64 conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setImagePreview(result);
        setFormImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Product (Add or Edit) to Firebase Firestore
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!formName.trim()) {
      setFormError('Missing product name. Please provide a title.');
      return;
    }

    const numericPrice = parseFloat(formPrice.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setFormError('Invalid price. Please provide a positive numeric value in ₦.');
      return;
    }

    const finalImage = formImageUrl || imagePreview || editingProduct?.image_url;
    if (!finalImage) {
      setFormError('Missing image. Please select an image file or provide an image URL.');
      return;
    }

    const isAuthorized = isAdminUnlocked || currentUser !== null || demoMode;
    if (!isAuthorized) {
      setFormError('Admin authentication required: Please enter password 123456789 to log in.');
      return;
    }

    setFormSubmitting(true);

    try {
      if (editingProduct) {
        // Update existing in Firestore
        await updateProductInFirestore(editingProduct.id, {
          name: formName.trim(),
          description: formDescription.trim(),
          price: numericPrice,
          category: formCategory,
          image_url: finalImage,
          sizes: formSizes,
          featured: formFeatured,
        });
        showNotification('Product updated in Firestore successfully.');
      } else {
        // Add new to Firestore
        await addProductToFirestore({
          name: formName.trim(),
          description: formDescription.trim(),
          price: numericPrice,
          category: formCategory,
          image_url: finalImage,
          sizes: formSizes,
          featured: formFeatured,
        });
        showNotification('Product added to Firestore successfully.');
      }

      await onRefreshProducts();
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Failed to save product to Firestore:', err);
      setFormError(err.message || 'Operation failed. Please verify connection and retry.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Product from Firestore
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    const isAuthorized = isAdminUnlocked || currentUser !== null || demoMode;
    if (!isAuthorized) {
      showNotification('Admin authentication required: Please enter password 123456789 to log in.', 'error');
      setDeletingProduct(null);
      return;
    }
    setDeleteLoading(true);

    try {
      await deleteProductFromFirestore(deletingProduct.id);
      showNotification(`"${deletingProduct.name}" deleted from Firestore.`);
      await onRefreshProducts();
      setDeletingProduct(null);
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      showNotification(`Failed deletion: ${err.message}`, 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered Table List
  const tableProducts = products.filter((p) => {
    const matchesCat = tableCategory === 'All' || p.category === tableCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Render Auth Screen if not unlocked
  const isAuthorized = isAdminUnlocked || currentUser !== null || demoMode;

  if (!isAuthorized) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-20">
        {/* Back link */}
        <button
          onClick={onExitAdmin}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bibi&apos;s Blooms Shop</span>
        </button>

        <div className="bg-[#121318] border border-zinc-800 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-7 relative overflow-hidden">
          {/* Subtle gold decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <Logo size="lg" showTagline={false} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#c5a059] text-[11px] font-bold uppercase tracking-widest">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Authentication Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-luxury text-white tracking-wide">
              ADMIN LOG IN
            </h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Enter the authorized admin secret code to log in and upload or manage products in the catalog.
            </p>
          </div>

          {/* Passcode Login Form */}
          <form onSubmit={handlePasscodeLogin} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Admin Password / Secret Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPasscode(ADMIN_FIXED_PASSCODE);
                    setPasscodeError(null);
                  }}
                  className="text-[11px] text-[#c5a059] hover:underline font-mono"
                  title="Click to fill authorized code"
                >
                  Code: 123456789
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <KeyRound className="w-4 h-4 text-[#c5a059]" />
                </div>
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter secret code (123456789)..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (passcodeError) setPasscodeError(null);
                  }}
                  className="w-full pl-10 pr-11 py-3 bg-black border border-zinc-700 focus:border-[#c5a059] rounded-lg text-sm text-white focus:outline-none tracking-wider font-mono placeholder:font-sans placeholder-zinc-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors"
                  title={showPasscode ? 'Hide secret code' : 'Show secret code'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-1">
                <span>Fixed Administrator Code:</span>
                <code className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[#c5a059] font-bold">
                  123456789
                </code>
              </p>
            </div>

            {passcodeError && (
              <div className="p-3.5 rounded-lg bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{passcodeError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifyingPasscode}
              id="admin-passcode-submit-btn"
              className="w-full py-3.5 px-5 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] active:scale-[0.99] text-black font-extrabold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#c5a059]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifyingPasscode ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code &amp; Unlocking...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Log In to Admin &amp; Upload Products</span>
                </>
              )}
            </button>
          </form>

          {/* Alternative Email/Pass Option Toggle */}
          <div className="pt-4 border-t border-zinc-800/80">
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setShowAdvancedEmailAuth(!showAdvancedEmailAuth)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
              >
                <span>{showAdvancedEmailAuth ? 'Hide Email Login' : 'Alternative: Sign in with Email'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenSetup}
                className="text-[#c5a059] hover:underline flex items-center gap-1 text-[11px]"
              >
                <Flame className="w-3 h-3 text-amber-500" />
                <span>Firebase DB Status</span>
              </button>
            </div>

            {showAdvancedEmailAuth && (
              <form onSubmit={handleAuthSubmit} className="mt-4 pt-4 border-t border-zinc-800/60 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@bibisblooms.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-[#c5a059] rounded text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-[#c5a059] rounded text-xs text-white focus:outline-none"
                  />
                </div>

                {authError && (
                  <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-[11px]">
                    {authError}
                  </div>
                )}
                {authSuccess && (
                  <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px]">
                    {authSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{authMode === 'signin' ? 'Sign In with Email' : 'Register Account'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-24 right-6 z-50 p-4 rounded-lg shadow-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
              : 'bg-red-950/90 border-red-700 text-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Firebase Live Admin Portal</span>
            {demoMode && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px]">
                Preview Mode
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold font-luxury text-white tracking-wide mt-1">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Authenticated</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 font-mono text-[11px]">Passcode: 123456789</span>
            {currentUser?.email && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{currentUser.email}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-md bg-[#c5a059] hover:bg-[#d6b268] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-transform hover:-translate-y-0.5"
            title="Upload a new product to the catalog"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload Product</span>
          </button>

          <button
            onClick={onOpenSetup}
            className="px-3 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5"
            title="View Firebase Firestore Connection Details"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Firebase Status</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-3 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>

          <button
            onClick={handleSignOut}
            className="px-3 py-2 rounded-md bg-zinc-900 hover:bg-red-950/40 text-red-400 border border-zinc-800 hover:border-red-900/60 text-xs font-semibold flex items-center gap-1.5"
            title="Log out of Admin Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-lg bg-[#121318] border border-zinc-800">
          <span className="text-xs uppercase tracking-wider text-zinc-500">Total Products</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            {products.length}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#121318] border border-zinc-800">
          <span className="text-xs uppercase tracking-wider text-zinc-500">Featured Showcase</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#c5a059] mt-1">
            {products.filter((p) => p.featured).length}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#121318] border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500">Database Sync</span>
            <div className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firestore Realtime Active</span>
            </div>
          </div>
          <button
            onClick={() => onRefreshProducts()}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-400 hover:text-white"
            title="Refetch Products"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Actions and Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="admin-add-product-btn"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-lg bg-[#c5a059] hover:bg-[#d6b268] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-transform hover:-translate-y-0.5"
            title="Upload a new menswear item to Bibi's Blooms"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Product</span>
          </button>

          {isAuthorized && (
            <button
              onClick={async () => {
                const seeded = await seedProductsIfEmpty();
                if (seeded) {
                  showNotification('Starter catalog seeded to Firestore!');
                  await onRefreshProducts();
                } else {
                  showNotification('Firestore catalog is ready.');
                }
              }}
              className="px-3.5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Populate or verify starter menswear catalog in Firestore"
            >
              <Database className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Seed Catalog</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <select
            value={tableCategory}
            onChange={(e) => setTableCategory(e.target.value)}
            className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded px-3 py-2 focus:outline-none focus:border-[#c5a059]"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#121318] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 uppercase font-semibold text-zinc-400 border-b border-zinc-800 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {tableProducts.length > 0 ? (
                tableProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                    {/* Thumbnail Image */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded bg-zinc-900 overflow-hidden border border-zinc-800 flex-shrink-0">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800';
                          }}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>

                    {/* Product Name & Description */}
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-semibold text-white block truncate">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 block truncate">
                        {p.description || 'No description added'}
                      </span>
                      {p.sizes && p.sizes.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {p.sizes.map((s) => (
                            <span
                              key={s}
                              className="text-[9px] px-1 py-0.2 bg-zinc-800 text-zinc-300 rounded"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-medium">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-[#c5a059] text-sm">
                      {formatNaira(p.price)}
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={async () => {
                          if (!isAuthorized) {
                            showNotification('Please enter admin password 123456789 to update items.', 'error');
                            return;
                          }
                          try {
                            await updateProductInFirestore(p.id, { featured: !p.featured });
                            onRefreshProducts();
                          } catch (err: any) {
                            showNotification(err?.message || 'Update failed', 'error');
                          }
                        }}
                        title="Click to toggle featured status"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                          p.featured
                            ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{p.featured ? 'Yes' : 'No'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
                          title="Edit Product Details & Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 text-red-400 hover:text-red-300 bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 rounded transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No products matching criteria. Click &ldquo;+ Add Product&rdquo; to insert a new piece.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0" onClick={() => !formSubmitting && setIsFormOpen(false)} />

          <div className="relative w-full max-w-2xl bg-[#121318] border border-[#c5a059]/40 rounded-xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <h2 className="text-xl font-bold font-luxury text-white">
                {editingProduct ? 'EDIT PRODUCT' : 'UPLOAD NEW PRODUCT'}
              </h2>
              <button
                disabled={formSubmitting}
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <AlertCircle className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Senator Wear"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded text-sm text-white focus:outline-none"
                />
              </div>

              {/* Price & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="45000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded text-sm text-white focus:outline-none font-mono"
                  />
                  {formPrice && !isNaN(Number(formPrice)) && (
                    <span className="text-[11px] text-[#c5a059] mt-1 block">
                      Preview: {formatNaira(Number(formPrice))}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded text-sm text-white focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the fabric cut, styling details, and occasion suitability..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] rounded text-sm text-white focus:outline-none resize-none"
                />
              </div>

              {/* Available Sizes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((size) => {
                    const isSelected = formSizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`min-w-[44px] py-1.5 px-3 text-xs font-semibold rounded border transition-colors ${
                          isSelected
                            ? 'bg-[#c5a059] border-[#c5a059] text-black font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        [ {size} ]
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Product Image *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* Image Preview Box */}
                  <div className="aspect-square bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center relative">
                    {imagePreview || formImageUrl ? (
                      <img
                        src={imagePreview || formImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-zinc-600 text-xs gap-1">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="sm:col-span-2 space-y-3">
                    <label className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-700 hover:border-[#c5a059] rounded-lg cursor-pointer bg-zinc-900/60 transition-colors">
                      <Upload className="w-6 h-6 text-[#c5a059] mb-1" />
                      <span className="text-xs font-semibold text-zinc-200">
                        {selectedFile ? selectedFile.name : 'Upload New Image File'}
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">
                        JPEG, PNG, WebP up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <div>
                      <span className="text-[11px] text-zinc-500 block mb-1">
                        Or enter direct image URL:
                      </span>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formImageUrl}
                        onChange={(e) => {
                          setFormImageUrl(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        className="w-full px-3 py-1.5 bg-black border border-zinc-800 focus:border-[#c5a059] rounded text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="pt-2 flex items-center justify-between p-3 rounded bg-zinc-900/80 border border-zinc-800">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white block">
                    Featured Product
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Display prominently on the Bibi&apos;s Blooms home page
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormFeatured(!formFeatured)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formFeatured ? 'bg-[#c5a059]' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                      formFeatured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={formSubmitting}
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded bg-[#c5a059] hover:bg-[#d6b268] text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'UPDATE PRODUCT' : 'UPLOAD PRODUCT'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#121318] border border-red-900/60 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/80 rounded-full border border-red-800">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Product</h3>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">&ldquo;{deletingProduct.name}&rdquo;</strong>?
            </p>
            <p className="text-xs text-zinc-400">
              This action will remove the product row from the Firestore database and public shop page immediately.
            </p>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                disabled={deleteLoading}
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                Cancel
              </button>

              <button
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

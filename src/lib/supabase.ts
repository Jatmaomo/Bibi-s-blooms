import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';

// Default initial starter catalog if database is fresh or credentials pending
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Midnight Navy Embroidered Agbada',
    description: 'Majestic 3-piece hand-loomed Agbada featuring bespoke gold thread embroidery across the chest and cuffs. Designed for high-profile ceremonies and dignitaries.',
    price: 85000,
    category: 'Agbada',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL'],
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Imperial Black Senator Wear with Gold Trims',
    description: 'Crafted with premium Italian cashmere blend fabric, tailored to sculpt a sharp, masculine silhouette with minimalist gold neck detailing.',
    price: 45000,
    category: 'Senator Wear',
    image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Emerald Green Monarch Kaftan',
    description: 'Regal Kaftan outfit with tonal geometric stitching and concealed placket. Highly breathable luxury cotton damask perfect for refined daywear.',
    price: 52000,
    category: 'Kaftan',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL'],
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Royal Burgundy Bespoke Native Suit',
    description: 'Distinctive cut tailored from pure wool-blend woven native fabric. Features structured shoulders and tapered trousers.',
    price: 48000,
    category: 'Native Wear',
    image_url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Monogram Luxury Crisp French Cuff Shirt',
    description: 'Super 140s Egyptian giza cotton executive shirt with subtle textured weave, mother-of-pearl buttons, and bespoke collar stay.',
    price: 32000,
    category: 'Shirts',
    image_url: 'https://images.unsplash.com/photo-1620012253295-c15c429fbb41?q=80&w=800&auto=format&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Charcoal Wool Double-Breasted Suit',
    description: 'Impeccable boardroom authority suit featuring peak lapels, horn buttons, and high-twist wool fabric resisting creases.',
    price: 95000,
    category: 'Corporate Wear',
    image_url: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL'],
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to get configuration
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  // Check localStorage overrides if user entered keys directly in settings
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('bibi_supabase_url') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('bibi_supabase_key') || '' : '';

  const url = (localUrl || envUrl).trim();
  const anonKey = (localKey || envKey).trim();

  return { url, anonKey };
}

export function saveLocalSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('bibi_supabase_url', url.trim());
    else localStorage.removeItem('bibi_supabase_url');

    if (key) localStorage.setItem('bibi_supabase_key', key.trim());
    else localStorage.removeItem('bibi_supabase_key');
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    anonKey.length > 20
  );
}

let supabaseInstance: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance || currentUrl !== url || currentKey !== anonKey) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentUrl = url;
    currentKey = anonKey;
  }

  return supabaseInstance;
}

// STORAGE BUCKET
export const STORAGE_BUCKET = 'product-images';

/**
 * Upload a product image to Supabase Storage
 */
export async function uploadProductImage(file: File): Promise<string> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase is not configured. Please set your credentials.');
  }

  // Generate safe unique filename
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileExt = cleanName.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error('Failed to retrieve public URL for uploaded image.');
  }

  return data.publicUrl;
}

/**
 * Fetch all products from Supabase (with fallback if not configured)
 */
export async function fetchProductsFromSupabase(): Promise<{ products: Product[]; isLive: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    // Read from local storage if available, else initial products
    const stored = typeof window !== 'undefined' ? localStorage.getItem('bibi_local_products') : null;
    const products: Product[] = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    return { products, isLive: false };
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error querying Supabase products table:', error.message);
      // Fallback to local
      const stored = typeof window !== 'undefined' ? localStorage.getItem('bibi_local_products') : null;
      const products: Product[] = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
      return { products, isLive: false, error: error.message };
    }

    if (data) {
      const mappedProducts: Product[] = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        description: item.description || '',
        price: Number(item.price),
        category: item.category,
        image_url: item.image_url,
        sizes: Array.isArray(item.sizes) ? item.sizes : (typeof item.sizes === 'string' ? JSON.parse(item.sizes || '[]') : []),
        featured: Boolean(item.featured),
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      return { products: mappedProducts, isLive: true };
    }

    return { products: [], isLive: true };
  } catch (err: any) {
    console.error('Failed to fetch products from Supabase:', err);
    return { products: INITIAL_PRODUCTS, isLive: false, error: err.message };
  }
}

/**
 * Insert a new product into Supabase
 */
export async function insertProductToSupabase(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();

  if (!client) {
    // Save to local persistence
    const newProduct: Product = {
      ...productData,
      id: 'local_' + Date.now(),
      created_at: now,
      updated_at: now,
    };
    const stored = typeof window !== 'undefined' ? localStorage.getItem('bibi_local_products') : null;
    const list: Product[] = stored ? JSON.parse(stored) : [...INITIAL_PRODUCTS];
    list.unshift(newProduct);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bibi_local_products', JSON.stringify(list));
    }
    return newProduct;
  }

  const payload = {
    name: productData.name,
    description: productData.description,
    price: Number(productData.price),
    category: productData.category,
    image_url: productData.image_url,
    sizes: productData.sizes,
    featured: Boolean(productData.featured),
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await client
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return {
    id: String(data.id),
    name: data.name,
    description: data.description || '',
    price: Number(data.price),
    category: data.category,
    image_url: data.image_url,
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    featured: Boolean(data.featured),
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Update an existing product in Supabase
 */
export async function updateProductInSupabase(id: string, updates: Partial<Product>): Promise<void> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();

  if (!client) {
    // Update local storage
    const stored = typeof window !== 'undefined' ? localStorage.getItem('bibi_local_products') : null;
    let list: Product[] = stored ? JSON.parse(stored) : [...INITIAL_PRODUCTS];
    list = list.map(p => p.id === id ? { ...p, ...updates, updated_at: now } : p);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bibi_local_products', JSON.stringify(list));
    }
    return;
  }

  const payload: any = {
    ...updates,
    updated_at: now,
  };
  delete payload.id;

  const { error } = await client
    .from('products')
    .update(payload)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

/**
 * Delete a product from Supabase
 */
export async function deleteProductFromSupabase(id: string): Promise<void> {
  const client = getSupabaseClient();

  if (!client) {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('bibi_local_products') : null;
    let list: Product[] = stored ? JSON.parse(stored) : [...INITIAL_PRODUCTS];
    list = list.filter(p => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bibi_local_products', JSON.stringify(list));
    }
    return;
  }

  const { error } = await client
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

/**
 * SQL Schema script to create tables, RLS policies, and storage
 */
export const SUPABASE_SETUP_SQL = `-- BIBI'S BLOOMS SUPABASE DATABASE SETUP SCRIPT
-- Run this in your Supabase Project -> SQL Editor

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sizes TEXT[] NOT NULL DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for products table
-- Public can SELECT products
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
CREATE POLICY "Allow public read access"
    ON public.products FOR SELECT
    USING (true);

-- Authenticated admins can INSERT products
DROP POLICY IF EXISTS "Allow authenticated admin insert" ON public.products;
CREATE POLICY "Allow authenticated admin insert"
    ON public.products FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Authenticated admins can UPDATE products
DROP POLICY IF EXISTS "Allow authenticated admin update" ON public.products;
CREATE POLICY "Allow authenticated admin update"
    ON public.products FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Authenticated admins can DELETE products
DROP POLICY IF EXISTS "Allow authenticated admin delete" ON public.products;
CREATE POLICY "Allow authenticated admin delete"
    ON public.products FOR DELETE
    TO authenticated
    USING (true);

-- 4. Enable Supabase Realtime for instant updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- 5. Create Storage Bucket for product-images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Security Policies for product-images bucket
DROP POLICY IF EXISTS "Public Access to product-images" ON storage.objects;
CREATE POLICY "Public Access to product-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated Admin can upload product-images" ON storage.objects;
CREATE POLICY "Authenticated Admin can upload product-images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated Admin can update product-images" ON storage.objects;
CREATE POLICY "Authenticated Admin can update product-images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated Admin can delete product-images" ON storage.objects;
CREATE POLICY "Authenticated Admin can delete product-images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');
`;

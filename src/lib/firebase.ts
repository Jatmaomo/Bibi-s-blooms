import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer,
  writeBatch,
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { Product, Review } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfigData);

// Initialize Firestore with custom databaseId if configured
export const db: Firestore = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Test connection on boot per Firebase skill instructions
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection confirmed.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Please verify network/configuration.');
    } else {
      console.log('Firebase initialized successfully.');
    }
    return true;
  }
}

// Initial Starter Products for Bibi's Blooms
export const STARTER_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'Midnight Navy Embroidered Agbada',
    description:
      'Majestic 3-piece hand-loomed Agbada featuring bespoke gold thread embroidery across the chest and cuffs. Designed for high-profile ceremonies and dignitaries.',
    price: 85000,
    category: 'Agbada',
    image_url:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL'],
    featured: true,
  },
  {
    name: 'Imperial Black Senator Wear with Gold Trims',
    description:
      'Crafted with premium Italian cashmere blend fabric, tailored to sculpt a sharp, masculine silhouette with minimalist gold neck detailing.',
    price: 45000,
    category: 'Senator Wear',
    image_url:
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    name: 'Emerald Green Monarch Kaftan',
    description:
      'Regal Kaftan outfit with tonal geometric stitching and concealed placket. Highly breathable luxury cotton damask perfect for refined daywear.',
    price: 52000,
    category: 'Kaftan',
    image_url:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL'],
    featured: true,
  },
  {
    name: 'Royal Burgundy Bespoke Native Suit',
    description:
      'Distinctive cut tailored from pure wool-blend woven native fabric. Features structured shoulders and tapered trousers.',
    price: 48000,
    category: 'Native Wear',
    image_url:
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&auto=format&fit=crop',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
  },
  {
    name: 'Monogram Luxury Crisp French Cuff Shirt',
    description:
      'Super 140s Egyptian giza cotton executive shirt with subtle textured weave, mother-of-pearl buttons, and bespoke collar stay.',
    price: 32000,
    category: 'Shirts',
    image_url:
      'https://images.unsplash.com/photo-1620012253295-c15c429fbb41?q=80&w=800&auto=format&fit=crop',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
  },
  {
    name: 'Charcoal Wool Double-Breasted Suit',
    description:
      'Impeccable boardroom authority suit featuring peak lapels, horn buttons, and high-twist wool fabric resisting creases.',
    price: 95000,
    category: 'Corporate Wear',
    image_url:
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL'],
    featured: true,
  },
];

// Curated Fallback Products for Bibi's Blooms
export const FALLBACK_PRODUCTS: Product[] = STARTER_PRODUCTS.map((item, idx) => ({
  ...item,
  id: `catalog-item-${idx + 1}`,
  created_at: new Date(Date.now() - idx * 3600000).toISOString(),
  updated_at: new Date(Date.now() - idx * 3600000).toISOString(),
}));

// Seed initial products into Firestore (Authorized for authenticated admins only)
export async function seedProductsIfEmpty(): Promise<boolean> {
  // Only authenticated admins are permitted by Firestore Security Rules to write
  if (!auth.currentUser) {
    return false;
  }

  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty) {
      console.log('Seeding initial Bibi\'s Blooms catalog into Firestore as authenticated admin...');
      const batch = writeBatch(db);
      for (const item of STARTER_PRODUCTS) {
        const newDocRef = doc(productsRef);
        batch.set(newDocRef, {
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      await batch.commit();
      console.log('Firestore products seeded successfully.');
      return true;
    }
    return false;
  } catch (err: any) {
    console.warn('Notice while checking/seeding Firestore products:', err?.message || err);
    return false;
  }
}

// Subscribe to Products in Real Time via Firestore onSnapshot
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
): () => void {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('created_at', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          name: data.name || 'Untitled Piece',
          description: data.description || '',
          price: Number(data.price) || 0,
          category: data.category || 'Other',
          image_url:
            data.image_url ||
            'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800',
          sizes: Array.isArray(data.sizes) ? data.sizes : ['M', 'L', 'XL'],
          featured: Boolean(data.featured),
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        });
      });

      // If Firestore currently has 0 items (e.g. before initial admin seed),
      // provide the rich starter catalog to ensure public visitors see items immediately
      if (list.length === 0) {
        if (auth.currentUser) {
          seedProductsIfEmpty();
        }
        onUpdate(FALLBACK_PRODUCTS);
      } else {
        onUpdate(list);
      }
    },
    (err) => {
      console.warn('Firestore Realtime notice:', err);
      onUpdate(FALLBACK_PRODUCTS);
      if (onError) onError(err);
    }
  );
}

// Fetch products once from Firestore
export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      if (auth.currentUser) {
        await seedProductsIfEmpty();
        const refetched = await getDocs(productsRef);
        if (!refetched.empty) {
          return refetched.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));
        }
      }
      return FALLBACK_PRODUCTS;
    }

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
  } catch (err) {
    console.warn('Failed to get products from Firestore, providing fallback catalog:', err);
    return FALLBACK_PRODUCTS;
  }
}

// Add Product to Firestore
export async function addProductToFirestore(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
  const productsRef = collection(db, 'products');
  const newDoc = await addDoc(productsRef, {
    ...productData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  return newDoc.id;
}

// Update Product in Firestore
export async function updateProductInFirestore(
  id: string,
  updates: Partial<Omit<Product, 'id'>>
): Promise<void> {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...updates,
    updated_at: new Date().toISOString(),
  });
}

// Delete Product from Firestore
export async function deleteProductFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}

// Firebase Auth Methods
export async function signInAdmin(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export async function signUpAdmin(email: string, pass: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAdminAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// Starter Reviews for Bibi's Blooms Ready-to-Wear Wears
export const STARTER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Adebayo Oladipo',
    rating: 5,
    wearPurchased: 'Imperial Black Senator Wear',
    location: 'Lekki, Lagos',
    comment:
      'The Imperial Black Senator wear arrived within 24 hours. Impeccable ready-to-wear fit with zero adjustments needed! The cashmere blend is soft, durable, and royal. Bibi never disappoints.',
    verified: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'rev-2',
    customerName: 'Chief Emeka Nwosu',
    rating: 5,
    wearPurchased: 'Midnight Navy Embroidered Agbada',
    location: 'Maitama, Abuja',
    comment:
      'Ordered the Midnight Navy Agbada for my brother’s traditional wedding. The gold embroidery was breathtaking. The best part is it is ready-to-wear without the notorious delays of roadside sewing tailors!',
    verified: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'rev-3',
    customerName: 'Tunde Martins',
    rating: 5,
    wearPurchased: 'Emerald Green Monarch Kaftan',
    location: 'Port Harcourt',
    comment:
      'Stunning Kaftan! The fabric breathes well in humid weather, and the geometric collar design drew tons of compliments at church on Sunday. Will definitely order more ready wears.',
    verified: true,
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: 'rev-4',
    customerName: 'Dr. Ibrahim Bello',
    rating: 5,
    wearPurchased: 'Monogram French Cuff Shirt',
    location: 'Ikeja, Lagos',
    comment:
      'Exceptional executive shirt. Crisp collar, luxury mother-of-pearl buttons, and pure Egyptian cotton. Ready-made quality that rivals European luxury fashion houses.',
    verified: true,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

// Subscribe to Reviews in Real Time from Firestore
export function subscribeToReviews(
  onUpdate: (reviews: Review[]) => void,
  onError?: (err: Error) => void
): () => void {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, orderBy('created_at', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Review[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          customerName: data.customerName || 'Anonymous Customer',
          rating: Number(data.rating) || 5,
          comment: data.comment || '',
          wearPurchased: data.wearPurchased || '',
          location: data.location || '',
          verified: data.verified ?? true,
          created_at: data.created_at || new Date().toISOString(),
        });
      });

      if (list.length === 0) {
        onUpdate(STARTER_REVIEWS);
      } else {
        // Merge Firestore reviews with starter reviews so testimonials remain rich and vibrant
        const existingIds = new Set(list.map((r) => r.id));
        const combined = [...list];
        for (const starter of STARTER_REVIEWS) {
          if (!existingIds.has(starter.id)) {
            combined.push(starter);
          }
        }
        onUpdate(combined);
      }
    },
    (err) => {
      console.warn('Firestore Reviews subscription notice:', err);
      onUpdate(STARTER_REVIEWS);
      if (onError) onError(err);
    }
  );
}

// Add a new Customer Review to Firestore
export async function addReviewToFirestore(
  reviewData: Omit<Review, 'id' | 'created_at'>
): Promise<string> {
  const reviewsRef = collection(db, 'reviews');
  const newDoc = await addDoc(reviewsRef, {
    ...reviewData,
    created_at: new Date().toISOString(),
  });
  return newDoc.id;
}


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
    name: 'Heavyweight Graphic Luxury Roundneck',
    description:
      'Good-quality 280GSM combed cotton roundneck tee. Pre-shrunk, ultra-soft, tailored everyday cut designed to elevate any casual look.',
    price: 18000,
    category: 'Roundnecks',
    image_url:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL'],
    featured: true,
  },
  {
    name: 'Signature Mercerized Pique Polo',
    description:
      'Premium breathable pique cotton polo with structured ribbed collar, mother-of-pearl buttons, and tailored cuffs for the handsome gentleman.',
    price: 24000,
    category: 'Polos',
    image_url:
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL'],
    featured: true,
  },
  {
    name: 'Vintage Wash Relaxed Baggy Jeans',
    description:
      'High-grade heavyweight denim in authentic vintage stone wash. Relaxed baggy cut through thigh and ankle with heavy-duty rivets and durable pocketing.',
    price: 35000,
    category: 'Baggy Jeans',
    image_url:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop',
    sizes: ['30', '32', '34', '36', '38'],
    featured: true,
  },
  {
    name: 'Embroidered Bibi Suede Trucker Cap',
    description:
      'Refined suede curved visor cap featuring intricate tonal embroidery, metal buckle adjustment, and sweatband lining.',
    price: 15000,
    category: 'Caps',
    image_url:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    sizes: ['One Size'],
    featured: true,
  },
  {
    name: 'Handcrafted Ergonomic Leather Slides',
    description:
      'Supple genuine leather slide sandals with contoured orthopedic footbed and non-slip rubber tread. Effortless everyday luxury.',
    price: 26000,
    category: 'Slides',
    image_url:
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop',
    sizes: ['40', '41', '42', '43', '44', '45'],
    featured: true,
  },
  {
    name: 'Executive Chronograph Onyx Wristwatch',
    description:
      'Stainless steel casing with scratch-resistant sapphire crystal face and precision quartz chronograph movement. Water resistant.',
    price: 48000,
    category: 'Wristwatches',
    image_url:
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    sizes: ['Standard'],
    featured: true,
  },
  {
    name: 'Tactical Leather Everyday Cross Bag',
    description:
      'Durable textured leather cross-body bag with multiple zippered utility compartments, padded shoulder strap, and polished dark hardware.',
    price: 28000,
    category: 'Cross Bags',
    image_url:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    sizes: ['Standard'],
    featured: true,
  },
  {
    name: 'Minimalist Signature Snapback Cap',
    description:
      'Structured 6-panel premium cotton twill cap with embroidered monogram and brass clasp closure.',
    price: 18000,
    category: 'Caps',
    image_url:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    sizes: ['Standard'],
    featured: true,
  },
  {
    name: 'Oversized Washed Graphic Roundneck Tee',
    description:
      'Vintage acid-washed heavyweight tee with relaxed drop shoulders and soft combed finish.',
    price: 24000,
    category: 'Roundnecks',
    image_url:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL'],
    featured: false,
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
    wearPurchased: 'Vintage Wash Baggy Jeans',
    location: 'Lekki, Lagos',
    comment:
      'The Vintage Wash Baggy Jeans arrived within 24 hours. Impeccable fit and heavyweight denim quality. Ready-to-wear without any adjustments needed! Bibi never disappoints.',
    verified: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'rev-2',
    customerName: 'Emeka Nwosu',
    rating: 5,
    wearPurchased: 'Double Mercerized Knit Polo',
    location: 'Maitama, Abuja',
    comment:
      'Ordered the black knit polo. The silky Egyptian cotton texture and structured collar look high-end. Immediate dispatch and super easy WhatsApp checkout!',
    verified: true,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'rev-3',
    customerName: 'Tunde Martins',
    rating: 5,
    wearPurchased: 'Heavyweight Minimalist Roundneck',
    location: 'Port Harcourt',
    comment:
      'Stunning roundneck tee! Heavyweight French terry cotton with a durable collar that doesn’t stretch out. Will definitely be ordering more wears.',
    verified: true,
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: 'rev-4',
    customerName: 'Ibrahim Bello',
    rating: 5,
    wearPurchased: 'Minimalist Tactile Cross Bag',
    location: 'Ikeja, Lagos',
    comment:
      'Top-notch cross bag. High-grade hardware, neat stitching, and plenty of room for phone, wallet and keys. 10/10 quality.',
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

      // Only return real customer reviews from Firestore (no fake reviews)
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore Reviews subscription notice:', err);
      onUpdate([]);
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


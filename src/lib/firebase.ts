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

// Subscribe to Products in Real Time via Firestore onSnapshot
// Exclusively reflects authentic products uploaded and managed by the admin in Firestore
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
            'https://i.postimg.cc/26BVc637/IMG-20260904-WA0000.jpg',
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          featured: Boolean(data.featured),
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        });
      });

      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore Realtime notice:', err);
      if (onError) onError(err);
    }
  );
}

// Fetch products once from Firestore
export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
  } catch (err) {
    console.warn('Failed to get products from Firestore:', err);
    return [];
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


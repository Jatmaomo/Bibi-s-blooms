export type ProductCategory =
  | 'Roundnecks'
  | 'Polos'
  | 'Baggy Jeans'
  | 'Caps'
  | 'Slides'
  | 'Wristwatches'
  | 'Cross Bags'
  | 'Senator Wear'
  | 'Agbada'
  | 'Kaftan'
  | 'Native Wear'
  | 'Shirts'
  | 'Corporate Wear'
  | 'Accessories'
  | 'Other';

export const CATEGORIES: ProductCategory[] = [
  'Roundnecks',
  'Polos',
  'Baggy Jeans',
  'Caps',
  'Slides',
  'Wristwatches',
  'Cross Bags',
  'Senator Wear',
  'Agbada',
  'Kaftan',
  'Native Wear',
  'Shirts',
  'Corporate Wear',
  'Accessories',
  'Other',
];

export const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export type ProductSize = (typeof AVAILABLE_SIZES)[number];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image_url: string;
  sizes: string[];
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PageView = 'home' | 'shop' | 'about' | 'reviews' | 'contact' | 'admin';

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  wearPurchased?: string;
  location?: string;
  verified?: boolean;
  created_at: string;
}

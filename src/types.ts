export type CategoryId = 'all' | 'men' | 'women' | 'kids' | 'festive' | 'western' | 'accessories';

export interface ProductColor {
  name: string;
  nameBn: string;
  hex: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  category: CategoryId;
  subCategoryBn: string;
  subCategoryEn: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  descriptionBn: string;
  descriptionEn: string;
  fabricBn: string;
  fabricEn: string;
  careInstructionsBn: string;
  careInstructionsEn: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  tags: string[];
}

export interface CartItem {
  cartItemId: string; // generated unique key product.id + size + color
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderTimelineStep {
  titleBn: string;
  titleEn: string;
  date: string;
  done: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  address: string;
  district: string;
  deliveryArea: 'inside_city' | 'outside_city';
  paymentMethod: PaymentMethod;
  paymentStatus: 'unpaid' | 'paid';
  transactionId?: string;
  orderStatus: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedCoupon?: string;
  total: number;
  note?: string;
  timeline: OrderTimelineStep[];
}

export type Language = 'bn' | 'en';
export type Currency = 'BDT' | 'INR' | 'USD';

export interface FilterState {
  category: CategoryId;
  subCategory: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColors: string[];
  inStockOnly: boolean;
  hasDiscountOnly: boolean;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

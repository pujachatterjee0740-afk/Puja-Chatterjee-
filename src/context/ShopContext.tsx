import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, Language, Currency, FilterState, ProductColor, CategoryId } from '../types';
import { INITIAL_PRODUCTS, AVAILABLE_COUPONS, Coupon } from '../data/mockProducts';

interface ShopContextType {
  products: Product[];
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (cur: Currency) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartTotalItems: number;
  cartSubtotal: number;
  
  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Coupon & Delivery
  deliveryArea: 'inside_city' | 'outside_city';
  setDeliveryArea: (area: 'inside_city' | 'outside_city') => void;
  deliveryFee: number;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  grandTotal: number;
  
  // Modals & UI View States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
  isSellerOpen: boolean;
  setIsSellerOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline' | 'orderStatus' | 'items' | 'subtotal' | 'deliveryFee' | 'discount' | 'total'>) => Order;
  cancelOrder: (orderId: string) => void;
  
  // Filter
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Product Reviews & Inventory (Seller / User reviews)
  addProductReview: (productId: string, userName: string, rating: number, comment: string) => void;
  addNewProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'poshak_cart_v1';
const LOCAL_STORAGE_WISHLIST_KEY = 'poshak_wishlist_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'poshak_orders_v1';
const LOCAL_STORAGE_PRODUCTS_KEY = 'poshak_products_v1';

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [currency, setCurrency] = useState<Currency>('BDT');
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // UI state
  const [deliveryArea, setDeliveryArea] = useState<'inside_city' | 'outside_city'>('inside_city');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Filter State
  const initialFilterState: FilterState = {
    category: 'all',
    subCategory: 'all',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 10000,
    selectedSizes: [],
    selectedColors: [],
    inStockOnly: false,
    hasDiscountOnly: false,
    sortBy: 'popular',
  };
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch {}
  }, [products]);

  // Cart operations
  const addToCart = (product: Product, size: string, color: ProductColor, quantity: number = 1) => {
    const cartItemId = `${product.id}-${size}-${color.name}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, product, selectedSize: size, selectedColor: color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Delivery Fee: 60 inside, 110 outside; free for orders > 3500
  const deliveryFee = cartSubtotal >= 3500 ? 0 : (deliveryArea === 'inside_city' ? 60 : 110);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minSpend) {
    discountAmount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
  }

  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  // Coupon handling
  const applyCouponCode = (code: string) => {
    const found = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (!found) {
      return { success: false, message: 'অকার্যকর কুপন কোড (Invalid coupon code)' };
    }
    if (cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `এই কুপনের জন্য সর্বনিম্ন ৳${found.minSpend} টাকার কেনাকাটা প্রয়োজন (Min spend ৳${found.minSpend})`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `কুপন '${found.code}' যোগ করা হয়েছে (${found.discountPercent}% ছাড়)!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Order creation
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline' | 'orderStatus' | 'items' | 'subtotal' | 'deliveryFee' | 'discount' | 'total'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PSK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now.toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: discountAmount,
      appliedCoupon: appliedCoupon?.code,
      total: grandTotal,
      orderStatus: 'confirmed',
      timeline: [
        {
          titleBn: 'অর্ডার গ্রহণ সম্পন্ন হয়েছে',
          titleEn: 'Order Placed & Confirmed',
          date: dateStr,
          done: true,
          current: false,
        },
        {
          titleBn: 'পোশাক বাছাই ও প্যাকেজিং চলছে',
          titleEn: 'Packaging & Quality Check',
          date: 'প্রক্রিয়াধীন',
          done: true,
          current: true,
        },
        {
          titleBn: 'কুরিয়ার সার্ভিসে হস্তান্তর',
          titleEn: 'Dispatched to Courier',
          date: 'আগামীকাল',
          done: false,
          current: false,
        },
        {
          titleBn: 'গ্রাহকের ঠিকানায় ডেলিভারি সম্পূর্ণ',
          titleEn: 'Out for Delivery & Completed',
          date: '২-৩ দিনের মধ্যে',
          done: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: 'cancelled',
              timeline: [
                ...ord.timeline,
                {
                  titleBn: 'অর্ডার বাতিল করা হয়েছে',
                  titleEn: 'Order Cancelled',
                  date: new Date().toLocaleDateString('bn-BD'),
                  done: true,
                  current: true,
                },
              ],
            }
          : ord
      )
    );
  };

  // Add Product Review
  const addProductReview = (productId: string, userName: string, rating: number, comment: string) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      userName: userName || 'সম্মানিত ক্রেতা',
      rating,
      date: 'আজকে',
      comment,
      verifiedPurchase: true,
    };

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updatedReviews = [newRev, ...prod.reviews];
          const avgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...prod,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: Number(avgRating.toFixed(1)),
          };
        }
        return prod;
      })
    );
  };

  // Add New Product (Seller Hub)
  const addNewProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        language,
        currency,
        setLanguage,
        setCurrency,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalItems,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        deliveryArea,
        setDeliveryArea,
        deliveryFee,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        discountAmount,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isSellerOpen,
        setIsSellerOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        selectedProduct,
        setSelectedProduct,
        lastPlacedOrder,
        setLastPlacedOrder,
        orders,
        createOrder,
        cancelOrder,
        filters,
        setFilters,
        resetFilters,
        addProductReview,
        addNewProduct,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

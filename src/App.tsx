import React, { useState, useMemo } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { BannerSlider } from './components/BannerSlider';
import { CategoryFilter } from './components/CategoryFilter';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrdersTrackerModal } from './components/OrdersTrackerModal';
import { WishlistModal } from './components/WishlistModal';
import { SellerDashboardModal } from './components/SellerDashboardModal';
import { Footer } from './components/Footer';
import { Sparkles, Shirt, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import { TRANSLATIONS } from './utils/translations';

const ShopContent: React.FC = () => {
  const { language, products, filters, resetFilters } = useShop();
  const t = TRANSLATIONS[language];
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState(false);

  // Filter & Sort computation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Search query filter (matches Bengali name, English name, fabric, subcategory, tags)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesNameBn = product.nameBn.toLowerCase().includes(query);
        const matchesNameEn = product.nameEn.toLowerCase().includes(query);
        const matchesFabricBn = product.fabricBn.toLowerCase().includes(query);
        const matchesFabricEn = product.fabricEn.toLowerCase().includes(query);
        const matchesSubCat =
          product.subCategoryBn.toLowerCase().includes(query) ||
          product.subCategoryEn.toLowerCase().includes(query);
        const matchesTags = product.tags.some((tag) => tag.toLowerCase().includes(query));

        if (!matchesNameBn && !matchesNameEn && !matchesFabricBn && !matchesFabricEn && !matchesSubCat && !matchesTags) {
          return false;
        }
      }

      // Price range
      if (product.price > filters.maxPrice || product.price < filters.minPrice) {
        return false;
      }

      // Size filter
      if (filters.selectedSizes.length > 0) {
        const hasSize = filters.selectedSizes.some((s) =>
          product.sizes.some((ps) => ps.toLowerCase().includes(s.toLowerCase()))
        );
        if (!hasSize) return false;
      }

      // In-stock only
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // Discount only
      if (filters.hasDiscountOnly && product.discountPercent <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'newest') {
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      }
      // 'popular'
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });
  }, [products, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-rose-500 selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Promotional Hero Carousel Banner */}
        <BannerSlider />

        {/* Category Pill Filters & Sorting Bar */}
        <div id="category-filter-section">
          <CategoryFilter onToggleMobileFilters={() => setIsMobileFilterDrawerOpen(true)} />
        </div>

        {/* Products Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterSidebar />
          </div>

          {/* Product Grid Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Products Header Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                  {filters.category === 'all'
                    ? (language === 'bn' ? 'সকল পোশাক ও জামা কাপড়ের কালেকশন' : 'All Apparel Collections')
                    : filters.category === 'men'
                    ? (language === 'bn' ? 'পুরুষদের আধুনিক পোশাক' : 'Men\'s Collection')
                    : filters.category === 'women'
                    ? (language === 'bn' ? 'মহিলাদের ফ্যাশন ও শাড়ি' : 'Women\'s Collection')
                    : filters.category === 'kids'
                    ? (language === 'bn' ? 'শিশুদের বর্ণিল জামা কাপড়' : 'Kids Collection')
                    : filters.category === 'festive'
                    ? (language === 'bn' ? 'উৎসব, বিয়ে ও ঐতিহ্যবাহী শাড়ি' : 'Festive & Traditional Sarees')
                    : (language === 'bn' ? 'ক্যাজুয়াল ও আনুষঙ্গিক পোশাক' : 'Casual & Accessories')}
                </h2>
              </div>

              <span className="text-xs font-bold text-stone-500 bg-stone-200/70 px-2.5 py-1 rounded-lg">
                {filteredProducts.length} {t.showingProducts}
              </span>
            </div>

            {/* Products Listing Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                  <Shirt className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-900">{t.noProductsFound}</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {t.tryDifferentSearch}
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetFilters}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {isMobileFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-bold text-stone-900 text-sm">{t.filterTitle}</h3>
              <button
                onClick={() => setIsMobileFilterDrawerOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <FilterSidebar onCloseMobile={() => setIsMobileFilterDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <ProductDetailModal />
      <SizeGuideModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <OrdersTrackerModal />
      <WishlistModal />
      <SellerDashboardModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  );
}

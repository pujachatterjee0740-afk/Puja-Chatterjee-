import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Globe, 
  Package, 
  Store, 
  Percent, 
  Sparkles,
  ChevronDown,
  X,
  PhoneCall
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { TRANSLATIONS } from '../utils/translations';
import { Currency, Language } from '../types';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    cartTotalItems,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    orders,
    setIsOrdersOpen,
    setIsSellerOpen,
    filters,
    setFilters,
  } = useShop();

  const t = TRANSLATIONS[language];
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-100 text-xs py-1.5 px-4 font-medium transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border border-rose-500/30">
              <Percent className="w-3 h-3 text-rose-400" /> EID20
            </span>
            <p className="truncate text-stone-300 text-[11px] sm:text-xs">
              {language === 'bn' 
                ? 'ঈদ ও বৈশাখী বিশেষ অফার: ৩,৫০০ টাকার কেনাকাটায় সারা দেশে ফ্রি হোম ডেলিভারি!' 
                : 'Special Season Offer: Free nationwide delivery on orders over ৳3,500! Use code EID20'}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-stone-300 text-[11px] sm:text-xs">
            <a href="tel:01700000000" className="hidden md:inline-flex items-center gap-1 hover:text-white transition">
              <PhoneCall className="w-3 h-3 text-rose-400" />
              <span>{language === 'bn' ? 'হেল্পলাইন: ০৯৬১২-৩৩৪৫৫' : 'Helpline: 09612-33455'}</span>
            </a>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 border-l border-stone-700 pl-3">
              {(['BDT', 'INR', 'USD'] as Currency[]).map((cur) => (
                <button
                  key={cur}
                  id={`currency-${cur}`}
                  onClick={() => setCurrency(cur)}
                  className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium transition ${
                    currency === cur
                      ? 'bg-rose-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {cur === 'BDT' ? '৳ BDT' : cur === 'INR' ? '₹ INR' : '$ USD'}
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                id="lang-toggle-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] border border-stone-700"
              >
                <Globe className="w-3 h-3 text-rose-400" />
                <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-1 w-28 bg-white text-stone-800 rounded-lg shadow-xl border border-stone-200 py-1 z-50">
                  <button
                    id="lang-bn-opt"
                    onClick={() => {
                      setLanguage('bn');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-stone-100 flex items-center justify-between ${
                      language === 'bn' ? 'text-rose-600 font-bold bg-rose-50' : ''
                    }`}
                  >
                    <span>বাংলা (BN)</span>
                    {language === 'bn' && <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />}
                  </button>
                  <button
                    id="lang-en-opt"
                    onClick={() => {
                      setLanguage('en');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-stone-100 flex items-center justify-between ${
                      language === 'en' ? 'text-rose-600 font-bold bg-rose-50' : ''
                    }`}
                  >
                    <span>English (EN)</span>
                    {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-stone-900 flex items-center gap-1">
                {t.appName}
                <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
              </span>
              <p className="text-[10px] text-stone-500 font-medium tracking-wide uppercase -mt-1 hidden sm:block">
                {language === 'bn' ? 'অনলাইন জামা কাপড় ও ফ্যাশন' : 'Premium Clothing & Fashion'}
              </p>
            </div>
          </a>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <div
            className={`relative flex items-center rounded-xl border transition-all ${
              isSearchFocused
                ? 'border-rose-500 ring-2 ring-rose-500/20 bg-white shadow-sm'
                : 'border-stone-200 bg-stone-100/80 hover:bg-stone-100'
            }`}
          >
            <Search className="w-4 h-4 text-stone-400 ml-3.5 shrink-0" />
            <input
              id="global-search-input"
              type="text"
              placeholder={t.searchPlaceholder}
              value={filters.searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full py-2.5 pl-2.5 pr-8 text-sm text-stone-800 placeholder:text-stone-400 bg-transparent outline-hidden"
            />
            {filters.searchQuery && (
              <button
                onClick={clearSearch}
                className="p-1.5 text-stone-400 hover:text-stone-700 mr-2"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Seller Mode Trigger */}
          <button
            id="seller-mode-btn"
            onClick={() => setIsSellerOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition border border-stone-200"
            title="Seller Management"
          >
            <Store className="w-4 h-4 text-amber-600" />
            <span>{t.sellerMode}</span>
          </button>

          {/* Orders Tracking */}
          <button
            id="my-orders-btn"
            onClick={() => setIsOrdersOpen(true)}
            className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition border border-stone-200"
            title={t.orders}
          >
            <Package className="w-4 h-4 text-stone-700" />
            <span className="hidden lg:inline">{t.orders}</span>
            {orders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5"></span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            id="wishlist-btn"
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 rounded-xl text-stone-700 bg-stone-100 hover:bg-stone-200 transition border border-stone-200"
            title={t.wishlist}
          >
            <Heart className="w-4 h-4 text-rose-600" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Drawer Trigger */}
          <button
            id="cart-drawer-trigger-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm shadow-md shadow-stone-900/10 transition active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline font-semibold">{t.cart}</span>
            <span className="bg-rose-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {cartTotalItems}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="sm:hidden px-4 pb-2.5">
        <div className="relative flex items-center rounded-xl border border-stone-200 bg-stone-100">
          <Search className="w-4 h-4 text-stone-400 ml-3 shrink-0" />
          <input
            id="mobile-search-input"
            type="text"
            placeholder={t.searchPlaceholder}
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full py-2 pl-2 pr-7 text-xs text-stone-800 placeholder:text-stone-400 bg-transparent outline-hidden"
          />
          {filters.searchQuery && (
            <button onClick={clearSearch} className="p-1 text-stone-400 mr-2">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  Sparkles, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Heart, 
  ShoppingBag, 
  Home, 
  Package, 
  Grid 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { TRANSLATIONS } from '../utils/translations';
import { CategoryId } from '../types';

export const Footer: React.FC = () => {
  const {
    language,
    setFilters,
    cartTotalItems,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    orders,
    setIsOrdersOpen,
  } = useShop();

  const t = TRANSLATIONS[language];

  const handleCategoryClick = (cat: CategoryId) => {
    setFilters((prev) => ({ ...prev, category: cat, subCategory: 'all' }));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 md:pb-12 mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  {t.appName}
                  <span className="w-2 h-2 rounded-full bg-rose-600 inline-block ml-1"></span>
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                {language === 'bn'
                  ? 'আমরা দিচ্ছি ঐতিহ্য ও আধুনিক ফ্যাশনের মেলবন্ধনে সেরা মানের শাড়ি, সুতি পাঞ্জাবি, কুর্তি ও শিশুদের আরামদায়ক পোশাকের সমাহার।'
                  : 'Your trusted destination for premium handloom sarees, pure cotton panjabis, festive bridal wear, and comfy kids apparel.'}
              </p>
              <div className="space-y-1.5 text-xs text-stone-400 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{language === 'bn' ? 'ধানমন্ডি ও গুলশান শোরুম, ঢাকা, বাংলাদেশ' : 'Dhanmondi & Gulshan Outlets, Dhaka'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>+৮৮০ ১৭০০-০০০০০০ (২৪/৭ হেল্পলাইন)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>support@poshakclothings.com</span>
                </div>
              </div>
            </div>

            {/* Collections Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
                {language === 'bn' ? 'পোশাক ক্যাটাগরি' : 'Apparel Collections'}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => handleCategoryClick('men')} className="hover:text-rose-400 transition">
                    {t.men}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick('women')} className="hover:text-rose-400 transition">
                    {t.women}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick('kids')} className="hover:text-rose-400 transition">
                    {t.kids}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick('festive')} className="hover:text-rose-400 transition">
                    {t.festive}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick('western')} className="hover:text-rose-400 transition">
                    {t.western}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick('accessories')} className="hover:text-rose-400 transition">
                    {t.accessories}
                  </button>
                </li>
              </ul>
            </div>

            {/* Customer Care & Policies */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
                {language === 'bn' ? 'গ্রাহক সেবা ও নীতি' : 'Customer Service'}
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'bn' ? 'সারা দেশে ক্যাশ অন ডেলিভারি' : 'Nationwide COD'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ গ্যারান্টি' : '7 Days Easy Exchange'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'bn' ? '১০০% অরিজিনাল খাঁটি কাপড়' : '100% Authentic Quality'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'bn' ? 'অর্ডার ট্র্যাকিং ও সাপোর্ট' : 'Order Tracking & Support'}</span>
                </li>
              </ul>
            </div>

            {/* Payment & Newsletter */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-stone-800 pb-2">
                {language === 'bn' ? 'নিরাপদ পেমেন্ট পার্টনার' : 'Payment Partners'}
              </h4>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
                <span className="px-2.5 py-1 bg-stone-800 text-rose-400 rounded-lg border border-stone-700">bKash</span>
                <span className="px-2.5 py-1 bg-stone-800 text-amber-400 rounded-lg border border-stone-700">Nagad</span>
                <span className="px-2.5 py-1 bg-stone-800 text-purple-400 rounded-lg border border-stone-700">Rocket</span>
                <span className="px-2.5 py-1 bg-stone-800 text-blue-400 rounded-lg border border-stone-700">Visa / Card</span>
                <span className="px-2.5 py-1 bg-stone-800 text-emerald-400 rounded-lg border border-stone-700">Cash On Delivery</span>
              </div>
              <p className="text-[11px] text-stone-500">
                {language === 'bn'
                  ? '© ২০২৬ পোশাক ফ্যাশন স্টোর। সর্বস্বত্ব সংরক্ষিত।'
                  : '© 2026 Poshak Fashion Store. All rights reserved.'}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Fixed Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-40 py-2 px-3 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setFilters((prev) => ({ ...prev, category: 'all' }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-stone-700 hover:text-rose-600 transition"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('category-filter-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-stone-700 hover:text-rose-600 transition"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold">{language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</span>
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="relative flex flex-col items-center gap-1 text-stone-700 hover:text-rose-600 transition"
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.wishlist}</span>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsOrdersOpen(true)}
          className="relative flex flex-col items-center gap-1 text-stone-700 hover:text-rose-600 transition"
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t.orders}</span>
          {orders.length > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-rose-600 font-bold"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black px-1 rounded-full">
              {cartTotalItems}
            </span>
          </div>
          <span className="text-[10px]">{t.cart}</span>
        </button>
      </nav>
    </>
  );
};

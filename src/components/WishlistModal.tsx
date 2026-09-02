import React from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';

export const WishlistModal: React.FC = () => {
  const {
    language,
    currency,
    wishlist,
    toggleWishlist,
    addToCart,
    isWishlistOpen,
    setIsWishlistOpen,
    setSelectedProduct,
  } = useShop();

  const t = TRANSLATIONS[language];

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (prod: any) => {
    addToCart(
      prod,
      prod.sizes[0] || 'Standard',
      prod.colors[0] || { name: 'Default', nameBn: 'ডিফল্ট', hex: '#000' },
      1
    );
    toggleWishlist(prod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {t.wishlist} ({wishlist.length})
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'bn' ? 'আপনার সংরক্ষিত পছন্দের পোশাকসমূহ' : 'Your saved favorite apparel items'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="overflow-y-auto p-6 flex-1">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">
                {language === 'bn' ? 'উইশলিস্টে কোনো পোশাক যোগ করা হয়নি' : 'Your wishlist is empty'}
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {language === 'bn'
                  ? 'পছন্দের জামা কাপড়ে হার্ট আইকনে ক্লিক করে সংরক্ষণ করুন।'
                  : 'Tap the heart icon on any product to save it here for later.'}
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="mt-2 px-5 py-2.5 bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlist.map((prod) => (
                <div
                  key={prod.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200 hover:border-stone-300 transition items-center"
                >
                  <img
                    src={prod.images[0]}
                    alt={language === 'bn' ? prod.nameBn : prod.nameEn}
                    className="w-16 h-20 object-cover rounded-xl bg-stone-200 shrink-0 cursor-pointer"
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setSelectedProduct(prod);
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setSelectedProduct(prod);
                      }}
                      className="font-bold text-stone-900 text-xs sm:text-sm truncate cursor-pointer hover:text-rose-600"
                    >
                      {language === 'bn' ? prod.nameBn : prod.nameEn}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {language === 'bn' ? prod.fabricBn : prod.fabricEn}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold text-stone-900 text-xs sm:text-sm">
                        {formatPrice(prod.price, currency, language)}
                      </span>
                      {prod.originalPrice > prod.price && (
                        <span className="text-[11px] text-stone-400 line-through">
                          {formatPrice(prod.originalPrice, currency, language)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToCart(prod)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                      title={t.addToCart}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.addToCart}</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

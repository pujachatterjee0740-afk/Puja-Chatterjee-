import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check, 
  AlertCircle,
  Percent
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';
import { AVAILABLE_COUPONS } from '../data/mockProducts';

export const CartDrawer: React.FC = () => {
  const {
    language,
    currency,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotalItems,
    cartSubtotal,
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
    setIsCheckoutOpen,
  } = useShop();

  const t = TRANSLATIONS[language];
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  if (!isCartOpen) return null;

  // Free delivery threshold: 3500
  const freeDeliveryThreshold = 3500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const remainingForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;
    const res = applyCouponCode(code);
    if (res.success) {
      setCouponFeedback({ type: 'success', msg: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', msg: res.message });
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Dark Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {t.yourCart}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {cartTotalItems} {t.itemCount}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-rose-50/70 border-b border-rose-100 text-xs">
              <div className="flex items-center justify-between font-semibold text-stone-800 mb-1">
                <span className="flex items-center gap-1 text-rose-700">
                  <Truck className="w-3.5 h-3.5" />
                  {remainingForFree === 0
                    ? (language === 'bn' ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন!' : 'Congratulations! You qualified for Free Shipping!')
                    : (language === 'bn'
                        ? `আর ${formatPrice(remainingForFree, currency, language)} এর কেনাকাটায় ফ্রি ডেলিভারি!`
                        : `Add ${formatPrice(remainingForFree, currency, language)} more for FREE Delivery!`)}
                </span>
                <span className="font-bold text-rose-600">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-rose-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-800 text-base">{t.emptyCart}</h4>
                <p className="text-xs text-stone-500 max-w-xs">
                  {language === 'bn'
                    ? 'আপনার পছন্দের শাড়ি, পাঞ্জাবি, শার্ট বা কুর্তি ব্যাগ-এ যোগ করুন।'
                    : 'Explore our premium collections and add your favorite apparel.'}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition"
                >
                  {t.startShopping}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3 p-3 rounded-2xl bg-stone-50/80 border border-stone-200/80 hover:border-stone-300 transition"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={language === 'bn' ? item.product.nameBn : item.product.nameEn}
                    className="w-18 h-22 object-cover object-top rounded-xl bg-stone-200 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-stone-900 truncate leading-snug">
                          {language === 'bn' ? item.product.nameBn : item.product.nameEn}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Size & Color tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-stone-500">
                        <span className="bg-white px-1.5 py-0.5 rounded border border-stone-200 font-medium">
                          {item.selectedSize}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span>{language === 'bn' ? item.selectedColor.nameBn : item.selectedColor.name}</span>
                        </span>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-stone-200 bg-white p-0.5 shadow-xs">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 rounded hover:bg-stone-100 text-stone-700 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 rounded hover:bg-stone-100 text-stone-700 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-stone-900 text-xs sm:text-sm">
                        {formatPrice(item.product.price * item.quantity, currency, language)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer (Coupons, Delivery, Checkout Summary) */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              {/* Delivery Area Option */}
              <div>
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                  {t.deliveryLocation}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setDeliveryArea('inside_city')}
                    className={`p-2 rounded-xl border text-center font-medium transition ${
                      deliveryArea === 'inside_city'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {t.insideDhaka}
                  </button>
                  <button
                    onClick={() => setDeliveryArea('outside_city')}
                    className={`p-2 rounded-xl border text-center font-medium transition ${
                      deliveryArea === 'outside_city'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {t.outsideDhaka}
                  </button>
                </div>
              </div>

              {/* Promo Coupon Section */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:underline text-[11px] font-bold"
                    >
                      {language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                        <input
                          type="text"
                          placeholder={t.couponCode}
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponFeedback(null);
                          }}
                          className="w-full py-2 pl-8 pr-2.5 text-xs bg-white rounded-xl border border-stone-200 uppercase outline-hidden focus:border-rose-500"
                        />
                      </div>
                      <button
                        onClick={() => handleApplyCoupon()}
                        className="px-3.5 py-2 bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition"
                      >
                        {t.applyCoupon}
                      </button>
                    </div>

                    {/* Quick Coupons Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-stone-500 font-medium">
                        {language === 'bn' ? 'প্রস্তাবিত কুপন:' : 'Available:'}
                      </span>
                      {AVAILABLE_COUPONS.slice(0, 2).map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleApplyCoupon(c.code)}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-stone-200 hover:border-rose-500 text-stone-700 font-mono transition"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>

                    {couponFeedback && (
                      <p
                        className={`text-[11px] font-semibold flex items-center gap-1 ${
                          couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {couponFeedback.type === 'success' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {couponFeedback.msg}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-stone-200 text-stone-600">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-stone-900">{formatPrice(cartSubtotal, currency, language)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.deliveryFee}</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'text-stone-900'}`}>
                    {deliveryFee === 0 ? (language === 'bn' ? 'ফ্রি (Free)' : 'FREE') : formatPrice(deliveryFee, currency, language)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট' : 'Coupon Discount'}</span>
                    <span>-{formatPrice(discountAmount, currency, language)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
                  <span>{t.totalAmount}</span>
                  <span className="text-base text-rose-600">{formatPrice(grandTotal, currency, language)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

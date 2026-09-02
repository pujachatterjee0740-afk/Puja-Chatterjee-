import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Ruler, 
  Plus, 
  Minus, 
  Sparkles, 
  Check, 
  MessageSquareQuote,
  Send,
  Share2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';
import { ProductColor } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    language,
    currency,
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    setIsCheckoutOpen,
    addProductReview,
  } = useShop();

  const t = TRANSLATIONS[language];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setSelectedSize(selectedProduct.sizes[0] || 'Standard');
      setSelectedColor(selectedProduct.colors[0] || { name: 'Default', nameBn: 'ডিফল্ট', hex: '#000' });
      setQuantity(1);
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const isWishlisted = isInWishlist(selectedProduct.id);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedProduct.inStock) return;
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedProduct.inStock) return;
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addProductReview(selectedProduct.id, reviewerName.trim(), reviewRating, reviewComment.trim());
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Floating Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
          {/* Main Grid: Gallery & Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Gallery Column */}
            <div className="space-y-3">
              {/* Main Active Image View */}
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={language === 'bn' ? selectedProduct.nameBn : selectedProduct.nameEn}
                  className="w-full h-full object-cover object-top"
                />
                {selectedProduct.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                    -{selectedProduct.discountPercent}% {t.discount}
                  </span>
                )}
                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition ${
                    isWishlisted
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-white/80 text-stone-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Row */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-rose-600 ring-2 ring-rose-500/20 shadow-xs'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Controls Column */}
            <div className="flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                {/* Subcategory & Star Rating */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                    {language === 'bn' ? selectedProduct.subCategoryBn : selectedProduct.subCategoryEn}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-stone-900">{selectedProduct.rating}</span>
                    <span className="text-stone-400">({selectedProduct.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                  {language === 'bn' ? selectedProduct.nameBn : selectedProduct.nameEn}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-rose-600">
                    {formatPrice(selectedProduct.price, currency, language)}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-sm text-stone-400 line-through">
                      {formatPrice(selectedProduct.originalPrice, currency, language)}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {language === 'bn' ? 'ইনভেন্টরিতে স্টক আছে' : 'Ready to Dispatch'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {language === 'bn' ? selectedProduct.descriptionBn : selectedProduct.descriptionEn}
                </p>

                {/* Color Selection */}
                {selectedProduct.colors.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                      <span>{t.selectColor}:</span>
                      <span className="text-stone-500 font-semibold">
                        {language === 'bn' ? selectedColor?.nameBn : selectedColor?.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                            selectedColor?.name === c.name
                              ? 'border-stone-900 ring-2 ring-stone-900/10 bg-stone-50 font-bold shadow-xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{language === 'bn' ? c.nameBn : c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {selectedProduct.sizes.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                      <span>{t.selectSize}:</span>
                      <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold underline underline-offset-2"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>{t.sizeGuide}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                            selectedSize === sz
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="pt-2 flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-800">
                    {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
                  </span>
                  <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 rounded-lg hover:bg-white text-stone-700 transition"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 rounded-lg hover:bg-white text-stone-700 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock}
                  className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                    !selectedProduct.inStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === 'bn' ? 'ব্যাগে যোগ হয়েছে!' : 'Added to Bag!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-rose-400" />
                      <span>{t.addToCart}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!selectedProduct.inStock}
                  className="flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.buyNow}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Specifications, Fabric & Delivery Guarantees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-stone-200">
            {/* Fabric & Composition */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>{t.fabricDetails}</span>
              </h4>
              <p className="text-xs text-stone-700 font-medium">
                {language === 'bn' ? selectedProduct.fabricBn : selectedProduct.fabricEn}
              </p>
              <div className="pt-1 text-[11px] text-stone-500">
                <span className="font-semibold">{t.careGuide}: </span>
                <span>{language === 'bn' ? selectedProduct.careInstructionsBn : selectedProduct.careInstructionsEn}</span>
              </div>
            </div>

            {/* Delivery & Warranty Policies */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'ডেলিভারি ও সেবা নীতি' : 'Delivery & Service Policy'}</span>
              </h4>
              <div className="space-y-1.5 text-xs text-stone-700">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{t.deliveryPromise}</span>
                </p>
                <p className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{t.returnPolicy}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  {t.reviews} ({selectedProduct.reviews.length})
                </h3>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition"
              >
                {t.addReview}
              </button>
            </div>

            {/* Add Review Form Drawer */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-900">{t.addReview}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder={language === 'bn' ? 'আপনার নাম' : 'Your Full Name'}
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs outline-hidden focus:border-rose-500"
                  />
                  {/* Star rating selector */}
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200">
                    <span className="text-xs text-stone-500">{language === 'bn' ? 'রেটিং:' : 'Rating:'}</span>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="hover:scale-110 transition"
                        >
                          <Star
                            className={`w-4 h-4 ${star <= reviewRating ? 'fill-current' : 'text-stone-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  required
                  rows={2}
                  placeholder={t.writeComment}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-stone-200 text-xs outline-hidden focus:border-rose-500"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.submitReview}</span>
                  </button>
                </div>
              </form>
            )}

            {reviewSubmitted && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'আপনার মূল্যবান রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Your review has been published!'}</span>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {selectedProduct.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-white border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{rev.userName}</span>
                    <span className="text-[11px] text-stone-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-stone-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pt-0.5">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

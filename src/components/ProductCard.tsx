import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Eye, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    language, 
    currency, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProduct 
  } = useShop();

  const t = TRANSLATIONS[language];
  const isWishlisted = isInWishlist(product.id);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Default', nameBn: 'ডিফল্ট', hex: '#000' });
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const displayImage = isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={language === 'bn' ? product.nameBn : product.nameEn}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Top Left Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-600 text-white shadow-md shadow-rose-600/20 tracking-tight">
              -{product.discountPercent}% {t.discount}
            </span>
          )}
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-stone-950 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              {t.bestSeller}
            </span>
          )}
        </div>

        {/* Wishlist Heart Action */}
        <button
          onClick={handleWishlistClick}
          aria-label="Toggle Wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-600 text-white shadow-md scale-110'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-rose-600 shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-3 px-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold shadow-lg border border-stone-200/50">
            <Eye className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.quickView}</span>
          </span>
        </div>

        {/* Out of Stock Ribbon */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-3 py-1.5 bg-stone-900 text-white text-xs font-bold rounded-lg border border-stone-700 shadow-lg">
              {t.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Sub-Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-stone-400">
              {language === 'bn' ? product.subCategoryBn : product.subCategoryEn}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-stone-900 text-sm line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
            {language === 'bn' ? product.nameBn : product.nameEn}
          </h3>

          {/* Fabric subtitle snippet */}
          <p className="text-[11px] text-stone-500 mt-0.5 truncate">
            {language === 'bn' ? product.fabricBn : product.fabricEn}
          </p>
        </div>

        {/* Color Swatch Dots */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
            {product.colors.slice(0, 4).map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c)}
                title={language === 'bn' ? c.nameBn : c.name}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedColor.name === c.name
                    ? 'ring-2 ring-rose-500 ring-offset-1 scale-115 border-white'
                    : 'border-stone-300 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-stone-400">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Price & Add to Cart Footer */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-stone-900 text-base sm:text-lg tracking-tight">
                {formatPrice(product.price, currency, language)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.originalPrice, currency, language)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`p-2.5 rounded-xl font-bold transition-all shadow-xs active:scale-90 flex items-center justify-center ${
              !product.inStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-rose-600 text-white'
            }`}
            title={product.inStock ? t.addToCart : t.outOfStock}
          >
            {addedAnimation ? (
              <Check className="w-4 h-4 text-white animate-scale" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

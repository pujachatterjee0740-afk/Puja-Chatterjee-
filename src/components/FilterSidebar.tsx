import React from 'react';
import { RotateCcw, Check, Sparkles, Tag, ShieldAlert } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';

const AVAILABLE_SIZES = ['30', '32', '34', '36', '38', '40', '42', '44', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const FilterSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { language, currency, filters, setFilters, resetFilters, products } = useShop();
  const t = TRANSLATIONS[language];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: Number(e.target.value),
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFilters((prev) => {
      const exists = prev.selectedSizes.includes(size);
      return {
        ...prev,
        selectedSizes: exists
          ? prev.selectedSizes.filter((s) => s !== size)
          : [...prev.selectedSizes, size],
      };
    });
  };

  return (
    <aside className="bg-white rounded-2xl border border-stone-200 p-5 space-y-6 shadow-xs">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>{t.filterTitle}</span>
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.resetFilters}</span>
        </button>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
          <span>{t.priceRange}</span>
          <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md">
            {formatPrice(filters.minPrice, currency, language)} - {formatPrice(filters.maxPrice, currency, language)}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min="500"
          max="10000"
          step="250"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-rose-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1">
          <span>{formatPrice(500, currency, language)}</span>
          <span>{formatPrice(10000, currency, language)}</span>
        </div>
      </div>

      {/* Size Selector Badges */}
      <div>
        <h4 className="text-xs font-semibold text-stone-700 mb-2.5">
          {t.sizeSelect}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.selectedSizes.includes(size);
            return (
              <button
                key={size}
                id={`filter-size-${size}`}
                onClick={() => handleSizeToggle(size)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  isSelected
                    ? 'bg-stone-900 text-white font-bold ring-2 ring-stone-900/20 shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Toggle Checkboxes */}
      <div className="space-y-2.5 pt-2 border-t border-stone-100">
        <label className="flex items-center gap-2.5 text-xs font-medium text-stone-700 cursor-pointer select-none">
          <input
            id="filter-discount-toggle"
            type="checkbox"
            checked={filters.hasDiscountOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, hasDiscountOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
          />
          <Tag className="w-3.5 h-3.5 text-rose-500" />
          <span>{language === 'bn' ? 'শুধুমাত্র ছাড়যুক্ত পোশাক' : 'Discounted Offers Only'}</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs font-medium text-stone-700 cursor-pointer select-none">
          <input
            id="filter-instock-toggle"
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
          />
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
          <span>{language === 'bn' ? 'শুধুমাত্র স্টকে আছে এমন' : 'In-Stock Items Only'}</span>
        </label>
      </div>

      {/* Close button for Mobile Drawer */}
      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full lg:hidden py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl mt-4 shadow-md"
        >
          {language === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filters'}
        </button>
      )}
    </aside>
  );
};

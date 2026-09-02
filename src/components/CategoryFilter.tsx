import React from 'react';
import { 
  Sparkles, 
  User, 
  HeartHandshake, 
  Baby, 
  Flame, 
  Shirt, 
  Layers,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryId } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface CategoryItem {
  id: CategoryId;
  nameBn: string;
  nameEn: string;
  icon: React.ReactNode;
}

export const CategoryFilter: React.FC<{ onToggleMobileFilters?: () => void }> = ({ onToggleMobileFilters }) => {
  const { language, filters, setFilters, products } = useShop();
  const t = TRANSLATIONS[language];

  const categories: CategoryItem[] = [
    { id: 'all', nameBn: 'সব জামা কাপড়', nameEn: 'All Apparel', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'men', nameBn: 'পুরুষদের পোশাক', nameEn: 'Men\'s Wear', icon: <User className="w-4 h-4" /> },
    { id: 'women', nameBn: 'মহিলাদের পোশাক', nameEn: 'Women\'s Wear', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'kids', nameBn: 'শিশুদের পোশাক', nameEn: 'Kids & Baby', icon: <Baby className="w-4 h-4" /> },
    { id: 'festive', nameBn: 'উৎসব ও শাড়ি', nameEn: 'Festive & Sarees', icon: <Flame className="w-4 h-4" /> },
    { id: 'western', nameBn: 'ক্যাজুয়াল ও জিন্স', nameEn: 'Casual & Jeans', icon: <Shirt className="w-4 h-4" /> },
    { id: 'accessories', nameBn: 'শাল ও এক্সেসরিজ', nameEn: 'Shawls & More', icon: <Layers className="w-4 h-4" /> },
  ];

  const getCategoryCount = (catId: CategoryId) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  const handleCategorySelect = (catId: CategoryId) => {
    setFilters((prev) => ({
      ...prev,
      category: catId,
      subCategory: 'all',
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: e.target.value as any,
    }));
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = filters.category === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => handleCategorySelect(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-xs ${
                isActive
                  ? 'bg-rose-600 text-white shadow-rose-600/20 shadow-md scale-102'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-stone-500'}>
                {cat.icon}
              </span>
              <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Bar (Search query indicator, Sort Dropdown & Mobile Filter Button) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-200/60">
        <div className="text-xs sm:text-sm text-stone-500">
          {filters.searchQuery ? (
            <p>
              {language === 'bn' ? 'অনুসন্ধান ফলাফল: ' : 'Search results for: '}
              <span className="font-bold text-stone-900">"{filters.searchQuery}"</span>
            </p>
          ) : (
            <p className="font-medium text-stone-600">
              {language === 'bn'
                ? 'অনলাইন প্রিমিয়াম জামা কাপড় সম্ভার'
                : 'Showing premier fashion collection'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile Filter Trigger */}
          {onToggleMobileFilters && (
            <button
              onClick={onToggleMobileFilters}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.filterTitle}</span>
            </button>
          )}

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-xs text-stone-400 hidden sm:inline">{t.sortBy}:</span>
            <select
              id="product-sort-select"
              value={filters.sortBy}
              onChange={handleSortChange}
              className="text-xs font-medium text-stone-800 bg-transparent outline-hidden cursor-pointer"
            >
              <option value="popular">{t.sortPopular}</option>
              <option value="price-low">{t.sortPriceAsc}</option>
              <option value="price-high">{t.sortPriceDesc}</option>
              <option value="rating">{t.sortRating}</option>
              <option value="newest">{t.sortNewest}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Store, 
  PlusCircle, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Layers, 
  Check, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';
import { CategoryId, ProductColor } from '../types';

export const SellerDashboardModal: React.FC = () => {
  const {
    language,
    currency,
    products,
    orders,
    isSellerOpen,
    setIsSellerOpen,
    addNewProduct,
  } = useShop();

  const t = TRANSLATIONS[language];

  // Active sub-view in seller hub: 'overview' | 'add' | 'inventory'
  const [sellerView, setSellerView] = useState<'overview' | 'add' | 'inventory'>('overview');

  // New product form state
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<CategoryId>('men');
  const [subCategoryBn, setSubCategoryBn] = useState('পাঞ্জাবি');
  const [subCategoryEn, setSubCategoryEn] = useState('Panjabi');
  const [price, setPrice] = useState('1850');
  const [originalPrice, setOriginalPrice] = useState('2450');
  const [fabricBn, setFabricBn] = useState('১০০% প্রিমিয়াম সুতি');
  const [fabricEn, setFabricEn] = useState('100% Premium Cotton');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [sizesInput, setSizesInput] = useState('38, 40, 42, 44');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80');
  const [stockCount, setStockCount] = useState('25');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  if (!isSellerOpen) return null;

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.total : 0), 0);
  const totalCompletedOrders = orders.filter((o) => o.orderStatus !== 'cancelled').length;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const pVal = Number(price) || 0;
    const origVal = Number(originalPrice) || pVal;
    const discount = origVal > pVal ? Math.round(((origVal - pVal) / origVal) * 100) : 0;
    const parsedSizes = sizesInput.split(',').map((s) => s.trim()).filter(Boolean);

    const defaultColors: ProductColor[] = [
      { name: 'Black', nameBn: 'কালো', hex: '#1c1917' },
      { name: 'Navy Blue', nameBn: 'নেভি ব্লু', hex: '#1e3a8a' },
      { name: 'White', nameBn: 'সাদা', hex: '#f8fafc' },
    ];

    addNewProduct({
      nameBn: nameBn.trim() || 'নতুন আকর্ষণীয় পোশাক',
      nameEn: nameEn.trim() || 'New Stylish Apparel',
      category,
      subCategoryBn: subCategoryBn.trim() || 'পোশাক',
      subCategoryEn: subCategoryEn.trim() || 'Apparel',
      price: pVal,
      originalPrice: origVal,
      discountPercent: discount,
      descriptionBn: descriptionBn.trim() || 'উচ্চমানের কাপড়ে তৈরি আধুনিক ও আরামদায়ক পোশাক।',
      descriptionEn: descriptionEn.trim() || 'Premium quality apparel made for maximum comfort and style.',
      fabricBn: fabricBn.trim() || '১০০% সুতি',
      fabricEn: fabricEn.trim() || '100% Cotton',
      careInstructionsBn: 'হালকা পানিতে ধৌত করুন।',
      careInstructionsEn: 'Gentle wash in cold water.',
      images: [imageUrl.trim()],
      sizes: parsedSizes.length > 0 ? parsedSizes : ['Standard'],
      colors: defaultColors,
      inStock: Number(stockCount) > 0,
      stockCount: Number(stockCount) || 10,
      tags: [category, 'New Arrival'],
    });

    setIsSuccessMessage(true);
    setTimeout(() => {
      setIsSuccessMessage(false);
      setSellerView('inventory');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {t.sellerTitle}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'bn' ? 'পোশাক বিক্রি, ইনভেন্টরি ও অর্ডার ব্যবস্থাপনা ড্যাশবোর্ড' : 'Apparel Merchant & Inventory Hub'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSellerOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-6 bg-white gap-2">
          <button
            onClick={() => setSellerView('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              sellerView === 'overview'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {language === 'bn' ? 'ব্যবসায়িক ওভারভিউ' : 'Overview & Stats'}
          </button>
          <button
            onClick={() => setSellerView('add')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              sellerView === 'add'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.addProduct}</span>
          </button>
          <button
            onClick={() => setSellerView('inventory')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              sellerView === 'inventory'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t.manageInventory} ({products.length})
          </button>
        </div>

        {/* Body View */}
        <div className="overflow-y-auto p-6 flex-1">
          {sellerView === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-2">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-stone-500 font-semibold">{t.totalRevenue}</p>
                  <h4 className="text-xl font-black text-amber-900">
                    {formatPrice(totalRevenue, currency, language)}
                  </h4>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center mb-2">
                    <Package className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-stone-500 font-semibold">{t.totalOrders}</p>
                  <h4 className="text-xl font-black text-rose-900">
                    {totalCompletedOrders}
                  </h4>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-stone-500 font-semibold">{t.totalProducts}</p>
                  <h4 className="text-xl font-black text-emerald-900">
                    {products.length}
                  </h4>
                </div>
              </div>

              {/* Quick Action Banner */}
              <div className="p-5 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    {language === 'bn' ? 'দোকানে নতুন জামা কাপড় লিস্ট করুন' : 'List New Apparel to Your Store'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    {language === 'bn'
                      ? 'নতুন শাড়ি, পাঞ্জাবি বা আধুনিক পোশাক দ্রুত যুক্ত করে বিক্রি বাড়ান।'
                      : 'Add high quality product details and reach more apparel customers.'}
                  </p>
                </div>
                <button
                  onClick={() => setSellerView('add')}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.addProduct}</span>
                </button>
              </div>
            </div>
          )}

          {sellerView === 'add' && (
            <form onSubmit={handleAddProduct} className="space-y-4">
              {isSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'bn' ? 'পোশাকটি সফলভাবে ক্যাটালগে যুক্ত হয়েছে!' : 'Product added successfully!'}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.productNameBn} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="উদা: প্রিমিয়াম ঢাকাই জামদানি শাড়ি"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.productNameEn} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Premium Dhakai Jamdani Saree"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.categoryLabel}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-amber-500"
                  >
                    <option value="men">{t.men}</option>
                    <option value="women">{t.women}</option>
                    <option value="kids">{t.kids}</option>
                    <option value="festive">{t.festive}</option>
                    <option value="western">{t.western}</option>
                    <option value="accessories">{t.accessories}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.priceLabel} *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.originalPriceLabel}
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'bn' ? 'ফেব্রিক ও উপাদান (বাংলা)' : 'Fabric Description (BN)'}
                  </label>
                  <input
                    type="text"
                    value={fabricBn}
                    onChange={(e) => setFabricBn(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'bn' ? 'সাইজ সমূহ (কমা দিয়ে লিখুন)' : 'Available Sizes (comma separated)'}
                  </label>
                  <input
                    type="text"
                    placeholder="38, 40, 42, 44, M, L, XL"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'bn' ? 'ছবির অনলাইন লিঙ্ক (Image URL)' : 'Product Image URL'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden"
                  />
                  {imageUrl && (
                    <img src={imageUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.stockLabel}
                  </label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSellerView('overview')}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.saveProduct}</span>
                </button>
              </div>
            </form>
          )}

          {sellerView === 'inventory' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {language === 'bn' ? `স্টক ইনভেন্টরি তালিকা (${products.length} আইটেম)` : `Inventory Items (${products.length})`}
              </h4>

              <div className="rounded-2xl border border-stone-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 font-bold text-stone-700 border-b border-stone-200">
                    <tr>
                      <th className="p-3">পোশাক</th>
                      <th className="p-3">ক্যাটাগরি</th>
                      <th className="p-3">মূল্য</th>
                      <th className="p-3">স্টক</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="p-3 flex items-center gap-2">
                          <img src={p.images[0]} alt="Thumbnail" className="w-9 h-11 object-cover rounded-lg bg-stone-200" />
                          <div>
                            <p className="font-bold text-stone-900 truncate max-w-xs">{language === 'bn' ? p.nameBn : p.nameEn}</p>
                            <p className="text-[10px] text-stone-400">{p.sizes.join(', ')}</p>
                          </div>
                        </td>
                        <td className="p-3 capitalize">{p.category}</td>
                        <td className="p-3 font-bold text-stone-900">{formatPrice(p.price, currency, language)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {p.inStock ? `${p.stockCount} ${language === 'bn' ? 'টি বাকি' : 'in stock'}` : 'Stock Out'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

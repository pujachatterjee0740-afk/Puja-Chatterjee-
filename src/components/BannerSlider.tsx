import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CategoryId } from '../types';

export const BannerSlider: React.FC = () => {
  const { language, setFilters, applyCouponCode } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const slides = [
    {
      id: 'slide-1',
      badgeBn: 'নতুন উৎসব কালেকশন ২০২৬',
      badgeEn: 'Festive Collection 2026',
      titleBn: 'আভিজাত্য ও ঐতিহ্যের সেরা পোশাক',
      titleEn: 'Crafted for Elegance & Tradition',
      subtitleBn: 'হাতে বোনা ঢাকাই জামদানি, তসর সিল্ক শাড়ি ও এক্সক্লুসিভ ডিজাইনার পাঞ্জাবি সংগ্রহে ৩০% পর্যন্ত ছাড়।',
      subtitleEn: 'Handwoven Dhakai Jamdani, Tussar silk sarees and signature embroidered panjabis up to 30% off.',
      category: 'festive' as CategoryId,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      coupon: 'EID20',
      btnTextBn: 'উৎসবের পোশাক দেখুন',
      btnTextEn: 'Explore Festive Wear',
    },
    {
      id: 'slide-2',
      badgeBn: 'প্রিমিয়াম সুতি পাঞ্জাবি ও শার্ট',
      badgeEn: 'Pure Cotton Comfort',
      titleBn: '১০০% অরগানিক সুতি পাঞ্জাবি ও ফরমাল শার্ট',
      titleEn: '100% Combed Cotton Panjabis & Shirts',
      subtitleBn: 'গ্রীষ্ম ও বসন্তের আবহে সর্বোচ্চ আরামদায়ক ফেব্রিক, নিখুঁত স্টিচিং ও আধুনিক স্টাইলিশ ফিটিং।',
      subtitleEn: 'Ultra-breathable fabrics, tailored collar designs, and refined textures for day-long effortless style.',
      category: 'men' as CategoryId,
      image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1200&q=80',
      coupon: 'FASHION15',
      btnTextBn: 'পুরুষদের পোশাক দেখুন',
      btnTextEn: 'Shop Men\'s Apparel',
    },
    {
      id: 'slide-3',
      badgeBn: 'শিশুদের বর্ণিল ও আরামদায়ক পোশাক',
      badgeEn: 'Kids & Toddler Happiness',
      titleBn: 'ছোট্টমণিদের রঙিন ফ্রক ও পাঞ্জাবি সেট',
      titleEn: 'Vibrant & Skin-Friendly Kids Wear',
      subtitleBn: '১-১০ বছরের শিশুদের ত্বকের উপযোগী কোমল সুতি ফেব্রিক, অ্যালার্জি-মুক্ত ও টেকসই রঙের নিশ্চয়তা।',
      subtitleEn: 'Hypoallergenic, ultra-soft cotton wear designed for total play comfort and celebratory joy.',
      category: 'kids' as CategoryId,
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=80',
      coupon: 'FIRST10',
      btnTextBn: 'কিডস কালেকশন দেখুন',
      btnTextEn: 'Shop Kids Wear',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleCategoryClick = (cat: CategoryId) => {
    setFilters((prev) => ({ ...prev, category: cat, subCategory: 'all' }));
  };

  const handleCopyCoupon = (code: string) => {
    applyCouponCode(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden mb-6">
      {/* Carousel Main Container */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[360px] sm:min-h-[420px] flex items-center shadow-lg border border-stone-800">
        {/* Background Image with Dark Overlay Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={language === 'bn' ? slide.titleBn : slide.titleEn}
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent"></div>
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-8 sm:py-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-md border border-rose-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'bn' ? slide.badgeBn : slide.badgeEn}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3 text-white">
            {language === 'bn' ? slide.titleBn : slide.titleEn}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 line-clamp-2 sm:line-clamp-3">
            {language === 'bn' ? slide.subtitleBn : slide.subtitleEn}
          </p>

          {/* CTA & Coupon Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleCategoryClick(slide.category)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all hover:gap-3 active:scale-95"
            >
              <span>{language === 'bn' ? slide.btnTextBn : slide.btnTextEn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleCopyCoupon(slide.coupon)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold backdrop-blur-md border border-white/20 transition active:scale-95"
              title="Apply Promo Code"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {copiedCoupon === slide.coupon
                  ? (language === 'bn' ? 'কুপন যোগ হয়েছে!' : 'Coupon Applied!')
                  : `${language === 'bn' ? 'কুপন' : 'Code'}: ${slide.coupon}`}
              </span>
            </button>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition border border-white/10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5 px-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-rose-500' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition border border-white/10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trust & Guarantee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              {language === 'bn' ? 'সারা দেশে হোম ডেলিভারি' : 'Nationwide Home Delivery'}
            </h4>
            <p className="text-[11px] text-stone-500">
              {language === 'bn' ? '২-৩ দিনে ক্যাশ অন ডেলিভারি' : 'Cash on Delivery in 2-3 Days'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              {language === 'bn' ? '১০০% খাঁটি ও সেরা সুতি ফেব্রিক' : '100% Authentic Quality'}
            </h4>
            <p className="text-[11px] text-stone-500">
              {language === 'bn' ? 'রং পাকা ও প্রিমিয়াম কোয়ালিটি' : 'Premium color & stitch finish'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              {language === 'bn' ? '৭ দিনের সহজ এক্সচেঞ্জ' : '7 Days Easy Exchange'}
            </h4>
            <p className="text-[11px] text-stone-500">
              {language === 'bn' ? 'সাইজ পরিবর্তন বা রিটার্ন সুবিধা' : 'Size swap or return guarantee'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

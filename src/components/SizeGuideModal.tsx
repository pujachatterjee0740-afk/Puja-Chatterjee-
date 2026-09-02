import React, { useState } from 'react';
import { X, Ruler, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { language, isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [activeTab, setActiveTab] = useState<'panjabi' | 'shirt' | 'kurti' | 'tshirt' | 'jeans'>('panjabi');

  if (!isSizeGuideOpen) return null;

  const panjabiSizes = [
    { size: '38 (S)', chest: '38-39"', length: '40"', sleeve: '24.5"', shoulder: '17"' },
    { size: '40 (M)', chest: '40-41"', length: '42"', sleeve: '25"', shoulder: '17.5"' },
    { size: '42 (L)', chest: '42-43"', length: '44"', sleeve: '25.5"', shoulder: '18"' },
    { size: '44 (XL)', chest: '44-45"', length: '45"', sleeve: '26"', shoulder: '19"' },
    { size: '46 (XXL)', chest: '46-47"', length: '46"', sleeve: '26.5"', shoulder: '20"' },
  ];

  const shirtSizes = [
    { size: 'S (38)', chest: '38"', length: '28.5"', shoulder: '17.5"', collar: '15"' },
    { size: 'M (40)', chest: '40"', length: '29.5"', shoulder: '18"', collar: '15.5"' },
    { size: 'L (42)', chest: '42"', length: '30.5"', shoulder: '19"', collar: '16"' },
    { size: 'XL (44)', chest: '44"', length: '31.5"', shoulder: '20"', collar: '16.5"' },
    { size: 'XXL (46)', chest: '46"', length: '32.5"', shoulder: '21"', collar: '17"' },
  ];

  const kurtiSizes = [
    { size: '36 (S)', bust: '36"', waist: '32"', hip: '38"', length: '42"' },
    { size: '38 (M)', bust: '38"', waist: '34"', hip: '40"', length: '43"' },
    { size: '40 (L)', bust: '40"', waist: '36"', hip: '42"', length: '44"' },
    { size: '42 (XL)', bust: '42"', waist: '38"', hip: '44"', length: '45"' },
    { size: '44 (XXL)', bust: '44"', waist: '40"', hip: '46"', length: '45"' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {language === 'bn' ? 'পোশাকের সঠিক সাইজ চার্ট ও নির্দেশিকা' : 'Official Apparel Size Guide'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'bn' ? 'ইঞ্চিতে পরিমাপ (Standard Measurement in Inches)' : 'All measurements in standard inches'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 px-6 bg-white overflow-x-auto">
          {[
            { id: 'panjabi', labelBn: 'পাঞ্জাবি', labelEn: 'Panjabi' },
            { id: 'shirt', labelBn: 'শার্ট', labelEn: 'Shirt' },
            { id: 'kurti', labelBn: 'কুর্তি ও থ্রি-পিস', labelEn: 'Kurti / 3-Piece' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {language === 'bn' ? tab.labelBn : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'panjabi' && (
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">সাইজ (Size)</th>
                    <th className="p-3">বুকের মাপ (Chest)</th>
                    <th className="p-3">লম্বা (Length)</th>
                    <th className="p-3">হাতার মাপ (Sleeve)</th>
                    <th className="p-3">কাঁধ (Shoulder)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {panjabiSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900">{row.size}</td>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.length}</td>
                      <td className="p-3">{row.sleeve}</td>
                      <td className="p-3">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shirt' && (
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">সাইজ (Size)</th>
                    <th className="p-3">বুক (Chest)</th>
                    <th className="p-3">লম্বা (Length)</th>
                    <th className="p-3">কাঁধ (Shoulder)</th>
                    <th className="p-3">কলার (Collar)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {shirtSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900">{row.size}</td>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.length}</td>
                      <td className="p-3">{row.shoulder}</td>
                      <td className="p-3">{row.collar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'kurti' && (
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">সাইজ (Size)</th>
                    <th className="p-3">বক্ষ (Bust)</th>
                    <th className="p-3">কোমর (Waist)</th>
                    <th className="p-3">হিপ (Hip)</th>
                    <th className="p-3">লম্বা (Length)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {kurtiSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900">{row.size}</td>
                      <td className="p-3">{row.bust}</td>
                      <td className="p-3">{row.waist}</td>
                      <td className="p-3">{row.hip}</td>
                      <td className="p-3">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Measurement Tips */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>{language === 'bn' ? 'সঠিক মাপ নেওয়ার টিপস:' : 'Measurement Tips:'}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-800">
              <li>{language === 'bn' ? 'টেপ দিয়ে বুক বা ছাতির সবচেয়ে চওড়া অংশ মেপে নিন।' : 'Measure around the fullest part of your chest/bust.'}</li>
              <li>{language === 'bn' ? 'পাঞ্জাবি ও কুর্তির ক্ষেত্রে শরীরের মাপের চেয়ে ১-২ ইঞ্চি বেশি নিলে পরা আরামদায়ক হয়।' : 'Add 1-2 inches ease for comfortable traditional garment fit.'}</li>
              <li>{language === 'bn' ? 'সাইজে সমস্যা হলে ৭ দিনের মধ্যে বিনামূল্যে এক্সচেঞ্জ সুবিধা উপভোগ করুন।' : 'Hassle-free size exchange within 7 days if it doesn’t fit.'}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition"
          >
            {language === 'bn' ? 'চার্ট বন্ধ করুন' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};

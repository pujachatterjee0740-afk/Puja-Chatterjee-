import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ArrowRight, 
  Lock, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';
import { BANGLADESH_DISTRICTS } from '../data/mockProducts';
import { PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    language,
    currency,
    cart,
    cartSubtotal,
    deliveryArea,
    setDeliveryArea,
    deliveryFee,
    discountAmount,
    grandTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    createOrder,
  } = useShop();

  const t = TRANSLATIONS[language];

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা (Dhaka)');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [mfsNumber, setMfsNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 11) {
      setFormError(language === 'bn' ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।' : 'Please enter a valid 11-digit phone number.');
      return;
    }

    if (!address.trim()) {
      setFormError(language === 'bn' ? 'অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা লিখুন।' : 'Please enter detailed delivery address.');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !trxId.trim()) {
      setFormError(language === 'bn' ? 'বিকাশ/নগদ পেমেন্টের ট্রানজেকশন আইডি (TrxID) লিখুন।' : 'Please enter the transaction ID (TrxID).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        address: address.trim(),
        district,
        deliveryArea,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        transactionId: trxId.trim() || undefined,
        note: orderNotes.trim() || undefined,
      });

      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {t.checkoutTitle}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'bn' ? 'নিরাপদ ১০০% এনক্রিপ্টেড অর্ডার চেকআউট' : 'Secure 100% Encrypted Checkout'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Delivery Details Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <Truck className="w-4 h-4 text-rose-600" />
              <span>{language === 'bn' ? '১. ডেলিভারির তথ্য' : '1. Delivery Details'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'উদা: রাকিবুল ইসলাম' : 'e.g. John Doe'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-rose-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.district}
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDistrict(val);
                    if (val.includes('Dhaka') || val.includes('ঢাকা')) {
                      setDeliveryArea('inside_city');
                    } else {
                      setDeliveryArea('outside_city');
                    }
                  }}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-rose-500 focus:bg-white"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.altPhone}
                </label>
                <input
                  type="tel"
                  placeholder="019XXXXXXXX"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-rose-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.fullAddress}
              </label>
              <textarea
                required
                rows={2}
                placeholder={
                  language === 'bn'
                    ? 'বাসা নং, রোড নং, এলাকা বা ইউনিয়ন, থানা'
                    : 'House no, Road/Street, Village/Thana, Landmark'
                }
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs outline-hidden focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span>{language === 'bn' ? '২. পেমেন্ট পদ্ধতি' : '2. Payment Method'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* COD */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <Banknote className="w-6 h-6 text-emerald-600 mb-1.5" />
                <span className="text-xs font-bold text-stone-900">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {language === 'bn' ? 'পণ্য হাতে পেয়ে পেমেন্ট' : 'Pay when you receive'}
                </span>
              </label>

              {/* bKash / Nagad */}
              <label
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition ${
                  paymentMethod === 'bkash'
                    ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <Smartphone className="w-6 h-6 text-rose-600 mb-1.5" />
                <span className="text-xs font-bold text-stone-900">
                  bKash / বিকাশ
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {language === 'bn' ? 'মার্চেন্ট পেমেন্ট' : 'Mobile Banking'}
                </span>
              </label>

              {/* Nagad */}
              <label
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition ${
                  paymentMethod === 'nagad'
                    ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <Smartphone className="w-6 h-6 text-amber-600 mb-1.5" />
                <span className="text-xs font-bold text-stone-900">
                  Nagad / নগদ
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">
                  {language === 'bn' ? 'ইনস্ট্যান্ট পেমেন্ট' : 'Direct Mobile Pay'}
                </span>
              </label>
            </div>

            {/* Mobile Banking Instructions and TrxID input */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-2 text-xs text-rose-950">
                <div className="font-bold flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-rose-600" />
                  <span>
                    {paymentMethod === 'bkash' ? 'বিকাশ পেমেন্ট নির্দেশনা:' : 'নগদ পেমেন্ট নির্দেশনা:'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-700">
                  {language === 'bn'
                    ? `আমাদের মার্চেন্ট নম্বর 01700-000000 এ Make Payment / Send Money করে ট্রানজেকশন আইডি (TrxID) নিচে প্রদান করুন:`
                    : `Please send ${formatPrice(grandTotal, currency, language)} to Merchant 01700-000000 and provide the TrxID below:`}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'প্রেরক বিকাশ/নগদ নম্বর' : 'Sender Mobile No'}
                    value={mfsNumber}
                    onChange={(e) => setMfsNumber(e.target.value)}
                    className="p-2 bg-white rounded-xl border border-stone-200 text-xs font-mono"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Transaction ID (TrxID) *"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    className="p-2 bg-white rounded-xl border border-stone-200 text-xs font-mono uppercase font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items Summary Overview */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <h5 className="font-bold text-stone-900 flex items-center justify-between">
              <span>{language === 'bn' ? 'অর্ডারকৃত পোশাকসমূহ:' : 'Ordered Items:'}</span>
              <span>{cart.length} {t.itemCount}</span>
            </h5>
            <div className="divide-y divide-stone-200 max-h-32 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.cartItemId} className="py-1.5 flex justify-between items-center text-stone-700">
                  <span className="truncate pr-2">
                    {language === 'bn' ? item.product.nameBn : item.product.nameEn} ({item.selectedSize}) × {item.quantity}
                  </span>
                  <span className="font-bold text-stone-900 shrink-0">
                    {formatPrice(item.product.price * item.quantity, currency, language)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-stone-900">
              <span>{t.totalAmount}</span>
              <span className="text-rose-600">{formatPrice(grandTotal, currency, language)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>{t.orderProcessing}</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.confirmOrder} ({formatPrice(grandTotal, currency, language)})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

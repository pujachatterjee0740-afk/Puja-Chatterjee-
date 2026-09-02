import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  X,
  Clock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';

export const OrderSuccessModal: React.FC = () => {
  const {
    language,
    currency,
    lastPlacedOrder,
    setLastPlacedOrder,
    setIsOrdersOpen,
  } = useShop();

  const t = TRANSLATIONS[language];

  if (!lastPlacedOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleTrack = () => {
    setLastPlacedOrder(null);
    setIsOrdersOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 text-white p-6 sm:p-8 text-center relative">
          <button
            onClick={() => setLastPlacedOrder(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black mb-1">
            {t.orderSuccessTitle}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            {t.orderSuccessSubtitle}
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono font-bold text-rose-300 border border-white/20">
            <span>{t.orderNumber}:</span>
            <span className="text-white">{lastPlacedOrder.orderNumber}</span>
          </div>
        </div>

        {/* Invoice & Tracking Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Timeline Progress */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.trackStatus}</span>
            </h4>

            <div className="relative pl-6 space-y-4 border-l-2 border-rose-200 ml-2">
              {lastPlacedOrder.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <span
                    className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                      step.done
                        ? 'bg-rose-600 border-white text-white'
                        : 'bg-stone-200 border-stone-300 text-stone-400'
                    }`}
                  >
                    {step.done && <CheckCircle2 className="w-2.5 h-2.5" />}
                  </span>

                  <div>
                    <h5
                      className={`text-xs font-bold ${
                        step.current ? 'text-rose-600' : step.done ? 'text-stone-900' : 'text-stone-400'
                      }`}
                    >
                      {language === 'bn' ? step.titleBn : step.titleEn}
                    </h5>
                    <p className="text-[11px] text-stone-500">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Customer Info Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}</span>
              </h5>
              <p className="font-semibold text-stone-800">{lastPlacedOrder.customerName}</p>
              <p className="text-stone-600">{lastPlacedOrder.address}</p>
              <p className="text-stone-600 font-mono">{lastPlacedOrder.phone} | {lastPlacedOrder.district}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
              <h5 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'পেমেন্ট ও সময়কাল' : 'Payment & Timeline'}</span>
              </h5>
              <p className="text-stone-600">
                <span className="font-semibold">{language === 'bn' ? 'পেমেন্ট:' : 'Payment:'} </span>
                <span className="font-bold text-stone-800 uppercase">{lastPlacedOrder.paymentMethod}</span>
              </p>
              <p className="text-stone-600">
                <span className="font-semibold">{t.estimatedDelivery}: </span>
                <span className="text-emerald-700 font-bold">{t.deliveryDays}</span>
              </p>
            </div>
          </div>

          {/* Itemized Receipt Table */}
          <div className="rounded-2xl border border-stone-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-stone-100 font-bold text-stone-700 border-b border-stone-200">
                <tr>
                  <th className="p-3">{language === 'bn' ? 'পোশাক' : 'Apparel Item'}</th>
                  <th className="p-3 text-center">{language === 'bn' ? 'পরিমাণ' : 'Qty'}</th>
                  <th className="p-3 text-right">{language === 'bn' ? 'মূল্য' : 'Price'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {lastPlacedOrder.items.map((item) => (
                  <tr key={item.cartItemId}>
                    <td className="p-3">
                      <p className="font-bold text-stone-900">
                        {language === 'bn' ? item.product.nameBn : item.product.nameEn}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {item.selectedSize} | {language === 'bn' ? item.selectedColor.nameBn : item.selectedColor.name}
                      </p>
                    </td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right font-bold text-stone-900">
                      {formatPrice(item.product.price * item.quantity, currency, language)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-stone-50 font-bold text-stone-800 border-t border-stone-200">
                <tr>
                  <td colSpan={2} className="p-3 text-right">{t.subtotal}:</td>
                  <td className="p-3 text-right">{formatPrice(lastPlacedOrder.subtotal, currency, language)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-3 text-right">{t.deliveryFee}:</td>
                  <td className="p-3 text-right">{formatPrice(lastPlacedOrder.deliveryFee, currency, language)}</td>
                </tr>
                {lastPlacedOrder.discount > 0 && (
                  <tr className="text-emerald-700">
                    <td colSpan={2} className="p-3 text-right">{language === 'bn' ? 'ডিসকাউন্ট:' : 'Discount:'}</td>
                    <td className="p-3 text-right">-{formatPrice(lastPlacedOrder.discount, currency, language)}</td>
                  </tr>
                )}
                <tr className="text-sm font-black text-rose-600 bg-rose-50/50">
                  <td colSpan={2} className="p-3 text-right">{t.totalAmount}:</td>
                  <td className="p-3 text-right">{formatPrice(lastPlacedOrder.total, currency, language)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.downloadInvoice}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleTrack}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.trackOrder}</span>
            </button>
            <button
              onClick={() => setLastPlacedOrder(null)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-600/20"
            >
              {t.continueShopping}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

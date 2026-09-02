import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  Calendar,
  Ban
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';

export const OrdersTrackerModal: React.FC = () => {
  const {
    language,
    currency,
    orders,
    isOrdersOpen,
    setIsOrdersOpen,
    cancelOrder,
  } = useShop();

  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (!isOrdersOpen) return null;

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.phone.includes(searchQuery) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || filteredOrders[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Package className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {t.orders} & {t.trackOrder}
              </h3>
              <p className="text-[11px] text-stone-500">
                {language === 'bn' ? 'আপনার সকল অর্ডারের লাইভ ট্র্যাকিং ও বিস্তারিত' : 'Live status of all your apparel orders'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOrdersOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Header */}
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="relative flex items-center max-w-md rounded-xl border border-stone-200 bg-stone-50">
            <Search className="w-4 h-4 text-stone-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder={language === 'bn' ? 'অর্ডার নম্বর বা ফোন দিয়ে খুঁজুন...' : 'Search by Order ID or phone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-2 pr-3 text-xs bg-transparent outline-hidden"
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">
                {language === 'bn' ? 'আপনার কোনো পূর্ববর্তী অর্ডার নেই' : 'No previous orders found'}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আমাদের চমৎকার শাড়ি, পাঞ্জাবি বা আধুনিক পোশাক থেকে এখনই কেনাকাটা শুরু করুন।'
                  : 'Explore collections and place your first order today.'}
              </p>
              <button
                onClick={() => setIsOrdersOpen(false)}
                className="mt-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/20"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order List Column */}
              <div className="space-y-3 lg:border-r lg:border-stone-200 lg:pr-6">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {language === 'bn' ? `অর্ডার সমূহ (${filteredOrders.length})` : `Order List (${filteredOrders.length})`}
                </h4>

                <div className="space-y-2 max-h-[480px] overflow-y-auto">
                  {filteredOrders.map((ord) => {
                    const isSelected = activeOrder?.id === ord.id;
                    return (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrderId(ord.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                            : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono font-bold text-xs text-stone-900 truncate">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ord.orderStatus === 'cancelled'
                                ? 'bg-stone-200 text-stone-600'
                                : ord.orderStatus === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-500 truncate">
                          {ord.items.length} {t.itemCount} • {formatPrice(ord.total, currency, language)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Order Details Column */}
              {activeOrder && (
                <div className="lg:col-span-2 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                        {t.orderNumber}
                      </span>
                      <h4 className="font-mono font-black text-stone-900 text-base">
                        {activeOrder.orderNumber}
                      </h4>
                    </div>

                    {activeOrder.orderStatus !== 'cancelled' && activeOrder.orderStatus !== 'delivered' && (
                      <button
                        onClick={() => cancelOrder(activeOrder.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'অর্ডার বাতিল করুন' : 'Cancel Order'}</span>
                      </button>
                    )}
                  </div>

                  {/* Live Progress Timeline */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                    <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-rose-600" />
                      <span>{t.trackStatus}</span>
                    </h5>

                    <div className="relative pl-6 space-y-3.5 border-l-2 border-rose-300 ml-2 text-xs">
                      {activeOrder.timeline.map((step, idx) => (
                        <div key={idx} className="relative">
                          <span
                            className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                              step.done ? 'bg-rose-600 border-white text-white' : 'bg-stone-200 border-stone-300 text-stone-400'
                            }`}
                          >
                            {step.done && <CheckCircle2 className="w-2.5 h-2.5" />}
                          </span>
                          <div className="leading-tight">
                            <span className={`font-bold ${step.current ? 'text-rose-600 font-extrabold' : step.done ? 'text-stone-900' : 'text-stone-400'}`}>
                              {language === 'bn' ? step.titleBn : step.titleEn}
                            </span>
                            <span className="text-[11px] text-stone-500 block">{step.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items List in this order */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-stone-800">
                      {language === 'bn' ? 'পোশাকের তালিকা:' : 'Purchased Apparel Items:'}
                    </h5>
                    <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 p-2">
                      {activeOrder.items.map((it) => (
                        <div key={it.cartItemId} className="p-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={it.product.images[0]}
                              alt="Item"
                              className="w-10 h-12 object-cover rounded-lg bg-stone-100"
                            />
                            <div>
                              <p className="font-bold text-stone-900 truncate max-w-xs">
                                {language === 'bn' ? it.product.nameBn : it.product.nameEn}
                              </p>
                              <p className="text-[11px] text-stone-500">
                                {it.selectedSize} • {language === 'bn' ? it.selectedColor.nameBn : it.selectedColor.name} • Qty: {it.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-stone-900">
                            {formatPrice(it.product.price * it.quantity, currency, language)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

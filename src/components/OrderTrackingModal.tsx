import React, { useState } from 'react';
import { X, Package, Truck, CheckCircle2, Clock, Search, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    orders,
    activeTrackingId,
    setActiveTrackingId,
    formatPrice,
  } = useStore();

  const [inputOrderId, setInputOrderId] = useState(activeTrackingId || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (activeTrackingId) {
      return orders.find((o) => o.id === activeTrackingId) || orders[0] || null;
    }
    return orders[0] || null;
  });

  if (!isOrderTrackingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputOrderId.trim().toUpperCase();
    const found = orders.find(
      (o) => o.id.toUpperCase() === clean || o.trackingNumber.toUpperCase().includes(clean)
    );
    if (found) {
      setSelectedOrder(found);
      setActiveTrackingId(found.id);
    } else {
      setSelectedOrder(null);
    }
  };

  const steps = [
    { title: 'WhatsApp Order Queued', desc: 'Order details received via WhatsApp' },
    { title: 'Tiruppur QC & Pack', desc: 'Pre-shrunk inspection & atelier packing' },
    { title: 'Dispatched', desc: 'Shipped via Delhivery / BlueDart Express' },
    { title: 'Out for Delivery', desc: 'Courier on final local route' },
    { title: 'Delivered', desc: 'Received & verified by customer' }
  ];

  const getStepStatus = (orderStatus: string, stepIdx: number) => {
    const statusMap: Record<string, number> = {
      Processing: 0,
      'Cutting & QC': 1,
      Shipped: 2,
      'Out for Delivery': 3,
      Delivered: 4,
    };
    const currentIdx = statusMap[orderStatus] ?? 0;
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={() => setIsOrderTrackingOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
          
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="border-b border-neutral-200 pb-4">
            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              Live Logistics
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 font-display">
              Track Atelier Shipment
            </h2>
          </div>

          {/* Search by Order ID */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order # (e.g. ORD-88204) or Tracking ID"
                value={inputOrderId}
                onChange={(e) => setInputOrderId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-300 text-xs font-mono uppercase focus:outline-none focus:border-black"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
            >
              Track
            </button>
          </form>

          {/* Quick past orders picker */}
          <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto pb-1 text-neutral-600">
            <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Your Orders:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSelectedOrder(o);
                  setInputOrderId(o.id);
                }}
                className={`px-2 py-0.5 border transition-colors ${
                  selectedOrder?.id === o.id
                    ? 'bg-black text-white border-black font-bold'
                    : 'bg-white border-neutral-200 hover:border-black'
                }`}
              >
                #{o.id}
              </button>
            ))}
          </div>

          {selectedOrder ? (
            <div className="space-y-6 pt-2">
              {/* Order status summary badge */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="text-xs font-mono text-neutral-500 uppercase">
                    Shipment Status: <strong className="text-black uppercase">{selectedOrder.status}</strong>
                  </div>
                  <div className="text-xs font-mono text-neutral-800 pt-0.5">
                    Carrier: Delhivery / BlueDart Express Air · {selectedOrder.trackingNumber}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">Estimated Delivery</div>
                  <div className="text-sm font-bold font-mono text-neutral-900">{selectedOrder.estimatedDelivery}</div>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="py-4">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {steps.map((st, idx) => {
                    const status = getStepStatus(selectedOrder.status, idx);
                    return (
                      <div
                        key={st.title}
                        className={`p-3 border text-xs font-mono transition-colors ${
                          status === 'completed'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : status === 'current'
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-white border-neutral-200 text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 pb-1">
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-current" />
                          )}
                          <span className="text-[11px] uppercase tracking-wider">{st.title}</span>
                        </div>
                        <div className="text-[10px] font-light leading-snug opacity-90">{st.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Destination Address & Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200 text-xs font-mono">
                <div className="space-y-1 text-neutral-600">
                  <div className="font-bold text-neutral-900 uppercase">Shipping Destination</div>
                  <div>{selectedOrder.customerName}</div>
                  <div>{selectedOrder.shippingAddress.street}</div>
                  <div>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}
                  </div>
                  <div>{selectedOrder.shippingAddress.country}</div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-neutral-900 uppercase">
                    Ordered Pieces ({selectedOrder.items.length})
                  </div>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-neutral-700 py-1 border-b border-neutral-100">
                      <span className="truncate max-w-[180px]">
                        {it.name} ({it.size})
                      </span>
                      <span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-neutral-900 pt-1">
                    <span>Order Total:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-xs font-mono text-neutral-500 space-y-2">
              <p>No order found matching your query.</p>
              <p>Please double-check your Order Number (e.g. ORD-88204) or enter your email address.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

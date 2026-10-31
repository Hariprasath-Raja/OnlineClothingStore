import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    setActiveView,
    settings,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-[#faf9f6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-neutral-900" />
              <h2 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900">
                Shopping Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3.5 bg-neutral-100/70 border-b border-neutral-200 text-xs font-mono">
            {amountToFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-700 text-[11px]">
                  <span>Add <strong className="text-black">{formatPrice(amountToFreeShipping)}</strong> for Free Express Delivery in India</span>
                  <span>{freeShippingPercent}%</span>
                </div>
                <div className="w-full bg-neutral-300 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-black h-full transition-all duration-500"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold">
                <Truck className="w-3.5 h-3.5" />
                <span>You unlocked Complimentary Express Delivery across India!</span>
              </div>
            )}
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 border border-neutral-200 bg-white hover:border-neutral-300 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover bg-neutral-100 shrink-0 border border-neutral-100"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-neutral-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-rose-600 p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 pt-1">
                        <span>Size: <strong className="text-neutral-800">{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span className="truncate max-w-[100px]">{item.selectedColor}</span>
                      </div>
                    </div>

                    {/* Stepper + Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:text-black cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:text-black cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-mono font-bold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900">
                  Your Bag Is Empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our Tamil typography, anime fusion, and Desi streetwear collections.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('shop');
                  }}
                  className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Module */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-[#faf9f6] space-y-4">
              
              {/* Promo Code Input */}
              <div className="space-y-1">
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. WELCOME15)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="w-full pl-7 pr-3 py-2 bg-white border border-neutral-300 text-xs font-mono uppercase focus:outline-none focus:border-black"
                      />
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 text-white text-xs font-mono uppercase hover:bg-black cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Code <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-500 hover:text-rose-600 text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] font-mono text-rose-700">{couponError}</p>
                )}
              </div>

              {/* Price Calculations in INR (₹) */}
              <div className="space-y-1.5 text-xs font-mono text-neutral-600 border-t border-neutral-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-rose-700">
                    <span>Discount</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{cartShipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(cartShipping)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Final Order Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Place Order On WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500 pt-1">
                <ShieldCheck className="w-3 h-3 text-neutral-700" />
                <span>No Payment Gateway Required · Verified WhatsApp Direct Flow</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

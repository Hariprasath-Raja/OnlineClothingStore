import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Package,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INDIAN_STATES } from '../data/initialData';
import { CustomerAddress, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    formatPrice,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    placeWhatsAppOrder,
    settings,
    setIsOrderTrackingOpen,
    setActiveTrackingId,
    user,
    showToast,
  } = useStore();

  const [step, setStep] = useState<'form' | 'preparing' | 'ready'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string>('');
  const [orderMessageText, setOrderMessageText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Address Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [mobile, setMobile] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [whatsApp, setWhatsApp] = useState('');
  const [houseBuilding, setHouseBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [areaLocality, setAreaLocality] = useState('');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [pinCode, setPinCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleMobileChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 10);
    setMobile(clean);
    if (sameAsMobile) {
      setWhatsApp(clean);
    }
  };

  const handleWhatsAppChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 10);
    setWhatsApp(clean);
  };

  const handlePinCodeChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 6);
    setPinCode(clean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (mobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    const finalWhatsApp = sameAsMobile ? mobile : whatsApp;
    if (finalWhatsApp.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp number.');
      return;
    }
    if (!houseBuilding.trim() || !street.trim() || !areaLocality.trim()) {
      setErrorMsg('Please enter your complete street and area address.');
      return;
    }
    if (pinCode.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    const address: CustomerAddress = {
      fullName: fullName.trim(),
      mobile,
      whatsApp: finalWhatsApp,
      houseBuilding: houseBuilding.trim(),
      street: street.trim(),
      areaLocality: areaLocality.trim(),
      city: city.trim(),
      state,
      pinCode,
      deliveryInstructions: deliveryInstructions.trim(),
    };

    setStep('preparing');

    // Smooth preparation delay to show loader state
    setTimeout(() => {
      const result = placeWhatsAppOrder(address);
      setCreatedOrder(result.order);
      setWhatsAppUrl(result.whatsAppUrl);
      setOrderMessageText(result.messageText);
      setStep('ready');

      // Attempt to open WhatsApp in new window/tab
      try {
        const opened = window.open(result.whatsAppUrl, '_blank');
        if (!opened) {
          showToast('Popup blocked. Please click "Open WhatsApp" below.', 'info');
        }
      } catch (e) {
        // window.open blocked
      }
    }, 900);
  };

  const handleCopyMessage = () => {
    if (navigator.clipboard && orderMessageText) {
      navigator.clipboard.writeText(orderMessageText);
      setCopied(true);
      showToast('Order details copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTrackShipment = () => {
    if (createdOrder) {
      setActiveTrackingId(createdOrder.id);
      setIsCheckoutOpen(false);
      setIsOrderTrackingOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs"
        onClick={() => setIsCheckoutOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-white shadow-2xl border border-neutral-300 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-4 bg-[#faf9f6] border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight font-display uppercase">
                {settings.storeName}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                / WhatsApp Direct Checkout
              </span>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loader State: Preparing WhatsApp Order */}
          {step === 'preparing' && (
            <div className="p-12 text-center space-y-6">
              <div className="w-16 h-16 border-4 border-neutral-300 border-t-emerald-600 rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-bold font-display uppercase tracking-tight text-neutral-900">
                  Preparing WhatsApp Order Packet...
                </h3>
                <p className="text-xs font-mono text-neutral-500 max-w-md mx-auto">
                  Validating cart stock, formatting your delivery address, and routing to official WhatsApp concierge.
                </p>
              </div>
            </div>
          )}

          {/* Order Details Ready (Post-Submission Screen) */}
          {step === 'ready' && createdOrder && (
            <div className="p-6 sm:p-10 space-y-6">
              
              {/* Important requirement: Do not claim order is confirmed yet! */}
              <div className="p-5 bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900">
                      Your order details are ready! Please send the WhatsApp message to complete your order.
                    </h3>
                    <p className="text-xs text-neutral-600 font-mono pt-1">
                      Press <strong>Send</strong> in the WhatsApp chat to submit your order to our team. We do not collect online payments at this stage.
                    </p>
                  </div>
                </div>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Open WhatsApp Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Order Info Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 border border-neutral-200 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 uppercase">Order ID:</span>
                  <div className="text-base font-bold text-neutral-900">{createdOrder.id}</div>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase">Official WhatsApp:</span>
                  <div className="font-bold text-neutral-900">+{settings.whatsAppNumber}</div>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase">Total Amount:</span>
                  <div className="text-base font-bold text-neutral-900">{formatPrice(createdOrder.total)}</div>
                </div>
              </div>

              {/* Formatted Message Preview & Fallback Copy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold uppercase tracking-wider text-neutral-800">
                    Pre-filled WhatsApp Message Packet:
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1.5 text-xs text-neutral-700 hover:text-black font-semibold underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Message Text'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-neutral-900 text-neutral-200 text-xs font-mono whitespace-pre-wrap overflow-x-auto border border-neutral-800 max-h-56 leading-relaxed">
                  {orderMessageText}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200">
                <button
                  onClick={handleTrackShipment}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>View in Order Tracker</span>
                </button>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                >
                  Done · Return to Store
                </button>
              </div>

            </div>
          )}

          {/* Form Step */}
          {step === 'form' && (
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: Delivery Details Form (7 Cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                
                <div className="border-b border-neutral-200 pb-3">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 flex items-center gap-1.5 font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Direct Ordering · Zero Online Payment Required</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 font-display pt-1">
                    Customer Delivery Address
                  </h2>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block uppercase text-neutral-700 font-semibold mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black font-sans text-xs"
                    />
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase text-neutral-700 font-semibold mb-1">
                        Mobile Number *
                      </label>
                      <div className="flex">
                        <span className="px-2.5 py-2 bg-neutral-200 border border-r-0 border-neutral-300 text-neutral-600 font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="98765 43210"
                          value={mobile}
                          onChange={(e) => handleMobileChange(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase text-neutral-700 font-semibold mb-1">
                        WhatsApp Number *
                      </label>
                      <div className="flex">
                        <span className="px-2.5 py-2 bg-neutral-200 border border-r-0 border-neutral-300 text-neutral-600 font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          disabled={sameAsMobile}
                          placeholder="98765 43210"
                          value={sameAsMobile ? mobile : whatsApp}
                          onChange={(e) => handleWhatsAppChange(e.target.value)}
                          className={`w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black ${
                            sameAsMobile ? 'bg-neutral-100 text-neutral-500' : 'bg-neutral-50'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Same as mobile checkbox */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="sameWhatsApp"
                      checked={sameAsMobile}
                      onChange={(e) => {
                        setSameAsMobile(e.target.checked);
                        if (e.target.checked) setWhatsApp(mobile);
                      }}
                      className="accent-black w-3.5 h-3.5 rounded-none cursor-pointer"
                    />
                    <label htmlFor="sameWhatsApp" className="text-[11px] text-neutral-600 cursor-pointer">
                      WhatsApp number is same as Mobile number
                    </label>
                  </div>

                  {/* Address fields */}
                  <div className="space-y-3 pt-2 border-t border-neutral-200">
                    <div className="font-bold uppercase tracking-wider text-neutral-900 text-[11px]">
                      Shipping Destination in India
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase text-neutral-600 text-[11px] mb-1">
                          House No. / Building Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Flat 402, Royal Residency"
                          value={houseBuilding}
                          onChange={(e) => setHouseBuilding(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black font-sans text-xs"
                        />
                      </div>

                      <div>
                        <label className="block uppercase text-neutral-600 text-[11px] mb-1">
                          Street Name / Road *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mount Road"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black font-sans text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block uppercase text-neutral-600 text-[11px] mb-1">
                          Area / Locality *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. T. Nagar"
                          value={areaLocality}
                          onChange={(e) => setAreaLocality(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black font-sans text-xs"
                        />
                      </div>

                      <div>
                        <label className="block uppercase text-neutral-600 text-[11px] mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chennai"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black font-sans text-xs"
                        />
                      </div>

                      <div>
                        <label className="block uppercase text-neutral-600 text-[11px] mb-1">
                          State *
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-2.5 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase text-neutral-600 text-[11px] mb-1">
                        PIN Code (6 Digits) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="600017"
                        value={pinCode}
                        onChange={(e) => handlePinCodeChange(e.target.value)}
                        className="w-full sm:w-44 px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-neutral-600 text-[11px] mb-1">
                        Delivery Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Please call before delivery, leave with security"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black font-sans text-xs"
                      />
                    </div>
                  </div>

                  {/* Primary WhatsApp Action CTA */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-widest uppercase transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Place Order On WhatsApp · {formatPrice(cartTotal)}</span>
                    </button>
                    <p className="text-[10px] text-center text-neutral-500 pt-2">
                      WhatsApp chat will open with your pre-filled order packet. Simply press Send!
                    </p>
                  </div>

                </form>

              </div>

              {/* Right Column: Order Summary (5 Cols) */}
              <div className="lg:col-span-5 bg-neutral-50 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-neutral-200 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 border-b border-neutral-200 pb-3 mb-4">
                    Order Summary ({cart.length} items)
                  </h3>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 text-xs">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-16 object-cover bg-neutral-200 shrink-0 border border-neutral-200"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-neutral-900 line-clamp-1">{item.name}</div>
                          <div className="text-[11px] font-mono text-neutral-500">
                            Size: {item.selectedSize} · Color: {item.selectedColor}
                          </div>
                          <div className="text-[11px] font-mono text-neutral-500">
                            Qty: {item.quantity}
                          </div>
                          <div className="text-xs font-mono font-semibold pt-0.5">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartSubtotal)}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-rose-700">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{formatPrice(cartDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Charges</span>
                    <span>{cartShipping === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(cartShipping)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Order Total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-neutral-200 text-[11px] font-mono text-neutral-600 space-y-1">
                  <div className="font-bold text-neutral-900 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Free Shipping on Orders Over {formatPrice(settings.freeShippingThreshold)}</span>
                  </div>
                  <div>Dispatched via Delhivery or BlueDart Express across India.</div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FAQModal: React.FC = () => {
  const { isFaqOpen, setIsFaqOpen, setIsSizeGuideOpen } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!isFaqOpen) return null;

  const faqs = [
    {
      q: 'How does ordering through WhatsApp work without a payment gateway?',
      a: 'We use a direct-to-concierge WhatsApp ordering system! Add your desired T-shirts to the cart, select your size and color, and enter your delivery address with your 6-digit PIN code. Clicking "PLACE ORDER ON WHATSAPP" generates a neatly formatted order summary with your unique Order ID and opens WhatsApp. Once you press Send, our store team confirms your order and arranges Cash on Delivery or direct UPI on delivery.'
    },
    {
      q: 'How does the store manage products using Google Sheets?',
      a: 'Store owners can link any Google Spreadsheet directly from the Admin Dashboard. Any changes made to product names, prices, discounts, stock availability, or images in Google Sheets sync directly to the store with a single click—no code modifications or server deployments required!'
    },
    {
      q: 'What makes Tiruppur 300+ GSM combed cotton so superior?',
      a: 'Standard fast-fashion tees use thin 140–180 GSM single jersey that clings, shrinks, and wrinkles easily. We use 100% long-staple Indian combed cotton knitted at 300 to 340 GSM in Tiruppur, Tamil Nadu. It provides a structured, sculptural drape that holds its boxy geometry without feeling suffocating in tropical weather.'
    },
    {
      q: 'How does the oversized streetwear fit compare to regular Indian sizing?',
      a: 'Our silhouettes are custom engineered with dropped shoulders, wider chest proportions, and an indestructible 1.25" ribbed collar. If you desire the boxy street drape shown on our lookbook models, order your true size. For a regular standard fit, choose one size smaller.'
    },
    {
      q: 'How long does delivery take across India, and what are shipping charges?',
      a: 'We provide Free Express Delivery across India on all orders above ₹999 (flat ₹99 for orders below ₹999). Shipments are dispatched from our Tamil Nadu hub via Delhivery or BlueDart Express Air and typically arrive in 2–4 business days across metros and tier-1/2 cities.'
    },
    {
      q: 'How do I care for my Tamil typography and puff printed T-shirts?',
      a: 'All our tees are enzymatic pre-shrunk before cutting. To protect the high-density puff and screen-printed graphics, machine wash inside out in cold water, do not bleach, and iron inside out on low heat. Never iron directly over prints.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={() => setIsFaqOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
          
          <button
            onClick={() => setIsFaqOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="border-b border-neutral-200 pb-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              Atelier Support
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 font-display">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-neutral-200 bg-neutral-50/50">
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 transition-colors hover:bg-neutral-100"
                >
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 font-display">
                    {faq.q}
                  </span>
                  {openIdx === idx ? (
                    <ChevronUp className="w-4 h-4 text-neutral-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {openIdx === idx && (
                  <div className="p-4 pt-0 text-xs text-neutral-600 font-light leading-relaxed border-t border-neutral-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-neutral-100 flex items-center justify-between text-xs font-mono">
            <span>Still unsure about your ideal size?</span>
            <button
              onClick={() => {
                setIsFaqOpen(false);
                setIsSizeGuideOpen(true);
              }}
              className="text-black font-bold underline hover:text-neutral-700"
            >
              Open Measurement Matrix
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

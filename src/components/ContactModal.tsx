import React, { useState } from 'react';
import { X, Send, MessageSquare, Mail, MapPin, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppChatUrl } from '../config/brandConfig';

export const ContactModal: React.FC = () => {
  const { isContactOpen, setIsContactOpen, showToast, settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Sizing & Fit');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isContactOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been sent to Atelier Concierge. We respond within 2 hours.', 'success');
  };

  const handleWhatsAppClick = () => {
    showToast('Connecting to Atelier VIP Concierge via WhatsApp...', 'info');
    const url = buildWhatsAppChatUrl(
      'Hello Aether Desi Atelier Concierge, I have an inquiry regarding your T-shirt collection.',
      settings.whatsAppNumber
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={() => setIsContactOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
          
          <button
            onClick={() => setIsContactOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="border-b border-neutral-200 pb-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
              Personalized Assistance
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 font-display">
              Atelier Concierge &amp; Support
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form (7 cols) */}
            <div className="md:col-span-7">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block uppercase text-neutral-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Christian K."
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-600 mb-1">Inquiry Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black uppercase"
                    >
                      <option value="Product Sizing & Fit">Product Sizing &amp; Fit</option>
                      <option value="Order Tracking & Logistics">Order Tracking &amp; Logistics</option>
                      <option value="Returns & Exchanges">Returns &amp; Exchanges</option>
                      <option value="Wholesale / Press Inquiries">Wholesale / Press Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-600 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can our styling or fulfillment team assist you today?"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black font-sans text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white uppercase font-bold tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              ) : (
                <div className="py-8 text-center space-y-3 bg-neutral-50 border border-neutral-200 p-6">
                  <div className="text-sm font-bold uppercase font-display text-neutral-900">
                    Message Dispatched
                  </div>
                  <p className="text-xs text-neutral-600 font-mono">
                    Thank you {name}. A client concierge will review your message and reply to {email} within 4 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono underline text-black pt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              )}
            </div>

            {/* Direct Channels (5 cols) */}
            <div className="md:col-span-5 bg-neutral-50 border border-neutral-200 p-5 space-y-5 text-xs font-mono">
              <div className="space-y-1">
                <div className="font-bold uppercase text-neutral-900">Direct VIP Concierge</div>
                <p className="text-neutral-500 text-[11px] font-light">
                  Need instant sizing guidance or custom delivery accommodation?
                </p>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat via WhatsApp</span>
              </button>

              <div className="space-y-3 pt-2 border-t border-neutral-200 text-[11px] text-neutral-600">
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900">Desk Hours (IST):</span>
                    <div>Mon – Sat: 09:30 – 21:00 IST</div>
                    <div>Sunday: 11:00 – 18:00 IST</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900">Direct Support:</span>
                    <div>support@aetherdesi.in</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900">Design Studio &amp; Mills:</span>
                    <div>Khaderpet Mill Complex, Tiruppur, TN 641601</div>
                    <div className="text-[10px] text-neutral-500">Retail Flagship: T. Nagar, Chennai 600017</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

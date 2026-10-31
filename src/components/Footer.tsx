import React from 'react';
import {
  Instagram,
  Twitter,
  ArrowUp,
  MessageSquare,
  ShieldCheck,
  Truck,
  FileSpreadsheet,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryType } from '../types';
import { formatDisplayWhatsAppNumber, getCleanWhatsAppNumber } from '../config/brandConfig';

export const Footer: React.FC = () => {
  const {
    setActiveView,
    setActiveCategory,
    setIsOrderTrackingOpen,
    setIsSizeGuideOpen,
    setIsFaqOpen,
    setIsContactOpen,
    setIsAdminOpen,
    settings,
  } = useStore();

  const handleCategoryClick = (cat: CategoryType) => {
    setActiveCategory(cat);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (view: 'home' | 'shop' | 'lookbook' | 'about') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppClick = () => {
    const clean = settings.whatsAppNumber.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${clean}&text=Hello%20${encodeURIComponent(settings.storeName)},%20I%20have%20an%20inquiry.`, '_blank');
  };

  return (
    <footer className="bg-black text-white border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-black tracking-[-0.04em] uppercase text-white font-display flex items-baseline gap-2">
              <span>{settings.storeName.split(' ')[0]}</span>
              <span className="text-xs tracking-[0.25em] text-neutral-400 font-light">
                {settings.storeName.split(' ').slice(1).join(' ') || 'DESI ATELIER'}
              </span>
            </span>

            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm">
              An independent streetwear clothing label celebrating modern Tamil typography, Desi pop graphics, and anime crossover aesthetics. Spun from 300+ GSM super-combed Indian cotton in Tiruppur with zero-sag architectural collars.
            </p>

            <div className="text-xs font-mono text-emerald-400 flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official WhatsApp: {formatDisplayWhatsAppNumber(settings.whatsAppNumber)}</span>
            </div>

            {/* Social media links */}
            <div className="flex items-center gap-4 pt-2 text-neutral-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="hover:text-white transition-colors text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs font-mono">
            <h4 className="font-bold uppercase tracking-wider text-white font-display text-sm">
              Explore
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home Index
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Complete Catalog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('lookbook')} className="hover:text-white transition-colors cursor-pointer">
                  Desi Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-white transition-colors cursor-pointer">
                  Tiruppur Craft &amp; 300 GSM
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-neutral-500 hover:text-neutral-400 text-[10px] transition-colors cursor-pointer flex items-center gap-1 pt-1"
                  title="Staff & Management Access Portal"
                >
                  <Lock className="w-2.5 h-2.5" />
                  <span>Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3 text-xs font-mono">
            <h4 className="font-bold uppercase tracking-wider text-white font-display text-sm">
              Collections
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => handleCategoryClick('tamil')} className="hover:text-white transition-colors cursor-pointer">
                  தமிழ் Typography Streetwear
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('desi')} className="hover:text-white transition-colors cursor-pointer">
                  Retro Bollywood &amp; Pop Art
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('anime')} className="hover:text-white transition-colors cursor-pointer">
                  Tokyo x India Anime Fusion
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('culture')} className="hover:text-white transition-colors cursor-pointer">
                  Jallikattu Heritage Tees
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('oversized')} className="hover:text-white transition-colors cursor-pointer">
                  Oversized Heavyweight 320G
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('couple')} className="hover:text-white transition-colors cursor-pointer">
                  Couple &amp; College Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support & Policies */}
          <div className="space-y-3 text-xs font-mono">
            <h4 className="font-bold uppercase tracking-wider text-white font-display text-sm">
              Client Support
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => setIsOrderTrackingOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                  Track Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                  Size &amp; Fit Guide (IN / CM)
                </button>
              </li>
              <li>
                <button onClick={() => setIsFaqOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                  FAQs &amp; Washing Care
                </button>
              </li>
              <li>
                <button onClick={() => setIsContactOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                  Contact Chennai Studio
                </button>
              </li>
              <li>
                <button onClick={() => setIsFaqOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                  7-Day Return &amp; Exchange Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: WhatsApp Trust Badges, Courier info, & scroll to top */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-mono text-neutral-500">
          
          <div>
            © 2026 {settings.storeName}. Handcrafted in Chennai &amp; Tiruppur, India.
          </div>

          {/* Shipping & Payment Method badges */}
          <div className="flex flex-wrap items-center gap-2 text-neutral-300">
            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
              <MessageSquare className="w-3 h-3 fill-emerald-400" />
              <span>WHATSAPP DIRECT ORDER</span>
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-[10px]">
              DELHIVERY EXPRESS
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-[10px]">
              BLUEDART COURIER
            </span>
            <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-[10px]">
              100% INDIAN COTTON
            </span>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors text-neutral-400 cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sliders,
  MessageSquare,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatDisplayWhatsAppNumber, getCleanWhatsAppNumber } from '../config/brandConfig';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setActiveCategory,
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAuthOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    settings,
    user,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: 'home' | 'shop' | 'lookbook' | 'about', category?: any) => {
    setActiveView(view);
    if (category) {
      setActiveCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin Hotkey for Store Owner / Developer: Alt+Shift+A
      if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminOpen]);

  const handleWhatsAppConcierge = () => {
    const cleanNumber = getCleanWhatsAppNumber(settings.whatsAppNumber);
    const url = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=Hello%20${encodeURIComponent(settings.storeName)},%20I%20have%20an%20inquiry%20regarding%20your%20T-shirt%20collection.`;
    window.open(url, '_blank');
  };

  return (
    <div className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner - Dismissible */}
      {showBanner && (
        <div className="bg-black text-white px-4 py-2 text-[11px] tracking-widest uppercase flex items-center justify-between border-b border-zinc-800 font-medium">
          <div className="flex-1 text-center truncate font-mono">
            <span>FREE EXPRESS DELIVERY ACROSS INDIA OVER ₹{settings.freeShippingThreshold}</span>
            <span className="mx-2 text-zinc-500">·</span>
            <span className="text-emerald-400 font-bold">WHATSAPP ORDERING ACTIVE</span>
            <span className="mx-2 text-zinc-500 hidden md:inline">·</span>
            <span className="text-zinc-300 hidden md:inline">USE CODE <strong>WELCOME15</strong> FOR 15% OFF</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-zinc-400 hover:text-white p-0.5 ml-2 transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header - Adhering to 3-Zone Top Bar Contract */}
      <header
        className={`w-full transition-colors duration-200 border-b ${
          isScrolled
            ? 'bg-[#faf9f6]/95 backdrop-blur-md border-neutral-200/80 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)]'
            : 'bg-[#faf9f6] border-neutral-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single element Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="group text-left cursor-pointer focus-visible:outline-none shrink-0"
          >
            <span className="text-xl sm:text-2xl font-black tracking-[-0.04em] uppercase text-black font-display flex items-baseline gap-1.5">
              <span>{settings.storeName.split(' ')[0]}</span>
              <span className="text-xs tracking-[0.25em] text-neutral-500 font-light group-hover:text-black transition-colors">
                {settings.storeName.split(' ').slice(1).join(' ') || 'ATELIER'}
              </span>
            </span>
          </button>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider uppercase text-neutral-700">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-black transition-colors py-1 relative whitespace-nowrap shrink-0 ${
                activeView === 'home' ? 'text-black' : ''
              }`}
            >
              Home
              {activeView === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />
              )}
            </button>
            <button
              onClick={() => handleNavClick('shop', 'all')}
              className={`hover:text-black transition-colors py-1 relative whitespace-nowrap shrink-0 ${
                activeView === 'shop' ? 'text-black' : ''
              }`}
            >
              Collection
              {activeView === 'shop' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />
              )}
            </button>
            <button
              onClick={() => handleNavClick('shop', 'tamil')}
              className="hover:text-black transition-colors py-1 whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>தமிழ் Typography</span>
            </button>
            <button
              onClick={() => handleNavClick('shop', 'desi')}
              className="hover:text-black transition-colors py-1 whitespace-nowrap shrink-0"
            >
              Desi Graphics
            </button>
            <button
              onClick={() => handleNavClick('shop', 'anime')}
              className="hover:text-black transition-colors py-1 whitespace-nowrap shrink-0"
            >
              Anime Fusion
            </button>
            <button
              onClick={() => handleNavClick('lookbook')}
              className={`hover:text-black transition-colors py-1 relative whitespace-nowrap shrink-0 ${
                activeView === 'lookbook' ? 'text-black' : ''
              }`}
            >
              Lookbook
              {activeView === 'lookbook' && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />
              )}
            </button>
          </nav>

          {/* Zone 3: Clean primary action & functional utility affordances */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            
            {/* WhatsApp Direct Help */}
            <button
              onClick={handleWhatsAppConcierge}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              title="Chat with WhatsApp Concierge"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-neutral-700 hover:text-black transition-colors cursor-pointer"
              aria-label="Search Collection"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-neutral-700 hover:text-black transition-colors relative cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-2 text-neutral-700 hover:text-black transition-colors relative cursor-pointer"
              aria-label="User Account"
            >
              <User className="w-4.5 h-4.5" />
              {user && (
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-neutral-900 ring-2 ring-white" />
              )}
            </button>

            {/* Admin Switch — Strictly hidden from public visitors, rendered ONLY when authenticated */}
            {isAdminAuthenticated && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-neutral-900 border border-emerald-800 hover:bg-black transition-colors cursor-pointer"
                title="Open Store & Google Sheets Admin (Authenticated)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin</span>
              </button>
            )}

            {/* Shopping Bag Button (Primary Action) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-black text-white px-3.5 py-2 text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="font-mono tabular-nums text-[11px] px-1.5 py-0.2 bg-white/20 text-white">
                {cartItemCount}
              </span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-800 hover:text-black cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#faf9f6] border-t border-neutral-200 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3 text-sm font-semibold tracking-wider uppercase text-neutral-800">
              <button
                onClick={() => handleNavClick('home')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop', 'all')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                All T-Shirts
              </button>
              <button
                onClick={() => handleNavClick('shop', 'tamil')}
                className="text-left py-2 border-b border-neutral-200/60 flex items-center justify-between text-neutral-900 font-bold"
              >
                <span>தமிழ் Typography Streetwear</span>
                <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5">NEW</span>
              </button>
              <button
                onClick={() => handleNavClick('shop', 'desi')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                Desi Graphic &amp; Retro Bollywood
              </button>
              <button
                onClick={() => handleNavClick('shop', 'anime')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                Tokyo x India Anime Fusion
              </button>
              <button
                onClick={() => handleNavClick('shop', 'culture')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                Indian Culture &amp; Heritage
              </button>
              <button
                onClick={() => handleNavClick('shop', 'oversized')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                Oversized Heavyweight 320G
              </button>
              <button
                onClick={() => handleNavClick('shop', 'couple')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                Couple T-shirts
              </button>
              <button
                onClick={() => handleNavClick('shop', 'college')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                College Fashion T-shirts
              </button>
              <button
                onClick={() => handleNavClick('lookbook')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                Campaign Lookbook
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="text-left py-2 border-b border-neutral-200/60"
              >
                Atelier Craft &amp; Fabric (300 GSM)
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleWhatsAppConcierge}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp ({formatDisplayWhatsAppNumber(settings.whatsAppNumber)})</span>
              </button>
            </div>

            {/* Mobile Admin Link — Only shown when authenticated */}
            {isAdminAuthenticated && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-wider text-emerald-400 bg-black border border-emerald-800"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Console (Active)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

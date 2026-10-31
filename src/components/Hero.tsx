import React from 'react';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setActiveView, setActiveCategory, settings } = useStore();

  const handleShopNow = () => {
    setActiveCategory('all');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreTamil = () => {
    setActiveCategory('tamil');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-[#111111] text-white overflow-hidden">
      {/* Background Campaign Image with measured luxury scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_streetwear_models_1793441451610.jpg"
          alt="AETHER DESI ATELIER Heavyweight Streetwear Models"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-[1.05] transition-transform duration-1000 scale-100 hover:scale-[1.02]"
          referrerPolicy="no-referrer"
        />
        {/* Editorial gradient scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36 flex flex-col justify-end min-h-[82vh] lg:min-h-[88vh]">
        <div className="max-w-3xl space-y-6">
          
          {/* Natural editorial kicker */}
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-zinc-300 font-mono">
            <span className="text-white font-semibold">Desi Streetwear</span>
            <span aria-hidden="true" className="text-zinc-500">·</span>
            <span>Chennai · Tiruppur · Mumbai</span>
            <span aria-hidden="true" className="text-zinc-500">·</span>
            <span>300–320 GSM Heavyweight Bio-Washed</span>
          </div>

          {/* Primary Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-0.04em] leading-[0.95] text-white font-display text-balance">
            Wear Your Vibe. <br />
            <span className="text-neutral-300">Define Your Style.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-300 max-w-xl font-light leading-relaxed">
            Discover premium everyday essentials designed for your individuality. 
            Modern Tamil typography, retro Bollywood pop art, and Japanese anime fusion cut in sculpted boxy drapes. Direct one-tap ordering on WhatsApp.
          </p>

          {/* Two CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={handleShopNow}
              className="group px-8 py-4 bg-white text-black text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-lg hover:gap-4 duration-200 cursor-pointer"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleExploreTamil}
              className="px-8 py-4 bg-transparent border border-white/60 text-white text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-white/10 hover:border-white transition-all backdrop-blur-xs cursor-pointer flex items-center gap-2"
            >
              <span>தமிழ் Streetwear Drop</span>
            </button>
          </div>

          {/* Highlights Row */}
          <div className="pt-8 border-t border-white/15 grid grid-cols-3 gap-6 max-w-lg text-xs font-mono">
            <div>
              <div className="text-white font-bold text-sm">300+ GSM</div>
              <div className="text-zinc-400 text-[11px] uppercase tracking-wider">Tiruppur Cotton</div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">WhatsApp</div>
              <div className="text-zinc-400 text-[11px] uppercase tracking-wider">Direct Order Flow</div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">All-India</div>
              <div className="text-zinc-400 text-[11px] uppercase tracking-wider">Delhivery Express</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

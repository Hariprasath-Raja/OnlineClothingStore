import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Layers,
  Compass,
  Instagram,
  Star,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

export const HomeFeatured: React.FC = () => {
  const { products, reviews, setActiveView, setActiveCategory, showToast, settings } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival || p.category === 'tamil');

  const handleNextSlide = () => {
    setSliderIndex((prev) => (prev + 1) % Math.max(1, newArrivals.length - 2));
  };

  const handlePrevSlide = () => {
    setSliderIndex((prev) => (prev - 1 + Math.max(1, newArrivals.length - 2)) % Math.max(1, newArrivals.length - 2));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the Style Club! Use code WELCOME15 for 15% off.', 'success');
  };

  return (
    <div className="space-y-24 bg-[#faf9f6]">
      
      {/* 1. Trending & Bestselling Products */}
      <section className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-500 mb-2">
              Signature Indian Streetwear
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
              Trending &amp; Bestselling
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-900 hover:text-neutral-600 transition-colors border-b-2 border-black pb-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All T-Shirts</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4-column product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 2. New Arrivals Horizontal Showcase */}
      <section className="bg-neutral-100/70 py-20 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-500 mb-2">
                Fresh Styles, Fresh Energy
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
                New Arrivals
              </h2>
            </div>

            {/* Slider arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="p-2.5 bg-white border border-neutral-300 hover:border-black text-neutral-800 hover:text-black transition-colors cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="p-2.5 bg-white border border-neutral-300 hover:border-black text-neutral-800 hover:text-black transition-colors cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider items container */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.slice(sliderIndex, sliderIndex + 3).map((product) => (
                <ProductCard key={`slider-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Promotional Campaign Banner */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-black text-white min-h-[460px] flex items-center p-8 sm:p-14 lg:p-20">
          <img
            src="/images/campaign_editorial_banner_1793441452269.jpg"
            alt="Upgrade Your Wardrobe"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60 contrast-[1.1]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />

          <div className="relative z-10 max-w-xl space-y-6">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-300">
              Chennai · Tiruppur · Mumbai Drops
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-display text-white text-balance leading-[1.05]">
              Upgrade Your Wardrobe
            </h2>
            <p className="text-base text-neutral-200 font-light leading-relaxed">
              Premium style. Everyday comfort. Cut from high-density 300+ GSM Tiruppur super-combed cotton with our signature architectural drop-shoulder fit. Easy one-tap WhatsApp ordering.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
              >
                Shop The Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us (Craftsmanship & Standards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-500 mb-2">
            The Indian Streetwear Standard
          </div>
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
            Why Choose {settings.storeName}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 font-display">
              300–320 GSM Bio-Washed Cotton
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Knit from long-staple Indian cotton in Tiruppur. Substantial, structured weight that never shows through or clings to the body.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 font-display">
              Zero-Sag Ribbed Collars
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              1.25" double-ply ribbing with elastane memory retention. Engineered to survive humid Indian weather and washing cycles without baconing.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 font-display">
              Seamless WhatsApp Ordering
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Zero payment gateways needed. Review your cart, click to order on WhatsApp, and confirm delivery details directly with our team.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 font-display">
              Breathable Discharge Screenprint
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We extract color directly from cotton fibers rather than slapping thick plastic rubber prints that trap sweat. Zero cracking.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 font-display">
              Express All-India Delivery
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Fast courier dispatch via Delhivery or BlueDart Express. Same-day dispatch from Chennai and Tiruppur with end-to-end live tracking.
            </p>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-3">
            <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center text-black">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 font-display">
              7-Day Size Exchange
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Try your oversized fit at home. Easy self-serve exchange with doorstep reverse pickup across major Indian pin codes.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews Showcase */}
      <section className="bg-neutral-100/60 py-20 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-500 mb-2">
              Verified Client Voices
            </div>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
              What The Community Says
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-neutral-800">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-mono font-bold">4.9 / 5.0</span>
              <span className="text-xs text-neutral-500">based on 2,800+ Indian orders</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-white border border-neutral-200/90 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">{rev.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 font-display">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900">{rev.author}</span>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Instagram & Lifestyle Gallery: "STYLE IT. SHARE IT. REPEAT." */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-500 mb-2">
              Indian Streetwear Movement
            </div>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
              Style It. Share It. Repeat.
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow {settings.instagramHandle}</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative group overflow-hidden bg-neutral-200 aspect-square">
            <img
              src="/images/desi_tamil_streetwear_tee_1793442456883.jpg"
              alt="Chennai Streetwear Tamil Tee"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <span className="text-xs font-mono tracking-wider">#AETHERDESI</span>
            </div>
          </div>

          <div className="relative group overflow-hidden bg-neutral-200 aspect-square">
            <img
              src="/images/desi_retro_graphic_tee_1793442458879.jpg"
              alt="Bombay Talkies Retro Tee"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <span className="text-xs font-mono tracking-wider">#AETHERDESI</span>
            </div>
          </div>

          <div className="relative group overflow-hidden bg-neutral-200 aspect-square">
            <img
              src="/images/desi_anime_fusion_tee_1793442457665.jpg"
              alt="Tokyo India Anime Tee"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <span className="text-xs font-mono tracking-wider">#AETHERDESI</span>
            </div>
          </div>

          <div className="relative group overflow-hidden bg-neutral-200 aspect-square">
            <img
              src="/images/hero_streetwear_models_1793441451610.jpg"
              alt="Community Style"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <span className="text-xs font-mono tracking-wider">#AETHERDESI</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Newsletter Subscription Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-400">
            Exclusive Indian Streetwear Drops
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-display text-white">
            Join The Style Club
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-light max-w-lg mx-auto leading-relaxed">
            Get instant access to limited Tamil typography drops, festival specials, and an immediate 15% discount code for your WhatsApp order.
          </p>

          {!subscribed ? (
            <form onSubmit={handleNewsletterSubmit} className="pt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3.5 bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="pt-4 p-4 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-200 max-w-md mx-auto space-y-1">
              <div className="text-white font-bold">You're in the Club!</div>
              <div>Use promo code <span className="text-white underline font-bold">WELCOME15</span> for 15% off.</div>
            </div>
          )}

          <div className="text-[11px] font-mono text-neutral-500">
            No spam. WhatsApp concierge alerts on demand.
          </div>
        </div>
      </section>

    </div>
  );
};

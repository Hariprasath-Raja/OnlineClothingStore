import React from 'react';
import { ArrowRight, Layers, ShieldCheck, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { setActiveView, setIsFaqOpen, setIsContactOpen } = useStore();

  return (
    <div className="bg-[#faf9f6] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-500">
            The Atelier Manifesto
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-900 font-display">
            The Science of The Perfect T-Shirt
          </h1>
          <p className="text-base text-neutral-600 font-light leading-relaxed">
            Most modern t-shirts are designed to be disposable — thin 160 GSM jersey that warps after three washes and collars that bacon. We set out to engineer the definitive luxury heavyweight essential.
          </p>
        </div>

        {/* Feature Split 1: Why GSM Matters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] bg-neutral-900 overflow-hidden border border-neutral-200">
            <img
              src="/images/lookbook_minimalist_white_tee_1793441452252.jpg"
              alt="Heavyweight cotton drape"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              01. Density &amp; Drape
            </div>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
              Why 300+ GSM Changes Everything
            </h2>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              GSM stands for grams per square meter. Standard fast-fashion tees measure between 140–180 GSM — lightweight, fragile, and prone to clinging. Aether Atelier t-shirts are spun between <strong>280 and 340 GSM</strong>.
            </p>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span>Zero Transparency — Never see-through, even in purest chalk white</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span>Sculptural Structure — Maintains an architectural boxy drape off the shoulders</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                <span>Pre-Shrunk Precision — Washed with natural enzymes before cutting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Split 2: Collar Engineering */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 lg:order-2 relative aspect-[4/3] bg-neutral-900 overflow-hidden border border-neutral-200">
            <img
              src="/images/hero_streetwear_models_1793441451610.jpg"
              alt="Collar and ribbing craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 lg:order-1 space-y-6">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
              02. The Indestructible Collar
            </div>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
              Say Goodbye to Bacon Collars
            </h2>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              The first thing to fail on any t-shirt is the neckline. We engineered our 1.25" and 1.5" bound collars using custom 1x1 rib knit woven with 5% high-recovery Japanese elastane.
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Twin-needle cover-stitched to the neck tape, the collar sits flush against the neck and holds its crisp circular geometry indefinitely.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveView('shop')}
                className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Experience The Collection
              </button>
            </div>
          </div>
        </div>

        {/* Global Craftsmanship Locations */}
        <div className="p-8 sm:p-12 bg-white border border-neutral-200 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-500">
              Heritage Partners
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
              Ethical Mills &amp; Master Artisans
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
            <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="text-sm font-bold text-neutral-900 uppercase">Tiruppur, Tamil Nadu</div>
              <div className="text-neutral-500">Circular Looms &amp; Heavyweight Knit</div>
              <p className="text-neutral-600 font-light pt-1">
                South India's textile heartland. 320 to 340 GSM combed jersey knitted on slow European high-gauge circular knitting machines with zero chemical optical brighteners.
              </p>
            </div>

            <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="text-sm font-bold text-neutral-900 uppercase">Tokyo &amp; Okayama, Japan</div>
              <div className="text-neutral-500">Discharge &amp; Puff Screenprint</div>
              <p className="text-neutral-600 font-light pt-1">
                Master screenprinters applying high-density puff and water-based discharge prints that become one with the cotton fiber rather than peeling or cracking.
              </p>
            </div>

            <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="text-sm font-bold text-neutral-900 uppercase">Coimbatore, India</div>
              <div className="text-neutral-500">Long-Staple Combed Cotton</div>
              <p className="text-neutral-600 font-light pt-1">
                Extra-long staple cotton harvested under fair-trade farmer collectives, spun into dense compact yarns for butter-soft hand-feel with extraordinary longevity.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs & Contact Quick Links */}
        <div className="text-center space-y-4 pt-6">
          <h3 className="text-lg font-bold uppercase tracking-tight text-neutral-900 font-display">
            Need More Information?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsFaqOpen(true)}
              className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-800"
            >
              Read Frequently Asked Questions
            </button>
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-6 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider"
            >
              Contact Atelier Concierge
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

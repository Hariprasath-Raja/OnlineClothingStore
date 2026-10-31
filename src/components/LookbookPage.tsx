import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LookbookPage: React.FC = () => {
  const { products, setSelectedProduct, setActiveView, settings } = useStore();

  const looks = [
    {
      title: '01. சென்னை வீதி கலை — Chennai Streetwear Movement',
      subtitle: 'Tamil Typography 320 GSM Heavyweight Oversized Tee',
      image: '/src/assets/images/desi_tamil_streetwear_tee_1793442456883.jpg',
      productId: 'prod-01',
      description: 'Captured in the concrete brutalist shadows of Chennai underpasses. Modern Tamil typography with architectural drop-shoulder drape and zero-sag ribbing.',
      quote: 'Language as architecture. Our Tamil typography isn’t nostalgia — it’s the future of Indian street fashion.'
    },
    {
      title: '02. बंबई टॉकीज़ — Vintage Bollywood Pop Art',
      subtitle: 'Acid-Washed 280 GSM Mineral Slub Jersey',
      image: '/src/assets/images/desi_retro_graphic_tee_1793442458879.jpg',
      productId: 'prod-02',
      description: 'Shot at iconic Kala Ghoda Irani cafes in South Mumbai. Vintage 70s cinema aesthetic printed with breathable water-based discharge inks.',
      quote: 'A vintage look that feels like a treasured hand-me-down from the golden age of cinema, but cut with modern boxy streetwear lines.'
    },
    {
      title: '03. Tokyo x India — Cyber Anime Fusion',
      subtitle: 'Neon Manga Print on 300 GSM Chalk White',
      image: '/src/assets/images/desi_anime_fusion_tee_1793442457665.jpg',
      productId: 'prod-03',
      description: 'Where Tokyo otaku cyberpunk meets the neon-drenched night streets and auto-rickshaws of Indian metros. High-definition screenprint with zero plastic peel.',
      quote: 'A cross-cultural clash of high-energy neon illustration and luxury heavyweight Tiruppur cotton.'
    },
    {
      title: '04. The Brutalist Heavyweight Archive',
      subtitle: 'Pitch Black 320 GSM Drop-Shoulder Blank',
      image: '/src/assets/images/lookbook_oversized_black_tee_1793441452338.jpg',
      productId: 'prod-07',
      description: 'The foundation of the modern streetwear wardrobe. Structured enough to hold its architectural box drape without ever clinging.',
      quote: 'Weight equals presence. When the fabric has structural integrity, you don’t need loud logos.'
    }
  ];

  const handleShopLook = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId) || products[0];
    if (prod) {
      setSelectedProduct(prod);
    } else {
      setActiveView('shop');
    }
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] font-mono text-neutral-500">
            Indian Streetwear Lookbook
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-900 font-display">
            Desi Street Culture
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
            Shot on location across Chennai underpasses and Mumbai art districts. 
            An unapologetic exploration of regional typography, Indian pop culture, and 300+ GSM heavyweight cotton.
          </p>
        </div>

        {/* Editorial Feature Spread */}
        <div className="space-y-24">
          {looks.map((look, idx) => (
            <div
              key={look.title}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image (7 cols) */}
              <div
                className={`lg:col-span-7 relative overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl group ${
                  idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Editorial Text & CTA (5 cols) */}
              <div
                className={`lg:col-span-5 space-y-6 ${
                  idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
                  {look.subtitle}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
                  {look.title}
                </h2>

                <p className="text-sm text-neutral-600 font-light leading-relaxed">
                  {look.description}
                </p>

                <blockquote className="border-l-2 border-neutral-900 pl-4 text-xs italic font-serif text-neutral-700">
                  "{look.quote}"
                </blockquote>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleShopLook(look.productId)}
                    className="group px-7 py-3.5 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-all flex items-center gap-3 shadow-md cursor-pointer"
                  >
                    <span>View &amp; Order Design</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

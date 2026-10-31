import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryType } from '../types';

interface CategoryItem {
  id: CategoryType;
  title: string;
  tagline: string;
  count: string;
  image: string;
}

export const CategoryGrid: React.FC = () => {
  const { setActiveCategory, setActiveView } = useStore();

  const categories: CategoryItem[] = [
    {
      id: 'tamil',
      title: 'Tamil Typography',
      tagline: 'Modern Tamil street art & architectural lettering ("சென்னை வீதி கலை")',
      count: 'Exclusive Drop',
      image: '/images/desi_tamil_streetwear_tee_1793442456883.jpg'
    },
    {
      id: 'desi',
      title: 'Desi Graphic & Retro Pop',
      tagline: 'Vintage Bollywood cinema pop art, auto-rickshaw meter humor, and chai nostalgia',
      count: 'Trending',
      image: '/images/desi_retro_graphic_tee_1793442458879.jpg'
    },
    {
      id: 'anime',
      title: 'Tokyo x India Anime Fusion',
      tagline: 'Cyber-manga neon graphics fused with Indian street energy and nocturnal cityscapes',
      count: 'New Drop',
      image: '/images/desi_anime_fusion_tee_1793442457665.jpg'
    },
    {
      id: 'culture',
      title: 'Indian Culture & Heritage',
      tagline: 'Jallikattu valor, Dravidian brutalism, and ancient woodcut prints',
      count: 'Heritage Run',
      image: '/images/lookbook_oversized_black_tee_1793441452338.jpg'
    },
    {
      id: 'oversized',
      title: 'Oversized Streetwear 320G',
      tagline: 'Tiruppur super-combed heavyweight cotton with zero-sag architectural ribbed necklines',
      count: 'Bestseller',
      image: '/images/hero_streetwear_models_1793441451610.jpg'
    },
    {
      id: 'minimalist',
      title: 'Minimalist & Raw Essentials',
      tagline: 'Unbleached natural cotton with Madras filter coffee micro-embroidery',
      count: 'Pure Cotton',
      image: '/images/lookbook_minimalist_white_tee_1793441452252.jpg'
    }
  ];

  const handleSelectCategory = (cat: CategoryType) => {
    setActiveCategory(cat);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#faf9f6] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-500 mb-2">
              Indian Streetwear &amp; Desi Collections
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
              Featured Silhouettes
            </h2>
          </div>
          <p className="text-sm text-neutral-600 max-w-md font-light leading-relaxed">
            Spun from 300+ GSM super-combed Indian cotton in Tiruppur, bio-washed to prevent shrinkage, and tailored with sculptural drop-shoulder cuts.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="group relative cursor-pointer overflow-hidden bg-neutral-900 aspect-[4/5] flex flex-col justify-end p-8 transition-all duration-300"
            >
              {/* Image with zoom on hover */}
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Content */}
              <div className="relative z-10 text-white space-y-2">
                <div className="flex items-center justify-between text-xs font-mono tracking-widest text-neutral-300 uppercase">
                  <span>{cat.count}</span>
                  <span className="p-2 bg-white/10 group-hover:bg-white group-hover:text-black transition-colors duration-200">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-tight font-display text-white">
                  {cat.title}
                </h3>

                <p className="text-xs text-neutral-300 line-clamp-2 font-light leading-relaxed">
                  {cat.tagline}
                </p>

                <div className="pt-2 text-[11px] font-semibold tracking-widest uppercase text-white/90 underline underline-offset-4 group-hover:text-white transition-colors">
                  Shop Collection
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

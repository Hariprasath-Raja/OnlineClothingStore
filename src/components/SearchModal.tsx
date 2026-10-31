import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    setSelectedProduct,
    setActiveView,
    setActiveCategory,
    formatPrice,
  } = useStore();

  const [query, setQuery] = useState('');

  const trendingTags = [
    'Oversized 320 GSM',
    'Raw Chalk Blank',
    'Midnight Graphic',
    'Tokyo Shibuya',
    'Supima Terry',
    'Sand Beige'
  ];

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchFabric = p.fabricSpecs.weight.toLowerCase().includes(q);
      return matchName || matchCategory || matchDesc || matchTag || matchFabric;
    });
  }, [query, products]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: any) => {
    setIsSearchOpen(false);
    setSelectedProduct(product);
  };

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
  };

  const handleViewAllResults = () => {
    setIsSearchOpen(false);
    setActiveView('shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative min-h-screen flex items-start justify-center pt-20 px-4 sm:px-6">
        <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-neutral-300 overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Search Input Bar */}
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center gap-3 bg-[#faf9f6]">
            <Search className="w-5 h-5 text-neutral-500 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by silhouette, GSM, graphic, or tag..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-sm sm:text-base font-medium bg-transparent focus:outline-none text-neutral-900 placeholder-neutral-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Trending Tags */}
          <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2 overflow-x-auto text-xs font-mono text-neutral-600">
            <span className="flex items-center gap-1 text-neutral-400 uppercase tracking-wider shrink-0 text-[11px]">
              <TrendingUp className="w-3 h-3" />
              <span>Trending:</span>
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className="px-2 py-0.5 bg-white border border-neutral-200 hover:border-black text-neutral-800 shrink-0 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
            {query.trim() ? (
              searchResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                    Found {searchResults.length} matching silhouettes
                  </div>

                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center gap-4 p-3 border border-neutral-200 hover:border-black cursor-pointer bg-white transition-colors group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-16 object-cover bg-neutral-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-mono text-neutral-500 uppercase">
                          {product.fabricSpecs.weight} · {product.category}
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 truncate group-hover:text-black">
                          {product.name}
                        </h4>
                        <div className="text-xs font-mono font-bold text-neutral-900 pt-0.5">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}

                  <button
                    onClick={handleViewAllResults}
                    className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-800 transition-colors"
                  >
                    View All In Catalog
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <p className="text-sm font-bold text-neutral-800 font-display uppercase">
                    No results for "{query}"
                  </p>
                  <p className="text-xs text-neutral-500">
                    Try searching for "320 GSM", "Oversized", "Graphic", or "White".
                  </p>
                </div>
              )
            ) : (
              <div className="py-8 text-center text-xs text-neutral-500 font-mono space-y-1">
                <div>Type anything to search the Aether Atelier catalog.</div>
                <div>Filter by cut, weight, city collection, or garment treatment.</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

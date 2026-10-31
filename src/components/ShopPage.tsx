import React, { useState, useMemo } from 'react';
import {
  Filter,
  X,
  RotateCcw,
  Search,
  LayoutGrid,
  Grid3X3,
  FileSpreadsheet,
  MessageSquare
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { CategoryType } from '../types';

export const ShopPage: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    formatPrice,
    settings,
    setIsAdminOpen,
  } = useStore();

  // Filter states
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Categories list matching user's spec
  const allCategories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'tamil', label: 'தமிழ் Typography' },
    { id: 'desi', label: 'Desi Graphic & Bollywood' },
    { id: 'anime', label: 'Tokyo x India Anime' },
    { id: 'culture', label: 'Indian Culture' },
    { id: 'oversized', label: 'Oversized Streetwear' },
    { id: 'minimalist', label: 'Minimalist & Raw' },
    { id: 'couple', label: 'Couple T-shirts' },
    { id: 'college', label: 'College Fashion' },
    { id: 'retro', label: 'Retro Vintage' },
    { id: 'festival', label: 'Festival Special' },
    { id: 'custom', label: 'Custom Printed' },
  ];

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const allColors = [
    { name: 'Pitch Black', hex: '#111111' },
    { name: 'Chalk White', hex: '#f7f6f1' },
    { name: 'Washed Charcoal', hex: '#2d2d2d' },
    { name: 'Desert Sand', hex: '#cfc1a5' },
    { name: 'Deep Rust', hex: '#632626' },
    { name: 'Sage Green', hex: '#879482' },
    { name: 'Auto Yellow', hex: '#f4a261' },
  ];

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const toggleColor = (clr: string) => {
    setSelectedColors((prev) =>
      prev.includes(clr) ? prev.filter((c) => c !== clr) : [...prev, clr]
    );
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(1500);
    setInStockOnly(false);
    setSearchFilter('');
    setSortBy('featured');
  };

  // Active filters count
  const activeFiltersCount =
    (activeCategory !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (maxPrice < 1500 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchFilter ? 1 : 0);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category
      if (activeCategory !== 'all') {
        if (prod.category !== activeCategory) return false;
      }

      // Search
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesTags = prod.tags.some((t) => t.toLowerCase().includes(q));
        const matchesDesc = prod.description.toLowerCase().includes(q);
        if (!matchesName && !matchesTags && !matchesDesc) return false;
      }

      // Sizes
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((sz) => prod.sizes.includes(sz as any));
        if (!hasSize) return false;
      }

      // Colors
      if (selectedColors.length > 0) {
        const hasColor = prod.colors.some((c) => selectedColors.includes(c.name));
        if (!hasColor) return false;
      }

      // Price limit
      if (prod.price > maxPrice) {
        return false;
      }

      // In stock only
      if (inStockOnly) {
        const totalStock = Object.values(prod.stock).reduce((a, b) => a + b, 0);
        if (totalStock <= 0 || prod.availability === 'Out of Stock') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [
    products,
    activeCategory,
    searchFilter,
    selectedSizes,
    selectedColors,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="bg-[#faf9f6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-neutral-200 pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] font-mono text-neutral-500 mb-2">
                Authentic Indian Streetwear
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900 font-display">
                All T-Shirts &amp; Collections
              </h1>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-600">
              <span>
                Showing <strong className="text-neutral-900">{displayedProducts.length}</strong> of{' '}
                <strong className="text-neutral-900">{filteredProducts.length}</strong> styles
              </span>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 hover:bg-emerald-100"
                title="Manage products in Google Sheets"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Google Sheet Mode</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 no-scrollbar">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-200 mb-8">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-neutral-300 text-xs font-semibold uppercase tracking-wider text-neutral-900 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* In-page live search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tamil, Anime, GSM..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black w-44 sm:w-60"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Clear filters shortcut */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-mono text-neutral-500 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Grid density toggle */}
            <div className="hidden sm:flex items-center border border-neutral-200 bg-white p-0.5">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 transition-colors cursor-pointer ${
                  gridCols === 3 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-black'
                }`}
                title="3 Columns"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 transition-colors cursor-pointer ${
                  gridCols === 4 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-black'
                }`}
                title="4 Columns"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-neutral-300 text-neutral-900 px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="featured">Featured Drops</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 bg-white p-6 border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-xs font-bold tracking-widest uppercase font-mono text-neutral-900">
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-mono text-neutral-500 hover:text-black underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Size Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Size
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {allSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`py-1.5 text-xs font-mono border transition-colors cursor-pointer ${
                      selectedSizes.includes(sz)
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-3 border-t border-neutral-100 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Colorway
              </h3>
              <div className="space-y-1.5">
                {allColors.map((clr) => (
                  <button
                    key={clr.name}
                    onClick={() => toggleColor(clr.name)}
                    className="w-full flex items-center justify-between text-xs py-1 text-neutral-700 hover:text-black cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                        style={{ backgroundColor: clr.hex }}
                      />
                      <span>{clr.name}</span>
                    </div>
                    {selectedColors.includes(clr.name) && (
                      <span className="text-black font-bold text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 border-t border-neutral-100 pt-5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-800">
                <span>Max Price</span>
                <span className="font-mono">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="499"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>{formatPrice(499)}</span>
                <span>{formatPrice(1500)}</span>
              </div>
            </div>

            {/* Availability */}
            <div className="border-t border-neutral-100 pt-5">
              <label className="flex items-center gap-2 text-xs text-neutral-800 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-black w-3.5 h-3.5 rounded-none cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* WhatsApp Ordering Note */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>WhatsApp Ordering</span>
              </div>
              <div>Add your sizes and place orders directly on WhatsApp!</div>
            </div>

          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {displayedProducts.length > 0 ? (
              <div className="space-y-10">
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                  } gap-6`}
                >
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Button */}
                {displayedProducts.length < filteredProducts.length && (
                  <div className="text-center pt-8">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-8 py-3 bg-white border border-black text-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      Load More Styles ({filteredProducts.length - displayedProducts.length} remaining)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 p-12 text-center space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 font-display uppercase">
                  No Silhouettes Match Your Filter
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Try adjusting your price range, clearing selected sizes, or resetting category filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-sm bg-white h-full flex flex-col p-6 overflow-y-auto z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider font-display">
                Filter Products
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-neutral-600 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {allSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`py-2 text-xs font-mono border cursor-pointer ${
                        selectedSizes.includes(sz)
                          ? 'bg-black text-white border-black font-bold'
                          : 'bg-white border-neutral-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2">
                  Price Limit: {formatPrice(maxPrice)}
                </h3>
                <input
                  type="range"
                  min="499"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-mono text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-3 border border-neutral-300 text-xs font-semibold uppercase cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 bg-black text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

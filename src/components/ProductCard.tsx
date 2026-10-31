import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    setQuickViewProduct,
    setIsQuickViewOpen,
    addToCart,
  } = useStore();

  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentImage = product.images[activeColorIdx] || product.images[0] || '';
  const secondaryImage = product.images[1] || currentImage;

  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const isOutOfStock = totalStock <= 0 || product.availability === 'Out of Stock';

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const colorName = product.colors[activeColorIdx]?.name || 'Standard';
    addToCart(product, selectedSize, colorName, 1);
    setShowQuickAdd(false);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
      className={`group relative flex flex-col cursor-pointer bg-white border border-neutral-200/90 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 ${
        isOutOfStock ? 'opacity-85' : ''
      }`}
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f3f2ee]">
        {/* Primary and secondary hover image */}
        <img
          src={isHovered && secondaryImage !== currentImage ? secondaryImage : currentImage}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 ${
            isOutOfStock ? 'filter grayscale-[25%]' : ''
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Badges: Bestseller / New Arrival / Out of Stock / Discount */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="text-[10px] font-mono tracking-widest uppercase bg-rose-900 text-white px-2 py-0.5 font-bold">
              Sold Out
            </span>
          ) : product.isLimitedEdition ? (
            <span className="text-[10px] font-mono tracking-widest uppercase bg-black text-white px-2 py-0.5 font-semibold">
              Limited Run
            </span>
          ) : product.isNewArrival ? (
            <span className="text-[10px] font-mono tracking-widest uppercase bg-neutral-900 text-neutral-100 px-2 py-0.5 font-semibold">
              New Arrival
            </span>
          ) : product.isBestseller ? (
            <span className="text-[10px] font-mono tracking-widest uppercase bg-neutral-900 text-white px-2 py-0.5 font-semibold">
              Bestseller
            </span>
          ) : null}

          {discountPercent > 0 && !isOutOfStock && (
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-800 text-white px-2 py-0.5 self-start">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Action icons: Wishlist & Quick View */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistClick}
            className={`p-2 transition-all duration-200 ${
              isFavorited
                ? 'bg-black text-rose-500 shadow-md'
                : 'bg-white/90 text-neutral-800 hover:bg-white hover:text-black shadow-sm'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleQuickViewClick}
            className="p-2 bg-white/90 text-neutral-800 hover:bg-white hover:text-black shadow-sm transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Overlay Drawer on Card Bottom */}
        {!isOutOfStock ? (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-xs border-t border-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-20">
            {!showQuickAdd ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickAdd(true);
                }}
                className="w-full py-2 bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600">
                  <span>Select Size:</span>
                  <span className="font-semibold text-black">{selectedSize}</span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {product.sizes.map((sz) => {
                    const stockCount = product.stock[sz] ?? 5;
                    const isSizeOut = stockCount <= 0;
                    return (
                      <button
                        key={sz}
                        disabled={isSizeOut}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-1 text-[10px] font-mono border transition-colors ${
                          isSizeOut
                            ? 'border-neutral-200 text-neutral-300 line-through cursor-not-allowed bg-neutral-50'
                            : selectedSize === sz
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleQuickAdd}
                  className="w-full py-1.5 bg-black text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors"
                >
                  Confirm Add to Bag
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute bottom-0 inset-x-0 py-2 bg-neutral-900/90 text-white text-[11px] font-mono text-center uppercase tracking-wider">
            Sold Out
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-2.5">
        
        {/* Unboxed Metadata: Category & Rating */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span className="uppercase tracking-wider truncate max-w-[150px]">
            {product.subCategory || product.category}
          </span>
          <div className="flex items-center gap-1 text-neutral-800">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-neutral-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black line-clamp-1 transition-colors">
          {product.name}
        </h3>

        {/* Available Sizes List (Badges) */}
        <div className="flex items-center gap-1 pt-0.5">
          <span className="text-[10px] font-mono text-neutral-400 uppercase mr-1">Sizes:</span>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((sz) => (
              <span
                key={sz}
                className="text-[10px] font-mono px-1 py-0.2 bg-neutral-100 text-neutral-700 border border-neutral-200"
              >
                {sz}
              </span>
            ))}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 pt-0.5" onClick={(e) => e.stopPropagation()}>
          {product.colors.map((color, idx) => (
            <button
              key={color.name}
              onClick={() => setActiveColorIdx(idx)}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                activeColorIdx === idx
                  ? 'ring-1 ring-offset-1 ring-black scale-110'
                  : 'border-neutral-300 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select color ${color.name}`}
            />
          ))}
          <span className="text-[10px] font-mono text-neutral-400 ml-1">
            {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
          </span>
        </div>

        {/* Price Row (INR ₹) */}
        <div className="flex items-baseline justify-between pt-1 border-t border-neutral-100 font-mono-numbers">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="text-[11px] font-mono text-emerald-800 font-bold">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Star, Heart, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    isQuickViewOpen,
    setIsQuickViewOpen,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
  } = useStore();

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);
  const currentImage = quickViewProduct.images[selectedColorIdx] || quickViewProduct.images[0] || '';
  const currentColor = quickViewProduct.colors[selectedColorIdx]?.name || 'Standard';

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, currentColor, quantity);
    setIsQuickViewOpen(false);
  };

  const handleViewFullDetails = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(quickViewProduct);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        onClick={() => setIsQuickViewOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white border border-neutral-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          
          <button
            onClick={() => setIsQuickViewOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 text-neutral-800 hover:text-black hover:bg-white shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image */}
            <div className="relative aspect-[3/4] bg-neutral-100">
              <img
                src={currentImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span className="uppercase tracking-wider">{quickViewProduct.fabricSpecs.weight}</span>
                  <div className="flex items-center gap-1 text-neutral-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{quickViewProduct.rating}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-900 font-display">
                  {quickViewProduct.name}
                </h2>

                <div className="text-xl font-bold font-mono text-neutral-900">
                  {formatPrice(quickViewProduct.price)}
                </div>

                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed font-light">
                  {quickViewProduct.description}
                </p>

                {/* Color swatches */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                  <div className="text-[11px] font-mono text-neutral-600">Color: {currentColor}</div>
                  <div className="flex gap-2">
                    {quickViewProduct.colors.map((c, idx) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          selectedColorIdx === idx ? 'ring-2 ring-black scale-110' : 'border-neutral-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size picker */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-mono text-neutral-600">Size: {selectedSize}</div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-1.5 text-xs font-mono border transition-colors ${
                          selectedSize === sz
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-neutral-100">
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
                  >
                    Add To Bag
                  </button>
                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`p-3 border transition-colors ${
                      isFavorited ? 'border-black bg-black text-rose-500' : 'border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleViewFullDetails}
                  className="w-full text-center text-xs font-mono uppercase tracking-wider text-neutral-700 hover:text-black py-1 flex items-center justify-center gap-1"
                >
                  <span>View Full Product Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

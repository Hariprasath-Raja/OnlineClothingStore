import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    products,
    toggleWishlist,
    addToCart,
    formatPrice,
    setSelectedProduct,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (product: any) => {
    addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard', 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-[#faf9f6]">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-neutral-900 fill-black" />
              <h2 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900">
                Saved Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length > 0 ? (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 border border-neutral-200 bg-white hover:border-neutral-300 transition-colors"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-24 object-cover bg-neutral-100 shrink-0 cursor-pointer"
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setSelectedProduct(product);
                    }}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h3
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setSelectedProduct(product);
                          }}
                          className="text-xs font-bold text-neutral-900 line-clamp-1 hover:underline cursor-pointer"
                        >
                          {product.name}
                        </h3>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-neutral-400 hover:text-rose-600 p-0.5"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] font-mono text-neutral-500 pt-0.5">
                        {product.fabricSpecs.weight}
                      </div>

                      <div className="text-xs font-mono font-bold text-neutral-900 pt-1">
                        {formatPrice(product.price)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="w-full py-1.5 bg-black text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-4">
                <Heart className="w-12 h-12 text-neutral-300 mx-auto stroke-1" />
                <h3 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900">
                  Your Wishlist Is Empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Save pieces you love to track sizes and purchase when ready.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-[#faf9f6]">
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => {
                    addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard', 1);
                  });
                  setIsWishlistOpen(false);
                }}
                className="w-full py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
              >
                Move All To Bag
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

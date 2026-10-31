import React, { useState } from 'react';
import {
  Star,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Minus,
  MessageSquare,
  Share2
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { buildWhatsAppChatUrl } from '../config/brandConfig';

interface ProductDetailPageProps {
  product: Product;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
    reviews,
    addReview,
    setIsSizeGuideOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    setActiveView,
    settings,
    showToast,
  } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [pinCode, setPinCode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentImage = product.images[selectedImageIdx] || product.images[0] || '';
  const currentColorName = product.colors[selectedColorIdx]?.name || 'Pitch Black';
  const currentStock = product.stock[selectedSize] ?? 8;
  const isOutOfStock = currentStock <= 0 || product.availability === 'Out of Stock';

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, 4);

  // Reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      showToast('Selected size is currently out of stock.', 'error');
      return;
    }
    addToCart(product, selectedSize, currentColorName, quantity);
  };

  const handleBuyOnWhatsApp = () => {
    if (isOutOfStock) {
      showToast('Selected size is currently out of stock.', 'error');
      return;
    }
    addToCart(product, selectedSize, currentColorName, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinCode.replace(/[^0-9]/g, '');
    if (cleanPin.length !== 6) {
      setDeliveryResult('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    const days = cleanPin.startsWith('6') ? 2 : 3;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    const dateStr = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    setDeliveryResult(`Estimated Delivery to ${cleanPin}: ${dateStr} via Delhivery / Bluedart Air`);
  };

  const handleWhatsAppConsult = () => {
    const message = `Hello Aether Atelier, I have questions about ${product.name} (Size ${selectedSize}).`;
    const url = buildWhatsAppChatUrl(message, settings.whatsAppNumber);
    window.open(url, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment || !reviewTitle) {
      showToast('Please fill out all review fields', 'error');
      return;
    }
    addReview({
      productId: product.id,
      author: reviewName,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verified: true,
      helpfulCount: 0,
    });
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider">
          <button
            onClick={() => setActiveView('shop')}
            className="hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Collection</span>
          </button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Gallery & Thumbnails (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-26 overflow-hidden bg-neutral-200 border transition-all cursor-pointer ${
                    selectedImageIdx === idx
                      ? 'border-black ring-1 ring-black'
                      : 'border-neutral-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Interactive Zoom Image */}
            <div
              className="relative flex-1 aspect-[3/4] bg-neutral-100 overflow-hidden cursor-crosshair border border-neutral-200"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={currentImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? 'scale-175' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                    : undefined
                }
              />

              <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
                {product.isNewArrival && (
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-black text-white px-2.5 py-1 font-semibold">
                    New Arrival
                  </span>
                )}
                {product.isBestseller && (
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-neutral-900 text-white px-2.5 py-1">
                    Bestseller
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-mono tracking-wider uppercase bg-emerald-800 text-white px-2.5 py-1 font-bold">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-mono text-neutral-600 border border-neutral-200 pointer-events-none hidden sm:block">
                Hover to Zoom Fabric
              </div>
            </div>

          </div>

          {/* Right Column: Contiguous Purchase Module (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                <span className="uppercase tracking-widest font-semibold text-neutral-700">
                  {product.fabricSpecs.weight}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-neutral-900">{product.rating}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-display">
                {product.name}
              </h1>

              {/* Price in INR (₹) */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-black font-mono-numbers text-neutral-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm font-mono-numbers text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              <div className="text-[11px] font-mono text-neutral-500">
                Inclusive of all taxes · Free delivery on orders over {formatPrice(settings.freeShippingThreshold)}
              </div>
            </div>

            {/* Color selection */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500 uppercase tracking-wider">Color:</span>
                <span className="font-bold text-neutral-900">{currentColorName}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((clr, idx) => (
                  <button
                    key={clr.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`group relative flex items-center gap-2 p-1 border transition-all cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'border-black ring-1 ring-black'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-neutral-300"
                      style={{ backgroundColor: clr.hex }}
                    />
                    <span className="text-xs font-mono pr-2 hidden sm:inline">{clr.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500 uppercase tracking-wider">Select Size:</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-neutral-900 hover:underline font-semibold cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Indian Size &amp; Fit Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((sz) => {
                  const stock = product.stock[sz] ?? 5;
                  const isOut = stock <= 0;
                  return (
                    <button
                      key={sz}
                      disabled={isOut}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 text-xs font-mono border transition-all cursor-pointer ${
                        isOut
                          ? 'border-neutral-200 text-neutral-300 line-through cursor-not-allowed bg-neutral-50'
                          : selectedSize === sz
                          ? 'bg-black text-white border-black font-bold shadow-xs'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Stock indicator */}
              {currentStock > 0 && currentStock <= 5 && (
                <div className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-1 border border-amber-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  <span>Fast selling: Only {currentStock} tees left in Size {selectedSize}!</span>
                </div>
              )}
            </div>

            {/* Quantity Selector + WhatsApp Direct CTA */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-300 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock || 10, q + 1))}
                    className="p-3 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3.5 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isOutOfStock ? 'Sold Out' : 'Add To Bag'}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'border-black bg-black text-rose-500'
                      : 'border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Direct WhatsApp Ordering Button */}
              <button
                onClick={handleBuyOnWhatsApp}
                disabled={isOutOfStock}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Buy Now on WhatsApp · {formatPrice(product.price * quantity)}</span>
              </button>
            </div>

            {/* Indian PIN Code Delivery Checker */}
            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <div className="text-xs font-mono uppercase text-neutral-600 flex items-center gap-1.5 font-semibold">
                <Truck className="w-3.5 h-3.5 text-neutral-800" />
                <span>Check Delivery Availability in India</span>
              </div>
              <form onSubmit={handleCheckDelivery} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN code (e.g. 600017)"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.slice(0, 6))}
                  className="flex-1 px-3 py-2 border border-neutral-300 text-xs font-mono focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-100 border border-neutral-300 text-xs font-mono uppercase font-bold hover:bg-neutral-200 cursor-pointer"
                >
                  Check
                </button>
              </form>
              {deliveryResult && (
                <div className="text-xs font-mono text-emerald-800 bg-emerald-50 p-2.5 border border-emerald-200">
                  {deliveryResult}
                </div>
              )}
            </div>

            {/* Direct WhatsApp Concierge consultation */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-600">Need personal sizing advice?</span>
              <button
                onClick={handleWhatsAppConsult}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3 h-3 fill-emerald-700" />
                <span>Ask via WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

        {/* Tabbed Specifications */}
        <div className="bg-white border border-neutral-200 p-8 space-y-8">
          <div className="border-b border-neutral-200 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-900 font-display">
              Technical Specifications &amp; Indian Craftsmanship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-sm">
                Material &amp; Weave
              </h3>
              <p className="text-neutral-600 font-light leading-relaxed">
                {product.description}
              </p>
              <div className="space-y-2 border-t border-neutral-100 pt-3 font-mono">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Fabric Density:</span>
                  <span className="font-bold text-neutral-900">{product.fabricSpecs.weight}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Composition:</span>
                  <span className="font-bold text-neutral-900">{product.fabricSpecs.composition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Knit Structure:</span>
                  <span className="font-bold text-neutral-900">{product.fabricSpecs.weave}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Origin:</span>
                  <span className="font-bold text-neutral-900">{product.fabricSpecs.origin}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-sm">
                Fit Advice &amp; Garment Care
              </h3>
              <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="font-bold uppercase tracking-wider text-neutral-800 font-mono text-[11px]">
                  Drop-Shoulder Fit Note:
                </div>
                <p className="text-neutral-700 font-light">
                  {product.fitAdvice}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="font-bold uppercase tracking-wider text-neutral-800 font-mono text-[11px]">
                  Washing Instructions:
                </div>
                <p className="text-neutral-600 font-light">
                  {product.fabricSpecs.care}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white border border-neutral-200 p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-neutral-900 font-display">
                Client Reviews ({productReviews.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-neutral-900">
                  {product.rating} out of 5.0
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer self-start sm:self-auto"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Interactive Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="p-6 bg-neutral-50 border border-neutral-200 space-y-4 animate-in slide-in-from-top-2">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900">
                Share Your Product Review
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Vignesh K."
                    className="w-full px-3 py-2 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-black font-mono"
                  >
                    <option value={5}>5 Stars — Exceptional Heavyweight Fabric</option>
                    <option value={4}>4 Stars — Great Fit &amp; Print</option>
                    <option value={3}>3 Stars — Average</option>
                    <option value={2}>2 Stars — Below Expectations</option>
                    <option value={1}>1 Star — Disappointed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Best Tamil streetwear tee I have owned"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">Review</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details regarding fit, fabric weight, washing durability, etc."
                  className="w-full px-3 py-2 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-black font-sans"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
              >
                Submit Verified Review
              </button>
            </form>
          )}

          {/* Reviews list */}
          <div className="space-y-4">
            {productReviews.length > 0 ? (
              productReviews.map((rev) => (
                <div key={rev.id} className="p-4 border border-neutral-100 bg-neutral-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-neutral-900">{rev.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">{rev.date}</span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {rev.comment}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-neutral-500">
                    <span className="font-semibold text-neutral-900">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-neutral-500 font-mono">
                No reviews yet for this design. Be the first to leave a review!
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-3">
              <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 font-display">
                Complete The Streetwear Vibe
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

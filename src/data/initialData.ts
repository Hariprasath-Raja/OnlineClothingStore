import { Product, Coupon, Order, Review, StoreSettings } from '../types';
import {
  BRAND_CONFIG,
  WHATSAPP_CONFIG,
  SHIPPING_CONFIG,
  getCleanWhatsAppNumber
} from '../config/brandConfig';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: BRAND_CONFIG.storeName,
  tagline: BRAND_CONFIG.tagline,
  whatsAppNumber: getCleanWhatsAppNumber(WHATSAPP_CONFIG.phoneNumber), // Initialized from centralized brandConfig.ts
  googleSheetUrl: '',
  googleSheetId: '',
  autoSyncOnLoad: false,
  freeShippingThreshold: SHIPPING_CONFIG.freeShippingThreshold, // ₹999
  standardShippingFee: SHIPPING_CONFIG.standardShippingFee, // ₹60
  supportEmail: BRAND_CONFIG.supportEmail,
  supportPhone: BRAND_CONFIG.supportPhone,
  returnPolicyDays: SHIPPING_CONFIG.returnPolicyDays,
  instagramHandle: BRAND_CONFIG.socialLinks.instagram,
  locationCity: `${BRAND_CONFIG.location.city}, ${BRAND_CONFIG.location.state}`
};

export const INDIAN_STATES = [
  'Tamil Nadu',
  'Maharashtra',
  'Karnataka',
  'Delhi NCR',
  'Kerala',
  'Andhra Pradesh',
  'Telangana',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Goa',
  'Odisha',
  'Assam',
  'Bihar',
  'Jharkhand',
  'Uttarakhand'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Chennai Veedhi Kalai Tamil Typography Oversized Tee',
    slug: 'chennai-veedhi-kalai-tamil-typography-oversized-tee',
    category: 'tamil',
    subCategory: 'Tamil Typography',
    gender: 'unisex',
    price: 764,
    originalPrice: 899,
    rating: 4.9,
    reviewCount: 184,
    colors: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Charcoal Wash', hex: '#2d2d2d' },
      { name: 'Chalk White', hex: '#f6f5f0' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/src/assets/images/desi_tamil_streetwear_tee_1793442456883.jpg',
      '/src/assets/images/lookbook_oversized_black_tee_1793441452338.jpg',
      '/src/assets/images/campaign_editorial_banner_1793441452269.jpg'
    ],
    description: 'Featuring high-density Tamil typography "சென்னை வீதி கலை" (Chennai Street Art) with structured drop-shoulder drape. Spun from 320 GSM super-combed cotton in Tiruppur with zero-sag ribbed neckline.',
    fabricSpecs: {
      weight: '320 GSM Ultra Heavyweight Bio-Washed',
      composition: '100% Super-Combed Indian Organic Cotton',
      weave: 'Compact Single Jersey Knit',
      care: 'Machine wash cold inside out, dry in shade, iron on reverse',
      origin: 'Knitted & Screenprinted in Tiruppur & Chennai'
    },
    fitAdvice: 'Boxy streetwear drape. Buy your regular size for an authentic oversized drop-shoulder fit.',
    isBestseller: true,
    isNewArrival: true,
    productType: 'Tamil Typography T-shirt',
    availability: 'In Stock',
    stock: { S: 18, M: 24, L: 20, XL: 12, XXL: 6 },
    tags: ['Tamil Typography', 'Chennai Streetwear', 'Oversized', '320 GSM']
  },
  {
    id: 'prod-02',
    name: 'Bombay Talkies Retro Bollywood Graphic Tee',
    slug: 'bombay-talkies-retro-bollywood-graphic-tee',
    category: 'desi',
    subCategory: 'Retro Vintage',
    gender: 'unisex',
    price: 719,
    originalPrice: 799,
    rating: 4.8,
    reviewCount: 142,
    colors: [
      { name: 'Washed Charcoal', hex: '#2e2e2e' },
      { name: 'Acid Washed Black', hex: '#1c1b1a' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/src/assets/images/desi_retro_graphic_tee_1793442458879.jpg',
      '/src/assets/images/lookbook_vintage_graphic_tee_1793441451704.jpg'
    ],
    description: 'Archival 70s Bollywood cinema poster pop art ("बंबई टॉकीज़") with vintage halftone distressed discharge printing. Super soft hand-feel that breathes easily in Indian summers.',
    fabricSpecs: {
      weight: '280 GSM Mineral Washed Cotton',
      composition: '100% Ring-Spun Cotton',
      weave: 'Enzyme Washed Slub Jersey',
      care: 'Cold wash with darks, do not bleach',
      origin: 'Garment Washed in Mumbai'
    },
    fitAdvice: 'Relaxed vintage fit with slightly extended sleeves.',
    isBestseller: true,
    isNewArrival: false,
    productType: 'Desi Graphic T-shirt',
    availability: 'In Stock',
    stock: { XS: 8, S: 16, M: 22, L: 14, XL: 9 },
    tags: ['Bollywood', 'Retro Vintage', 'Desi Graphic', 'Enzyme Wash']
  },
  {
    id: 'prod-03',
    name: 'Tokyo x India Anime Fusion Streetwear Tee',
    slug: 'tokyo-india-anime-fusion-streetwear-tee',
    category: 'anime',
    subCategory: 'Anime Fusion',
    gender: 'unisex',
    price: 679,
    originalPrice: 849,
    rating: 4.9,
    reviewCount: 110,
    colors: [
      { name: 'Chalk White', hex: '#f7f6f1' },
      { name: 'Onyx Black', hex: '#111111' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/src/assets/images/desi_anime_fusion_tee_1793442457665.jpg',
      '/src/assets/images/campaign_editorial_banner_1793441452269.jpg'
    ],
    description: 'Electric neon cyber-manga graphics fused with Indian auto-rickshaw night aesthetics. High-definition screenprint with zero rubbery peel.',
    fabricSpecs: {
      weight: '300 GSM Heavyweight Bio-Washed',
      composition: '100% Combed Indian Cotton',
      weave: 'High-Density Jersey',
      care: 'Machine wash delicate, do not iron on print',
      origin: 'Crafted in Bengaluru'
    },
    fitAdvice: 'True oversized Japanese-street cut.',
    isBestseller: true,
    isNewArrival: true,
    productType: 'Anime T-shirt',
    availability: 'In Stock',
    stock: { S: 15, M: 25, L: 18, XL: 10, XXL: 5 },
    tags: ['Anime', 'Cyberpunk', 'Neon Graphic', 'Oversized']
  },
  {
    id: 'prod-04',
    name: 'Jallikattu Singam Heritage Graphic Tee',
    slug: 'jallikattu-singam-heritage-graphic-tee',
    category: 'culture',
    subCategory: 'Heritage Series',
    gender: 'unisex',
    price: 749,
    rating: 4.9,
    reviewCount: 95,
    colors: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Deep Rust', hex: '#632626' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/src/assets/images/lookbook_oversized_black_tee_1793441452338.jpg',
      '/src/assets/images/desi_tamil_streetwear_tee_1793442456883.jpg'
    ],
    description: 'Honoring ancient Tamil valor and Madurai bull-embracing bravery. Illustrated with brutalist woodcut engraving aesthetic and pure discharge ink.',
    fabricSpecs: {
      weight: '300 GSM Heavyweight Cotton',
      composition: '100% GOTS Certified Organic Cotton',
      weave: 'Carded Single Jersey',
      care: 'Cold water wash, hang dry in shade',
      origin: 'Hand Printed in Madurai'
    },
    fitAdvice: 'Sculpted oversized drop-shoulder cut.',
    isBestseller: false,
    isNewArrival: true,
    productType: 'Indian Culture T-shirt',
    availability: 'In Stock',
    stock: { S: 12, M: 19, L: 15, XL: 6 },
    tags: ['Indian Culture', 'Tamil Heritage', 'Madurai', 'Woodcut']
  },
  {
    id: 'prod-05',
    name: 'Filter Kaapi Minimalist Raw Cotton Boxy Tee',
    slug: 'filter-kaapi-minimalist-raw-cotton-boxy-tee',
    category: 'minimalist',
    subCategory: 'Raw Essentials',
    gender: 'unisex',
    price: 649,
    rating: 4.8,
    reviewCount: 78,
    colors: [
      { name: 'Raw Chalk', hex: '#f7f6f1' },
      { name: 'Brass Ochre', hex: '#d4a373' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/src/assets/images/lookbook_minimalist_white_tee_1793441452252.jpg',
      '/src/assets/images/hero_streetwear_models_1793441451610.jpg'
    ],
    description: 'An ode to Madras filter coffee culture. Unbleached raw cotton fibers with natural texture and subtle high-density tonal coffee dabarah micro-embroidery on the chest pocket.',
    fabricSpecs: {
      weight: '290 GSM Raw Combed Cotton',
      composition: '100% Unbleached Cotton',
      weave: 'Natural Slub Compact Knit',
      care: 'Cold gentle wash, flat dry',
      origin: 'Knitted in Coimbatore'
    },
    fitAdvice: 'Relaxed modern box cut with clean lines.',
    isBestseller: true,
    isNewArrival: false,
    productType: 'Minimalist T-shirt',
    availability: 'In Stock',
    stock: { XS: 9, S: 15, M: 20, L: 16, XL: 7 },
    tags: ['Minimalist', 'Filter Coffee', 'Raw Cotton', 'Embroidered']
  },
  {
    id: 'prod-06',
    name: 'Auto Raja "Meter Podu" Street Graphic Tee',
    slug: 'auto-raja-meter-podu-street-graphic-tee',
    category: 'desi',
    subCategory: 'Desi Pop Culture',
    gender: 'unisex',
    price: 699,
    originalPrice: 799,
    rating: 4.7,
    reviewCount: 86,
    colors: [
      { name: 'Asphalt Black', hex: '#161616' },
      { name: 'Auto Yellow', hex: '#f4a261' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/src/assets/images/desi_tamil_streetwear_tee_1793442456883.jpg',
      '/src/assets/images/campaign_editorial_banner_1793441452269.jpg'
    ],
    description: 'Iconic South Indian auto-rickshaw typography and retro meter dial illustration with humorous Tamil catchphrases. Thick rib-knit collar that never warps.',
    fabricSpecs: {
      weight: '290 GSM Heavyweight Jersey',
      composition: '100% Ring-Spun Combed Cotton',
      weave: 'Single Weft Dense Knit',
      care: 'Machine wash 30C inside out',
      origin: 'Tiruppur, Tamil Nadu'
    },
    fitAdvice: 'Easy streetwear box drape.',
    isBestseller: false,
    isNewArrival: true,
    productType: 'Desi Graphic T-shirt',
    availability: 'In Stock',
    stock: { S: 14, M: 22, L: 19, XL: 11, XXL: 4 },
    tags: ['Auto Raja', 'Humorous', 'Meter Podu', 'Desi Street']
  },
  {
    id: 'prod-07',
    name: 'Brutalism 320 GSM Heavyweight Oversized Tee',
    slug: 'brutalism-heavyweight-oversized-tee',
    category: 'oversized',
    subCategory: 'Heavyweight Boxy',
    gender: 'unisex',
    price: 799,
    originalPrice: 949,
    rating: 4.9,
    reviewCount: 215,
    colors: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Stone Grey', hex: '#77797b' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/src/assets/images/lookbook_oversized_black_tee_1793441452338.jpg',
      '/src/assets/images/hero_streetwear_models_1793441451610.jpg'
    ],
    description: 'Architectural streetwear essential in thick 320 GSM combed cotton with statement brutalist typographic back print. Retains silhouette all day.',
    fabricSpecs: {
      weight: '320 GSM Masterweight Cotton',
      composition: '100% Organic Combed Cotton',
      weave: 'Compact Double Ply Weave',
      care: 'Gentle wash inside out, line dry in shade',
      origin: 'Tiruppur, India'
    },
    fitAdvice: 'True oversized boxy drape.',
    isBestseller: true,
    isNewArrival: false,
    productType: 'Oversized Streetwear T-shirt',
    availability: 'In Stock',
    stock: { XS: 10, S: 18, M: 26, L: 20, XL: 12, XXL: 6 },
    tags: ['Oversized', 'Brutalist', '320 GSM', 'Bestseller']
  },
  {
    id: 'prod-08',
    name: 'Kala Ghoda Art District Retro Pop Tee',
    slug: 'kala-ghoda-art-district-retro-pop-tee',
    category: 'retro',
    subCategory: 'Heritage Art',
    gender: 'unisex',
    price: 729,
    originalPrice: 849,
    rating: 4.8,
    reviewCount: 64,
    colors: [
      { name: 'Bone Cream', hex: '#eee8dc' },
      { name: 'Vintage Noir', hex: '#161616' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/src/assets/images/desi_retro_graphic_tee_1793442458879.jpg',
      '/src/assets/images/lookbook_minimalist_white_tee_1793441452252.jpg'
    ],
    description: 'Inspired by South Mumbai Kala Ghoda heritage architecture and classic bohemian art galleries. Screenprinted with non-toxic water inks.',
    fabricSpecs: {
      weight: '280 GSM Ring-Spun Cotton',
      composition: '100% Cotton',
      weave: 'Soft Carded Single Jersey',
      care: 'Cold wash, wash with like colors',
      origin: 'Mumbai, India'
    },
    fitAdvice: 'Relaxed contemporary drape.',
    isBestseller: false,
    isNewArrival: true,
    productType: 'Retro Vintage T-shirt',
    availability: 'In Stock',
    stock: { S: 12, M: 18, L: 14, XL: 7 },
    tags: ['Kala Ghoda', 'Retro Vintage', 'Art District']
  },
  {
    id: 'prod-09',
    name: 'Rendhu Peices Couple Tee Set',
    slug: 'rendhu-peices-couple-tee-set',
    category: 'couple',
    subCategory: 'Couple Capsule',
    gender: 'unisex',
    price: 1399,
    originalPrice: 1699,
    rating: 5.0,
    reviewCount: 52,
    colors: [
      { name: 'Monochrome Set', hex: '#111111' },
      { name: 'Pastel Set', hex: '#e3dfd5' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/src/assets/images/hero_streetwear_models_1793441451610.jpg',
      '/src/assets/images/lookbook_minimalist_white_tee_1793441452252.jpg'
    ],
    description: 'Twin set of two heavyweight boxy tees featuring complementary minimalist geometric chest motifs. The ultimate gift for modern couples.',
    fabricSpecs: {
      weight: '300 GSM Combed Jersey',
      composition: '100% Cotton',
      weave: 'Tubular Body Construction',
      care: 'Cold water wash, hang dry',
      origin: 'Crafted in Chennai'
    },
    fitAdvice: 'Includes two tees in your chosen sizes.',
    isBestseller: false,
    isNewArrival: true,
    productType: 'Couple T-shirt',
    availability: 'In Stock',
    stock: { S: 8, M: 12, L: 10, XL: 5 },
    tags: ['Couple T-shirts', 'Twin Set', 'Gift Box']
  },
  {
    id: 'prod-10',
    name: 'College Adda Relaxed Drop-Shoulder Tee',
    slug: 'college-adda-relaxed-drop-shoulder-tee',
    category: 'college',
    subCategory: 'Everyday Casual',
    gender: 'unisex',
    price: 599,
    originalPrice: 699,
    rating: 4.8,
    reviewCount: 138,
    colors: [
      { name: 'Sage Green', hex: '#879482' },
      { name: 'Desert Sand', hex: '#cfc1a5' },
      { name: 'Charcoal Wash', hex: '#2d2d2d' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/src/assets/images/campaign_editorial_banner_1793441452269.jpg',
      '/src/assets/images/lookbook_minimalist_white_tee_1793441452252.jpg'
    ],
    description: 'The go-to campus heavyweight essential. Made for everyday wear with zero sag, pre-shrunk cotton, and modern relaxed proportions.',
    fabricSpecs: {
      weight: '270 GSM Combed Jersey',
      composition: '100% Cotton',
      weave: 'Bio-Washed Single Jersey',
      care: 'Daily machine wash safe',
      origin: 'Tiruppur, India'
    },
    fitAdvice: 'Relaxed daily college fit.',
    isBestseller: true,
    isNewArrival: false,
    productType: 'College Fashion T-shirt',
    availability: 'In Stock',
    stock: { XS: 14, S: 24, M: 32, L: 28, XL: 16, XXL: 8 },
    tags: ['College Fashion', 'Budget Luxury', 'Everyday Wear']
  },
  {
    id: 'prod-11',
    name: 'Diwali & Pongal Gold Thread Festival Edition Tee',
    slug: 'diwali-pongal-gold-thread-festival-edition-tee',
    category: 'festival',
    subCategory: 'Festival Special',
    gender: 'unisex',
    price: 899,
    originalPrice: 1099,
    rating: 5.0,
    reviewCount: 46,
    colors: [
      { name: 'Royal Onyx & Gold', hex: '#0f0f0f' },
      { name: 'Maroon & Gold', hex: '#5c1010' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/src/assets/images/lookbook_oversized_black_tee_1793441452338.jpg',
      '/src/assets/images/desi_tamil_streetwear_tee_1793442456883.jpg'
    ],
    description: 'Festival special limited drop. Metallic Japanese gold foil print with traditional Kolam and geometric firework motifs on 320 GSM deep black jersey.',
    fabricSpecs: {
      weight: '320 GSM Heavyweight Terry Back',
      composition: '100% Long Staple Cotton',
      weave: 'French Terry Weave',
      care: 'Hand wash cold delicate, do not iron gold motif',
      origin: 'Limited Run, Chennai'
    },
    fitAdvice: 'Statement festive drop-shoulder drape.',
    isLimitedEdition: true,
    isNewArrival: true,
    productType: 'Festival Special T-shirt',
    availability: 'In Stock',
    stock: { S: 5, M: 8, L: 6, XL: 3 },
    tags: ['Festival Special', 'Gold Foil', 'Kolam', 'Limited Run']
  },
  {
    id: 'prod-12',
    name: 'Custom Printed Atelier Batch Monogram Tee',
    slug: 'custom-printed-atelier-batch-monogram-tee',
    category: 'custom',
    subCategory: 'Bespoke Print',
    gender: 'unisex',
    price: 799,
    rating: 4.9,
    reviewCount: 62,
    colors: [
      { name: 'Chalk White', hex: '#f7f6f1' },
      { name: 'Pitch Black', hex: '#111111' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/src/assets/images/lookbook_minimalist_white_tee_1793441452252.jpg',
      '/src/assets/images/desi_tamil_streetwear_tee_1793442456883.jpg'
    ],
    description: 'Order with custom Tamil or English lettering, college club crest, or customized personal logo directly through WhatsApp consultation.',
    fabricSpecs: {
      weight: '300 GSM Heavyweight Cotton',
      composition: '100% Cotton',
      weave: 'Ring-Spun Compact Weave',
      care: 'Machine wash 30C',
      origin: 'Chennai, India'
    },
    fitAdvice: 'Standard oversized box cut.',
    isBestseller: false,
    isNewArrival: true,
    productType: 'Custom Printed T-shirt',
    availability: 'In Stock',
    stock: { XS: 12, S: 18, M: 24, L: 20, XL: 10, XXL: 5 },
    tags: ['Custom Printed', 'Bespoke', 'WhatsApp Order']
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME15',
    discountPercent: 15,
    minSpend: 599,
    description: '15% off first order for Style Club members (Min. ₹599)',
    isActive: true
  },
  {
    code: 'DESI10',
    discountPercent: 10,
    description: '10% off any order site-wide',
    isActive: true
  },
  {
    code: 'CHENNAI20',
    discountPercent: 20,
    minSpend: 1499,
    description: '20% off orders over ₹1,499',
    isActive: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    author: 'Vigneshwaran K.',
    rating: 5,
    date: 'October 28, 2026',
    title: 'The Tamil typography print is next level!',
    comment: 'Finally a brand making modern Tamil typography without looking like cheap election merchandise. The 320 GSM cotton feels heavy and luxurious, identical to international streetwear brands.',
    verified: true,
    helpfulCount: 42
  },
  {
    id: 'rev-02',
    productId: 'prod-02',
    author: 'Pooja Iyer',
    rating: 5,
    date: 'October 24, 2026',
    title: 'Vintage Bollywood print is perfection',
    comment: 'The acid wash on the Bombay Talkies tee is so soft! Got size M for an oversized drape. Best part was ordering directly on WhatsApp and receiving order confirmation in 2 minutes.',
    verified: true,
    helpfulCount: 31
  },
  {
    id: 'rev-03',
    productId: 'prod-03',
    author: 'Arjun Nambiar',
    rating: 5,
    date: 'October 20, 2026',
    title: 'Anime fusion tee quality blew me away',
    comment: 'The collar did not stretch after three washes, which always happens with other Indian online brands. Tiruppur cotton at its absolute finest.',
    verified: true,
    helpfulCount: 28
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD88204',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerWhatsApp: '+91 98765 43210',
    shippingAddress: {
      street: 'Flat 402, Royal Residency, Mount Road',
      area: 'T. Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600017',
      country: 'India',
      deliveryInstructions: 'Please call before delivery'
    },
    items: [
      {
        productId: 'prod-01',
        name: 'Chennai Veedhi Kalai Tamil Typography Oversized Tee',
        price: 764,
        quantity: 1,
        size: 'L',
        color: 'Pitch Black',
        image: '/src/assets/images/desi_tamil_streetwear_tee_1793442456883.jpg'
      },
      {
        productId: 'prod-02',
        name: 'Bombay Talkies Retro Bollywood Graphic Tee',
        price: 719,
        quantity: 1,
        size: 'M',
        color: 'Washed Charcoal',
        image: '/src/assets/images/desi_retro_graphic_tee_1793442458879.jpg'
      }
    ],
    subtotal: 1483,
    discount: 148,
    shipping: 0,
    tax: 0,
    total: 1335,
    status: 'Dispatched via Delhivery / Bluedart',
    paymentMethod: 'WhatsApp Direct Order',
    createdAt: '2026-10-29T14:30:00Z',
    trackingNumber: 'DEL-983427189-IN',
    estimatedDelivery: 'November 2, 2026'
  }
];

export type CategoryType = 
  | 'all'
  | 'tamil'
  | 'oversized'
  | 'anime'
  | 'culture'
  | 'desi'
  | 'minimalist'
  | 'couple'
  | 'college'
  | 'retro'
  | 'festival'
  | 'custom'
  | 'men'
  | 'women'
  | 'limited';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  avatar?: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  subCategory?: string;
  gender: 'unisex' | 'men' | 'women';
  price: number; // in INR (₹)
  originalPrice?: number; // in INR (₹)
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  images: string[];
  description: string;
  fabricSpecs: {
    weight: string; // e.g. "300 GSM Heavyweight Bio-Washed Cotton"
    composition: string; // e.g. "100% Super-Combed Indian Organic Cotton"
    weave: string;
    care: string;
    origin: string;
  };
  fitAdvice: string;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isLimitedEdition?: boolean;
  productType?: string;
  availability?: 'In Stock' | 'Out of Stock';
  stock: Record<string, number>;
  tags: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend?: number;
  description: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface CustomerAddress {
  fullName: string;
  mobile: string;
  whatsApp: string;
  houseBuilding: string;
  street: string;
  areaLocality: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryInstructions?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerWhatsApp: string;
  shippingAddress: {
    street: string;
    area?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    deliveryInstructions?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'WhatsApp Order Placed' | 'Order Confirmed' | 'Cutting & Packing' | 'Dispatched via Delhivery / Bluedart' | 'Delivered' | 'Cancelled';
  paymentMethod: 'WhatsApp Direct Order';
  createdAt: string;
  trackingNumber: string;
  estimatedDelivery: string;
  whatsAppMessageText?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  savedAddresses?: string[];
  isAdmin?: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsAppNumber: string; // Country code included, e.g. "919876543210"
  googleSheetUrl: string;
  googleSheetId: string;
  lastSyncedAt?: string;
  autoSyncOnLoad: boolean;
  freeShippingThreshold: number; // in INR (e.g. 999)
  standardShippingFee: number; // in INR (e.g. 60)
  supportEmail: string;
  supportPhone: string;
  returnPolicyDays: number;
  instagramHandle: string;
  locationCity: string;
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

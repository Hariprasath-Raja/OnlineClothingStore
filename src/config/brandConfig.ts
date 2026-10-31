/**
 * ============================================================================
 * AETHER DESI ATELIER — CENTRAL BRAND & STORE CONFIGURATION
 * ============================================================================
 * 
 * HANDOVER GUIDE FOR DEVELOPER & CLIENT:
 * To update your store settings, change the values in this file:
 * 
 * 1. WHATSAPP NUMBER:
 *    Change `WHATSAPP_CONFIG.phoneNumber` below (e.g. '98876543210').
 *    The website automatically formats it with +91 for displays and creates
 *    clean international links for orders and concierge chat.
 * 
 * 2. BRAND IDENTITY & TEXT:
 *    Update `BRAND_CONFIG.storeName`, `tagline`, `supportEmail`, `supportPhone`,
 *    and physical studio locations.
 * 
 * 3. PRICING & SHIPPING:
 *    Update `SHIPPING_CONFIG.freeShippingThreshold` (e.g. 999 for ₹999)
 *    and `standardShippingFee` (e.g. 60 for ₹60).
 * 
 * 4. THEME & COLORS:
 *    Update `THEME_CONFIG` to adjust primary brand accents, backgrounds,
 *    and badge styling without touching core CSS.
 * ============================================================================
 */

export interface WhatsAppConfig {
  countryCode: string; // e.g. "+91"
  rawCountryCode: string; // "91"
  phoneNumber: string; // 10-digit Indian mobile number
  conciergeDefaultMessage: string;
}

export interface BrandConfig {
  storeName: string;
  shortName: string;
  tagline: string;
  subTagline: string;
  currencySymbol: string;
  currencyCode: 'INR';
  supportEmail: string;
  supportPhone: string;
  location: {
    city: string;
    state: string;
    millHub: string;
    flagshipRetail: string;
  };
  socialLinks: {
    instagram: string;
    twitter: string;
    instagramUrl: string;
  };
}

export interface ShippingConfig {
  freeShippingThreshold: number; // in INR (₹)
  standardShippingFee: number; // in INR (₹)
  primaryCarrier: string;
  secondaryCarrier: string;
  returnPolicyDays: number;
}

export interface ThemeConfig {
  brandPrimary: string;
  brandDark: string;
  brandBackground: string;
  whatsAppGreen: string;
  accentGold: string;
  accentRed: string;
}

// ----------------------------------------------------------------------------
// 1. WHATSAPP BUSINESS CONFIGURATION
// ----------------------------------------------------------------------------
export const WHATSAPP_CONFIG: WhatsAppConfig = {
  countryCode: '+91',
  rawCountryCode: '91',
  phoneNumber: '98876543210', // <-- CONFIGURE CLIENT'S 10-DIGIT WHATSAPP NUMBER HERE
  conciergeDefaultMessage: 'Hello Aether Desi Atelier Concierge, I have an inquiry regarding your T-shirt collection.',
};

// ----------------------------------------------------------------------------
// 2. BRAND & STORE IDENTITY
// ----------------------------------------------------------------------------
export const BRAND_CONFIG: BrandConfig = {
  storeName: 'AETHER DESI ATELIER',
  shortName: 'AETHER',
  tagline: 'Modern Streetwear x Indian Culture',
  subTagline: '320+ GSM Heavyweight Combed Cotton Essentials from Tiruppur',
  currencySymbol: '₹',
  currencyCode: 'INR',
  supportEmail: 'care@aetherdesi.in',
  supportPhone: '+91 98876 54321',
  location: {
    city: 'Chennai & Tiruppur',
    state: 'Tamil Nadu, India',
    millHub: 'Khaderpet Circular Knitting Mills, Tiruppur 641601',
    flagshipRetail: 'T. Nagar Atelier Hub, Chennai 600017',
  },
  socialLinks: {
    instagram: '@aetherdesi.in',
    twitter: '@aetherdesi',
    instagramUrl: 'https://instagram.com',
  },
};

// ----------------------------------------------------------------------------
// 3. SHIPPING & FULFILLMENT RULES
// ----------------------------------------------------------------------------
export const SHIPPING_CONFIG: ShippingConfig = {
  freeShippingThreshold: 999, // Free express shipping above ₹999
  standardShippingFee: 60, // ₹60 standard courier charge
  primaryCarrier: 'Delhivery Express Air',
  secondaryCarrier: 'BlueDart Courier Priority',
  returnPolicyDays: 7,
};

// ----------------------------------------------------------------------------
// 4. COLOR THEME & VISUAL TOKENS
// ----------------------------------------------------------------------------
export const THEME_CONFIG: ThemeConfig = {
  brandPrimary: '#000000',
  brandDark: '#111111',
  brandBackground: '#faf9f6',
  whatsAppGreen: '#25D366',
  accentGold: '#D4AF37',
  accentRed: '#E11D48',
};

// ----------------------------------------------------------------------------
// 5. HELPER UTILITIES (Single source of truth for WhatsApp throughout the app)
// ----------------------------------------------------------------------------

/**
 * Returns the sanitized pure digit string suitable for WhatsApp API URLs:
 * e.g. "9198876543210"
 */
export function getCleanWhatsAppNumber(customNumber?: string): string {
  const num = customNumber || WHATSAPP_CONFIG.phoneNumber;
  const digitsOnly = num.replace(/[^0-9]/g, '');
  
  // If already starts with country code (e.g. 9198876543210 with 12 digits), return as is
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly;
  }
  
  // If 10 digits, prepend India code 91
  if (digitsOnly.length === 10) {
    return `${WHATSAPP_CONFIG.rawCountryCode}${digitsOnly}`;
  }
  
  return digitsOnly || `${WHATSAPP_CONFIG.rawCountryCode}${WHATSAPP_CONFIG.phoneNumber}`;
}

/**
 * Formats a phone number for user-facing UI presentation:
 * e.g. "+91 98876 54321"
 */
export function formatDisplayWhatsAppNumber(customNumber?: string): string {
  const clean = getCleanWhatsAppNumber(customNumber);
  if (clean.length === 12 && clean.startsWith('91')) {
    const p1 = clean.slice(2, 7);
    const p2 = clean.slice(7);
    return `+91 ${p1} ${p2}`;
  }
  return `+91 ${customNumber || WHATSAPP_CONFIG.phoneNumber}`;
}

/**
 * Builds the official WhatsApp click-to-chat URL with encoded message:
 */
export function buildWhatsAppChatUrl(messageText?: string, customNumber?: string): string {
  const phone = getCleanWhatsAppNumber(customNumber);
  const text = encodeURIComponent(messageText || WHATSAPP_CONFIG.conciergeDefaultMessage);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
}

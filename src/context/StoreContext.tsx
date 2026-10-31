import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  Coupon,
  Order,
  Review,
  UserProfile,
  CategoryType,
  StoreSettings,
  CustomerAddress,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  DEFAULT_STORE_SETTINGS,
} from '../data/initialData';
import { fetchProductsFromGoogleSheet } from '../services/googleSheetsService';
import { WHATSAPP_CONFIG, BRAND_CONFIG, getCleanWhatsAppNumber } from '../config/brandConfig';
import { ADMIN_CONFIG } from '../config/adminConfig';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface WhatsAppOrderResult {
  order: Order;
  whatsAppUrl: string;
  messageText: string;
}

export interface AdminSessionMeta {
  email: string;
  name: string;
  role: 'SUPER_ADMIN';
  expiresAt: number;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  settings: StoreSettings;
  appliedCoupon: Coupon | null;
  recentlyViewed: string[];
  user: UserProfile | null;
  activeCategory: CategoryType;
  searchQuery: string;
  activeView: 'home' | 'shop' | 'product' | 'lookbook' | 'about' | 'admin';
  selectedProduct: Product | null;
  quickViewProduct: Product | null;
  toasts: Toast[];
  isSyncingSheet: boolean;

  // Admin Security & Session
  adminToken: string | null;
  adminSessionMeta: AdminSessionMeta | null;
  isAdminAuthenticated: boolean;
  setAdminToken: (token: string, expiresAt: number, meta: any) => void;
  logoutAdmin: () => Promise<void>;
  verifyAdminSession: () => Promise<boolean>;

  // Modal / Drawer visibility
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isAuthOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderTrackingOpen: boolean;
  isSizeGuideOpen: boolean;
  isAdminOpen: boolean;
  isQuickViewOpen: boolean;
  isContactOpen: boolean;
  isFaqOpen: boolean;
  activeTrackingId: string | null;

  // Actions
  setActiveView: (view: 'home' | 'shop' | 'product' | 'lookbook' | 'about' | 'admin') => void;
  setActiveCategory: (cat: CategoryType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (p: Product | null) => void;
  setQuickViewProduct: (p: Product | null) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Modals controls
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrderTrackingOpen: (open: boolean) => void;
  setIsSizeGuideOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsQuickViewOpen: (open: boolean) => void;
  setIsContactOpen: (open: boolean) => void;
  setIsFaqOpen: (open: boolean) => void;
  setActiveTrackingId: (id: string | null) => void;

  // Shopping operations
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  placeWhatsAppOrder: (address: CustomerAddress) => WhatsAppOrderResult;

  // Google Sheets
  syncGoogleSheets: (customUrlOrId?: string) => Promise<{ success: boolean; count: number; error?: string }>;

  // Formatters
  formatPrice: (amountInINR: number) => string;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;

  // Admin / Data operations
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, size: string, quantity: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (id: string) => void;
  loginUser: (email: string, name?: string, isAdmin?: boolean) => void;
  logoutUser: () => void;
  resetAllData: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Settings (configurable via Admin)
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('aether_settings');
    return saved ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_STORE_SETTINGS;
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aether_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aether_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('aether_wishlist');
    return saved ? JSON.parse(saved) : ['prod-01', 'prod-02'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aether_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('aether_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('aether_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('aether_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation and active view
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'product' | 'lookbook' | 'about' | 'admin'>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);

  // Admin Session Security State
  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    return localStorage.getItem(ADMIN_CONFIG.sessionStorageKey);
  });

  const [adminSessionMeta, setAdminSessionMeta] = useState<AdminSessionMeta | null>(() => {
    const raw = localStorage.getItem(ADMIN_CONFIG.sessionMetaKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(ADMIN_CONFIG.sessionStorageKey);
        localStorage.removeItem(ADMIN_CONFIG.sessionMetaKey);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const isAdminAuthenticated = Boolean(
    adminToken && adminSessionMeta && Date.now() < adminSessionMeta.expiresAt
  );

  const setAdminToken = (token: string, expiresAt: number, meta: any) => {
    setAdminTokenState(token);
    const sessionObj: AdminSessionMeta = {
      email: meta.email || ADMIN_CONFIG.defaultEmail,
      name: meta.name || 'Store Administrator',
      role: 'SUPER_ADMIN',
      expiresAt,
    };
    setAdminSessionMeta(sessionObj);
    localStorage.setItem(ADMIN_CONFIG.sessionStorageKey, token);
    localStorage.setItem(ADMIN_CONFIG.sessionMetaKey, JSON.stringify(sessionObj));
  };

  const logoutAdmin = async () => {
    if (adminToken) {
      try {
        await fetch(ADMIN_CONFIG.endpoints.logout, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
        });
      } catch (e) {
        // ignore network error
      }
    }
    setAdminTokenState(null);
    setAdminSessionMeta(null);
    setIsAdminOpen(false);
    localStorage.removeItem(ADMIN_CONFIG.sessionStorageKey);
    localStorage.removeItem(ADMIN_CONFIG.sessionMetaKey);
    showToast('Admin session terminated. Dashboard locked.', 'info');
  };

  const verifyAdminSession = async (): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(ADMIN_CONFIG.endpoints.verify, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        return Boolean(data.authenticated);
      } else {
        await logoutAdmin();
        return false;
      }
    } catch {
      return false;
    }
  };

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('aether_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('aether_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('aether_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aether_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('aether_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aether_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('aether_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('aether_user', JSON.stringify(user));
  }, [user]);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings saved successfully', 'success');
  };

  // Google Sheets Synchronization (Protected by Server-Side Admin Session)
  const syncGoogleSheets = async (customUrlOrId?: string): Promise<{ success: boolean; count: number; error?: string }> => {
    const targetUrl = customUrlOrId || settings.googleSheetUrl || settings.googleSheetId;
    if (!targetUrl) {
      const err = 'Please enter a Google Sheet URL or ID in Settings.';
      showToast(err, 'error');
      return { success: false, count: 0, error: err };
    }

    if (!adminToken || !isAdminAuthenticated) {
      const err = 'Access Denied: You must be authenticated as an Administrator to sync Google Sheets.';
      showToast(err, 'error');
      setIsAdminOpen(true);
      return { success: false, count: 0, error: err };
    }

    setIsSyncingSheet(true);
    showToast('Securely syncing spreadsheet with server...', 'info');

    try {
      // 1. Try secure server proxy first
      const serverRes = await fetch(ADMIN_CONFIG.endpoints.syncSheets, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ sheetUrl: targetUrl }),
      });

      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          setSettings((prev) => ({
            ...prev,
            googleSheetUrl: targetUrl,
            lastSyncedAt: new Date().toLocaleTimeString(),
          }));
          setIsSyncingSheet(false);
          showToast(`Successfully synced ${data.products.length} products from Google Sheet!`, 'success');
          return { success: true, count: data.products.length };
        }
      }

      // 2. Fallback to client-side parser if server route returned non-200 in standalone client preview
      const res = await fetchProductsFromGoogleSheet(targetUrl);
      setIsSyncingSheet(false);

      if (res.error || res.products.length === 0) {
        showToast(res.error || 'No valid products found in sheet.', 'error');
        return { success: false, count: 0, error: res.error };
      }

      // Update store products with the fetched products
      setProducts(res.products);
      setSettings((prev) => ({
        ...prev,
        googleSheetUrl: targetUrl,
        lastSyncedAt: new Date().toLocaleTimeString(),
      }));

      showToast(`Successfully synced ${res.products.length} products from Google Sheets!`, 'success');
      return { success: true, count: res.products.length };
    } catch (err: any) {
      setIsSyncingSheet(false);
      const msg = err?.message || 'Failed to sync Google Sheets';
      showToast(msg, 'error');
      return { success: false, count: 0, error: msg };
    }
  };

  // Track recently viewed
  const trackRecentlyViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item !== id);
      return [id, ...filtered].slice(0, 8);
    });
  };

  const handleSelectProduct = (product: Product | null) => {
    setSelectedProduct(product);
    if (product) {
      trackRecentlyViewed(product.id);
      setActiveView('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    // Check if out of stock
    const availableStock = product.stock[size] ?? 10;
    if (availableStock <= 0 || product.availability === 'Out of Stock') {
      showToast(`Sorry, ${product.name} (Size ${size}) is out of stock!`, 'error');
      return;
    }

    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIndex > -1) {
      setCart((prev) => {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      });
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size}-${color}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || '',
        selectedColor: color,
        selectedSize: size,
        quantity,
      };
      setCart((prev) => [...prev, newItem]);
    }
    showToast(`Added ${quantity}x "${product.name}" to Bag!`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from shopping bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const prod = products.find((p) => p.id === productId);
      const name = prod ? prod.name : 'T-shirt';
      if (exists) {
        showToast(`Removed "${name}" from Wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${name}" to Wishlist`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Pricing & Currency in Indian Rupees (₹)
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;
  // Free delivery threshold e.g. ₹999
  const cartShipping =
    cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : settings.standardShippingFee;
  const cartTax = 0; // Inclusive of GST
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Format price in Indian Rupees (₹) with Indian numbering system
  const formatPrice = (amountInINR: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amountInINR);
  };

  // Coupons
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (found.minSpend && cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Minimum order value of ${formatPrice(found.minSpend)} required for code ${found.code}`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Code ${found.code} applied: ${found.discountPercent}% off!`, 'success');
    return { success: true, message: `Applied ${found.discountPercent}% discount` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  // WhatsApp Order Submission (NO PAYMENT GATEWAY)
  const placeWhatsAppOrder = (address: CustomerAddress): WhatsAppOrderResult => {
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `#ORD${orderNum}`;
    const cleanWhatsAppNumber = getCleanWhatsAppNumber(settings.whatsAppNumber || WHATSAPP_CONFIG.phoneNumber);

    // Format item list matching user requirement
    const itemsListText = cart
      .map((item, idx) => {
        return `${idx + 1}. ${item.name}\n   Size: ${item.selectedSize} | Color: ${item.selectedColor} | Quantity: ${item.quantity} | Price: ₹${item.price * item.quantity}`;
      })
      .join('\n');

    // Build the exact WhatsApp message as specified:
    const messageLines = [
      `ORDER REQUEST – ${settings.storeName.toUpperCase()}`,
      '',
      `Order ID: ${orderId}`,
      '',
      'CUSTOMER DETAILS:',
      `Name: ${address.fullName}`,
      `Mobile: +91 ${address.mobile}`,
      `WhatsApp: +91 ${address.whatsApp}`,
      `Address: ${address.houseBuilding}, ${address.street}, ${address.areaLocality}`,
      `City: ${address.city}`,
      `State: ${address.state}`,
      `PIN Code: ${address.pinCode}`,
      '',
      'ORDER ITEMS:',
      itemsListText,
      '',
      'ORDER SUMMARY:',
      `Subtotal: ₹${cartSubtotal}`,
      cartDiscount > 0 ? `Discount: ₹${cartDiscount} (${appliedCoupon?.code})` : 'Discount: ₹0',
      `Delivery Charges: ${cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}`,
      `TOTAL: ₹${cartTotal}`,
      '',
      address.deliveryInstructions ? `Delivery Instructions: ${address.deliveryInstructions}\n` : '',
      'Thank you for shopping with us!',
    ].filter((line) => line !== null);

    const messageText = messageLines.join('\n');
    const encodedText = encodeURIComponent(messageText);

    // Click-to-chat URL works across both mobile and desktop browser
    const whatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanWhatsAppNumber}&text=${encodedText}`;

    // Create and save local order record
    const deliveryEst = new Date();
    deliveryEst.setDate(deliveryEst.getDate() + 3);
    const estimatedDeliveryStr = deliveryEst.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const newOrder: Order = {
      id: orderId,
      customerName: address.fullName,
      customerPhone: address.mobile,
      customerWhatsApp: address.whatsApp,
      shippingAddress: {
        street: `${address.houseBuilding}, ${address.street}`,
        area: address.areaLocality,
        city: address.city,
        state: address.state,
        zipCode: address.pinCode,
        country: 'India',
        deliveryInstructions: address.deliveryInstructions,
      },
      items: cart.map((it) => ({
        productId: it.productId,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        size: it.selectedSize,
        color: it.selectedColor,
        image: it.image,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: cartShipping,
      tax: 0,
      total: cartTotal,
      status: 'WhatsApp Order Placed',
      paymentMethod: 'WhatsApp Direct Order',
      createdAt: new Date().toISOString(),
      trackingNumber: `DEL-${Math.floor(100000000 + Math.random() * 900000000)}-IN`,
      estimatedDelivery: estimatedDeliveryStr,
      whatsAppMessageText: messageText,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    return {
      order: newOrder,
      whatsAppUrl,
      messageText,
    };
  };

  // Admin Actions
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now().toString(36)}`;
    const product: Product = {
      ...newProdData,
      id: newId,
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Product "${product.name}" added to catalog`, 'success');
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated "${updated.name}"`, 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const updateStock = (productId: string, size: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = {
            ...p.stock,
            [size]: Math.max(0, quantity),
          };
          const totalStock = Object.values(newStock).reduce((a, b) => a + b, 0);
          return {
            ...p,
            stock: newStock,
            availability: totalStock > 0 ? 'In Stock' : 'Out of Stock',
          };
        }
        return p;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order ${orderId} updated to "${status}"`, 'info');
  };

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev.filter((c) => c.code !== newCoupon.code)]);
    showToast(`Coupon ${newCoupon.code} created`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Coupon ${code} deleted`, 'info');
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast('Review submitted. Dhanyavaad!', 'success');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review removed', 'info');
  };

  const loginUser = (email: string, name = 'Client', isAdmin = false) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name,
      email,
      isAdmin,
      savedAddresses: ['Flat 402, Royal Residency, Mount Road, T. Nagar, Chennai 600017'],
    };
    setUser(newUser);
    showToast(`Vanakkam & Welcome, ${name}!`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Signed out of account', 'info');
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCoupons(INITIAL_COUPONS);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setSettings(DEFAULT_STORE_SETTINGS);
    setCart([]);
    setWishlist(['prod-01', 'prod-02']);
    setAppliedCoupon(null);
    localStorage.clear();
    showToast('Store reset to initial Desi & Tamil streetwear collection', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        coupons,
        reviews,
        settings,
        appliedCoupon,
        recentlyViewed,
        user,
        activeCategory,
        searchQuery,
        activeView,
        selectedProduct,
        quickViewProduct,
        toasts,
        isSyncingSheet,
        adminToken,
        adminSessionMeta,
        isAdminAuthenticated,
        setAdminToken,
        logoutAdmin,
        verifyAdminSession,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isAuthOpen,
        isCheckoutOpen,
        isOrderTrackingOpen,
        isSizeGuideOpen,
        isAdminOpen,
        isQuickViewOpen,
        isContactOpen,
        isFaqOpen,
        activeTrackingId,
        setActiveView,
        setActiveCategory,
        setSearchQuery,
        setSelectedProduct: handleSelectProduct,
        setQuickViewProduct,
        updateSettings,
        syncGoogleSheets,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsSearchOpen,
        setIsAuthOpen,
        setIsCheckoutOpen,
        setIsOrderTrackingOpen,
        setIsSizeGuideOpen,
        setIsAdminOpen,
        setIsQuickViewOpen,
        setIsContactOpen,
        setIsFaqOpen,
        setActiveTrackingId,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        placeWhatsAppOrder,
        formatPrice,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        cartItemCount,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updateOrderStatus,
        addCoupon,
        deleteCoupon,
        addReview,
        deleteReview,
        loginUser,
        logoutUser,
        resetAllData,
        showToast,
      }}
    >
      {children}

      {/* Syncing Sheets Floating Pill */}
      {isSyncingSheet && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-4 py-2 text-xs font-mono flex items-center gap-2 border border-neutral-700 shadow-xl animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Fetching live products from Google Sheets...</span>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-none shadow-xl border text-xs tracking-wider uppercase font-medium flex items-center gap-3 transition-all transform animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-800'
                : toast.type === 'info'
                ? 'bg-zinc-900 text-zinc-100 border-zinc-700'
                : 'bg-black text-white border-zinc-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

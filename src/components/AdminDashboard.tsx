import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  Package,
  ShoppingBag,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  MessageSquare,
  Settings,
  Link,
  ExternalLink,
  HelpCircle,
  FileSpreadsheet,
  Lock,
  ShieldCheck,
  LogOut,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Coupon, Order, CategoryType } from '../types';
import { downloadGoogleSheetsTemplate } from '../services/googleSheetsService';
import { AdminLoginPage } from './AdminLoginPage';
import { ADMIN_CONFIG } from '../config/adminConfig';
import { WHATSAPP_CONFIG, formatDisplayWhatsAppNumber, getCleanWhatsAppNumber } from '../config/brandConfig';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    reviews,
    deleteReview,
    formatPrice,
    resetAllData,
    settings,
    updateSettings,
    syncGoogleSheets,
    isSyncingSheet,
    showToast,
    adminToken,
    adminSessionMeta,
    isAdminAuthenticated,
    logoutAdmin,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'sheets' | 'products' | 'orders' | 'inventory' | 'settings'>('overview');
  
  // Sheet config state
  const [sheetInput, setSheetInput] = useState(settings.googleSheetUrl || settings.googleSheetId || '');
  const [whatsAppInput, setWhatsAppInput] = useState(settings.whatsAppNumber || '9198876543210');
  const [storeNameInput, setStoreNameInput] = useState(settings.storeName || 'AETHER DESI ATELIER');
  const [freeShipInput, setFreeShipInput] = useState(settings.freeShippingThreshold || 999);
  const [standardShipInput, setStandardShipInput] = useState(settings.standardShippingFee || 60);

  // Admin Credentials Update State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const [credMessage, setCredMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Product Modal / Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryType>('tamil');
  const [prodPrice, setProdPrice] = useState(749);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | undefined>(899);
  const [prodWeight, setProdWeight] = useState('320 GSM Ultra Heavyweight');
  const [prodComposition, setProdComposition] = useState('100% Super-Combed Indian Organic Cotton');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('/images/desi_tamil_streetwear_tee_1793442456883.jpg');

  if (!isAdminOpen) return null;

  // STRICT ACCESS CONTROL:
  // If user is not authenticated with an active server-side session, render the Admin Login Screen
  if (!isAdminAuthenticated) {
    return (
      <AdminLoginPage
        onSuccess={() => {}}
        onCancel={() => setIsAdminOpen(false)}
      />
    );
  }

  // Overview metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const totalUnitsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0);
  const totalCatalogItems = products.length;

  const lowStockProducts = products.filter((p) =>
    Object.values(p.stock).some((qty) => qty <= 4)
  );

  const handleSyncSheets = async () => {
    if (!sheetInput.trim()) {
      showToast('Please enter a Google Sheet URL or ID first', 'error');
      return;
    }
    updateSettings({ googleSheetUrl: sheetInput.trim() });
    await syncGoogleSheets(sheetInput.trim());
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: storeNameInput.trim(),
      whatsAppNumber: whatsAppInput.trim().replace(/[^0-9]/g, ''),
      googleSheetUrl: sheetInput.trim(),
      freeShippingThreshold: Number(freeShipInput),
      standardShippingFee: Number(standardShipInput),
    });
  };

  const handleTestWhatsApp = () => {
    const clean = getCleanWhatsAppNumber(whatsAppInput);
    const url = `https://api.whatsapp.com/send?phone=${clean}&text=Hello%20Aether%20Atelier%20Admin,%20testing%20WhatsApp%20order%20link.`;
    window.open(url, '_blank');
  };

  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredMessage(null);

    if (!currentPassword) {
      setCredMessage({ text: 'Please enter your current administrator password.', type: 'error' });
      return;
    }

    if (!newAdminEmail && !newAdminPassword) {
      setCredMessage({ text: 'Please specify a new email or new password to update.', type: 'error' });
      return;
    }

    if (newAdminPassword && newAdminPassword.length < 8) {
      setCredMessage({ text: 'New password must be at least 8 characters long.', type: 'error' });
      return;
    }

    setIsUpdatingCreds(true);
    try {
      const res = await fetch(ADMIN_CONFIG.endpoints.updateCredentials, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newEmail: newAdminEmail.trim() || undefined,
          newPassword: newAdminPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCredMessage({ text: data.error || 'Failed to update credentials.', type: 'error' });
      } else {
        setCredMessage({ text: 'Admin credentials successfully updated on server.', type: 'success' });
        showToast('Admin credentials updated successfully!', 'success');
        setCurrentPassword('');
        setNewAdminPassword('');
      }
    } catch (err: any) {
      setCredMessage({ text: 'Network error while updating credentials.', type: 'error' });
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('tamil');
    setProdPrice(749);
    setProdOriginalPrice(899);
    setProdWeight('320 GSM Heavyweight Bio-Washed');
    setProdComposition('100% Super-Combed Indian Cotton');
    setProdDescription('Statement Desi streetwear tee crafted in Tiruppur with drop-shoulder fit.');
    setProdImageUrl('/images/desi_tamil_streetwear_tee_1793442456883.jpg');
    setShowAddProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdOriginalPrice(prod.originalPrice);
    setProdWeight(prod.fabricSpecs.weight);
    setProdComposition(prod.fabricSpecs.composition);
    setProdDescription(prod.description);
    setProdImageUrl(prod.images[0] || '/images/desi_tamil_streetwear_tee_1793442456883.jpg');
    setShowAddProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) {
      showToast('Please enter a product name', 'error');
      return;
    }

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        updateProduct({
          ...existing,
          name: prodName,
          category: prodCategory,
          price: Number(prodPrice),
          originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
          description: prodDescription,
          images: [prodImageUrl, ...existing.images.slice(1)],
          fabricSpecs: {
            ...existing.fabricSpecs,
            weight: prodWeight,
            composition: prodComposition,
          },
        });
      }
    } else {
      addProduct({
        name: prodName,
        slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: prodCategory,
        gender: 'unisex',
        price: Number(prodPrice),
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        rating: 5.0,
        reviewCount: 1,
        colors: [
          { name: 'Pitch Black', hex: '#111111' },
          { name: 'Chalk White', hex: '#f7f6f1' },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        images: [
          prodImageUrl,
          '/images/hero_streetwear_models_1793441451610.jpg',
        ],
        description: prodDescription,
        fabricSpecs: {
          weight: prodWeight,
          composition: prodComposition,
          weave: 'Compact Single Jersey Knit',
          care: 'Machine wash delicate inside out',
          origin: 'Tiruppur & Chennai, India',
        },
        fitAdvice: 'Boxy drop shoulder silhouette.',
        stock: { XS: 10, S: 15, M: 20, L: 15, XL: 8, XXL: 4 },
        tags: [prodCategory, 'Desi Streetwear', 'Heavyweight'],
        isNewArrival: true,
      });
    }

    setShowAddProductModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm">
      <div className="min-h-screen p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <div className="w-full max-w-6xl bg-white border border-neutral-300 shadow-2xl overflow-hidden flex flex-col min-h-[85vh]">
          
          {/* Header with Security Status & Session Actions */}
          <div className="px-6 py-4 bg-black text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-black tracking-tight font-display uppercase">
                {settings.storeName}
              </span>
              <span className="text-neutral-400 font-mono text-xs">/ Management Console</span>
              
              {/* Authenticated Admin Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Super Admin: {adminSessionMeta?.email || 'Authenticated'}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetAllData}
                className="text-neutral-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                title="Reset store to default products and orders"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Initial Data</span>
              </button>

              {/* Secure Sign Out Button */}
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-rose-300 hover:text-rose-200 border border-neutral-700 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Destroy active session token and lock admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white"
                title="Return to storefront"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <div className="px-6 bg-neutral-100 border-b border-neutral-200 flex items-center gap-2 overflow-x-auto text-xs font-mono font-semibold uppercase tracking-wider text-neutral-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
              }`}
            >
              Overview &amp; Metrics
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'sheets' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets Sync</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'products' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'inventory' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
              }`}
            >
              Inventory Matrix
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'settings' ? 'border-black text-black bg-white' : 'border-transparent hover:text-black'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Store &amp; WhatsApp Settings</span>
            </button>
          </div>

          {/* Main Dashboard Content */}
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                      <span>Total Revenue</span>
                      <TrendingUp className="w-4 h-4 text-neutral-800" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-neutral-900">
                      {formatPrice(totalRevenue)}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700">
                      Via WhatsApp Direct Orders
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                      <span>WhatsApp Orders</span>
                      <ShoppingBag className="w-4 h-4 text-neutral-800" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-neutral-900">
                      {totalOrdersCount}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      {totalUnitsSold} T-shirts packaged
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                      <span>Live Catalog Items</span>
                      <Layers className="w-4 h-4 text-neutral-800" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-neutral-900">
                      {totalCatalogItems}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      {settings.lastSyncedAt ? `Synced at ${settings.lastSyncedAt}` : 'Default Desi catalog'}
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-50 border border-neutral-200 space-y-1">
                    <div className="flex items-center justify-between text-neutral-500 text-xs font-mono">
                      <span>Low Stock Alerts</span>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-bold font-mono text-neutral-900">
                      {lowStockProducts.length}
                    </div>
                    <div className="text-[11px] font-mono text-amber-700">
                      Sizes needing restock in Tiruppur
                    </div>
                  </div>
                </div>

                {/* Quick Google Sheets Sync Banner */}
                <div className="p-5 bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold uppercase text-emerald-900 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                      <span>Google Sheets Product Integration</span>
                    </div>
                    <p className="text-xs text-emerald-800 font-light">
                      Manage all products, pricing, discounts, and inventory in your Google Sheet without editing website code.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('sheets')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono uppercase font-bold tracking-wider"
                    >
                      Configure Sheets
                    </button>
                    <button
                      onClick={downloadGoogleSheetsTemplate}
                      className="px-4 py-2 bg-white border border-emerald-300 text-emerald-900 text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Template</span>
                    </button>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900">
                      Recent WhatsApp Customer Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-mono text-neutral-600 hover:text-black underline"
                    >
                      View All Orders
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
                    {orders.slice(0, 3).map((o) => (
                      <div key={o.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-mono">
                        <div>
                          <div className="font-bold text-neutral-900">{o.id} · {o.customerName}</div>
                          <div className="text-neutral-500">
                            Mobile: +91 {o.customerPhone} · {o.shippingAddress.city}, {o.shippingAddress.state} ({o.shippingAddress.zipCode})
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-neutral-900">{formatPrice(o.total)}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. GOOGLE SHEETS SYNC TAB */}
            {activeTab === 'sheets' && (
              <div className="space-y-8 max-w-4xl">
                <div className="border-b border-neutral-200 pb-3">
                  <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 font-display flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <span>Google Sheets Live Product Synchronization</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono pt-1">
                    Connect your Google Spreadsheet to automatically pull product names, descriptions, images, prices, discounts, categories, and inventory.
                  </p>
                </div>

                {/* Step-by-Step Instructions Card */}
                <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-4 text-xs font-mono">
                  <div className="font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-neutral-700" />
                    <span>3-Step Setup Instructions:</span>
                  </div>

                  <ol className="space-y-2.5 text-neutral-700 list-decimal list-inside leading-relaxed">
                    <li>
                      <strong>Download the Template:</strong> Click the button below to get our pre-formatted CSV template with all 15 required columns.
                    </li>
                    <li>
                      <strong>Upload to Google Sheets:</strong> Open <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-600 underline">sheets.new</a>, go to <em>File &gt; Import &gt; Upload</em>, and upload the CSV file.
                    </li>
                    <li>
                      <strong>Make it Public:</strong> Click the green <strong>Share</strong> button in Google Sheets &gt; under <em>General Access</em>, select <strong>"Anyone with the link can view"</strong>, copy the link, and paste it below!
                    </li>
                  </ol>

                  <div className="pt-2">
                    <button
                      onClick={downloadGoogleSheetsTemplate}
                      className="px-5 py-2.5 bg-black text-white uppercase font-bold text-xs flex items-center gap-2 hover:bg-neutral-800"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Sample Google Sheets Template (CSV)</span>
                    </button>
                  </div>
                </div>

                {/* Sync Controller Box */}
                <div className="p-6 bg-white border-2 border-neutral-300 space-y-4">
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-900">
                    Google Spreadsheet URL or Sheet ID:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                      value={sheetInput}
                      onChange={(e) => setSheetInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-neutral-300 text-xs font-mono focus:outline-none focus:border-black"
                    />
                    <button
                      onClick={handleSyncSheets}
                      disabled={isSyncingSheet}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                      <span>{isSyncingSheet ? 'Syncing...' : 'Sync Products Now'}</span>
                    </button>
                  </div>

                  {settings.lastSyncedAt && (
                    <div className="text-[11px] font-mono text-emerald-800 flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Active Google Sheet connection. Last fetched at {settings.lastSyncedAt}.</span>
                    </div>
                  )}
                </div>

                {/* Required Columns Reference */}
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800">
                    Expected Google Sheet Columns:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-[11px] font-mono">
                    {[
                      'Product ID',
                      'Product Name',
                      'Product Description',
                      'Product Images / Image URLs',
                      'Original Price (₹)',
                      'Discount Percentage',
                      'Final Selling Price (₹)',
                      'Category',
                      'Available Sizes',
                      'Available Colors',
                      'Stock Quantity',
                      'Product Availability',
                      'Product Type',
                      'Featured Product',
                      'New Arrival',
                    ].map((col) => (
                      <div key={col} className="p-2 bg-neutral-100 border border-neutral-200 truncate">
                        {col}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 3. PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900">
                    Product Catalog ({products.length} items)
                  </h3>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Silhouette</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-neutral-200">
                  <table className="w-full text-xs font-mono text-left border-collapse">
                    <thead className="bg-neutral-100 text-neutral-900 uppercase">
                      <tr className="border-b border-neutral-200">
                        <th className="p-3">Image</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Selling Price</th>
                        <th className="p-3">Original MRP</th>
                        <th className="p-3">Availability</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                      {products.map((p) => {
                        const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);
                        return (
                          <tr key={p.id} className="hover:bg-neutral-50">
                            <td className="p-3">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-10 h-12 object-cover bg-neutral-200"
                              />
                            </td>
                            <td className="p-3 font-semibold text-neutral-900 max-w-xs truncate">
                              {p.name}
                            </td>
                            <td className="p-3 uppercase text-neutral-600">{p.category}</td>
                            <td className="p-3 font-bold text-neutral-900">{formatPrice(p.price)}</td>
                            <td className="p-3 text-neutral-400">
                              {p.originalPrice ? formatPrice(p.originalPrice) : '—'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold ${
                                totalStock <= 0 || p.availability === 'Out of Stock'
                                  ? 'bg-rose-100 text-rose-800'
                                  : totalStock < 10
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {totalStock <= 0 ? 'Out of Stock' : `${totalStock} in stock`}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. WHATSAPP ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Orders Fulfillment Center</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono pt-1">
                    Customer orders placed through WhatsApp chat. Connect directly with clients to confirm COD and provide delivery updates.
                  </p>
                </div>

                <div className="space-y-4">
                  {orders.map((o) => {
                    const cleanPhone = (o.customerWhatsApp || o.customerPhone).replace(/[^0-9]/g, '');
                    const customerChatUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello%20${encodeURIComponent(o.customerName)},%20this%20is%20${encodeURIComponent(settings.storeName)}%20regarding%20your%20Order%20${encodeURIComponent(o.id)}.`;

                    return (
                      <div
                        key={o.id}
                        className="p-5 border border-neutral-200 bg-white space-y-4 text-xs font-mono"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-neutral-100 pb-3">
                          <div>
                            <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                              <span>#{o.id}</span>
                              <span>·</span>
                              <span>{o.customerName}</span>
                            </div>
                            <div className="text-neutral-500 pt-0.5">
                              Mobile: +91 {o.customerPhone} · WhatsApp: +91 {o.customerWhatsApp || o.customerPhone}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {/* Direct WhatsApp Customer Chat Button */}
                            <a
                              href={customerChatUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-white" />
                              <span>Chat on WhatsApp</span>
                            </a>

                            {/* Status Updater Dropdown */}
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                              className="bg-neutral-100 border border-neutral-300 font-bold uppercase text-[11px] px-2.5 py-1.5 text-neutral-900 focus:outline-none focus:border-black cursor-pointer"
                            >
                              <option value="WhatsApp Order Placed">WhatsApp Order Placed</option>
                              <option value="Order Confirmed">Order Confirmed</option>
                              <option value="Cutting & Packing">Cutting &amp; Packing</option>
                              <option value="Dispatched via Delhivery / Bluedart">Dispatched via Delhivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="font-bold text-neutral-800 uppercase pb-1">Items in Packet:</div>
                            <div className="space-y-1">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between text-neutral-600">
                                  <span>{it.quantity}x {it.name} ({it.size}, {it.color})</span>
                                  <span>{formatPrice(it.price * it.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="font-bold text-neutral-900 pt-2 border-t border-neutral-100 flex justify-between">
                              <span>Total Amount:</span>
                              <span>{formatPrice(o.total)}</span>
                            </div>
                          </div>

                          <div className="border-t sm:border-t-0 sm:border-l border-neutral-100 sm:pl-4 space-y-1">
                            <div className="font-bold text-neutral-800 uppercase pb-1">Delivery Address:</div>
                            <div className="text-neutral-700">
                              {o.shippingAddress.street}, {o.shippingAddress.area || ''}
                            </div>
                            <div className="text-neutral-700">
                              {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.zipCode}
                            </div>
                            {o.shippingAddress.deliveryInstructions && (
                              <div className="text-amber-800 pt-1">
                                Note: {o.shippingAddress.deliveryInstructions}
                              </div>
                            )}
                            <div className="text-neutral-500 pt-1">
                              Tracking ID: <strong className="text-neutral-800">{o.trackingNumber}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. INVENTORY MATRIX TAB */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="border-b border-neutral-200 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-900">
                    Live Stock Matrix &amp; Inline Adjustments
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono pt-1">
                    Quantities update in real-time. Products with 0 stock across all sizes automatically show as "Out of Stock".
                  </p>
                </div>

                <div className="overflow-x-auto border border-neutral-200">
                  <table className="w-full text-xs font-mono text-left border-collapse">
                    <thead className="bg-neutral-100 text-neutral-900 uppercase">
                      <tr className="border-b border-neutral-200">
                        <th className="p-3">Product Name</th>
                        <th className="p-3 text-center">XS</th>
                        <th className="p-3 text-center">S</th>
                        <th className="p-3 text-center">M</th>
                        <th className="p-3 text-center">L</th>
                        <th className="p-3 text-center">XL</th>
                        <th className="p-3 text-center">XXL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 bg-white">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50">
                          <td className="p-3 font-semibold text-neutral-900 max-w-xs truncate">
                            {p.name}
                          </td>
                          {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => {
                            const count = p.stock[sz] ?? 0;
                            return (
                              <td key={sz} className="p-3 text-center">
                                <div className="inline-flex items-center gap-1 border border-neutral-200 px-1 py-0.5">
                                  <button
                                    onClick={() => updateStock(p.id, sz, count - 1)}
                                    className="px-1 text-neutral-500 hover:text-black font-bold"
                                  >
                                    -
                                  </button>
                                  <span className={`w-6 text-center font-bold ${count <= 3 ? 'text-amber-700' : 'text-neutral-900'}`}>
                                    {count}
                                  </span>
                                  <button
                                    onClick={() => updateStock(p.id, sz, count + 1)}
                                    className="px-1 text-neutral-500 hover:text-black font-bold"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl text-xs font-mono">
                <div className="border-b border-neutral-200 pb-3">
                  <h3 className="text-base font-bold uppercase tracking-tight text-neutral-900 font-display">
                    Store Configuration &amp; WhatsApp Settings
                  </h3>
                </div>

                <div>
                  <label className="block uppercase text-neutral-700 font-bold mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    required
                    value={storeNameInput}
                    onChange={(e) => setStoreNameInput(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block uppercase text-neutral-700 font-bold mb-1">
                    Official WhatsApp Business Number (With Country Code) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="919876543210"
                      value={whatsAppInput}
                      onChange={(e) => setWhatsAppInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={handleTestWhatsApp}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white uppercase font-bold"
                    >
                      Test WhatsApp
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500 pt-1">
                    Enter numbers only without '+' or spaces (e.g. 919876543210 for India).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase text-neutral-700 font-bold mb-1">
                      Free Shipping Threshold (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={freeShipInput}
                      onChange={(e) => setFreeShipInput(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-neutral-700 font-bold mb-1">
                      Standard Shipping Fee (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={standardShipInput}
                      onChange={(e) => setStandardShipInput(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
                >
                  Save Store Settings
                </button>

                {/* Centralized WhatsApp Handover Guidance */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 space-y-2 mt-6">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold uppercase text-[11px]">
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                    <span>WhatsApp Handover &amp; Permanent Configuration</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] font-light leading-relaxed">
                    The store's official WhatsApp Business number is centralized in <strong>src/config/brandConfig.ts</strong>.
                    When handing over to your client, you can either update it above live, or open <code>src/config/brandConfig.ts</code> and edit <code>WHATSAPP_CONFIG.phoneNumber</code>. All orders, concierge links, and buttons throughout the entire website will automatically point to the client's number with +91 country code formatting.
                  </p>
                  <div className="text-[11px] text-emerald-950 font-bold">
                    Currently Formatted for WhatsApp API: <span className="underline font-mono">{formatDisplayWhatsAppNumber(whatsAppInput)}</span>
                  </div>
                </div>

                {/* Secure Admin Credentials Update Section */}
                <div className="pt-6 border-t border-neutral-300 space-y-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-neutral-800" />
                    <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-900 font-display">
                      Change Administrator Account Credentials
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-600 font-light leading-relaxed">
                    Update the credentials used to log into this private Admin Dashboard and execute Google Sheets synchronizations.
                  </p>

                  {credMessage && (
                    <div
                      className={`p-3 text-xs border ${
                        credMessage.type === 'success'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                      }`}
                    >
                      {credMessage.text}
                    </div>
                  )}

                  <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-200">
                    <div>
                      <label className="block uppercase text-neutral-700 text-[11px] font-bold mb-1">
                        Current Admin Password *
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password to verify identity"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase text-neutral-700 text-[11px] font-bold mb-1">
                          New Admin Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="client-admin@domain.com"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block uppercase text-neutral-700 text-[11px] font-bold mb-1">
                          New Admin Password (Min 8 characters)
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleUpdateAdminCredentials}
                        disabled={isUpdatingCreds}
                        className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isUpdatingCreds ? 'Updating Server...' : 'Update Admin Credentials'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

          </div>

          {/* Add / Edit Product Modal */}
          {showAddProductModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
              <div className="relative w-full max-w-xl bg-white border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-display">
                    {editingProductId ? 'Edit Product Silhouette' : 'Create New Silhouette'}
                  </h3>
                  <button onClick={() => setShowAddProductModal(false)}>
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block uppercase text-neutral-600 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. Chennai Veedhi Kalai Tamil Typography Tee"
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase text-neutral-600 mb-1">Category</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black uppercase"
                      >
                        <option value="tamil">Tamil Typography T-shirts</option>
                        <option value="oversized">Oversized Streetwear T-shirts</option>
                        <option value="anime">Anime T-shirts</option>
                        <option value="culture">Indian Culture T-shirts</option>
                        <option value="desi">Desi Graphic T-shirts</option>
                        <option value="minimalist">Minimalist T-shirts</option>
                        <option value="couple">Couple T-shirts</option>
                        <option value="college">College Fashion T-shirts</option>
                        <option value="retro">Retro Vintage T-shirts</option>
                        <option value="festival">Festival Special T-shirts</option>
                        <option value="custom">Custom Printed T-shirts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase text-neutral-600 mb-1">Selling Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase text-neutral-600 mb-1">Fabric Weight</label>
                      <input
                        type="text"
                        value={prodWeight}
                        onChange={(e) => setProdWeight(e.target.value)}
                        placeholder="e.g. 320 GSM Bio-Washed Cotton"
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-neutral-600 mb-1">Original Price / MRP (₹)</label>
                      <input
                        type="number"
                        value={prodOriginalPrice || ''}
                        onChange={(e) => setProdOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Optional strikethrough price"
                        className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-600 mb-1">Image URL / Path</label>
                    <input
                      type="text"
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-600 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(false)}
                      className="px-4 py-2 border border-neutral-300 uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-black text-white uppercase font-bold hover:bg-neutral-800"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

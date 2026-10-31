/**
 * ============================================================================
 * FULL-STACK EXPRESS SERVER — AETHER DESI ATELIER
 * ============================================================================
 * 
 * Provides:
 * 1. Secure Admin Authentication (Email & Password, Session Token, Rate Limiting)
 * 2. Protected Google Sheets Sync API (Restricted strictly to authenticated admins)
 * 3. Vite development middlewares (in dev) / Static production build serving
 * ============================================================================
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ----------------------------------------------------------------------------
// SERVER-SIDE ADMIN CREDENTIALS & SESSION STORE
// ----------------------------------------------------------------------------
let currentAdminConfig = {
  email: process.env.ADMIN_EMAIL || 'admin@aetherdesi.in',
  // Password can be overridden via env var ADMIN_PASSWORD
  password: process.env.ADMIN_PASSWORD || 'AetherAdmin@2026',
  name: 'Store Administrator',
  role: 'SUPER_ADMIN' as const,
};

interface ActiveSession {
  token: string;
  email: string;
  expiresAt: number;
  createdAt: number;
}

// Active in-memory session tokens
const activeSessions = new Map<string, ActiveSession>();

// Rate-limiting for failed login attempts (max 5 failed attempts per IP per 15 minutes)
interface LoginAttempt {
  count: number;
  resetAt: number;
}
const loginAttempts = new Map<string, LoginAttempt>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// Helper to sanitize IP
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

// Admin Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin session token required to access this resource.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired admin session token. Please log in again.',
    });
    return;
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    res.status(401).json({
      success: false,
      error: 'Session expired: Your 8-hour admin session has expired. Please log in again.',
    });
    return;
  }

  // Session is valid
  next();
}

// ----------------------------------------------------------------------------
// ADMIN AUTHENTICATION API ROUTES
// ----------------------------------------------------------------------------

/**
 * POST /api/admin/login
 * Validates admin credentials with rate-limiting and issues a secure 8-hour session token
 */
app.post('/api/admin/login', (req: Request, res: Response): void => {
  const clientIp = getClientIp(req);
  const now = Date.now();

  // Check rate limiting
  const attemptRecord = loginAttempts.get(clientIp);
  if (attemptRecord) {
    if (now < attemptRecord.resetAt && attemptRecord.count >= MAX_FAILED_ATTEMPTS) {
      const minutesLeft = Math.ceil((attemptRecord.resetAt - now) / 60000);
      res.status(429).json({
        success: false,
        error: `Too many failed login attempts. For security, access is locked for ${minutesLeft} more minute(s).`,
      });
      return;
    }
    if (now >= attemptRecord.resetAt) {
      loginAttempts.delete(clientIp);
    }
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required.' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const targetEmail = currentAdminConfig.email.toLowerCase();

  const isEmailMatch = cleanEmail === targetEmail;
  const isPasswordMatch = String(password) === currentAdminConfig.password;

  if (!isEmailMatch || !isPasswordMatch) {
    // Record failed attempt
    const current = loginAttempts.get(clientIp) || { count: 0, resetAt: now + LOCKOUT_DURATION_MS };
    current.count += 1;
    loginAttempts.set(clientIp, current);

    const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - current.count);
    res.status(401).json({
      success: false,
      error: `Invalid admin email or password. (${remaining} attempts remaining before temporary lockout)`,
    });
    return;
  }

  // Reset failed attempts on success
  loginAttempts.delete(clientIp);

  // Generate a cryptographically secure 256-bit session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = now + SESSION_DURATION_MS;

  activeSessions.set(token, {
    token,
    email: currentAdminConfig.email,
    expiresAt,
    createdAt: now,
  });

  res.json({
    success: true,
    token,
    expiresAt,
    admin: {
      email: currentAdminConfig.email,
      name: currentAdminConfig.name,
      role: currentAdminConfig.role,
    },
    message: 'Admin authentication successful.',
  });
});

/**
 * GET /api/admin/verify
 * Validates if the current Bearer token is active
 */
app.get('/api/admin/verify', requireAdminAuth, (req: Request, res: Response): void => {
  const token = req.headers.authorization!.split(' ')[1];
  const session = activeSessions.get(token)!;

  res.json({
    authenticated: true,
    admin: {
      email: session.email,
      name: currentAdminConfig.name,
      role: currentAdminConfig.role,
    },
    expiresAt: session.expiresAt,
    expiresInMinutes: Math.round((session.expiresAt - Date.now()) / 60000),
  });
});

/**
 * POST /api/admin/logout
 * Destroys the active session token
 */
app.post('/api/admin/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * POST /api/admin/update-credentials
 * Allows authenticated admin to change their admin email and password
 */
app.post('/api/admin/update-credentials', requireAdminAuth, (req: Request, res: Response): void => {
  const { currentPassword, newEmail, newPassword } = req.body;

  if (!currentPassword) {
    res.status(400).json({ success: false, error: 'Current password is required to make changes.' });
    return;
  }

  if (currentPassword !== currentAdminConfig.password) {
    res.status(401).json({ success: false, error: 'Incorrect current password.' });
    return;
  }

  if (newEmail && typeof newEmail === 'string' && newEmail.includes('@')) {
    currentAdminConfig.email = newEmail.trim();
  }

  if (newPassword && typeof newPassword === 'string' && newPassword.length >= 8) {
    currentAdminConfig.password = newPassword.trim();
  } else if (newPassword) {
    res.status(400).json({ success: false, error: 'New password must be at least 8 characters long.' });
    return;
  }

  res.json({
    success: true,
    message: 'Admin credentials updated successfully.',
    admin: {
      email: currentAdminConfig.email,
      name: currentAdminConfig.name,
      role: currentAdminConfig.role,
    },
  });
});

// ----------------------------------------------------------------------------
// PROTECTED GOOGLE SHEETS SYNC ENDPOINT (SERVER-SIDE PROXY)
// ----------------------------------------------------------------------------

/**
 * POST /api/admin/sync-sheets
 * Protected server-side proxy that fetches, parses, and sanitizes Google Sheets data.
 * Ordinary customers CANNOT invoke this endpoint.
 */
app.post('/api/admin/sync-sheets', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { sheetUrl } = req.body;
    if (!sheetUrl || typeof sheetUrl !== 'string') {
      res.status(400).json({ success: false, error: 'Valid Google Sheet URL or ID is required.' });
      return;
    }

    // Extract Sheet ID
    let sheetId = sheetUrl.trim();
    const idMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (idMatch && idMatch[1]) {
      sheetId = idMatch[1];
    }

    // Try Google Visualization API export endpoint first
    const endpoints = [
      `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
      `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    ];

    let csvText = '';
    let fetchError = '';

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'AetherAtelier-SyncEngine/1.0',
          },
        });
        if (response.ok) {
          csvText = await response.text();
          if (csvText && csvText.trim().length > 20) {
            break;
          }
        }
      } catch (err: any) {
        fetchError = err.message || String(err);
      }
    }

    if (!csvText || csvText.trim().length < 20) {
      res.status(422).json({
        success: false,
        error: `Could not fetch spreadsheet data. Please verify that the Google Sheet is shared with "Anyone with the link can view". ${fetchError ? `(${fetchError})` : ''}`,
      });
      return;
    }

    // Server-side CSV parser
    const rows: string[][] = parseCsv(csvText);
    if (rows.length < 2) {
      res.status(422).json({
        success: false,
        error: 'Spreadsheet appears to be empty or missing data rows.',
      });
      return;
    }

    const headers = rows[0].map((h) => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));

    // Map column indices
    const colIndex = {
      id: findHeaderIndex(headers, ['productid', 'id', 'itemid']),
      name: findHeaderIndex(headers, ['productname', 'name', 'title']),
      description: findHeaderIndex(headers, ['productdescription', 'description', 'desc']),
      images: findHeaderIndex(headers, ['productimages', 'imageurls', 'images', 'image']),
      originalPrice: findHeaderIndex(headers, ['originalprice', 'mrp', 'price', 'original']),
      discountPercentage: findHeaderIndex(headers, ['discountpercentage', 'discount', 'off']),
      finalSellingPrice: findHeaderIndex(headers, ['finalsellingprice', 'sellingprice', 'finalprice', 'saleprice']),
      category: findHeaderIndex(headers, ['category', 'cat', 'collection']),
      sizes: findHeaderIndex(headers, ['availablesizes', 'sizes', 'size']),
      colors: findHeaderIndex(headers, ['availablecolors', 'colors', 'color']),
      stock: findHeaderIndex(headers, ['stockquantity', 'stock', 'inventory', 'quantity', 'qty']),
      availability: findHeaderIndex(headers, ['productavailability', 'availability', 'status']),
      productType: findHeaderIndex(headers, ['producttype', 'type', 'fit']),
      featured: findHeaderIndex(headers, ['featuredproduct', 'featured']),
      newArrival: findHeaderIndex(headers, ['newarrival', 'new']),
    };

    const parsedProducts = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || row.every((c) => !c.trim())) continue;

      const rawName = getColVal(row, colIndex.name);
      if (!rawName) continue;

      const rawId = getColVal(row, colIndex.id) || `prod-sheet-${i}`;
      const rawDesc = getColVal(row, colIndex.description) || 'Premium 320 GSM combed cotton T-shirt from Tiruppur.';
      const rawImages = getColVal(row, colIndex.images);
      const rawOrig = parseFloat(getColVal(row, colIndex.originalPrice).replace(/[^0-9.]/g, '')) || 899;
      const rawDisc = parseFloat(getColVal(row, colIndex.discountPercentage).replace(/[^0-9.]/g, '')) || 0;
      let rawFinal = parseFloat(getColVal(row, colIndex.finalSellingPrice).replace(/[^0-9.]/g, '')) || 0;

      // Calculate final selling price if not provided
      if (!rawFinal || rawFinal <= 0) {
        if (rawDisc > 0) {
          rawFinal = Math.round(rawOrig * (1 - rawDisc / 100));
        } else {
          rawFinal = rawOrig;
        }
      }

      const rawCategory = getColVal(row, colIndex.category).toLowerCase();
      const rawSizes = getColVal(row, colIndex.sizes) || 'S, M, L, XL, XXL';
      const rawColors = getColVal(row, colIndex.colors) || 'Onyx Black:#111111, Chalk White:#f6f5f0';
      const rawStock = parseInt(getColVal(row, colIndex.stock).replace(/[^0-9]/g, ''), 10) || 50;
      const rawAvail = getColVal(row, colIndex.availability).toLowerCase();
      const isOutOfStock = rawAvail.includes('out') || rawStock <= 0;

      const parsedSizes = rawSizes.split(/[,/|]+/).map((s) => s.trim().toUpperCase()).filter((s) => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(s));
      const validSizes = parsedSizes.length > 0 ? parsedSizes : ['S', 'M', 'L', 'XL'];

      const parsedImages = rawImages
        ? rawImages.split(/[\n,]+/).map((img) => img.trim()).filter((img) => img.startsWith('http') || img.startsWith('/'))
        : ['/images/desi_tamil_streetwear_tee_1793442456883.jpg'];

      // Stock distribution
      const stockMap: Record<string, number> = {};
      const perSizeStock = Math.max(0, Math.floor(rawStock / validSizes.length));
      validSizes.forEach((sz) => {
        stockMap[sz] = isOutOfStock ? 0 : perSizeStock;
      });

      parsedProducts.push({
        id: rawId,
        name: rawName,
        slug: rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: rawDesc,
        price: rawFinal,
        originalPrice: rawOrig > rawFinal ? rawOrig : undefined,
        images: parsedImages,
        category: mapCategory(rawCategory),
        sizes: validSizes,
        colors: parseColors(rawColors),
        stock: stockMap,
        availability: isOutOfStock ? 'Out of Stock' : 'In Stock',
        rating: 4.8,
        reviewCount: 42,
        gender: 'unisex',
        fabricSpecs: {
          weight: '320 GSM Heavyweight Bio-Washed',
          composition: '100% Super-Combed Indian Organic Cotton',
          weave: 'Compact Single Jersey Knit',
          care: 'Machine wash cold inside out, dry in shade',
          origin: 'Tiruppur, Tamil Nadu',
        },
        fitAdvice: 'Engineered oversized drape with dropped shoulders. Order true size for relaxed streetwear drape.',
        isNewArrival: getColVal(row, colIndex.newArrival).toLowerCase().startsWith('y'),
        isBestseller: getColVal(row, colIndex.featured).toLowerCase().startsWith('y'),
        tags: [rawCategory, 'streetwear', 'desi'],
      });
    }

    res.json({
      success: true,
      count: parsedProducts.length,
      products: parsedProducts,
      syncedAt: new Date().toISOString(),
      message: `Successfully synced ${parsedProducts.length} products from Google Sheet.`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: `Server sync failed: ${error.message || String(error)}`,
    });
  }
});

// CSV parser helper
function parseCsv(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const result: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let inQuotes = false;
    let field = '';

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' || char === "'") {
        if (inQuotes && line[j + 1] === char) {
          field += char;
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    row.push(field.trim());
    result.push(row);
  }
  return result;
}

function findHeaderIndex(headers: string[], searchTerms: string[]): number {
  return headers.findIndex((h) => searchTerms.some((term) => h.includes(term)));
}

function getColVal(row: string[], idx: number): string {
  if (idx < 0 || idx >= row.length) return '';
  return row[idx]?.trim() || '';
}

function mapCategory(rawCat: string): string {
  if (rawCat.includes('tamil')) return 'tamil';
  if (rawCat.includes('desi') || rawCat.includes('retro') || rawCat.includes('bollywood')) return 'desi';
  if (rawCat.includes('anime')) return 'anime';
  if (rawCat.includes('culture') || rawCat.includes('heritage')) return 'culture';
  if (rawCat.includes('oversized') || rawCat.includes('street')) return 'oversized';
  if (rawCat.includes('couple')) return 'couple';
  if (rawCat.includes('minimal')) return 'minimalist';
  return 'all';
}

function parseColors(colorStr: string) {
  const parts = colorStr.split(/[,/|]+/);
  const colors = [];
  for (const p of parts) {
    const clean = p.trim();
    if (!clean) continue;
    if (clean.includes(':')) {
      const [name, hex] = clean.split(':');
      colors.push({ name: name.trim(), hex: hex.trim() });
    } else {
      colors.push({ name: clean, hex: '#111111' });
    }
  }
  return colors.length > 0 ? colors : [{ name: 'Onyx Black', hex: '#111111' }];
}

// Public configuration route (no secrets)
app.get('/api/public/config', (req: Request, res: Response) => {
  res.json({
    storeName: 'AETHER DESI ATELIER',
    whatsAppNumber: '98876543210',
    countryCode: '+91',
    freeShippingThreshold: 999,
  });
});

// ----------------------------------------------------------------------------
// VITE DEV MIDDLEWARES OR PRODUCTION STATIC SERVING
// ----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Aether Atelier Server] Running on http://localhost:${PORT}`);
    console.log(`[Admin Security] Protected endpoints active at /api/admin/*`);
  });
}

// Export app for Vercel Serverless Function
export default app;

// Only start the standalone HTTP listener when not running inside Vercel
if (!process.env.VERCEL) {
  startServer();
}

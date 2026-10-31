import { Product, CategoryType } from '../types';

export interface SheetParseResult {
  products: Product[];
  totalRows: number;
  validRows: number;
  error?: string;
  syncedAt: string;
}

// Fallback images in case sheet doesn't specify images or URL is broken
const FALLBACK_IMAGES = [
  '/images/desi_tamil_streetwear_tee_1793442456883.jpg',
  '/images/desi_retro_graphic_tee_1793442458879.jpg',
  '/images/desi_anime_fusion_tee_1793442457665.jpg',
  '/images/lookbook_oversized_black_tee_1793441452338.jpg',
  '/images/lookbook_minimalist_white_tee_1793441452252.jpg',
];

/**
 * Extracts Google Sheet ID from URL or returns clean ID
 */
export function extractGoogleSheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // If already pure alphanumeric ID
  if (/^[a-zA-Z0-9-_]{20,60}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle standard Google Sheets URL: /spreadsheets/d/ID/edit
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // Handle published web url: /spreadsheets/d/e/2PACX-.../pub
  const pubMatch = trimmed.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (pubMatch && pubMatch[1]) {
    return pubMatch[1];
  }

  return trimmed;
}

/**
 * Robust CSV parser that handles quotes, escaped commas and linebreaks
 */
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(current.trim());
      if (row.length > 0 && row.some((field) => field.length > 0)) {
        lines.push(row);
      }
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some((field) => field.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

/**
 * Map freeform category text to typed categories
 */
function normalizeCategory(catStr: string): CategoryType {
  const clean = (catStr || '').toLowerCase();
  if (clean.includes('tamil')) return 'tamil';
  if (clean.includes('anime')) return 'anime';
  if (clean.includes('culture') || clean.includes('indian')) return 'culture';
  if (clean.includes('desi') || clean.includes('bollywood')) return 'desi';
  if (clean.includes('minimal')) return 'minimalist';
  if (clean.includes('couple')) return 'couple';
  if (clean.includes('college')) return 'college';
  if (clean.includes('retro') || clean.includes('vintage')) return 'retro';
  if (clean.includes('festival')) return 'festival';
  if (clean.includes('custom')) return 'custom';
  if (clean.includes('women')) return 'women';
  if (clean.includes('men')) return 'men';
  if (clean.includes('limited')) return 'limited';
  return 'oversized';
}

/**
 * Parse sizes string (e.g. "S, M, L, XL" or "XS,S,M,L,XL,XXL")
 */
function parseSizes(sizesStr: string): ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[] {
  if (!sizesStr) return ['S', 'M', 'L', 'XL'];
  const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const tokens = sizesStr
    .split(/[,/|\s]+/)
    .map((s) => s.trim().toUpperCase())
    .filter((s) => validSizes.includes(s));

  return tokens.length > 0 ? (tokens as any) : ['S', 'M', 'L', 'XL'];
}

/**
 * Parse colors into structured color array
 */
function parseColors(colorsStr: string) {
  if (!colorsStr) {
    return [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Chalk White', hex: '#f7f6f1' },
    ];
  }

  const items = colorsStr.split(/[,/|]+/).map((c) => c.trim()).filter(Boolean);
  if (items.length === 0) {
    return [{ name: 'Black', hex: '#111111' }];
  }

  const colorHexMap: Record<string, string> = {
    black: '#111111',
    white: '#f8f8f6',
    charcoal: '#2e2e2e',
    grey: '#888888',
    gray: '#888888',
    navy: '#1b263b',
    red: '#c1121f',
    maroon: '#660708',
    olive: '#585d4c',
    beige: '#e3d5ca',
    sand: '#cfc1a5',
    sage: '#879482',
    yellow: '#fcbf49',
    orange: '#f77f00',
    blue: '#0077b6',
  };

  return items.map((colorName) => {
    const key = colorName.toLowerCase();
    const hex = colorHexMap[key] || (key.startsWith('#') ? key : '#222222');
    return { name: colorName, hex };
  });
}

/**
 * Clean numeric string from symbols (₹, $, %, commas)
 */
function cleanNumber(val: string | number | undefined, defaultVal = 0): number {
  if (typeof val === 'number') return val;
  if (!val) return defaultVal;
  const cleaned = val.toString().replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? defaultVal : parsed;
}

/**
 * Fetches and parses Google Sheet into verified Product objects
 */
export async function fetchProductsFromGoogleSheet(sheetUrlOrId: string): Promise<SheetParseResult> {
  const sheetId = extractGoogleSheetId(sheetUrlOrId);
  const now = new Date().toISOString();

  if (!sheetId) {
    return {
      products: [],
      totalRows: 0,
      validRows: 0,
      error: 'Invalid Google Sheet URL or ID provided.',
      syncedAt: now,
    };
  }

  // Multiple candidate URL schemes for Google Sheets CSV exports
  const urlCandidates = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    sheetUrlOrId.includes('output=csv') ? sheetUrlOrId : '',
  ].filter(Boolean);

  let csvContent = '';
  let fetchError = '';

  for (const url of urlCandidates) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'text/csv, text/plain, */*' },
      });
      if (response.ok) {
        const text = await response.text();
        if (text && text.includes(',')) {
          csvContent = text;
          break;
        }
      }
    } catch (err: any) {
      fetchError = err?.message || 'Network error fetching Google Sheet';
    }
  }

  if (!csvContent) {
    return {
      products: [],
      totalRows: 0,
      validRows: 0,
      error: `Could not fetch Google Sheet. Please make sure the sheet is public ("Anyone with the link can view"). ${fetchError}`,
      syncedAt: now,
    };
  }

  const rows = parseCSV(csvContent);
  if (rows.length < 2) {
    return {
      products: [],
      totalRows: rows.length,
      validRows: 0,
      error: 'Google Sheet appears empty or contains only a header row.',
      syncedAt: now,
    };
  }

  // Header mapping
  const headers = rows[0].map((h) => h.toLowerCase().trim().replace(/[^a-z0-9]/g, ''));

  const findCol = (keywords: string[]) => {
    return headers.findIndex((h) => keywords.some((k) => h.includes(k)));
  };

  const idCol = findCol(['productid', 'id', 'sku', 'code']);
  const nameCol = findCol(['productname', 'name', 'title', 'product']);
  const descCol = findCol(['description', 'desc', 'details', 'about']);
  const imgCol = findCol(['image', 'images', 'imageurl', 'photo', 'url']);
  const origPriceCol = findCol(['originalprice', 'mrp', 'price', 'original']);
  const discountCol = findCol(['discount', 'discountpercentage', 'offer', 'off']);
  const finalPriceCol = findCol(['finalsellingprice', 'sellingprice', 'finalprice', 'final']);
  const catCol = findCol(['category', 'collection', 'type', 'genre']);
  const sizeCol = findCol(['availablesizes', 'sizes', 'size']);
  const colorCol = findCol(['availablecolors', 'colors', 'color']);
  const stockCol = findCol(['stockquantity', 'stock', 'quantity', 'qty']);
  const availCol = findCol(['productavailability', 'availability', 'status', 'instock']);
  const typeCol = findCol(['producttype', 'fit', 'fabric']);
  const featCol = findCol(['featuredproduct', 'featured', 'isfeatured']);
  const newCol = findCol(['newarrival', 'new', 'isnew']);

  const parsedProducts: Product[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Skip empty lines
    if (!row || row.length === 0 || !row.some((cell) => cell.length > 0)) continue;

    const name = (nameCol !== -1 ? row[nameCol] : '') || row[1] || '';
    if (!name || name.trim().length === 0) continue;

    const id = (idCol !== -1 ? row[idCol] : '') || `GS-${r}`;
    const description = (descCol !== -1 ? row[descCol] : '') ||
      'Heavyweight Indian street cotton t-shirt. 300 GSM bio-washed ring-spun combed cotton.';

    // Images
    const rawImages = (imgCol !== -1 ? row[imgCol] : '') || '';
    let images: string[] = [];
    if (rawImages) {
      images = rawImages
        .split(/[,;\n]+/)
        .map((img) => img.trim())
        .filter((img) => img.startsWith('http') || img.startsWith('/'));
    }
    if (images.length === 0) {
      images = [FALLBACK_IMAGES[(r - 1) % FALLBACK_IMAGES.length]];
    }

    // Pricing
    const origPriceVal = cleanNumber(origPriceCol !== -1 ? row[origPriceCol] : undefined, 799);
    const discountVal = cleanNumber(discountCol !== -1 ? row[discountCol] : undefined, 0);
    let finalPriceVal = cleanNumber(finalPriceCol !== -1 ? row[finalPriceCol] : undefined, 0);

    if (finalPriceVal === 0) {
      if (discountVal > 0) {
        finalPriceVal = Math.round(origPriceVal * (1 - discountVal / 100));
      } else {
        finalPriceVal = origPriceVal;
      }
    }

    const effectiveOriginalPrice = origPriceVal > finalPriceVal ? origPriceVal : undefined;

    // Stock & Availability
    const stockQty = cleanNumber(stockCol !== -1 ? row[stockCol] : undefined, 20);
    const availText = (availCol !== -1 ? row[availCol] : '').toLowerCase();
    const isOutOfStock = stockQty <= 0 || availText.includes('out') || availText === 'no';

    // Sizes & Colors
    const sizes = parseSizes(sizeCol !== -1 ? row[sizeCol] : 'S, M, L, XL');
    const colors = parseColors(colorCol !== -1 ? row[colorCol] : 'Black, White');

    // Build per-size stock distribution
    const stockDist: Record<string, number> = {};
    const perSize = isOutOfStock ? 0 : Math.max(1, Math.floor(stockQty / sizes.length));
    sizes.forEach((sz) => {
      stockDist[sz] = perSize;
    });

    const categoryText = (catCol !== -1 ? row[catCol] : '') || 'oversized';
    const normalizedCat = normalizeCategory(categoryText);

    const featText = (featCol !== -1 ? row[featCol] : '').toLowerCase();
    const newText = (newCol !== -1 ? row[newCol] : '').toLowerCase();

    const product: Product = {
      id: id.startsWith('prod-') || id.startsWith('GS-') ? id : `GS-${id}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: normalizedCat,
      subCategory: (typeCol !== -1 ? row[typeCol] : '') || 'Heavyweight Streetwear',
      gender: 'unisex',
      price: finalPriceVal,
      originalPrice: effectiveOriginalPrice,
      rating: 4.8 + ((r % 3) * 0.1),
      reviewCount: 30 + ((r * 7) % 120),
      colors,
      sizes,
      images,
      description,
      fabricSpecs: {
        weight: '300 GSM Heavyweight Bio-Washed',
        composition: '100% Super-Combed Indian Cotton',
        weave: 'Single Compact Jersey Knit',
        care: 'Cold machine wash, inside out, do not bleach or iron print',
        origin: 'Tiruppur & Chennai, India',
      },
      fitAdvice: 'Oversized boxy drape. Buy your regular size for drop shoulder fit.',
      isBestseller: featText.includes('yes') || featText.includes('true') || r <= 3,
      isNewArrival: newText.includes('yes') || newText.includes('true') || r % 2 === 0,
      productType: typeCol !== -1 ? row[typeCol] : 'Oversized Tee',
      availability: isOutOfStock ? 'Out of Stock' : 'In Stock',
      stock: stockDist,
      tags: [categoryText, 'Desi Streetwear', '300 GSM', 'Tiruppur Cotton'].filter(Boolean),
    };

    parsedProducts.push(product);
  }

  return {
    products: parsedProducts,
    totalRows: rows.length - 1,
    validRows: parsedProducts.length,
    syncedAt: now,
  };
}

/**
 * Downloads a ready-to-use CSV template with exact required columns
 */
export function downloadGoogleSheetsTemplate() {
  const headers = [
    'Product ID',
    'Product Name',
    'Product Description',
    'Product Images / Image URLs',
    'Original Price (₹)',
    'Discount Percentage',
    'Final Selling Price (₹)',
    'Category',
    'Available Sizes (XS, S, M, L, XL, XXL)',
    'Available Colors',
    'Stock Quantity',
    'Product Availability (In Stock / Out of Stock)',
    'Product Type',
    'Featured Product (Yes / No)',
    'New Arrival (Yes / No)',
  ];

  const sampleRows = [
    [
      '001',
      'Chennai Streetwear Tamil Typography Tee',
      'Chennai veedhi kalai statement streetwear oversized t-shirt in 320 GSM combed cotton.',
      '/images/desi_tamil_streetwear_tee_1793442456883.jpg',
      '899',
      '15%',
      '764',
      'Tamil Typography T-shirts',
      'S, M, L, XL, XXL',
      'Pitch Black, Charcoal Wash',
      '45',
      'In Stock',
      'Oversized Boxy Tee',
      'Yes',
      'Yes',
    ],
    [
      '002',
      'Bombay Talkies Retro Bollywood Graphic Tee',
      'Vintage Bollywood pop art graphic on distressed enzyme-washed cotton.',
      '/images/desi_retro_graphic_tee_1793442458879.jpg',
      '799',
      '10%',
      '719',
      'Desi Graphic T-shirts',
      'XS, S, M, L, XL',
      'Washed Charcoal, Acid Black',
      '30',
      'In Stock',
      'Vintage Graphic Tee',
      'Yes',
      'No',
    ],
    [
      '003',
      'Tokyo x India Anime Fusion Streetwear Tee',
      'High-voltage neon Japanese anime illustration with Desi streetwear sensibilities.',
      '/images/desi_anime_fusion_tee_1793442457665.jpg',
      '849',
      '20%',
      '679',
      'Anime T-shirts',
      'S, M, L, XL, XXL',
      'Chalk White, Bone Cream',
      '25',
      'In Stock',
      'Anime Streetwear',
      'Yes',
      'Yes',
    ],
    [
      '004',
      'Jallikattu Singam Heritage Graphic Tee',
      'Celebration of Tamil bravery and temple brutalist architecture with discharge print.',
      '/images/lookbook_oversized_black_tee_1793441452338.jpg',
      '749',
      '0%',
      '749',
      'Indian Culture T-shirts',
      'S, M, L, XL',
      'Pitch Black, Earth Brown',
      '18',
      'In Stock',
      'Heritage Tee',
      'No',
      'Yes',
    ],
    [
      '005',
      'Filter Kaapi Minimalist Pocket Tee',
      'Minimal brass dabarah coffee outline embroidery with unbleached 300 GSM raw cotton.',
      '/images/lookbook_minimalist_white_tee_1793441452252.jpg',
      '649',
      '0%',
      '649',
      'Minimalist T-shirts',
      'XS, S, M, L, XL',
      'Raw Chalk, Oatmeal Heather',
      '35',
      'In Stock',
      'Minimalist Tee',
      'No',
      'No',
    ],
  ];

  const csvRows = [
    headers.map((h) => `"${h}"`).join(','),
    ...sampleRows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'aether_products_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

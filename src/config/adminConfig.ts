/**
 * ============================================================================
 * ADMIN SECURITY & ACCESS CONFIGURATION
 * ============================================================================
 * 
 * This file documents and configures the security rules for the store's
 * private Admin Dashboard and Google Sheets integration.
 * 
 * KEY SECURITY PRINCIPLES IMPLEMENTED:
 * 1. Zero Public Exposure:
 *    - Admin routes are protected by server-validated Bearer tokens.
 *    - Admin navigation links are completely hidden from regular customers.
 *    - Direct URL access to /admin enforces server-side authentication.
 * 
 * 2. Session Security:
 *    - Admin sessions expire automatically after 8 hours.
 *    - Session tokens are cryptographically generated on the backend.
 *    - Token revocation on Logout.
 * 
 * 3. Server-Side Google Sheets Proxy:
 *    - Spreadsheet fetching is proxied through the server (`/api/admin/sync-sheets`).
 *    - No Google API keys or credentials exposed in frontend code.
 *    - Unauthorized visitors cannot trigger sheet sync or modify data.
 * 
 * 4. How to Change Admin Credentials on Handover:
 *    - You can update credentials directly via the Admin Dashboard > Settings tab.
 *    - Or specify environment variables in `.env`:
 *      ADMIN_EMAIL="client-admin@domain.com"
 *      ADMIN_PASSWORD="YourSecurePasswordHere"
 * ============================================================================
 */

export interface AdminSession {
  token: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN';
  expiresAt: number; // UNIX timestamp in ms
}

export const ADMIN_CONFIG = {
  // Default Initial Admin Credentials
  // NOTE: You can change these immediately after initial login via Admin Settings
  defaultEmail: 'admin@aetherdesi.in',
  defaultInitialPassword: 'AetherAdmin@2026', // Initial setup password

  // Session Duration (8 hours in milliseconds)
  sessionDurationMs: 8 * 60 * 60 * 1000,

  // Local Storage Key for storing authenticated token
  sessionStorageKey: 'aether_admin_secure_token',
  sessionMetaKey: 'aether_admin_secure_meta',

  // API Endpoints
  endpoints: {
    login: '/api/admin/login',
    verify: '/api/admin/verify',
    logout: '/api/admin/logout',
    updateCredentials: '/api/admin/update-credentials',
    syncSheets: '/api/admin/sync-sheets',
    publicConfig: '/api/public/config',
  },
};

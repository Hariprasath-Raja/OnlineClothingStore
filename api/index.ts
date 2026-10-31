import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// Admin credentials
let currentAdminConfig = {
  email: process.env.ADMIN_EMAIL || 'admin@aetherdesi.in',
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

const activeSessions = new Map<string, ActiveSession>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: Admin session token required.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token.' });
    return;
  }
  next();
}

// POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response): void => {
  const clientIp = getClientIp(req);
  const now = Date.now();

  const attemptRecord = loginAttempts.get(clientIp);
  if (attemptRecord) {
    if (now < attemptRecord.resetAt && attemptRecord.count >= MAX_FAILED_ATTEMPTS) {
      const minutesLeft = Math.ceil((attemptRecord.resetAt - now) / 60000);
      res.status(429).json({
        success: false,
        error: `Too many failed login attempts. Locked for ${minutesLeft} more minute(s).`,
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
    const current = loginAttempts.get(clientIp) || { count: 0, resetAt: now + LOCKOUT_DURATION_MS };
    current.count += 1;
    loginAttempts.set(clientIp, current);
    const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - current.count);
    res.status(401).json({
      success: false,
      error: `Invalid admin email or password. (${remaining} attempts remaining)`,
    });
    return;
  }

  loginAttempts.delete(clientIp);

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

// GET /api/admin/verify
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
  });
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/public/config
app.get('/api/public/config', (req: Request, res: Response) => {
  res.json({
    storeName: 'AETHER DESI ATELIER',
    whatsAppNumber: '98876543210',
    countryCode: '+91',
    freeShippingThreshold: 999,
  });
});

export default app;

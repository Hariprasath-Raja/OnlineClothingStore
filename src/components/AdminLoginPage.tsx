import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ADMIN_CONFIG } from '../config/adminConfig';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onCancel }) => {
  const { setAdminToken, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(ADMIN_CONFIG.endpoints.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
        showToast(data.error || 'Invalid admin credentials', 'error');
        setLoading(false);
        return;
      }

      // Successful server authentication
      setAdminToken(data.token, data.expiresAt, data.admin);
      showToast('Admin session verified. Welcome back.', 'success');
      onSuccess();
    } catch (err: any) {
      setError('Unable to reach authentication server. Please ensure the server is active.');
      showToast('Network error during admin login', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoCreds = () => {
    setEmail(ADMIN_CONFIG.defaultEmail);
    setPassword(ADMIN_CONFIG.defaultInitialPassword);
    setShowHints(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121212] border border-neutral-800 text-white shadow-2xl p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                Private Portal
              </div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-white font-display">
                Atelier Administration
              </h2>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 space-y-1.5 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>End-to-End Restricted Access</span>
          </div>
          <p className="text-neutral-400 text-[11px] font-light leading-relaxed">
            This dashboard controls Google Sheets sync, product catalogs, and inventory. All operations require an authenticated 8-hour administrator token.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/60 border border-rose-800 p-3 text-xs font-mono text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block uppercase tracking-wider text-neutral-400 mb-1.5 text-[11px]">
              Administrator Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aetherdesi.in"
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block uppercase tracking-wider text-neutral-400 text-[11px]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-400 hover:text-white text-[10px] flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating Server...</span>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verify &amp; Unlock Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Initial Setup Credentials Dropdown for Developer & Client */}
        <div className="pt-2 border-t border-neutral-800 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="w-full flex items-center justify-between text-neutral-400 hover:text-neutral-200 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
              <span>Default Initial Setup Credentials</span>
            </span>
            <span className="text-[10px] uppercase underline">
              {showHints ? 'Hide' : 'Reveal'}
            </span>
          </button>

          {showHints && (
            <div className="mt-2.5 p-3 bg-neutral-900 border border-neutral-800 space-y-2 text-neutral-300">
              <div className="text-[10px] uppercase text-emerald-400 font-bold">
                Initial Account (Change after login in Admin Settings):
              </div>
              <div className="space-y-1 text-[11px]">
                <div>Email: <code className="text-white bg-black px-1.5 py-0.5 rounded">{ADMIN_CONFIG.defaultEmail}</code></div>
                <div>Password: <code className="text-white bg-black px-1.5 py-0.5 rounded">{ADMIN_CONFIG.defaultInitialPassword}</code></div>
              </div>
              <button
                type="button"
                onClick={handleUseDemoCreds}
                className="mt-1 text-[10px] uppercase tracking-wider text-emerald-400 hover:text-emerald-300 underline font-bold"
              >
                Auto-fill initial credentials
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-500" />
            <span>8-Hour Session Expiry</span>
          </div>
          <div>5-Attempt Brute Force Protection</div>
        </div>

      </div>
    </div>
  );
};

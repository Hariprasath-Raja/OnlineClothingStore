import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, LogOut, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    user,
    loginUser,
    logoutUser,
    setIsOrderTrackingOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const displayName = mode === 'register' && name ? name : email.split('@')[0];
    loginUser(email, displayName, false);
    setIsAuthOpen(false);
  };

  const handleGoogleLogin = () => {
    loginUser('client@domain.com', 'Valued Customer', false);
    setIsAuthOpen(false);
  };

  const handleOpenAdmin = () => {
    setIsAuthOpen(false);
    setIsAdminOpen(true);
  };

  const handleOpenOrders = () => {
    setIsAuthOpen(false);
    setIsOrderTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        onClick={() => setIsAuthOpen(false)}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white border border-neutral-300 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
          
          <button
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>

          {user ? (
            /* Logged in state */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold font-display mx-auto">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  {user.name}
                </h3>
                <div className="text-xs font-mono text-neutral-500">{user.email}</div>
                {user.isAdmin && (
                  <span className="inline-block text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 font-bold">
                    Atelier Store Administrator
                  </span>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <button
                  onClick={handleOpenOrders}
                  className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-xs font-mono uppercase tracking-wider text-neutral-900 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>View Order History &amp; Tracking</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {isAdminAuthenticated && (
                  <button
                    onClick={handleOpenAdmin}
                    className="w-full py-2.5 px-4 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Open Store Admin Dashboard</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  logoutUser();
                  setIsAuthOpen(false);
                }}
                className="w-full py-2 text-xs font-mono uppercase tracking-wider text-rose-700 hover:underline flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Login / Register form */
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                  Aether Client Portal
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 font-display">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-xs text-neutral-500 font-light">
                  Access your orders, saved silhouettes, and Style Club benefits.
                </p>
              </div>

              {/* One-click Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 border border-neutral-300 hover:border-black bg-white text-xs font-semibold uppercase tracking-wider text-neutral-800 flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center text-center">
                <div className="border-t border-neutral-200 w-full" />
                <span className="bg-white px-2 text-[10px] font-mono text-neutral-400 uppercase">
                  Or with email
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Christian K."
                      className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-neutral-300 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                >
                  {mode === 'login' ? 'Sign In to Atelier' : 'Create Member Account'}
                </button>
              </form>

              <div className="text-center pt-2 text-xs font-mono">
                {mode === 'login' ? (
                  <button
                    onClick={() => setMode('register')}
                    className="text-neutral-600 hover:text-black underline"
                  >
                    Don't have an account? Register here
                  </button>
                ) : (
                  <button
                    onClick={() => setMode('login')}
                    className="text-neutral-600 hover:text-black underline"
                  >
                    Already registered? Sign in
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === 'admin@gmail.com' && cleanPassword === 'admin123') {
      login({
        name: 'Administrator',
        email: 'admin@gmail.com',
        role: 'Admin',
        code: 'ADM-001',
        company: 'Apparel360',
        isLoggedIn: true
      });
    } else if (cleanEmail === 'staff@gmail.com' && cleanPassword === 'staff123') {
      login({
        name: 'Store Staff',
        email: 'staff@gmail.com',
        role: 'Staff',
        code: 'STAFF-102',
        company: 'Apparel360',
        isLoggedIn: true
      });
    } else {
      setErrorMessage('Invalid email or password. Please check your login credentials.');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans"
      style={{ backgroundColor: '#1B0E06' }}
    >
      {/* Container Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-cream-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Hero / Brand Section (Hidden on mobile, visible on lg screens) */}
        <div className="hidden lg:flex lg:col-span-5 bg-cream-50 p-8 flex-col justify-between border-b lg:border-b-0 lg:border-r border-cream-200 relative">
          
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/apparel360-logo-dark.jpg"
                alt="Apparel360 Logo"
                className="w-12 h-12 rounded-2xl object-cover shadow-lg border border-chocolate-800"
              />
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-black">
                  Apparel360
                </h1>
                <p className="text-[11px] text-chocolate-800 uppercase tracking-widest font-bold mt-1">
                  Garments & Stock ERP
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 text-xs font-bold text-black border border-cream-300">
                <Sparkles className="w-3.5 h-3.5" style={{ color: '#E86526' }} />
                Stock Management System
              </span>
              <h2 className="text-2xl font-black tracking-tight text-black">
                Garments Inventory Portal
              </h2>
              <p className="text-xs text-chocolate-900 font-semibold leading-relaxed">
                Centralized platform to manage garment fabrics, size & color variations, supplier procurement, and fast POS customer billing.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2 text-xs text-black font-bold">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#059669' }} />
                <span>Real-time stock movement & low-stock alerts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#059669' }} />
                <span>Point-of-Sale (POS) counter billing & receipts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#059669' }} />
                <span>Instant LocalStorage offline persistence</span>
              </div>
            </div>
          </div>

          {/* Secure Session Info */}
          <div className="pt-8 border-t border-cream-200 text-xs text-chocolate-900 space-y-0.5 mt-6 lg:mt-0">
            <p className="font-extrabold text-black">Apparel360 ERP</p>
            <p className="text-[11px] font-bold" style={{ color: '#CB4E14' }}>Secure Local Session Authentication</p>
          </div>

        </div>

        {/* Right Form Section (7 Cols on desktop, full width on mobile) */}
        <div className="w-full lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-5 bg-white">
          
          <div>
            {/* Mobile-only Brand Header */}
            <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-cream-200 lg:hidden">
              <img
                src="/apparel360-logo-dark.jpg"
                alt="Apparel360 Logo"
                className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0 border border-chocolate-800"
              />
              <div>
                <h1 className="text-lg font-black tracking-tight leading-none text-black">
                  Apparel360
                </h1>
                <p className="text-[10px] text-chocolate-800 uppercase tracking-wider font-bold mt-0.5">
                  Garments & Stock ERP
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-black">
                Sign in to your Account
              </h3>
              <p className="text-xs text-chocolate-800 font-semibold">
                Enter your email address and password to sign in.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-black text-xs text-black block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#E86526' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 rounded-xl border border-cream-300 focus:border-burnt-500 focus:bg-white text-black outline-none text-xs font-bold transition-all focus:ring-2 focus:ring-burnt-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-black text-xs text-black">Password</label>
                  <span className="text-[11px] text-burnt-700 hover:underline cursor-pointer font-bold">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#845736' }} />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50 rounded-xl border border-cream-300 focus:border-burnt-500 focus:bg-white text-black outline-none text-xs font-bold transition-all focus:ring-2 focus:ring-burnt-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-black font-bold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-burnt-600 focus:ring-burnt-500 border-cream-300"
                  />
                  <span>Keep me logged in on this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-burnt-500 hover:bg-burnt-600 text-white font-black text-sm shadow-lg shadow-burnt-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
                style={{ backgroundColor: '#E86526', color: '#FFFFFF' }}
              >
                <span className="text-white font-black">Sign In</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
};


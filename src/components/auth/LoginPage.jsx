import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const isAdm = selectedRole === 'Admin';
    login({
      name: isAdm ? 'Administrator' : 'Store Staff',
      email: email.trim() || (isAdm ? 'admin@apparel360.com' : 'staff@apparel360.com'),
      role: selectedRole,
      code: isAdm ? 'ADM-001' : 'STAFF-102',
      company: 'Apparel360',
      isLoggedIn: true
    });
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
              <div
                className="flex items-center justify-center w-11 h-11 rounded-2xl text-white shadow-md"
                style={{ backgroundColor: '#E86526', color: '#FFFFFF' }}
              >
                <Layers className="w-6 h-6 text-white" />
              </div>
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
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl text-white shadow-sm shrink-0"
                style={{ backgroundColor: '#E86526' }}
              >
                <Layers className="w-5 h-5 text-white" />
              </div>
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
                Select your role profile and enter your credentials.
              </p>
            </div>

            {/* Quick 1-Click Role Presets */}
            <div className="mt-4 space-y-2">
              <label className="text-[11px] font-black uppercase tracking-wider text-black block">
                Select User Role Profile
              </label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Admin Option */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('Admin')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                    selectedRole === 'Admin'
                      ? 'border-burnt-500 bg-burnt-50 ring-2 ring-burnt-500/30 shadow-sm'
                      : 'border-cream-300 hover:border-cream-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-xs"
                      style={{
                        backgroundColor: selectedRole === 'Admin' ? '#E86526' : '#FFF0EA',
                        color: selectedRole === 'Admin' ? '#FFFFFF' : '#CB4E14'
                      }}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    {selectedRole === 'Admin' && (
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E86526' }} />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-black text-black">Admin Account</div>
                    <div className="text-[10px] text-chocolate-700 font-medium">Full Access (Catalog & Settings)</div>
                  </div>
                </button>

                {/* Staff Option */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('Staff')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                    selectedRole === 'Staff'
                      ? 'border-chocolate-700 bg-chocolate-50 ring-2 ring-chocolate-700/30 shadow-sm'
                      : 'border-cream-300 hover:border-cream-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-xs"
                      style={{
                        backgroundColor: selectedRole === 'Staff' ? '#2A170C' : '#F2E8E1',
                        color: selectedRole === 'Staff' ? '#FFFFFF' : '#2A170C'
                      }}
                    >
                      <UserCheck className="w-4 h-4" />
                    </div>
                    {selectedRole === 'Staff' && (
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#2A170C' }} />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-black text-black">Staff Account</div>
                    <div className="text-[10px] text-chocolate-700 font-medium">POS Sales & Inward Stock</div>
                  </div>
                </button>

              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-black text-xs text-black block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#E86526' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <span className="text-white font-black">Sign In as {selectedRole}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
};


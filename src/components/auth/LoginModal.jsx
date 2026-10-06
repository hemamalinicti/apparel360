import React, { useState } from 'react';
import { X, Lock, Mail, Sparkles, Layers, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
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
      onClose();
    } else if (cleanEmail === 'staff@gmail.com' && cleanPassword === 'staff123') {
      login({
        name: 'Store Staff',
        email: 'staff@gmail.com',
        role: 'Staff',
        code: 'STAFF-102',
        company: 'Apparel360',
        isLoggedIn: true
      });
      onClose();
    } else {
      setErrorMessage('Invalid credentials. Use admin@gmail.com/admin123 or staff@gmail.com/staff123');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(27, 14, 6, 0.8)' }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-cream-300 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-md shrink-0"
              style={{ backgroundColor: '#E86526', color: '#FFFFFF' }}
            >
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-black tracking-tight">System Authentication</h2>
              <p className="text-xs text-chocolate-800 font-bold">Apparel360 ERP</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-chocolate-700 hover:text-black hover:bg-cream-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm bg-white">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email & Password */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="font-black text-xs text-black block mb-1">Email Address</label>
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-burnt-500 focus:ring-2 focus:ring-burnt-500/20 outline-none font-bold bg-cream-50 focus:bg-white text-black text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-black text-xs text-black block mb-1">Password</label>
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
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-burnt-500 focus:ring-2 focus:ring-burnt-500/20 outline-none font-bold bg-cream-50 focus:bg-white text-black text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-burnt-500 hover:bg-burnt-600 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-burnt-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              style={{ backgroundColor: '#E86526', color: '#FFFFFF' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-black text-sm tracking-wide">Sign In</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


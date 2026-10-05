import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Lock, Mail, Sparkles, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login, currentUser } = useApp();

  const [role, setRole] = useState(currentUser.role || 'Admin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState(currentUser.name || (role === 'Admin' ? 'Administrator' : 'Store Staff'));
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleRolePreset = (selectedRole) => {
    setRole(selectedRole);
    setName(selectedRole === 'Admin' ? 'Administrator' : 'Store Staff');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAdm = role === 'Admin';
    login({
      name: name.trim() || (isAdm ? 'Administrator' : 'Store Staff'),
      email: email.trim() || (isAdm ? 'admin@apparel360.com' : 'staff@apparel360.com'),
      role,
      code: isAdm ? 'ADM-001' : 'STAFF-102',
      company: 'Apparel360',
      isLoggedIn: true
    });
    onClose();
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
          
          {/* Role selector buttons */}
          <div className="space-y-1.5">
            <label className="font-black text-xs uppercase tracking-wider text-black block">Choose Role Profile</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRolePreset('Admin')}
                className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                  role === 'Admin'
                    ? 'border-burnt-500 bg-burnt-50 ring-2 ring-burnt-500/30 shadow-sm'
                    : 'border-cream-300 hover:border-cream-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2 rounded-xl flex items-center justify-center shadow-xs"
                    style={{
                      backgroundColor: role === 'Admin' ? '#E86526' : '#FFF0EA',
                      color: role === 'Admin' ? '#FFFFFF' : '#CB4E14'
                    }}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-black text-sm text-black">Admin</span>
                </div>
                <p className="text-xs text-chocolate-800 font-semibold mt-2 leading-tight">Full access (Catalog, Masters, Suppliers)</p>
              </button>

              <button
                type="button"
                onClick={() => handleRolePreset('Staff')}
                className={`p-3.5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                  role === 'Staff'
                    ? 'border-chocolate-700 bg-chocolate-50 ring-2 ring-chocolate-700/30 shadow-sm'
                    : 'border-cream-300 hover:border-cream-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-2 rounded-xl flex items-center justify-center shadow-xs"
                    style={{
                      backgroundColor: role === 'Staff' ? '#2A170C' : '#F2E8E1',
                      color: role === 'Staff' ? '#FFFFFF' : '#2A170C'
                    }}
                  >
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="font-black text-sm text-black">Staff</span>
                </div>
                <p className="text-xs text-chocolate-800 font-semibold mt-2 leading-tight">POS Sales & Purchase Entry</p>
              </button>
            </div>
          </div>

          {/* Name & Email */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="font-black text-xs text-black block mb-1">User Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-burnt-500 focus:ring-2 focus:ring-burnt-500/20 outline-none font-bold bg-cream-50 focus:bg-white text-black text-sm transition-all"
              />
            </div>

            <div>
              <label className="font-black text-xs text-black block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#E86526' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-300 focus:border-burnt-500 focus:ring-2 focus:ring-burnt-500/20 outline-none font-bold bg-cream-50 focus:bg-white text-black text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-black text-xs text-black block mb-1">Password / PIN</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#845736' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <span className="text-white font-black text-sm tracking-wide">Sign In as {role}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


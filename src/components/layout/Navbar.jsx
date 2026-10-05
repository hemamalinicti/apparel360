import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  User,
  RotateCcw,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  Plus,
  ShoppingCart,
  PackagePlus,
  Layers,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = ({ onOpenLogin, onOpenAddProduct, onOpenStockIn, onOpenPOS }) => {
  const {
    currentUser,
    switchRole,
    metrics,
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    globalSearch,
    setGlobalSearch,
    resetToDemoData,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="app-navbar sticky top-0 z-30 px-3 sm:px-6 py-2.5 sm:py-3 transition-all shadow-md shadow-black/30 text-white"
      style={{ backgroundColor: '#2A170C', borderBottom: '1px solid #3A2213', color: '#FFFFFF' }}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto w-full">
        
        {/* Left: Hamburger & Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white hover:bg-chocolate-800 border border-chocolate-700 transition-colors shrink-0 cursor-pointer"
            style={{ backgroundColor: '#1B0E06' }}
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>

          <div
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white shadow-md shrink-0"
            style={{ backgroundColor: '#E86526' }}
          >
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-white truncate">
                Apparel360
              </span>
              <span
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full text-white border hidden sm:inline-block"
                style={{ backgroundColor: '#3A2213', borderColor: '#CB4E14' }}
              >
                Stock Manager
              </span>
            </div>
            <p className="text-[11px] text-white/80 hidden md:block">
              Garments & Apparel Inventory System
            </p>
          </div>
        </div>

        {/* Center: Global Search (Desktop) */}
        <div className="flex-1 max-w-md hidden md:block mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-white/70 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments, SKU, sizes, categories..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (e.target.value) {
                  setActiveTab('products');
                }
              }}
              style={{ backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#4D2F1A' }}
              className="w-full pl-9 pr-4 py-2 text-sm text-white placeholder-white/60 rounded-xl border focus:border-burnt-500 focus:ring-2 focus:ring-burnt-500/20 outline-none transition-all"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white hover:bg-chocolate-800 border border-chocolate-700 transition-colors cursor-pointer"
            style={{ backgroundColor: '#1B0E06' }}
            title="Search Catalog"
          >
            <Search className="w-4 h-4 text-white" />
          </button>

          {/* Quick Action POS Button (Desktop / Tablet) */}
          <button
            onClick={onOpenPOS}
            title="Open POS Register"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-white shadow-sm shadow-burnt-900/30 transition-all transform active:scale-95 whitespace-nowrap cursor-pointer"
            style={{ backgroundColor: '#E86526' }}
          >
            <ShoppingCart className="w-4 h-4 text-white shrink-0" />
            <span>New Sale (POS)</span>
          </button>

          {/* Quick Action Stock In Button (Desktop) */}
          <button
            onClick={onOpenStockIn}
            title="Stock In / Purchase Entry"
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-chocolate-800 text-white hover:bg-chocolate-700 border border-chocolate-700 transition-colors shadow-2xs"
            style={{ backgroundColor: '#2A170C', borderColor: '#3A2213' }}
          >
            <PackagePlus className="w-4 h-4 text-burnt-400" />
            <span>Stock In</span>
          </button>

          {/* Low Stock Alerts Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white hover:bg-chocolate-800 border border-chocolate-700 transition-colors cursor-pointer relative"
              style={{ backgroundColor: '#1B0E06' }}
              title="Inventory Alerts"
            >
              <Bell className="w-4 h-4 text-white" />
              {metrics.lowStockCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9px] font-black text-white rounded-full shadow-sm"
                  style={{ backgroundColor: '#E86526' }}
                >
                  {metrics.lowStockCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-72 sm:w-96 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95"
                style={{
                  backgroundColor: '#1B0E06',
                  border: '2px solid #643F25',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.65)',
                  color: '#FFFFFF'
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-chocolate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-burnt-400" />
                    <h4 className="text-sm font-bold text-white">Inventory Alerts</h4>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: '#CB4E14', color: '#FFFFFF' }}
                  >
                    {metrics.lowStockCount} items low
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-chocolate-800/80 py-1">
                  {metrics.lowStockProducts.length === 0 ? (
                    <div className="py-6 text-center text-white/80 text-xs font-medium">
                      All inventory stock levels are healthy!
                    </div>
                  ) : (
                    metrics.lowStockProducts.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 px-2 hover:bg-chocolate-800/90 rounded-lg flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[180px]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-cream-200">
                            SKU: {item.sku} • {item.size}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: item.stock === 0 ? '#991B1B' : '#C2410C',
                              color: '#FFFFFF'
                            }}
                          >
                            {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2.5 border-t border-chocolate-800 flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('stock');
                      setShowNotifications(false);
                    }}
                    className="text-burnt-400 font-bold hover:underline"
                  >
                    View Stock Ledger &rarr;
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('purchases');
                      setShowNotifications(false);
                    }}
                    className="text-white hover:underline font-semibold"
                  >
                    Create Purchase Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 sm:w-auto sm:h-auto flex items-center justify-center sm:gap-2 p-0 sm:px-2.5 sm:py-1.5 rounded-xl border text-white transition-colors cursor-pointer"
              style={{ backgroundColor: '#1B0E06', borderColor: '#4D2F1A' }}
              title="User Account"
            >
              <div
                className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-black text-xs shrink-0"
                style={{ backgroundColor: '#E86526' }}
              >
                {currentUser.name ? currentUser.name.charAt(0) : 'A'}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-black text-white leading-tight truncate max-w-[100px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cream-200 uppercase tracking-wider font-bold">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/80 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95"
                style={{
                  backgroundColor: '#1B0E06',
                  border: '2px solid #643F25',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
                  color: '#FFFFFF'
                }}
              >
                <div
                  className="p-2.5 rounded-xl mb-2.5"
                  style={{ backgroundColor: '#2A170C', border: '1px solid #4D2F1A' }}
                >
                  <p className="text-sm font-black text-white leading-tight">{currentUser.name}</p>
                  <p className="text-xs text-cream-200 font-medium truncate mt-0.5">{currentUser.email}</p>
                  <span
                    className="inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: '#E86526', color: '#FFFFFF' }}
                  >
                    Role: {currentUser.role} • ID: {currentUser.code || 'ADM-001'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-white hover:bg-chocolate-800 rounded-xl transition-colors font-bold"
                    style={{ backgroundColor: '#2A170C' }}
                  >
                    <User className="w-4 h-4 text-burnt-400" />
                    <span>Switch User / Login</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Reset all garment database to initial sample dataset?')) {
                        resetToDemoData();
                      }
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-amber-200 hover:bg-chocolate-800 rounded-xl transition-colors font-bold"
                    style={{ backgroundColor: '#2A170C' }}
                  >
                    <RotateCcw className="w-4 h-4 text-burnt-400" />
                    <span>Reset Sample Demo Data</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs text-rose-300 hover:bg-rose-950/80 rounded-xl transition-colors font-bold"
                    style={{ backgroundColor: '#3A1010', border: '1px solid #7F1D1D' }}
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Search Row */}
      {showMobileSearch && (
        <div className="md:hidden pt-2.5 mt-2.5 border-t border-chocolate-800 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <Search className="w-4 h-4 text-white/70 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search garments, SKU, sizes, categories..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (e.target.value) {
                  setActiveTab('products');
                }
              }}
              style={{ backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#4D2F1A' }}
              className="w-full pl-9 pr-8 py-2 text-xs text-white placeholder-white/60 rounded-xl border focus:border-burnt-500 outline-none"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

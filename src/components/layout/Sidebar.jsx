import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  ShoppingCart,
  Receipt,
  Sliders,
  BarChart3,
  LogOut,
  X,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, currentUser, metrics, products, logout } = useApp();
  const isAdmin = currentUser.role === 'Admin';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'products',
      label: 'Garments Catalog',
      icon: Shirt,
      badge: products.length,
      adminOnly: false,
    },
    {
      id: 'sales',
      label: 'Sales & Billing (POS)',
      icon: ShoppingCart,
      badge: 'POS',
      badgeColor: 'bg-burnt-500 text-white',
      adminOnly: false,
    },
    {
      id: 'purchases',
      label: 'Purchase Entries',
      icon: Receipt,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'master',
      label: 'Master Setup',
      icon: Sliders,
      badge: 'Master',
      badgeColor: 'bg-cream-200 text-chocolate-800',
      adminOnly: true,
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: BarChart3,
      badge: null,
      adminOnly: false,
    }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-chocolate-950/70 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar shrink-0 shadow-lg shadow-black/25 text-white overflow-y-auto ${
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full flex flex-col justify-between animate-in slide-in-from-left duration-200 shadow-2xl'
            : 'hidden md:flex md:w-64 md:sticky md:top-[61px] md:h-[calc(100vh-61px)] flex-col justify-between z-20'
        }`}
        style={{ backgroundColor: '#1B0E06', borderRight: '1px solid #3A2213', color: '#FFFFFF' }}
      >
        
        {/* Top Section */}
        <div className="p-4 space-y-5">
          
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-chocolate-800 md:hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-burnt-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm text-white">Apparel360</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-chocolate-800 transition-colors"
              title="Close Menu"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-extrabold uppercase tracking-widest text-white/90">
              Main Menu
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isLocked = item.adminOnly && !isAdmin;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!isLocked) {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    disabled={isLocked}
                    style={
                      isActive
                        ? { backgroundColor: '#CB4E14', color: '#FFFFFF' }
                        : { color: '#FFFFFF' }
                    }
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'shadow-md shadow-black/30 font-bold'
                        : isLocked
                        ? 'opacity-30 text-white/50 cursor-not-allowed'
                        : 'hover:bg-black/30 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-white" />
                      <span className="font-semibold text-white">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isLocked && (
                        <span
                          className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded border"
                          style={{ backgroundColor: '#2A170C', borderColor: '#3A2213' }}
                        >
                          Admin
                        </span>
                      )}
                      {item.badge && !isLocked && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white border"
                          style={
                            isActive
                              ? { backgroundColor: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.4)' }
                              : { backgroundColor: '#2A170C', borderColor: '#3A2213' }
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Info & Logout */}
        <div
          className="p-4 border-t space-y-3"
          style={{ backgroundColor: '#1B0E06', borderTopColor: '#3A2213' }}
        >
          <button
            onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-white font-bold text-xs transition-colors shadow-2xs hover:bg-rose-950/60 cursor-pointer"
            style={{ backgroundColor: '#2A170C', borderColor: '#3A2213' }}
          >
            <LogOut className="w-3.5 h-3.5 text-burnt-400" />
            <span>Log Out / Login Page</span>
          </button>

          <div className="text-[11px] text-white/80 space-y-0.5 text-center">
            <p className="font-semibold text-white">Apparel360 ERP</p>
            <p className="text-[10px] text-white/60">v1.0 • Offline Ready</p>
          </div>
        </div>

      </aside>
    </>
  );
};


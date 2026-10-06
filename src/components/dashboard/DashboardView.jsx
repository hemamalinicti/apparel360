import React from 'react';
import {
  Shirt,
  Package,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  ShoppingCart,
  Plus,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryStockChart, SalesPurchasesTrend, StockHealthDonut } from './ChartComponents';

export const DashboardView = ({ onOpenAddProduct, onOpenStockIn, onOpenPOS }) => {
  const {
    products,
    categories,
    metrics,
    sales,
    setActiveTab,
    currentUser
  } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Banner in Vibrant Burnt Orange */}
      <div
        className="rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-burnt-950/20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #CB4E14 0%, #E86526 50%, #A73B0C 100%)',
          color: '#FFFFFF'
        }}
      >
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 rounded-full bg-black/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm border border-white/25"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-cream-100" />
              Apparel360 • Stock & Inventory Management
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Garments Stock Overview
            </h1>
            <p className="text-sm text-white/90 leading-relaxed font-medium">
              Real-time monitoring of garment fabric stocks, supplier purchases, and fast POS customer sales.
            </p>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPOS}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all transform active:scale-95"
              style={{ backgroundColor: '#2A170C', border: '1px solid #3A2213' }}
            >
              <ShoppingCart className="w-4 h-4 text-burnt-400" />
              <span>POS Billing</span>
            </button>

            {currentUser.role === 'Admin' && (
              <button
                onClick={onOpenAddProduct}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-md transition-all border border-chocolate-800"
                style={{ backgroundColor: '#3A2213' }}
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add Garment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core KPI Metrics in 4 Distinct Theme Colors (2 columns in a row on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
        
        {/* Card 1: Total Garments - Deep Chocolate Brown */}
        <div
          onClick={() => setActiveTab('products')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveTab('products');
            }
          }}
          className="rounded-2xl p-3.5 sm:p-5 shadow-lg shadow-black/15 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] text-white border flex flex-col justify-between cursor-pointer group select-none"
          style={{
            background: 'linear-gradient(135deg, #2A170C 0%, #3A2213 100%)',
            borderColor: '#4D2F1A',
            color: '#FFFFFF'
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/80 truncate">
              Total Garments
            </span>
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm border border-white/20 shrink-0 group-hover:scale-105 transition-transform"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-400" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <div className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {metrics.totalProductsCount}
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-white/80 font-medium truncate">{categories.length} Categories</span>
              <span className="text-burnt-300 font-bold group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-1">
                &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Stock Units - Vibrant Burnt Orange */}
        <div
          onClick={() => setActiveTab('products')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveTab('products');
            }
          }}
          className="rounded-2xl p-3.5 sm:p-5 shadow-lg shadow-black/15 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] text-white border flex flex-col justify-between cursor-pointer group select-none"
          style={{
            background: 'linear-gradient(135deg, #CB4E14 0%, #E86526 100%)',
            borderColor: '#A73B0C',
            color: '#FFFFFF'
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/90 truncate">
              Total Stock Units
            </span>
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm border border-white/25 shrink-0 group-hover:scale-105 transition-transform"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <div className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {metrics.totalStockQuantity} <span className="text-xs sm:text-sm font-normal text-white/80">pcs</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-white/90 font-medium truncate">
                ₹{metrics.totalInventoryValuation.toLocaleString()}
              </span>
              <span className="text-white font-bold group-hover:translate-x-1 transition-transform shrink-0 ml-1">
                &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Sales Revenue - Warm Rich Cocoa / Leather */}
        <div
          onClick={() => setActiveTab('sales')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveTab('sales');
            }
          }}
          className="rounded-2xl p-3.5 sm:p-5 shadow-lg shadow-black/15 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] text-white border flex flex-col justify-between cursor-pointer group select-none"
          style={{
            background: 'linear-gradient(135deg, #643F25 0%, #845736 100%)',
            borderColor: '#4D2F1A',
            color: '#FFFFFF'
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/90 truncate">
              Total Sales
            </span>
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm border border-white/20 shrink-0 group-hover:scale-105 transition-transform"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <div className="text-xl sm:text-3xl font-black text-white tracking-tight">
              ₹{metrics.totalSalesRevenue.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-white/85 font-medium truncate">{sales.length} orders</span>
              <span className="text-white font-bold group-hover:translate-x-1 transition-transform shrink-0 ml-1">
                &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts - Deep Rust Terracotta */}
        <div
          onClick={() => setActiveTab('reports')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveTab('reports');
            }
          }}
          className="rounded-2xl p-3.5 sm:p-5 shadow-lg shadow-black/15 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] text-white border flex flex-col justify-between cursor-pointer group select-none"
          style={{
            background: 'linear-gradient(135deg, #862F0D 0%, #A73B0C 100%)',
            borderColor: '#6C280E',
            color: '#FFFFFF'
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/90 truncate">
              Low Stock Alerts
            </span>
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm border border-white/25 shrink-0 group-hover:scale-105 transition-transform"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            >
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <div className="text-xl sm:text-3xl font-black text-white tracking-tight">
              {metrics.lowStockCount}{' '}
              <span className="text-[10px] sm:text-xs font-semibold text-white/80">
                ({metrics.outOfStockCount} out)
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] sm:text-xs">
              <span className="text-white/90 font-medium truncate">Needs reorder</span>
              <span className="text-white font-bold group-hover:translate-x-1 transition-transform shrink-0 ml-1">
                &rarr;
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Analytics & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Stock Distribution */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-cream-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-chocolate-950">Category Stock Breakdown</h3>
              <p className="text-xs text-chocolate-500">Inventory volume by garment type</p>
            </div>
            <Layers className="w-4 h-4 text-chocolate-400" />
          </div>
          <CategoryStockChart />
        </div>

        {/* Sales vs Purchases Performance */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-cream-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-chocolate-950">Revenue & Purchase Margin</h3>
              <p className="text-xs text-chocolate-500">Sales receipts vs supplier outlays</p>
            </div>
            <TrendingUp className="w-4 h-4 text-chocolate-400" />
          </div>
          <SalesPurchasesTrend />
        </div>

        {/* Stock Health Level */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-cream-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-chocolate-950">Stock Health Index</h3>
              <p className="text-xs text-chocolate-500">Ratio of optimal vs low stock</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-chocolate-400" />
          </div>
          <StockHealthDonut />
        </div>

      </div>

    </div>
  );
};

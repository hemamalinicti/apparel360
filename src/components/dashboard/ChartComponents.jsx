import React from 'react';
import { useApp } from '../../context/AppContext';

export const CategoryStockChart = () => {
  const { products, categories } = useApp();

  // Aggregate stock by category
  const categoryData = categories.map((cat) => {
    const catProducts = products.filter((p) => p.categoryId === cat.id || p.category === cat.name);
    const totalQty = catProducts.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const totalVal = catProducts.reduce((sum, p) => sum + ((Number(p.stock) || 0) * (Number(p.sellingPrice) || 0)), 0);
    return {
      name: cat.name,
      count: catProducts.length,
      stock: totalQty,
      valuation: totalVal
    };
  });

  const maxStock = Math.max(...categoryData.map((c) => c.stock), 1);

  const barStyles = [
    'linear-gradient(90deg, #CB4E14 0%, #E86526 100%)',
    'linear-gradient(90deg, #2A170C 0%, #4D2F1A 100%)',
    'linear-gradient(90deg, #862F0D 0%, #A73B0C 100%)',
    'linear-gradient(90deg, #643F25 0%, #845736 100%)',
    'linear-gradient(90deg, #CB4E14 0%, #3A2213 100%)',
    'linear-gradient(90deg, #A73B0C 0%, #CB4E14 100%)'
  ];

  return (
    <div className="space-y-4">
      {categoryData.map((item, idx) => {
        const percentage = Math.round((item.stock / maxStock) * 100);
        return (
          <div key={item.name} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-black">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-chocolate-700 font-semibold">({item.count} items)</span>
                <span className="font-extrabold text-black">{item.stock} units</span>
              </div>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden border"
              style={{ backgroundColor: '#EBDBC3', borderColor: '#DEC5A6' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 shadow-xs"
                style={{
                  width: `${Math.max(percentage, 5)}%`,
                  background: barStyles[idx % barStyles.length]
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SalesPurchasesTrend = () => {
  const { sales, purchases } = useApp();

  const salesTotal = sales.reduce((acc, s) => acc + (Number(s.grandTotal) || 0), 0);
  const purchaseTotal = purchases.reduce((acc, p) => acc + (Number(p.totalAmount) || 0), 0);
  const profitEst = Math.max(0, salesTotal - purchaseTotal * 0.45);

  const totalCompare = salesTotal + purchaseTotal || 1;
  const salesPercent = Math.round((salesTotal / totalCompare) * 100);
  const purchasePercent = 100 - salesPercent;

  return (
    <div className="space-y-6">
      {/* Metric overview */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-3.5 rounded-xl border"
          style={{ backgroundColor: '#FAF5EB', borderColor: '#EBDBC3' }}
        >
          <div className="text-[11px] font-bold text-burnt-700 uppercase tracking-wide">Total Sales Realized</div>
          <div className="text-lg font-black text-black mt-0.5">
            ₹{salesTotal.toLocaleString()}
          </div>
          <div className="text-[11px] text-chocolate-800 font-semibold mt-1">
            {sales.length} customer sales
          </div>
        </div>

        <div
          className="p-3.5 rounded-xl border"
          style={{ backgroundColor: '#FAF5EB', borderColor: '#EBDBC3' }}
        >
          <div className="text-[11px] font-bold text-chocolate-800 uppercase tracking-wide">Supplier Purchases</div>
          <div className="text-lg font-black text-black mt-0.5">
            ₹{purchaseTotal.toLocaleString()}
          </div>
          <div className="text-[11px] text-chocolate-800 font-semibold mt-1">
            {purchases.length} supplier orders
          </div>
        </div>
      </div>

      {/* Visual Bar Ratio with High Contrast Colors */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-1.5 text-burnt-700 font-black">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#CB4E14' }} />
            Sales ({salesPercent}%)
          </span>
          <span className="flex items-center gap-1.5 text-chocolate-950 font-black">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#2A170C' }} />
            Purchases ({purchasePercent}%)
          </span>
        </div>
        
        {/* The Colored Ratio Bar */}
        <div
          className="w-full h-5 rounded-xl overflow-hidden flex shadow-inner border"
          style={{ backgroundColor: '#EBDBC3', borderColor: '#DEC5A6' }}
        >
          <div
            className="h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
            style={{ width: `${Math.max(salesPercent, 4)}%`, backgroundColor: '#CB4E14' }}
            title={`Sales: ₹${salesTotal.toLocaleString()} (${salesPercent}%)`}
          >
            {salesPercent >= 15 && `${salesPercent}%`}
          </div>
          <div
            className="h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
            style={{ width: `${Math.max(purchasePercent, 4)}%`, backgroundColor: '#2A170C' }}
            title={`Purchases: ₹${purchaseTotal.toLocaleString()} (${purchasePercent}%)`}
          >
            {purchasePercent >= 15 && `${purchasePercent}%`}
          </div>
        </div>
      </div>

      {/* Breakdown footer */}
      <div className="pt-2.5 border-t border-cream-300 flex items-center justify-between text-xs">
        <span className="font-bold text-chocolate-900">Estimated Gross Margin</span>
        <span className="font-black text-sm text-black">₹{Math.round(profitEst).toLocaleString()}</span>
      </div>
    </div>
  );
};

export const StockHealthDonut = () => {
  const { products, metrics } = useApp();

  const total = products.length || 1;
  const inStockCount = products.filter((p) => p.stock > (p.minStock || 10)).length;
  const lowStockCount = metrics.lowStockCount - metrics.outOfStockCount;
  const outOfStockCount = metrics.outOfStockCount;

  const inStockPct = Math.round((inStockCount / total) * 100);
  const lowStockPct = Math.round((Math.max(lowStockCount, 0) / total) * 100);
  const outOfStockPct = Math.round((outOfStockCount / total) * 100);

  const circumference = 301.59;
  const inStockLength = (circumference * inStockPct) / 100;
  const lowStockLength = (circumference * lowStockPct) / 100;
  const outOfStockLength = (circumference * outOfStockPct) / 100;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-5">
      {/* 3-Color Multi-Segment Donut Chart */}
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Base Track */}
          <circle
            cx="64"
            cy="64"
            r="48"
            stroke="#EBDBC3"
            strokeWidth="14"
            fill="transparent"
          />
          {/* In Stock Segment (Emerald Green) */}
          {inStockPct > 0 && (
            <circle
              cx="64"
              cy="64"
              r="48"
              stroke="#16A34A"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={`${inStockLength} ${circumference}`}
              strokeDashoffset="0"
              className="transition-all duration-700"
            />
          )}
          {/* Low Stock Segment (Amber Orange) */}
          {lowStockPct > 0 && (
            <circle
              cx="64"
              cy="64"
              r="48"
              stroke="#D97706"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={`${lowStockLength} ${circumference}`}
              strokeDashoffset={-inStockLength}
              className="transition-all duration-700"
            />
          )}
          {/* Out of Stock Segment (Crimson Red) */}
          {outOfStockPct > 0 && (
            <circle
              cx="64"
              cy="64"
              r="48"
              stroke="#DC2626"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={`${outOfStockLength} ${circumference}`}
              strokeDashoffset={-(inStockLength + lowStockLength)}
              className="transition-all duration-700"
            />
          )}
        </svg>
        <div className="absolute text-center">
          <span className="text-2xl font-black text-black leading-none">{inStockPct}%</span>
          <span className="block text-[10px] uppercase font-black tracking-wider text-emerald-800 mt-0.5">Optimal</span>
        </div>
      </div>

      {/* 3 High-Contrast Clearly Distinguishable Legend Items */}
      <div className="space-y-3 text-xs">
        {/* In Stock */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white"
            style={{ backgroundColor: '#16A34A' }}
          />
          <div>
            <span className="font-bold text-black">In Stock: </span>
            <span className="font-black text-emerald-800">{inStockCount} items ({inStockPct}%)</span>
          </div>
        </div>

        {/* Low Stock */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white"
            style={{ backgroundColor: '#D97706' }}
          />
          <div>
            <span className="font-bold text-black">Low Stock: </span>
            <span className="font-black text-amber-800">{Math.max(lowStockCount, 0)} items ({lowStockPct}%)</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white"
            style={{ backgroundColor: '#DC2626' }}
          />
          <div>
            <span className="font-bold text-black">Out of Stock: </span>
            <span className="font-black text-rose-800">{outOfStockCount} items ({outOfStockPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};


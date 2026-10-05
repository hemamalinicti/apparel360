import React, { useState, useMemo } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PackagePlus,
  ShoppingBag,
  DollarSign,
  Percent,
  Layers,
  Filter,
  RefreshCw,
  BarChart2,
  PieChart,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FinancialReportCharts = () => {
  const { products, sales, purchases, stockMovements } = useApp();

  // Timeframe filter state
  const [timeframe, setTimeframe] = useState('month'); // 'day' | 'week' | 'month' | 'year' | 'custom'
  
  // Custom date range state (defaults to past 30 days up to today)
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const thirtyDaysAgoStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  }, []);

  const [startDate, setStartDate] = useState(thirtyDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);

  // Compute date boundaries
  const { startBoundary, endBoundary, timeframeLabel } = useMemo(() => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    let label = 'This Month (Past 30 Days)';

    if (timeframe === 'day') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      label = `Today (${now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })})`;
    } else if (timeframe === 'week') {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      label = 'This Week (Past 7 Days)';
    } else if (timeframe === 'month') {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      label = 'This Month (Past 30 Days)';
    } else if (timeframe === 'year') {
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0); // Start of current year
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      label = `Full Year (${now.getFullYear()})`;
    } else if (timeframe === 'custom') {
      start = startDate ? new Date(`${startDate}T00:00:00`) : new Date(0);
      end = endDate ? new Date(`${endDate}T23:59:59`) : new Date();
      label = `Custom: ${startDate || 'Start'} to ${endDate || 'Today'}`;
    }

    return { startBoundary: start, endBoundary: end, timeframeLabel: label };
  }, [timeframe, startDate, endDate]);

  // Product cost map for accurate COGS
  const productCostMap = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.id] = Number(p.costPrice) || 0;
    });
    return map;
  }, [products]);

  // Filtered sales in timeframe
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const saleDate = new Date(s.date);
      return saleDate >= startBoundary && saleDate <= endBoundary;
    });
  }, [sales, startBoundary, endBoundary]);

  // Filtered purchases in timeframe
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const pDate = new Date(p.date);
      return pDate >= startBoundary && pDate <= endBoundary;
    });
  }, [purchases, startBoundary, endBoundary]);

  // Filtered stock movements in timeframe
  const filteredMovements = useMemo(() => {
    return stockMovements.filter((m) => {
      const mDate = new Date(m.date);
      return mDate >= startBoundary && mDate <= endBoundary;
    });
  }, [stockMovements, startBoundary, endBoundary]);

  // Calculate Metrics for selected timeframe
  const metrics = useMemo(() => {
    // 1. Sales & Units Sold
    const salesRevenue = filteredSales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
    const salesSubtotal = filteredSales.reduce((sum, s) => sum + (Number(s.subtotal) || 0), 0);
    const salesDiscount = filteredSales.reduce((sum, s) => sum + (Number(s.discountAmount) || 0), 0);
    
    let unitsSold = 0;
    let cogs = 0;

    filteredSales.forEach((s) => {
      if (Array.isArray(s.items)) {
        s.items.forEach((item) => {
          const qty = Number(item.quantity) || 0;
          unitsSold += qty;
          const unitCost = productCostMap[item.productId] ?? (Number(item.costPrice) || (Number(item.price) * 0.5) || 0);
          cogs += qty * unitCost;
        });
      }
    });

    // 2. Purchases & Stock In
    const purchasesCost = filteredPurchases.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);
    let stockInUnits = 0;
    filteredPurchases.forEach((p) => {
      if (Array.isArray(p.items)) {
        p.items.forEach((i) => {
          stockInUnits += Number(i.quantity) || 0;
        });
      } else {
        stockInUnits += Number(p.itemCount) || 0;
      }
    });

    // Also include direct STOCK_IN movements if any exist outside purchases
    const directStockInUnits = filteredMovements
      .filter((m) => m.type === 'STOCK_IN' && !m.reason?.startsWith('Purchase'))
      .reduce((sum, m) => sum + (Number(m.quantity) || 0), 0);

    const totalStockInPieces = stockInUnits + directStockInUnits;

    // 3. Profit / Loss calculations
    // Gross Profit = Revenue - COGS (Cost of Goods actually sold)
    const grossProfit = salesRevenue - cogs;
    const profitMarginPercent = salesRevenue > 0 ? ((grossProfit / salesRevenue) * 100).toFixed(1) : 0;
    
    // Net Flow: Inward pieces vs Sold pieces
    const netUnitFlow = totalStockInPieces - unitsSold;

    return {
      salesRevenue,
      salesSubtotal,
      salesDiscount,
      unitsSold,
      purchasesCost,
      stockInUnits: totalStockInPieces,
      cogs,
      grossProfit,
      profitMarginPercent,
      netUnitFlow,
      salesCount: filteredSales.length,
      purchasesCount: filteredPurchases.length
    };
  }, [filteredSales, filteredPurchases, filteredMovements, productCostMap]);

  // Generate dynamic trend buckets based on selected timeframe
  const trendBuckets = useMemo(() => {
    const buckets = [];

    if (timeframe === 'day') {
      // 4 time slots of the day
      const slots = [
        { label: 'Morning (06:00 - 12:00)', startHour: 6, endHour: 12 },
        { label: 'Afternoon (12:00 - 16:00)', startHour: 12, endHour: 16 },
        { label: 'Evening (16:00 - 20:00)', startHour: 16, endHour: 20 },
        { label: 'Night (20:00 - 24:00)', startHour: 20, endHour: 24 }
      ];

      slots.forEach((slot) => {
        let salesVal = 0;
        let purchaseVal = 0;
        let cogsVal = 0;
        let inQty = 0;
        let soldQty = 0;

        filteredSales.forEach((s) => {
          const d = new Date(s.date);
          const h = d.getHours();
          if (h >= slot.startHour && h < slot.endHour) {
            salesVal += Number(s.grandTotal) || 0;
            s.items?.forEach((i) => {
              soldQty += Number(i.quantity) || 0;
              const unitCost = productCostMap[i.productId] || (Number(i.price) * 0.5) || 0;
              cogsVal += (Number(i.quantity) || 0) * unitCost;
            });
          }
        });

        filteredPurchases.forEach((p) => {
          const d = new Date(p.date);
          const h = d.getHours();
          if (h >= slot.startHour && h < slot.endHour) {
            purchaseVal += Number(p.totalAmount) || 0;
            p.items?.forEach((i) => { inQty += Number(i.quantity) || 0; });
          }
        });

        buckets.push({
          label: slot.label,
          sales: salesVal,
          purchases: purchaseVal,
          cogs: cogsVal,
          profit: salesVal - cogsVal,
          inQty,
          soldQty
        });
      });
    } else if (timeframe === 'week') {
      // 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);
        const dayName = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

        let salesVal = 0;
        let purchaseVal = 0;
        let cogsVal = 0;
        let inQty = 0;
        let soldQty = 0;

        filteredSales.forEach((s) => {
          if (s.date.startsWith(dayStr)) {
            salesVal += Number(s.grandTotal) || 0;
            s.items?.forEach((item) => {
              soldQty += Number(item.quantity) || 0;
              const unitCost = productCostMap[item.productId] || (Number(item.price) * 0.5) || 0;
              cogsVal += (Number(item.quantity) || 0) * unitCost;
            });
          }
        });

        filteredPurchases.forEach((p) => {
          if (p.date.startsWith(dayStr)) {
            purchaseVal += Number(p.totalAmount) || 0;
            p.items?.forEach((i) => { inQty += Number(i.quantity) || 0; });
          }
        });

        buckets.push({
          label: dayName,
          sales: salesVal,
          purchases: purchaseVal,
          cogs: cogsVal,
          profit: salesVal - cogsVal,
          inQty,
          soldQty
        });
      }
    } else if (timeframe === 'month') {
      // 4 Weekly intervals in the 30-day period
      const intervals = [
        { label: 'Week 1 (Days 1-7)', daysOffsetStart: 28, daysOffsetEnd: 21 },
        { label: 'Week 2 (Days 8-14)', daysOffsetStart: 21, daysOffsetEnd: 14 },
        { label: 'Week 3 (Days 15-21)', daysOffsetStart: 14, daysOffsetEnd: 7 },
        { label: 'Week 4 (Past 7 Days)', daysOffsetStart: 7, daysOffsetEnd: 0 }
      ];

      intervals.forEach((inv) => {
        const now = new Date();
        const start = new Date(now.getTime() - inv.daysOffsetStart * 24 * 60 * 60 * 1000);
        const end = new Date(now.getTime() - inv.daysOffsetEnd * 24 * 60 * 60 * 1000);

        let salesVal = 0;
        let purchaseVal = 0;
        let cogsVal = 0;
        let inQty = 0;
        let soldQty = 0;

        filteredSales.forEach((s) => {
          const sd = new Date(s.date);
          if (sd >= start && sd <= end) {
            salesVal += Number(s.grandTotal) || 0;
            s.items?.forEach((item) => {
              soldQty += Number(item.quantity) || 0;
              const unitCost = productCostMap[item.productId] || (Number(item.price) * 0.5) || 0;
              cogsVal += (Number(item.quantity) || 0) * unitCost;
            });
          }
        });

        filteredPurchases.forEach((p) => {
          const pd = new Date(p.date);
          if (pd >= start && pd <= end) {
            purchaseVal += Number(p.totalAmount) || 0;
            p.items?.forEach((i) => { inQty += Number(i.quantity) || 0; });
          }
        });

        buckets.push({
          label: inv.label,
          sales: salesVal,
          purchases: purchaseVal,
          cogs: cogsVal,
          profit: salesVal - cogsVal,
          inQty,
          soldQty
        });
      });
    } else if (timeframe === 'year') {
      // 12 Months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const curYear = new Date().getFullYear();

      months.forEach((mName, mIdx) => {
        let salesVal = 0;
        let purchaseVal = 0;
        let cogsVal = 0;
        let inQty = 0;
        let soldQty = 0;

        filteredSales.forEach((s) => {
          const sd = new Date(s.date);
          if (sd.getFullYear() === curYear && sd.getMonth() === mIdx) {
            salesVal += Number(s.grandTotal) || 0;
            s.items?.forEach((item) => {
              soldQty += Number(item.quantity) || 0;
              const unitCost = productCostMap[item.productId] || (Number(item.price) * 0.5) || 0;
              cogsVal += (Number(item.quantity) || 0) * unitCost;
            });
          }
        });

        filteredPurchases.forEach((p) => {
          const pd = new Date(p.date);
          if (pd.getFullYear() === curYear && pd.getMonth() === mIdx) {
            purchaseVal += Number(p.totalAmount) || 0;
            p.items?.forEach((i) => { inQty += Number(i.quantity) || 0; });
          }
        });

        buckets.push({
          label: mName,
          sales: salesVal,
          purchases: purchaseVal,
          cogs: cogsVal,
          profit: salesVal - cogsVal,
          inQty,
          soldQty
        });
      });
    } else if (timeframe === 'custom') {
      // Divide the custom range into 4-5 segment buckets
      const totalSpanMs = Math.max(endBoundary.getTime() - startBoundary.getTime(), 1000);
      const segmentCount = 4;
      const segmentSpanMs = totalSpanMs / segmentCount;

      for (let i = 0; i < segmentCount; i++) {
        const segStart = new Date(startBoundary.getTime() + i * segmentSpanMs);
        const segEnd = new Date(startBoundary.getTime() + (i + 1) * segmentSpanMs);
        const segLabel = `${segStart.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })} - ${segEnd.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}`;

        let salesVal = 0;
        let purchaseVal = 0;
        let cogsVal = 0;
        let inQty = 0;
        let soldQty = 0;

        filteredSales.forEach((s) => {
          const sd = new Date(s.date);
          if (sd >= segStart && sd <= segEnd) {
            salesVal += Number(s.grandTotal) || 0;
            s.items?.forEach((item) => {
              soldQty += Number(item.quantity) || 0;
              const unitCost = productCostMap[item.productId] || (Number(item.price) * 0.5) || 0;
              cogsVal += (Number(item.quantity) || 0) * unitCost;
            });
          }
        });

        filteredPurchases.forEach((p) => {
          const pd = new Date(p.date);
          if (pd >= segStart && pd <= segEnd) {
            purchaseVal += Number(p.totalAmount) || 0;
            p.items?.forEach((i) => { inQty += Number(i.quantity) || 0; });
          }
        });

        buckets.push({
          label: segLabel,
          sales: salesVal,
          purchases: purchaseVal,
          cogs: cogsVal,
          profit: salesVal - cogsVal,
          inQty,
          soldQty
        });
      }
    }

    return buckets;
  }, [timeframe, filteredSales, filteredPurchases, productCostMap, startBoundary, endBoundary]);

  // Max value in trend for scaling bars
  const maxTrendVal = useMemo(() => {
    return Math.max(
      ...trendBuckets.map((b) => Math.max(b.sales, b.purchases, Math.abs(b.profit))),
      1000
    );
  }, [trendBuckets]);

  // Units ratio calculation
  const totalUnitsActivity = (metrics.stockInUnits + metrics.unitsSold) || 1;
  const stockInPercent = Math.round((metrics.stockInUnits / totalUnitsActivity) * 100);
  const salesUnitsPercent = 100 - stockInPercent;

  // Financial ratio calculation
  const totalValueActivity = (metrics.salesRevenue + metrics.purchasesCost) || 1;
  const salesRevPercent = Math.round((metrics.salesRevenue / totalValueActivity) * 100);
  const purchaseCostPercent = 100 - salesRevPercent;

  return (
    <div className="space-y-5">
      
      {/* 1. Timeframe Filter Toolbar */}
      <div
        className="p-4 rounded-2xl border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{ backgroundColor: '#FAF5EB', borderColor: '#DEC5A6' }}
      >
        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-black flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-burnt-600" />
            Timeframe:
          </span>

          <button
            type="button"
            onClick={() => setTimeframe('day')}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border shadow-2xs"
            style={
              timeframe === 'day'
                ? { backgroundColor: '#CB4E14', color: '#FFFFFF', borderColor: '#A73B0C' }
                : { backgroundColor: '#FFFFFF', color: '#1B0E06', borderColor: '#DEC5A6' }
            }
          >
            Today (Day)
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('week')}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border shadow-2xs"
            style={
              timeframe === 'week'
                ? { backgroundColor: '#CB4E14', color: '#FFFFFF', borderColor: '#A73B0C' }
                : { backgroundColor: '#FFFFFF', color: '#1B0E06', borderColor: '#DEC5A6' }
            }
          >
            This Week (7D)
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('month')}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border shadow-2xs"
            style={
              timeframe === 'month'
                ? { backgroundColor: '#CB4E14', color: '#FFFFFF', borderColor: '#A73B0C' }
                : { backgroundColor: '#FFFFFF', color: '#1B0E06', borderColor: '#DEC5A6' }
            }
          >
            This Month (30D)
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('year')}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border shadow-2xs"
            style={
              timeframe === 'year'
                ? { backgroundColor: '#CB4E14', color: '#FFFFFF', borderColor: '#A73B0C' }
                : { backgroundColor: '#FFFFFF', color: '#1B0E06', borderColor: '#DEC5A6' }
            }
          >
            This Year (12M)
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('custom')}
            className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border shadow-2xs"
            style={
              timeframe === 'custom'
                ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
                : { backgroundColor: '#FFFFFF', color: '#1B0E06', borderColor: '#DEC5A6' }
            }
          >
            Custom Range 📅
          </button>
        </div>

        {/* Custom Range Date Pickers */}
        {timeframe === 'custom' && (
          <div className="flex flex-wrap items-center gap-2 bg-white px-3 py-2 rounded-xl border border-cream-300 shadow-2xs">
            <span className="text-[11px] font-black text-black">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 text-xs font-bold text-black bg-cream-50 border border-cream-300 rounded-lg focus:outline-hidden focus:border-burnt-500"
            />
            <span className="text-[11px] font-black text-black">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 text-xs font-bold text-black bg-cream-50 border border-cream-300 rounded-lg focus:outline-hidden focus:border-burnt-500"
            />
          </div>
        )}

        {/* Active Timeframe Badge */}
        <div className="text-right">
          <span className="text-xs font-bold text-chocolate-900 bg-white px-3 py-1 rounded-full border border-cream-300 shadow-2xs">
            Filtering: <span className="font-black text-burnt-700">{timeframeLabel}</span>
          </span>
        </div>
      </div>

      {/* 2. Key Dynamic Metrics Cards for Selected Timeframe (2 columns in a row on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Card 1: Stock Inward */}
        <div className="p-3 sm:p-4 bg-white rounded-2xl border border-cream-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-chocolate-600 truncate">Stock In (Purchases)</span>
            <span className="p-1 sm:p-1.5 rounded-lg bg-cream-100 text-chocolate-900 border border-cream-200 shrink-0">
              <PackagePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-chocolate-900" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-chocolate-950 mt-1.5">
            +{metrics.stockInUnits} <span className="text-xs sm:text-sm font-bold text-chocolate-600">pcs</span>
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-chocolate-800 mt-1 truncate">
            Outlay: ₹{metrics.purchasesCost.toLocaleString()} ({metrics.purchasesCount} orders)
          </div>
        </div>

        {/* Card 2: Sales Volume */}
        <div className="p-3 sm:p-4 bg-white rounded-2xl border border-cream-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-burnt-700 truncate">Sales (Stock Out)</span>
            <span className="p-1 sm:p-1.5 rounded-lg bg-burnt-50 text-burnt-700 border border-burnt-200 shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-burnt-700" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-burnt-600 mt-1.5">
            {metrics.unitsSold} <span className="text-xs sm:text-sm font-bold text-burnt-700">pcs sold</span>
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-black mt-1 truncate">
            Revenue: ₹{metrics.salesRevenue.toLocaleString()} ({metrics.salesCount} inv)
          </div>
        </div>

        {/* Card 3: COGS (Cost of Sold Goods) */}
        <div className="p-3 sm:p-4 bg-white rounded-2xl border border-cream-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-chocolate-600 truncate">Cost of Sold Goods</span>
            <span className="p-1 sm:p-1.5 rounded-lg bg-cream-100 text-chocolate-900 border border-cream-200 shrink-0">
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-chocolate-800" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-black text-chocolate-950 mt-1.5">
            ₹{Math.round(metrics.cogs).toLocaleString()}
          </div>
          <div className="text-[10px] sm:text-xs font-semibold text-chocolate-600 mt-1 truncate">
            Direct production cost
          </div>
        </div>

        {/* Card 4: Net Realized Profit or Loss */}
        <div
          className="p-3 sm:p-4 rounded-2xl border shadow-2xs flex flex-col justify-between"
          style={{
            backgroundColor: metrics.grossProfit >= 0 ? '#F0FDF4' : '#FEF2F2',
            borderColor: metrics.grossProfit >= 0 ? '#BBF7D0' : '#FECACA'
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider truncate"
              style={{ color: metrics.grossProfit >= 0 ? '#166534' : '#991B1B' }}
            >
              {metrics.grossProfit >= 0 ? 'Net Profit' : 'Net Deficit'}
            </span>
            <span
              className="px-1.5 py-0.5 rounded-lg border text-[10px] sm:text-xs font-black flex items-center gap-0.5 shrink-0"
              style={{
                backgroundColor: metrics.grossProfit >= 0 ? '#DCFCE7' : '#FEE2E2',
                borderColor: metrics.grossProfit >= 0 ? '#86EFAC' : '#FCA5A5',
                color: metrics.grossProfit >= 0 ? '#15803D' : '#B91C1C'
              }}
            >
              {metrics.grossProfit >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {metrics.profitMarginPercent}%
            </span>
          </div>
          <div
            className="text-lg sm:text-2xl font-black mt-1.5"
            style={{ color: metrics.grossProfit >= 0 ? '#14532D' : '#7F1D1D' }}
          >
            {metrics.grossProfit >= 0 ? '+' : ''}₹{Math.round(metrics.grossProfit).toLocaleString()}
          </div>
          <div
            className="text-[10px] sm:text-xs font-bold mt-1 truncate"
            style={{ color: metrics.grossProfit >= 0 ? '#166534' : '#991B1B' }}
          >
            {metrics.grossProfit >= 0 ? 'Profitable Period' : 'Trading Deficit'}
          </div>
        </div>

      </div>

      {/* 3. Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Chart 1: Stock In vs Sales Volume (Units & Value Flow) */}
        <div className="bg-white p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <div>
              <h3 className="text-sm font-bold text-chocolate-950">Stock In vs Sales Volume</h3>
              <p className="text-[11px] text-chocolate-500 mt-0.5">Unit flow & procurement balance</p>
            </div>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-cream-100 text-chocolate-900 border border-cream-200">
              {metrics.netUnitFlow >= 0 ? `+${metrics.netUnitFlow} Net Pcs` : `${metrics.netUnitFlow} Net Pcs`}
            </span>
          </div>

          {/* Unit Comparison Bars */}
          <div className="space-y-4 pt-1">
            {/* Units Inward Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#2A170C' }} />
                  Stock In (Inward Pcs)
                </span>
                <span className="font-black text-black">{metrics.stockInUnits} units</span>
              </div>
              <div
                className="w-full h-3.5 rounded-full overflow-hidden border"
                style={{ backgroundColor: '#FAF5EB', borderColor: '#DEC5A6' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{
                    width: `${Math.min(100, Math.max(stockInPercent, 8))}%`,
                    backgroundColor: '#2A170C'
                  }}
                />
              </div>
            </div>

            {/* Units Sold Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-black flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#CB4E14' }} />
                  Sales (Outward Pcs)
                </span>
                <span className="font-black text-burnt-700">{metrics.unitsSold} units</span>
              </div>
              <div
                className="w-full h-3.5 rounded-full overflow-hidden border"
                style={{ backgroundColor: '#FAF5EB', borderColor: '#DEC5A6' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{
                    width: `${Math.min(100, Math.max(salesUnitsPercent, 8))}%`,
                    backgroundColor: '#CB4E14'
                  }}
                />
              </div>
            </div>

            {/* Financial Value Ratio Strip */}
            <div className="pt-3 border-t border-cream-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-burnt-700 font-extrabold">Sales Rev: ₹{metrics.salesRevenue.toLocaleString()}</span>
                <span className="text-chocolate-900 font-extrabold">Purchases: ₹{metrics.purchasesCost.toLocaleString()}</span>
              </div>

              <div
                className="w-full h-5 rounded-xl overflow-hidden flex shadow-inner border"
                style={{ backgroundColor: '#FAF5EB', borderColor: '#DEC5A6' }}
              >
                <div
                  className="h-full transition-all duration-500 flex items-center justify-center text-[10px] font-extrabold text-white"
                  style={{ width: `${Math.max(salesRevPercent, 6)}%`, backgroundColor: '#CB4E14' }}
                >
                  {salesRevPercent >= 15 && `Sales ${salesRevPercent}%`}
                </div>
                <div
                  className="h-full transition-all duration-500 flex items-center justify-center text-[10px] font-extrabold text-white"
                  style={{ width: `${Math.max(purchaseCostPercent, 6)}%`, backgroundColor: '#2A170C' }}
                >
                  {purchaseCostPercent >= 15 && `Inward ${purchaseCostPercent}%`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Profit or Loss Performance Analysis */}
        <div className="bg-white p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <div>
              <h3 className="text-sm font-bold text-chocolate-950">Profit & Loss Performance</h3>
              <p className="text-[11px] text-chocolate-500 mt-0.5">Realized margins vs inventory cost</p>
            </div>
            <span
              className="text-xs font-black px-2.5 py-0.5 rounded-full border shadow-2xs"
              style={{
                backgroundColor: metrics.grossProfit >= 0 ? '#DCFCE7' : '#FEE2E2',
                borderColor: metrics.grossProfit >= 0 ? '#86EFAC' : '#FCA5A5',
                color: metrics.grossProfit >= 0 ? '#15803D' : '#B91C1C'
              }}
            >
              {metrics.profitMarginPercent}% Margin
            </span>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-3 pt-1">
            {/* Sales Revenue Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-chocolate-900">Total Sales Revenue</span>
                <span className="font-extrabold text-black">₹{metrics.salesRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-cream-100 overflow-hidden border border-cream-200">
                <div className="h-full rounded-full bg-burnt-500 w-full" />
              </div>
            </div>

            {/* COGS Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-chocolate-700">Cost of Goods Sold (COGS)</span>
                <span className="font-extrabold text-chocolate-900">-₹{Math.round(metrics.cogs).toLocaleString()}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-cream-100 overflow-hidden border border-cream-200">
                <div
                  className="h-full rounded-full bg-chocolate-700 transition-all duration-500"
                  style={{
                    width: `${metrics.salesRevenue > 0 ? Math.min(100, Math.round((metrics.cogs / metrics.salesRevenue) * 100)) : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Gross Profit Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className={metrics.grossProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'}>
                  Net Gross Profit Realized
                </span>
                <span
                  className="font-black text-sm"
                  style={{ color: metrics.grossProfit >= 0 ? '#15803D' : '#B91C1C' }}
                >
                  {metrics.grossProfit >= 0 ? '+' : ''}₹{Math.round(metrics.grossProfit).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-cream-100 overflow-hidden border border-cream-200">
                <div
                  className="h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{
                    width: `${metrics.salesRevenue > 0 ? Math.min(100, Math.max(5, Math.round((Math.abs(metrics.grossProfit) / metrics.salesRevenue) * 100))) : 0}%`,
                    backgroundColor: metrics.grossProfit >= 0 ? '#16A34A' : '#DC2626'
                  }}
                />
              </div>
            </div>

            {/* Summary Tag */}
            <div
              className="p-2.5 rounded-xl border mt-2 flex items-center justify-between text-xs font-bold"
              style={{ backgroundColor: '#FAF5EB', borderColor: '#DEC5A6' }}
            >
              <span className="text-black">Profit Efficiency:</span>
              <span className="font-extrabold text-burnt-700">
                ₹{metrics.unitsSold > 0 ? Math.round(metrics.grossProfit / metrics.unitsSold) : 0} / sold garment
              </span>
            </div>
          </div>
        </div>

        {/* Chart 3: Period Timeline Trend Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <div>
              <h3 className="text-sm font-bold text-chocolate-950">Timeframe Progression Trend</h3>
              <p className="text-[11px] text-chocolate-500 mt-0.5">Sales vs Stock In vs Profit progression</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-chocolate-700">
              <span className="w-2 h-2 rounded-full bg-burnt-600 inline-block" /> Sales
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block ml-1" /> Profit
            </div>
          </div>

          {/* Vertical/Horizontal intervals list */}
          <div className="space-y-3 pt-1 max-h-56 overflow-y-auto pr-1">
            {trendBuckets.map((bucket, idx) => {
              const salesBarWidth = Math.round((bucket.sales / maxTrendVal) * 100);
              const profitBarWidth = Math.round((Math.max(0, bucket.profit) / maxTrendVal) * 100);

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-black">{bucket.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-burnt-700">₹{bucket.sales.toLocaleString()}</span>
                      <span
                        className="font-extrabold"
                        style={{ color: bucket.profit >= 0 ? '#15803D' : '#DC2626' }}
                      >
                        ({bucket.profit >= 0 ? '+' : ''}₹{Math.round(bucket.profit).toLocaleString()})
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1">
                    <div
                      className="w-full h-2 rounded-full overflow-hidden border"
                      style={{ backgroundColor: '#FAF5EB', borderColor: '#DEC5A6' }}
                    >
                      <div
                        className="h-full rounded-full bg-burnt-600 transition-all duration-300"
                        style={{ width: `${Math.max(salesBarWidth, 3)}%` }}
                        title={`Sales: ₹${bucket.sales}`}
                      />
                    </div>
                    {bucket.profit > 0 && (
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: '#FAF5EB' }}
                      >
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                          style={{ width: `${Math.max(profitBarWidth, 3)}%` }}
                          title={`Profit: ₹${bucket.profit}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-cream-200 flex justify-between text-[11px] font-bold text-chocolate-800">
            <span>Period Total Sales: ₹{metrics.salesRevenue.toLocaleString()}</span>
            <span className="font-extrabold text-emerald-800">Net Profit: ₹{Math.round(metrics.grossProfit).toLocaleString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  Package,
  IndianRupee,
  Layers,
  Shirt,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockBadge, SizeBadge, ColorBadge, CategoryBadge } from '../common/Badge';
import { FinancialReportCharts } from './FinancialReportCharts';

export const ReportsView = () => {
  const { products, categories, sales, purchases, metrics } = useApp();
  const [selectedReport, setSelectedReport] = useState('valuation');

  const categorySummary = categories.map((cat) => {
    const prods = products.filter((p) => p.categoryId === cat.id || p.category === cat.name);
    const totalQty = prods.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const totalCost = prods.reduce((acc, p) => acc + ((Number(p.stock) || 0) * (Number(p.costPrice) || 0)), 0);
    const totalRetail = prods.reduce((acc, p) => acc + ((Number(p.stock) || 0) * (Number(p.sellingPrice) || 0)), 0);
    const margin = totalRetail - totalCost;

    return {
      category: cat.name,
      itemCount: prods.length,
      units: totalQty,
      costValuation: totalCost,
      retailValuation: totalRetail,
      margin
    };
  });

  const exportCurrentReportCSV = () => {
    let headers = [];
    let rows = [];
    let filename = 'Garments_Report';

    if (selectedReport === 'valuation') {
      filename = 'Inventory_Valuation_Report';
      headers = ['Garment Name', 'SKU', 'Category', 'Size', 'Stock Qty', 'Unit Cost', 'Unit Selling', 'Total Cost Value', 'Potential Retail Value'];
      rows = products.map((p) => [
        `"${p.name}"`,
        `"${p.sku}"`,
        `"${p.category}"`,
        `"${p.size}"`,
        p.stock,
        p.costPrice,
        p.sellingPrice,
        (p.stock * p.costPrice),
        (p.stock * p.sellingPrice)
      ]);
    } else if (selectedReport === 'lowstock') {
      filename = 'Low_Stock_Reorder_Report';
      headers = ['Garment Name', 'SKU', 'Category', 'Current Stock', 'Min Threshold', 'Supplier', 'Deficit'];
      rows = metrics.lowStockProducts.map((p) => [
        `"${p.name}"`,
        `"${p.sku}"`,
        `"${p.category}"`,
        p.stock,
        p.minStock,
        `"${p.supplierName}"`,
        Math.max(0, p.minStock - p.stock)
      ]);
    } else if (selectedReport === 'sales') {
      filename = 'Sales_Revenue_Report';
      headers = ['Invoice #', 'Date', 'Customer', 'Items Count', 'Subtotal', 'Discount', 'Tax', 'Grand Total', 'Payment'];
      rows = sales.map((s) => [
        `"${s.invoiceNumber}"`,
        `"${new Date(s.date).toLocaleDateString()}"`,
        `"${s.customerName}"`,
        s.items.length,
        s.subtotal,
        s.discountAmount,
        s.taxAmount,
        s.grandTotal,
        `"${s.paymentMethod}"`
      ]);
    } else if (selectedReport === 'purchases') {
      filename = 'Purchases_Procurement_Report';
      headers = ['PO #', 'Invoice #', 'Date', 'Supplier', 'Items Qty', 'Total Outlay', 'Status'];
      rows = purchases.map((p) => [
        `"${p.id}"`,
        `"${p.invoiceNumber}"`,
        p.date,
        `"${p.supplierName}"`,
        p.itemCount,
        p.totalAmount,
        `"${p.paymentStatus}"`
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl shadow-md border"
        style={{
          backgroundColor: '#E86526', // Orange background
          borderColor: '#CB4E14',
          color: '#000000' // Black font
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-black">Stock & Financial Reports</h1>
            <span
              className="px-2.5 py-0.5 text-xs font-black rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }}
            >
              Analytics Engine
            </span>
          </div>
          <p className="text-xs font-bold text-black/90 mt-0.5">
            Export valuation audits, inventory health metrics, sales margins, and reorder sheets.
          </p>
        </div>

        <button
          onClick={exportCurrentReportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors border hover:bg-white"
          style={{ backgroundColor: '#FAF5EB', borderColor: '#CB4E14', color: '#000000' }}
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span className="text-black">Export Current Report (CSV)</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-cream-200/90 rounded-2xl shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-chocolate-400">
            Total Inventory Cost Valuation
          </div>
          <div className="text-2xl font-extrabold text-chocolate-950 mt-1">
            ₹{metrics.totalInventoryValuation.toLocaleString()}
          </div>
          <div className="text-xs text-chocolate-500 mt-1">
            Capital invested in {metrics.totalStockQuantity} garment pieces
          </div>
        </div>

        <div className="p-5 bg-white border border-cream-200/90 rounded-2xl shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-chocolate-400">
            Expected Retail Realization
          </div>
          <div className="text-2xl font-extrabold text-burnt-600 mt-1">
            ₹{products.reduce((acc, p) => acc + (p.stock * p.sellingPrice), 0).toLocaleString()}
          </div>
          <div className="text-xs text-chocolate-500 mt-1">
            Estimated market value at full retail checkout
          </div>
        </div>

        <div className="p-5 bg-white border border-cream-200/90 rounded-2xl shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-chocolate-400">
            Estimated Stock Profit Margin
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            ₹{(products.reduce((acc, p) => acc + (p.stock * p.sellingPrice), 0) - metrics.totalInventoryValuation).toLocaleString()}
          </div>
          <div className="text-xs text-chocolate-500 mt-1">
            Unrealized gross margin on current physical inventory
          </div>
        </div>
      </div>

      {/* Timeframe Financial & Stock Reporting Charts */}
      <FinancialReportCharts />

      {/* Report Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-cream-300 pb-2">
        <button
          onClick={() => setSelectedReport('valuation')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            selectedReport === 'valuation'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <Package className="w-4 h-4" />
          <span>Category & Stock Valuation</span>
        </button>

        <button
          onClick={() => setSelectedReport('lowstock')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            selectedReport === 'lowstock'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Low Stock Reorder Schedule ({metrics.lowStockCount})</span>
        </button>

        <button
          onClick={() => setSelectedReport('sales')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            selectedReport === 'sales'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sales & Revenue Ledger</span>
        </button>

        <button
          onClick={() => setSelectedReport('purchases')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            selectedReport === 'purchases'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Supplier Procurement Sheet</span>
        </button>
      </div>

      {/* Report 1: Valuation */}
      {selectedReport === 'valuation' && (
        <div className="space-y-4">
          
          {/* Category Summary Breakdown */}
          <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 bg-cream-50 border-b border-cream-200">
              <h3 className="text-sm font-bold text-chocolate-950">Category Valuation Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Garment Category</th>
                    <th className="py-3 px-3 text-center">Catalog Items</th>
                    <th className="py-3 px-3 text-center">Units in Stock</th>
                    <th className="py-3 px-3 text-right">Cost Value (₹)</th>
                    <th className="py-3 px-3 text-right">Retail Value (₹)</th>
                    <th className="py-3 px-4 text-right">Estimated Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {categorySummary.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-chocolate-900">{cat.category}</td>
                      <td className="py-3 px-3 text-center text-chocolate-600">{cat.itemCount} items</td>
                      <td className="py-3 px-3 text-center font-bold text-chocolate-950">{cat.units} pcs</td>
                      <td className="py-3 px-3 text-right text-chocolate-700">₹{cat.costValuation.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-semibold text-burnt-600">₹{cat.retailValuation.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-emerald-700">₹{cat.margin.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Itemized Valuation Table */}
          <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 bg-cream-50 border-b border-cream-200 flex justify-between items-center">
              <h3 className="text-sm font-bold text-chocolate-950">Itemized Inventory Valuation</h3>
              <span className="text-xs text-chocolate-500">{products.length} Garments</span>
            </div>
            <div className="overflow-x-auto max-h-96 relative">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead
                  className="border-b border-cream-300 text-chocolate-950 font-black uppercase tracking-wider text-[10px] sticky top-0 z-10 shadow-xs"
                  style={{ backgroundColor: '#F4EBD9' }}
                >
                  <tr>
                    <th className="py-3 px-4" style={{ backgroundColor: '#F4EBD9' }}>Garment</th>
                    <th className="py-3 px-3" style={{ backgroundColor: '#F4EBD9' }}>SKU</th>
                    <th className="py-3 px-3 text-center" style={{ backgroundColor: '#F4EBD9' }}>Stock</th>
                    <th className="py-3 px-3 text-right" style={{ backgroundColor: '#F4EBD9' }}>Unit Cost</th>
                    <th className="py-3 px-3 text-right" style={{ backgroundColor: '#F4EBD9' }}>Unit Retail</th>
                    <th className="py-3 px-3 text-right" style={{ backgroundColor: '#F4EBD9' }}>Total Cost Asset</th>
                    <th className="py-3 px-4 text-right" style={{ backgroundColor: '#F4EBD9' }}>Potential Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 bg-white">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-chocolate-900">{p.name}</td>
                      <td className="py-2.5 px-3 font-mono text-chocolate-500 font-semibold">{p.sku}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-chocolate-950">{p.stock} pcs</td>
                      <td className="py-2.5 px-3 text-right text-chocolate-700 font-medium">₹{p.costPrice}</td>
                      <td className="py-2.5 px-3 text-right text-burnt-600 font-bold">₹{p.sellingPrice}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-chocolate-950">
                        ₹{(p.stock * p.costPrice).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 text-right font-extrabold text-emerald-700">
                        ₹{(p.stock * p.sellingPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Report 2: Low Stock */}
      {selectedReport === 'lowstock' && (
        <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 bg-burnt-50/50 border-b border-burnt-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-burnt-950">Critical Low Stock & Deficit Sheet</h3>
            <span className="text-xs font-bold text-burnt-800">{metrics.lowStockCount} items requiring action</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Current</th>
                  <th className="py-3 px-3 text-center">Safety Level</th>
                  <th className="py-3 px-3 text-center">Deficit</th>
                  <th className="py-3 px-4">Supplier Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {metrics.lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50/70">
                    <td className="py-3 px-4 font-bold text-chocolate-900">{p.name}</td>
                    <td className="py-3 px-3 font-mono text-chocolate-400">{p.sku}</td>
                    <td className="py-3 px-3"><CategoryBadge category={p.category} /></td>
                    <td className="py-3 px-3 text-center"><StockBadge stock={p.stock} minStock={p.minStock} /></td>
                    <td className="py-3 px-3 text-center font-bold text-chocolate-800">{p.minStock} pcs</td>
                    <td className="py-3 px-3 text-center font-extrabold text-rose-700">
                      -{Math.max(0, p.minStock - p.stock)} pcs
                    </td>
                    <td className="py-3 px-4 text-chocolate-700">{p.supplierName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Sales */}
      {selectedReport === 'sales' && (
        <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 bg-burnt-50/50 border-b border-burnt-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-burnt-950">Sales Revenue & Settlement Ledger</h3>
            <span className="text-xs font-bold text-burnt-800">Total: ₹{metrics.totalSalesRevenue.toLocaleString()}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3 text-right">Subtotal</th>
                  <th className="py-3 px-3 text-right">Discount</th>
                  <th className="py-3 px-3 text-right">Tax (5%)</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-cream-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-burnt-600">{s.invoiceNumber}</td>
                    <td className="py-3 px-3 text-chocolate-600">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-semibold text-chocolate-900">{s.customerName}</td>
                    <td className="py-3 px-3 text-right text-chocolate-700">₹{s.subtotal}</td>
                    <td className="py-3 px-3 text-right text-emerald-700">-₹{s.discountAmount || 0}</td>
                    <td className="py-3 px-3 text-right text-chocolate-500">+₹{s.taxAmount || 0}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-chocolate-950">₹{s.grandTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 4: Purchases */}
      {selectedReport === 'purchases' && (
        <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-chocolate-950">Supplier Outlay & Inward Procurement</h3>
            <span className="text-xs font-bold text-burnt-700">Total: ₹{metrics.totalPurchasesCost.toLocaleString()}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">PO # / Invoice</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Supplier</th>
                  <th className="py-3 px-3 text-center">Total Pieces</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Total Inward Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-burnt-600">{p.invoiceNumber}</td>
                    <td className="py-3 px-3 text-chocolate-600">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-bold text-chocolate-950">{p.supplierName}</td>
                    <td className="py-3 px-3 text-center font-bold text-chocolate-950">{p.itemCount} pcs</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-chocolate-950">
                      ₹{p.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

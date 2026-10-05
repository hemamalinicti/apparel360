import React, { useState, useMemo } from 'react';
import {
  Boxes,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  PackagePlus,
  Layers,
  History
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockBadge, SizeBadge, ColorBadge } from '../common/Badge';

export const StockManagementView = ({ onOpenAdjustStock, onOpenPurchaseOrder }) => {
  const { products, stockMovements, metrics } = useApp();

  const [activeTab, setActiveTab] = useState('ledger');
  const [movementSearch, setMovementSearch] = useState('');
  const [movementFilter, setMovementFilter] = useState('ALL');

  const filteredMovements = useMemo(() => {
    return stockMovements.filter((mov) => {
      const matchSearch =
        !movementSearch ||
        mov.productName.toLowerCase().includes(movementSearch.toLowerCase()) ||
        (mov.reference && mov.reference.toLowerCase().includes(movementSearch.toLowerCase())) ||
        mov.reason.toLowerCase().includes(movementSearch.toLowerCase()) ||
        mov.user.toLowerCase().includes(movementSearch.toLowerCase());

      const matchType = movementFilter === 'ALL' || mov.type === movementFilter;

      return matchSearch && matchType;
    });
  }, [stockMovements, movementSearch, movementFilter]);

  const exportLedgerCSV = () => {
    const headers = ['Transaction ID', 'Date & Time', 'Product', 'Type', 'Quantity', 'Previous Stock', 'New Stock', 'Reason', 'Reference', 'Operator'];
    const rows = filteredMovements.map((m) => [
      `"${m.id}"`,
      `"${new Date(m.date).toLocaleString()}"`,
      `"${m.productName}"`,
      `"${m.type}"`,
      m.quantity,
      m.previousStock,
      m.newStock,
      `"${m.reason}"`,
      `"${m.reference || ''}"`,
      `"${m.user}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Stock_Movements_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <h1 className="text-xl font-black text-black">Stock & Inventory Management</h1>
            <span
              className="px-2.5 py-0.5 text-xs font-black rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }}
            >
              {metrics.totalStockQuantity} Units On-Hand
            </span>
          </div>
          <p className="text-xs font-bold text-black/90 mt-0.5">
            Audit stock in/out events, track manual adjustments, and monitor reorder levels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportLedgerCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors border hover:bg-white"
            style={{ backgroundColor: '#FAF5EB', borderColor: '#CB4E14', color: '#000000' }}
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span className="text-black">Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex gap-2 border-b border-cream-300 pb-2">
        <button
          onClick={() => setActiveTab('ledger')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            activeTab === 'ledger'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <History className="w-4 h-4" />
          <span>Stock Movement Ledger ({stockMovements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reorder')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            activeTab === 'reorder'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reorder & Low Stock Alerts ({metrics.lowStockCount})</span>
        </button>
      </div>

      {/* Tab 1: Stock Movement Ledger */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-cream-200/90 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by garment, invoice #, reason, operator..."
                value={movementSearch}
                onChange={(e) => setMovementSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-cream-50 rounded-xl border border-cream-200 focus:border-burnt-500 outline-none text-chocolate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
              <span className="text-black font-extrabold mr-1">Event Type:</span>
              <button
                onClick={() => setMovementFilter('ALL')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
                style={
                  movementFilter === 'ALL'
                    ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
                    : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
                }
              >
                All
              </button>
              <button
                onClick={() => setMovementFilter('STOCK_IN')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
                style={
                  movementFilter === 'STOCK_IN'
                    ? { backgroundColor: '#15803D', color: '#FFFFFF', borderColor: '#15803D' }
                    : { backgroundColor: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' }
                }
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Stock In</span>
              </button>
              <button
                onClick={() => setMovementFilter('STOCK_OUT')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
                style={
                  movementFilter === 'STOCK_OUT'
                    ? { backgroundColor: '#BE123C', color: '#FFFFFF', borderColor: '#BE123C' }
                    : { backgroundColor: '#FFF1F2', color: '#9F1239', borderColor: '#FECDD3' }
                }
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Stock Out</span>
              </button>
              <button
                onClick={() => setMovementFilter('ADJUSTMENT')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
                style={
                  movementFilter === 'ADJUSTMENT'
                    ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
                    : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
                }
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Adjustments</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-3">Garment Item</th>
                    <th className="py-3.5 px-3">Type</th>
                    <th className="py-3.5 px-3 text-center">Change Qty</th>
                    <th className="py-3.5 px-3 text-center">Before &rarr; After</th>
                    <th className="py-3.5 px-3">Reason / Ref</th>
                    <th className="py-3.5 px-4 text-right">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {filteredMovements.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-chocolate-400">
                        No movement records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMovements.map((mov) => {
                      const isStockIn = mov.type === 'STOCK_IN';
                      const isStockOut = mov.type === 'STOCK_OUT';

                      return (
                        <tr key={mov.id} className="hover:bg-cream-50/70 transition-colors">
                          <td className="py-3 px-4 text-chocolate-700 whitespace-nowrap">
                            <div className="font-semibold text-chocolate-900">
                              {new Date(mov.date).toLocaleDateString()}
                            </div>
                            <div className="text-[10px] text-chocolate-400">
                              {new Date(mov.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          <td className="py-3 px-3 font-bold text-chocolate-950 max-w-[200px] truncate">
                            {mov.productName}
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isStockIn
                                  ? 'bg-burnt-50 text-burnt-700 border border-burnt-200'
                                  : isStockOut
                                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                  : 'bg-cream-100 text-chocolate-800 border border-cream-200'
                              }`}
                            >
                              {isStockIn && <ArrowUpRight className="w-3 h-3" />}
                              {isStockOut && <ArrowDownRight className="w-3 h-3" />}
                              {!isStockIn && !isStockOut && <RefreshCw className="w-3 h-3" />}
                              {mov.type.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span
                              className={`font-extrabold text-sm ${
                                isStockIn
                                  ? 'text-burnt-700'
                                  : isStockOut
                                  ? 'text-rose-700'
                                  : 'text-chocolate-800'
                              }`}
                            >
                              {isStockIn ? `+${mov.quantity}` : isStockOut ? `-${mov.quantity}` : `${mov.quantity}`} pcs
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center text-chocolate-600 font-mono">
                            {mov.previousStock} &rarr; <strong className="text-chocolate-950">{mov.newStock}</strong>
                          </td>

                          <td className="py-3 px-3 max-w-[220px]">
                            <div className="text-chocolate-900 font-medium truncate">{mov.reason}</div>
                            {mov.reference && (
                              <span className="text-[10px] font-mono text-chocolate-500 bg-cream-100 px-1 py-0.5 rounded">
                                {mov.reference}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right font-bold text-chocolate-800 whitespace-nowrap">
                            <span
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold border"
                              style={{
                                backgroundColor: (mov.user && mov.user.toLowerCase().includes('staff')) ? '#FAF5EB' : '#FAF5EB',
                                borderColor: '#DEC5A6',
                                color: '#1B0E06'
                              }}
                            >
                              {mov.user && mov.user.includes('(')
                                ? mov.user.split('(')[1].replace(')', '').trim()
                                : (mov.user && mov.user.toLowerCase().includes('admin') ? 'Admin' : (mov.user || 'Admin'))}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Reorder & Low Stock Alerts */}
      {activeTab === 'reorder' && (
        <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 bg-burnt-50/50 border-b border-burnt-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-burnt-600" />
              <div>
                <h3 className="text-sm font-bold text-burnt-950">Recommended Reorder Plan</h3>
                <p className="text-xs text-burnt-800">
                  Garments currently below their safety threshold that require purchasing.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPurchaseOrder}
              className="px-5 py-2.5 text-xs font-black rounded-xl text-white shadow-md transition-all active:scale-95 cursor-pointer"
              style={{
                backgroundColor: '#1B0E06',
                border: '1px solid #1B0E06',
                color: '#FFFFFF'
              }}
            >
              Create Purchase Order
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Garment Item</th>
                  <th className="py-3.5 px-3">Size / Color</th>
                  <th className="py-3.5 px-3 text-center">Current Stock</th>
                  <th className="py-3.5 px-3 text-center">Min Threshold</th>
                  <th className="py-3.5 px-3 text-center">Suggested Reorder</th>
                  <th className="py-3.5 px-3">Supplier</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {metrics.lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-chocolate-400">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                      All inventory stock levels are healthy! No reorders required right now.
                    </td>
                  </tr>
                ) : (
                  metrics.lowStockProducts.map((prod) => {
                    const suggestedOrderQty = Math.max(20, (prod.minStock || 10) * 2 - prod.stock);

                    return (
                      <tr key={prod.id} className="hover:bg-cream-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-chocolate-950">{prod.name}</div>
                          <div className="font-mono text-[11px] text-chocolate-400">{prod.sku}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <SizeBadge size={prod.size} />
                            <ColorBadge color={prod.color} hex={prod.colorHex} />
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <StockBadge stock={prod.stock} minStock={prod.minStock} />
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-chocolate-800">
                          {prod.minStock || 10} pcs
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span
                            className="font-extrabold px-2.5 py-1 rounded-lg border text-xs"
                            style={{ backgroundColor: '#FFF7ED', color: '#9A3412', borderColor: '#FED7AA' }}
                          >
                            +{suggestedOrderQty} pcs
                          </span>
                        </td>

                        <td className="py-3 px-3 text-chocolate-700">
                          {prod.supplierName || 'General Supplier'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onOpenAdjustStock(prod)}
                            className="px-3.5 py-1.5 text-xs font-bold rounded-xl border shadow-xs transition-colors hover:bg-white cursor-pointer"
                            style={{ backgroundColor: '#FAF5EB', borderColor: '#CB4E14', color: '#000000' }}
                          >
                            Quick Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

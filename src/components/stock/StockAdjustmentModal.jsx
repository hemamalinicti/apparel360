import React, { useState, useEffect } from 'react';
import { X, Boxes, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockBadge } from '../common/Badge';

export const StockAdjustmentModal = ({ isOpen, onClose, product }) => {
  const { adjustStock } = useApp();

  const [mode, setMode] = useState('IN');
  const [quantity, setQuantity] = useState('10');
  const [reason, setReason] = useState('New batch received from supplier');
  const [reference, setReference] = useState('');

  useEffect(() => {
    if (mode === 'IN') {
      setReason('Stock Replenishment / Supplier Batch');
    } else if (mode === 'OUT') {
      setReason('Damaged piece write-off / Sample dispatch');
    } else {
      setReason('Physical Inventory Audit Count Correction');
    }
  }, [mode]);

  if (!isOpen || !product) return null;

  const currentStock = Number(product.stock) || 0;
  const qtyNum = Number(quantity) || 0;
  
  let newStockCalc = currentStock;
  if (mode === 'IN') newStockCalc = currentStock + qtyNum;
  else if (mode === 'OUT') newStockCalc = Math.max(0, currentStock - qtyNum);
  else if (mode === 'ADJUST') newStockCalc = Math.max(0, qtyNum);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (qtyNum <= 0 && mode !== 'ADJUST') {
      alert('Please enter a valid quantity.');
      return;
    }

    let delta = 0;
    let type = 'STOCK_IN';

    if (mode === 'IN') {
      delta = qtyNum;
      type = 'STOCK_IN';
    } else if (mode === 'OUT') {
      delta = -qtyNum;
      type = 'STOCK_OUT';
    } else if (mode === 'ADJUST') {
      delta = newStockCalc - currentStock;
      type = 'ADJUSTMENT';
    }

    adjustStock(product.id, delta, type, reason, reference || `ADJ-${Date.now().toString().slice(-4)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-chocolate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-cream-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-chocolate-800 text-cream-100 flex items-center justify-center font-bold shrink-0">
              <Boxes className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-chocolate-950">
                Stock Adjustment & Restock
              </h2>
              <p className="text-[11px] sm:text-xs text-chocolate-500">
                Update on-hand physical stock quantity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-chocolate-400 hover:text-chocolate-800 hover:bg-cream-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs sm:text-sm flex-1">
          
          {/* Target Product Summary Card */}
          <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-chocolate-950">{product.name}</p>
              <p className="text-xs text-chocolate-500 font-mono">
                SKU: {product.sku} • {product.size} • {product.color}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-chocolate-400">Current Stock</div>
              <div className="text-sm font-extrabold text-chocolate-950">{currentStock} pcs</div>
            </div>
          </div>

          {/* Operation Type Switcher */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-black">Adjustment Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMode('IN')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs border transition-all shadow-xs"
                style={
                  mode === 'IN'
                    ? { backgroundColor: '#15803D', color: '#FFFFFF', borderColor: '#15803D' }
                    : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
                }
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Stock In (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('OUT')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs border transition-all shadow-xs"
                style={
                  mode === 'OUT'
                    ? { backgroundColor: '#BE123C', color: '#FFFFFF', borderColor: '#BE123C' }
                    : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
                }
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Stock Out (-)</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('ADJUST')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs border transition-all shadow-xs"
                style={
                  mode === 'ADJUST'
                    ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
                    : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
                }
              >
                <RefreshCw className="w-4 h-4" />
                <span>Direct Set (=)</span>
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-black">
              {mode === 'ADJUST' ? 'Set New Total Stock Count *' : 'Quantity to Add / Deduct *'}
            </label>
            <input
              type="number"
              min="0"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-extrabold text-base text-black bg-white"
            />
          </div>

          {/* Real-time Calculation Result */}
          <div className="p-3 bg-cream-100 rounded-xl border border-cream-200 flex items-center justify-between text-xs">
            <span className="text-black font-bold">Resulting Stock Level:</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-black text-sm">{newStockCalc} pcs</span>
              <StockBadge stock={newStockCalc} minStock={product.minStock} />
            </div>
          </div>

          {/* Reason Note */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-black">Reason / Notes *</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Received new shipment, return from display..."
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-xs font-semibold text-black placeholder:text-chocolate-400 bg-white"
            />
          </div>

          {/* Reference # */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-black">Reference / Invoice # (Optional)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. PO-8891 or MEMO-02"
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-xs font-mono font-semibold text-black placeholder:text-chocolate-400 bg-white"
            />
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-cream-50 border-t border-cream-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl text-black hover:bg-cream-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-md transition-all active:scale-95"
            style={{ backgroundColor: '#1B0E06', border: '1px solid #1B0E06' }}
          >
            Confirm Stock Update
          </button>
        </div>

      </div>
    </div>
  );
};

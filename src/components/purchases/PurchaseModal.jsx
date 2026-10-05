import React, { useState } from 'react';
import { X, PackagePlus, Plus, Trash2, IndianRupee, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PurchaseModal = ({ isOpen, onClose, initialProductId }) => {
  const { suppliers, products, addPurchase } = useApp();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-4)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [notes, setNotes] = useState('Stock Inward Shipment');

  const [items, setItems] = useState(() => {
    const defaultProd = initialProductId
      ? products.find((p) => p.id === initialProductId)
      : products[0];
    return [
      {
        productId: defaultProd?.id || '',
        productName: defaultProd?.name || '',
        quantity: 20,
        unitCost: defaultProd?.costPrice || 250,
        subtotal: 20 * (defaultProd?.costPrice || 250)
      }
    ];
  });

  if (!isOpen) return null;

  const handleProductSelect = (index, prodId) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const unitCost = prod.costPrice || 200;
          return {
            ...item,
            productId: prod.id,
            productName: prod.name,
            unitCost,
            subtotal: (Number(item.quantity) || 1) * unitCost
          };
        }
        return item;
      })
    );
  };

  const handleQtyChange = (index, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? { ...item, quantity: q, subtotal: q * (Number(item.unitCost) || 0) }
          : item
      )
    );
  };

  const handleCostChange = (index, cost) => {
    const c = Math.max(0, Number(cost) || 0);
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? { ...item, unitCost: c, subtotal: (Number(item.quantity) || 1) * c }
          : item
      )
    );
  };

  const addItemRow = () => {
    const defaultProd = products[0];
    setItems((prev) => [
      ...prev,
      {
        productId: defaultProd?.id || '',
        productName: defaultProd?.name || '',
        quantity: 10,
        unitCost: defaultProd?.costPrice || 200,
        subtotal: 10 * (defaultProd?.costPrice || 200)
      }
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) {
      alert('At least one garment item is required.');
      return;
    }
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);
  const totalItemCount = items.reduce((acc, item) => acc + Number(item.quantity), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === supplierId);

    const purchaseData = {
      supplierId,
      supplierName: sup ? sup.name : 'Unknown Supplier',
      invoiceNumber: invoiceNumber.trim() || `INV-${Date.now().toString().slice(-4)}`,
      date,
      paymentStatus,
      notes,
      items,
      totalAmount,
      itemCount: totalItemCount
    };

    addPurchase(purchaseData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-chocolate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-cream-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-chocolate-800 text-cream-100 flex items-center justify-center font-bold shrink-0">
              <PackagePlus className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-chocolate-950">
                Record Stock In / Purchase Order
              </h2>
              <p className="text-[11px] sm:text-xs text-chocolate-500">
                Inward inventory from mill/supplier with automatic stock increment
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 text-xs sm:text-sm">
          
          {/* Top Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Supplier *</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 bg-white font-medium outline-none text-xs text-chocolate-900"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Supplier Invoice # *</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-mono text-xs font-bold text-chocolate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Receiving Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-xs text-chocolate-900"
              />
            </div>
          </div>

          {/* Garments Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-chocolate-800 uppercase tracking-wider text-xs">
                Inward Garments List ({items.length} lines)
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1 text-xs font-bold text-burnt-700 hover:text-burnt-800 bg-burnt-50 hover:bg-burnt-100 px-2.5 py-1 rounded-lg transition-colors border border-burnt-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item Line
              </button>
            </div>

            <div className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100 border-b border-cream-200 text-chocolate-700 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Garment Item</th>
                    <th className="py-2.5 px-2 w-24">Inward Qty</th>
                    <th className="py-2.5 px-2 w-28">Unit Cost (₹)</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                    <th className="py-2.5 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {items.map((item, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="py-2 px-3">
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-cream-300 bg-white text-xs font-medium outline-none text-chocolate-900"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku} • {p.size})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleQtyChange(idx, e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-cream-300 font-bold text-center outline-none text-xs text-chocolate-900"
                        />
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitCost}
                          onChange={(e) => handleCostChange(idx, e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-cream-300 font-bold text-right outline-none text-xs text-chocolate-900"
                        />
                      </td>

                      <td className="py-2 px-3 text-right font-extrabold text-chocolate-950">
                        ₹{item.subtotal.toLocaleString()}
                      </td>

                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1 text-chocolate-300 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment & Summary Totals */}
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <div>
                <label className="text-[10px] uppercase font-bold text-chocolate-400 block">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="mt-0.5 px-2.5 py-1 rounded-lg border border-cream-300 bg-white text-xs font-semibold text-chocolate-900"
                >
                  <option value="Paid">Paid in Full</option>
                  <option value="Pending">Pending / Credit</option>
                  <option value="Partial">Partial Advance</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-chocolate-400 block">Total Units</label>
                <div className="text-sm font-bold text-chocolate-900 mt-0.5">{totalItemCount} pcs</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-chocolate-400 block">Total Inward Value</span>
              <span className="text-xl font-extrabold text-burnt-600">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-bold text-chocolate-800">Shipment / Purchase Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Festival batch restock, freight paid"
              className="w-full px-3 py-1.5 rounded-xl border border-cream-300 outline-none text-xs text-chocolate-900"
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
            className="px-6 py-2.5 text-xs font-black rounded-xl text-white shadow-lg transition-all transform active:scale-95 cursor-pointer"
            style={{
              backgroundColor: '#E86526',
              backgroundImage: 'linear-gradient(135deg, #CB4E14, #E86526)',
              border: '1px solid #A73B0C',
              boxShadow: '0 4px 14px rgba(203, 78, 20, 0.4)',
              color: '#FFFFFF'
            }}
          >
            Record Purchase & Inward Stock
          </button>
        </div>

      </div>
    </div>
  );
};

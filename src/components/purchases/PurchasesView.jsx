import React, { useState } from 'react';
import { Plus, Receipt, Search, Download, CheckCircle2, Clock, Truck, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PurchasesView = ({ onOpenNewPurchase }) => {
  const { purchases, metrics } = useApp();
  const [search, setSearch] = useState('');

  const filteredPurchases = purchases.filter((p) => {
    const matchSearch =
      !search ||
      p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  const exportPurchasesCSV = () => {
    const headers = ['PO Number', 'Invoice Number', 'Supplier', 'Date', 'Total Amount', 'Item Count', 'Payment Status', 'Notes'];
    const rows = filteredPurchases.map((p) => [
      `"${p.id}"`,
      `"${p.invoiceNumber}"`,
      `"${p.supplierName}"`,
      p.date,
      p.totalAmount,
      p.itemCount,
      `"${p.paymentStatus}"`,
      `"${p.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Purchase_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
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
            <h1 className="text-xl font-black text-black">Purchase Entries & Inward Stock</h1>
            <span
              className="px-2.5 py-0.5 text-xs font-black rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }}
            >
              {purchases.length} Orders
            </span>
          </div>
          <p className="text-xs font-bold text-black/90 mt-0.5">
            Log procurement from fabric mills and garment manufacturers with automatic inventory restocking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportPurchasesCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors border hover:bg-white"
            style={{ backgroundColor: '#FAF5EB', borderColor: '#CB4E14', color: '#000000' }}
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span className="text-black">Export CSV</span>
          </button>

          <button
            onClick={() => onOpenNewPurchase()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-md shadow-black/20 transition-all transform active:scale-95"
            style={{ backgroundColor: '#2A170C', border: '1px solid #1B0E06' }}
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Record Stock In</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200/90 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search supplier, invoice # or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-cream-50 rounded-xl border border-cream-200 focus:border-burnt-500 outline-none text-chocolate-900"
          />
        </div>

        <div className="text-xs text-chocolate-600 hidden sm:block font-medium">
          Total Outlay: <strong className="text-chocolate-950">₹{metrics.totalPurchasesCost.toLocaleString()}</strong>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">PO / Invoice #</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Supplier Name</th>
                <th className="py-3.5 px-3">Purchased Items</th>
                <th className="py-3.5 px-3 text-center">Total Quantity</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-chocolate-400">
                    No purchase orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((po) => (
                  <tr key={po.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-burnt-600">{po.invoiceNumber}</div>
                      <div className="text-[10px] text-chocolate-400 font-mono">{po.id}</div>
                    </td>

                    <td className="py-3 px-3 text-chocolate-600 whitespace-nowrap">
                      {new Date(po.date).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-3 font-bold text-chocolate-950">
                      {po.supplierName}
                    </td>

                    <td className="py-3 px-3 max-w-[220px]">
                      <div className="text-chocolate-900 font-medium truncate">
                        {po.items.map((i) => `${i.productName} (${i.quantity} pcs)`).join(', ')}
                      </div>
                      {po.notes && (
                        <div className="text-[10px] text-chocolate-400 truncate">{po.notes}</div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-chocolate-950">
                      {po.itemCount} pcs
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {po.paymentStatus || 'Paid'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-chocolate-950">
                      ₹{po.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

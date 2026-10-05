import React from 'react';
import { X, Printer, CheckCircle2, ShoppingBag, Layers } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, sale }) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-chocolate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full flex flex-col shadow-2xl border border-cream-200 overflow-hidden">
        
        {/* Modal Controls (Not printed) */}
        <div className="px-4 py-2 bg-cream-50 border-b border-cream-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-1.5 text-xs font-bold text-chocolate-950">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sale Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-burnt-500 text-cream-50 font-bold text-xs hover:bg-burnt-600 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3 h-3" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-chocolate-400 hover:text-chocolate-800 hover:bg-cream-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-4 space-y-3 text-xs text-black bg-white">
          
          {/* Header */}
          <div className="text-center pb-2 border-b border-dashed border-cream-300">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <div className="w-5 h-5 rounded-md bg-chocolate-800 text-cream-100 flex items-center justify-center font-bold">
                <Layers className="w-3.5 h-3.5 text-burnt-400" />
              </div>
              <h2 className="text-sm font-extrabold uppercase tracking-tight text-chocolate-950">
                Apparel360
              </h2>
            </div>
            <p className="text-[10px] text-chocolate-600 font-medium">Garments & Fashion Retail • Store POS Billing</p>
            <p className="text-[9px] text-chocolate-400 font-mono">GSTIN: 33AABCT1234F1Z5</p>
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10.5px] pb-2 border-b border-dashed border-cream-300">
            <div>
              <span className="text-chocolate-500 mr-1">Inv #:</span>
              <strong className="font-mono text-black">{sale.invoiceNumber}</strong>
            </div>
            <div className="text-right">
              <span className="text-chocolate-500 mr-1">Date:</span>
              <strong className="text-black">
                {new Date(sale.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </strong>
            </div>

            <div>
              <span className="text-chocolate-500 mr-1">Cust:</span>
              <strong className="text-black">{sale.customerName || 'Walk-in'}</strong>
            </div>
            <div className="text-right">
              <span className="text-chocolate-500 mr-1">Pay:</span>
              <span className="inline-block px-1.5 py-0.2 rounded bg-cream-100 text-chocolate-900 font-bold border border-cream-200 text-[10px]">
                {sale.paymentMethod || 'Cash'}
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-cream-200 text-chocolate-600 uppercase font-bold text-[9.5px]">
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-center">Qty</th>
                  <th className="pb-1 text-right">Price</th>
                  <th className="pb-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {sale.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1 pr-1">
                      <div className="font-bold text-black text-[11px] leading-tight">{item.productName}</div>
                      <div className="text-[9px] text-chocolate-400 font-mono">{item.sku}</div>
                    </td>
                    <td className="py-1 text-center font-bold text-chocolate-900">{item.quantity}</td>
                    <td className="py-1 text-right text-chocolate-700">₹{item.price}</td>
                    <td className="py-1 text-right font-bold text-black">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Billing Totals */}
          <div className="pt-2 border-t border-dashed border-cream-300 space-y-1 text-xs">
            <div className="flex justify-between text-chocolate-700 text-[11px]">
              <span>Subtotal:</span>
              <span className="font-medium text-black">₹{sale.subtotal.toLocaleString()}</span>
            </div>

            {sale.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium text-[11px]">
                <span>Discount:</span>
                <span>- ₹{sale.discountAmount.toLocaleString()}</span>
              </div>
            )}

            {sale.taxAmount > 0 && (
              <div className="flex justify-between text-chocolate-500 text-[10px]">
                <span>GST / Tax (5%):</span>
                <span className="text-chocolate-900 font-medium">+ ₹{sale.taxAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-1.5 border-t border-cream-200 flex justify-between items-center text-sm font-black text-chocolate-950">
              <span>Grand Total:</span>
              <span className="text-base text-burnt-600 font-black">₹{sale.grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-dashed border-cream-300 text-center text-[9.5px] text-chocolate-500 leading-tight">
            <p>Thank you for shopping with us! • Exchange valid within 7 days with bill.</p>
          </div>

        </div>

        {/* Modal Bottom Footer (Not printed) */}
        <div className="p-2.5 bg-cream-50 border-t border-cream-200 no-print">
          <button
            onClick={onClose}
            className="w-full py-1.5 bg-chocolate-800 hover:bg-chocolate-900 text-cream-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
};

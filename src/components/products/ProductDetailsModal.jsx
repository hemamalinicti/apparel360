import React from 'react';
import { X, Shirt, Package, Tag, ShoppingCart, PackagePlus, Edit, Trash2, IndianRupee } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockBadge, SizeBadge, ColorBadge, CategoryBadge, GarmentImage } from '../common/Badge';

export const ProductDetailsModal = ({ isOpen, onClose, product, onEdit, onAdjustStock, onSellItem }) => {
  const { deleteProduct, currentUser } = useApp();

  if (!isOpen || !product) return null;

  const cost = Number(product.costPrice) || 0;
  const sell = Number(product.sellingPrice) || 0;
  const marginAmt = Math.max(0, sell - cost);
  const marginPct = sell > 0 ? Math.round((marginAmt / sell) * 100) : 0;
  const stockValuation = (Number(product.stock) || 0) * cost;
  const salesPotential = (Number(product.stock) || 0) * sell;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-chocolate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-cream-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-chocolate-800 text-cream-100 flex items-center justify-center font-bold">
              <Shirt className="w-5 h-5 text-burnt-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-chocolate-950 truncate max-w-sm">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-bold text-burnt-600">
                  {product.sku}
                </span>
                <CategoryBadge category={product.category} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-chocolate-400 hover:text-chocolate-800 hover:bg-cream-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-xs sm:text-sm">
          
          {/* Top image & Quick Specs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-cream-50 p-4 rounded-2xl border border-cream-200">
            <GarmentImage
              src={product.image}
              alt={product.name}
              category={product.category}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
              fallbackIconSize="w-10 h-10"
            />

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <SizeBadge size={`Size: ${product.size}`} />
                <ColorBadge color={product.color} hex={product.colorHex} />
                <StockBadge stock={product.stock} minStock={product.minStock} />
              </div>
              
              <div className="text-xs text-chocolate-700">
                <span className="font-bold text-chocolate-900">Fabric: </span>
                {product.fabric || 'Standard Garment Fabric'}
              </div>

              <div className="text-xs text-chocolate-700">
                <span className="font-bold text-chocolate-900">Supplier: </span>
                {product.supplierName || 'General Mills'}
              </div>
            </div>
          </div>

          {/* Pricing & Stock Financials */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-cream-200 rounded-xl">
              <div className="text-[10px] uppercase font-bold text-chocolate-400">Cost Price</div>
              <div className="text-base font-extrabold text-chocolate-800 mt-0.5">₹{cost}</div>
            </div>

            <div className="p-3 bg-white border border-cream-200 rounded-xl">
              <div className="text-[10px] uppercase font-bold text-chocolate-400">Selling Price</div>
              <div className="text-base font-extrabold text-burnt-600 mt-0.5">₹{sell}</div>
            </div>

            <div className="p-3 bg-white border border-cream-200 rounded-xl">
              <div className="text-[10px] uppercase font-bold text-chocolate-400">Profit Margin</div>
              <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                ₹{marginAmt} <span className="text-xs font-normal">({marginPct}%)</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-cream-200 rounded-xl">
              <div className="text-[10px] uppercase font-bold text-chocolate-400">Inventory Units</div>
              <div className="text-base font-extrabold text-chocolate-950 mt-0.5">{product.stock} pcs</div>
            </div>
          </div>

          {/* Valuation breakdown */}
          <div className="p-4 bg-cream-100 rounded-2xl border border-cream-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-chocolate-700 font-medium">Stock Asset Valuation: </span>
              <strong className="text-chocolate-950 font-bold">₹{stockValuation.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-chocolate-700 font-medium">Potential Sales: </span>
              <strong className="text-burnt-700 font-bold">₹{salesPotential.toLocaleString()}</strong>
            </div>
          </div>

          {/* Quick Actions for this product */}
          <div className="pt-2 flex flex-wrap gap-2 justify-between items-center border-t border-cream-100">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onAdjustStock(product);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 text-chocolate-800 hover:bg-cream-200 font-bold text-xs border border-cream-300 transition-colors"
              >
                <PackagePlus className="w-3.5 h-3.5 text-burnt-600" />
                Adjust / Restock
              </button>

              <button
                onClick={() => {
                  onSellItem(product);
                  onClose();
                }}
                disabled={product.stock <= 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  product.stock <= 0
                    ? 'bg-cream-100 text-chocolate-300 cursor-not-allowed'
                    : 'bg-burnt-50 text-burnt-700 hover:bg-burnt-100 border border-burnt-200'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Sell in POS
              </button>
            </div>

            {currentUser.role === 'Admin' && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onEdit(product);
                    onClose();
                  }}
                  className="p-2 rounded-xl text-chocolate-600 hover:text-chocolate-900 hover:bg-cream-100 border border-cream-200 transition-colors"
                  title="Edit Product"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                      deleteProduct(product.id);
                      onClose();
                    }
                  }}
                  className="p-2 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

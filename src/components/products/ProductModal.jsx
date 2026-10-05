import React, { useState, useEffect } from 'react';
import { X, Shirt, IndianRupee, Sparkles, Image, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSizeStyle } from '../common/Badge';

export const ProductModal = ({ isOpen, onClose, productToEdit }) => {
  const { categories, sizes, colors, suppliers, addProduct, updateProduct } = useApp();

  const isEditing = !!productToEdit;

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    categoryId: '',
    category: '',
    size: 'M',
    color: 'Pure White',
    colorHex: '#ffffff',
    costPrice: '',
    sellingPrice: '',
    stock: '',
    minStock: '10',
    supplierId: '',
    supplierName: '',
    fabric: '100% Combed Cotton',
    image: ''
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        sku: productToEdit.sku || '',
        name: productToEdit.name || '',
        categoryId: productToEdit.categoryId || (categories[0]?.id || ''),
        category: productToEdit.category || (categories[0]?.name || ''),
        size: productToEdit.size || 'M',
        color: productToEdit.color || 'Pure White',
        colorHex: productToEdit.colorHex || '#ffffff',
        costPrice: productToEdit.costPrice?.toString() || '',
        sellingPrice: productToEdit.sellingPrice?.toString() || '',
        stock: productToEdit.stock?.toString() || '',
        minStock: productToEdit.minStock?.toString() || '10',
        supplierId: productToEdit.supplierId || (suppliers[0]?.id || ''),
        supplierName: productToEdit.supplierName || (suppliers[0]?.name || ''),
        fabric: productToEdit.fabric || '100% Combed Cotton',
        image: productToEdit.image || ''
      });
    } else {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setFormData({
        sku: `GAR-CT-${randomSuffix}`,
        name: '',
        categoryId: categories[0]?.id || '',
        category: categories[0]?.name || '',
        size: 'M',
        color: colors[0]?.name || 'Pure White',
        colorHex: colors[0]?.hex || '#ffffff',
        costPrice: '',
        sellingPrice: '',
        stock: '25',
        minStock: '10',
        supplierId: suppliers[0]?.id || '',
        supplierName: suppliers[0]?.name || '',
        fabric: '100% Combed Cotton (180 GSM)',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=60'
      });
    }
  }, [productToEdit, isOpen, categories, suppliers, colors]);

  if (!isOpen) return null;

  const cost = Number(formData.costPrice) || 0;
  const sell = Number(formData.sellingPrice) || 0;
  const marginAmt = Math.max(0, sell - cost);
  const marginPct = sell > 0 ? Math.round((marginAmt / sell) * 100) : 0;

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const catObj = categories.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      categoryId: catId,
      category: catObj ? catObj.name : ''
    }));
  };

  const handleSupplierChange = (e) => {
    const supId = e.target.value;
    const supObj = suppliers.find((s) => s.id === supId);
    setFormData((prev) => ({
      ...prev,
      supplierId: supId,
      supplierName: supObj ? supObj.name : ''
    }));
  };

  const handleColorChange = (col) => {
    setFormData((prev) => ({
      ...prev,
      color: col.name,
      colorHex: col.hex
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim()) {
      alert('Please fill in garment name and SKU code.');
      return;
    }

    if (isEditing) {
      updateProduct(productToEdit.id, formData);
    } else {
      addProduct(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-chocolate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-cream-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-chocolate-800 text-cream-100 flex items-center justify-center font-bold shrink-0">
              <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-chocolate-950">
                {isEditing ? 'Edit Garment Product' : 'Add New Garment to Stock'}
              </h2>
              <p className="text-[11px] sm:text-xs text-chocolate-500">
                {isEditing ? 'Update specifications & pricing' : 'Record SKU and inventory parameters'}
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
          
          {/* Row 1: Garment Name & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-chocolate-800">Garment Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Slim Fit Linen Cotton Shirt"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 focus:ring-2 focus:ring-burnt-100 outline-none transition-all font-medium text-chocolate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">SKU Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. SHT-LIN-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 focus:ring-2 focus:ring-burnt-100 outline-none transition-all font-mono font-bold text-chocolate-900"
              />
            </div>
          </div>

          {/* Row 2: Category & Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Category *</label>
              <select
                value={formData.categoryId}
                onChange={handleCategoryChange}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none bg-white font-medium text-chocolate-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Supplier *</label>
              <select
                value={formData.supplierId}
                onChange={handleSupplierChange}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none bg-white font-medium text-chocolate-900"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Size & Color Select */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-chocolate-800">Size Variation *</label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-chocolate-600">Selected:</span>
                <span
                  className="px-2.5 py-0.5 rounded-md text-xs font-black shadow-2xs border"
                  style={getSizeStyle(formData.size, true)}
                >
                  {formData.size}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => {
                const isSelected = formData.size === sz.name;
                const style = getSizeStyle(sz.name, isSelected);
                return (
                  <button
                    type="button"
                    key={sz.id}
                    onClick={() => setFormData({ ...formData, size: sz.name })}
                    style={style}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 transform active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-offset-1 ring-burnt-500 shadow-md scale-105'
                        : 'hover:bg-cream-100 hover:border-chocolate-400'
                    }`}
                  >
                    <span>{sz.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Swatch Picker */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-chocolate-800">Garment Color *</label>
              <div className="flex items-center gap-2 text-xs font-semibold text-chocolate-800">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-cream-300 shadow-2xs"
                  style={{ backgroundColor: formData.colorHex }}
                />
                <span>{formData.color}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((col) => {
                const isSelected = formData.color === col.name;
                return (
                  <button
                    type="button"
                    key={col.id}
                    onClick={() => handleColorChange(col)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-burnt-500 bg-burnt-50 ring-2 ring-burnt-500/20 font-bold text-burnt-800'
                        : 'border-cream-300 hover:border-cream-400 bg-white text-chocolate-800'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-cream-300 shadow-2xs"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-burnt-600 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Pricing & Margin Calculator */}
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold text-chocolate-700 uppercase tracking-wider">
              Pricing & Profit Analysis
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate-600">Cost Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="350"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full pl-7 pr-3 py-1.5 bg-white rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-bold text-chocolate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-chocolate-600">Selling Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    placeholder="799"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full pl-7 pr-3 py-1.5 bg-white rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-bold text-chocolate-900"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-white border border-cream-200 rounded-xl flex flex-col justify-center">
                <div className="text-[10px] uppercase font-bold text-chocolate-400">Profit Margin</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-extrabold text-burnt-600">₹{marginAmt}</span>
                  <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-burnt-50 text-burnt-700">
                    {marginPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Stock & Min Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Opening Stock Units *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="25"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-extrabold text-chocolate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Low Stock Alert Level</label>
              <input
                type="number"
                min="1"
                placeholder="10"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-medium text-chocolate-900"
              />
            </div>
          </div>

          {/* Row 6: Fabric composition & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Fabric Composition</label>
              <input
                type="text"
                placeholder="e.g. 100% Bio-Wash Combed Cotton"
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-xs text-chocolate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-xs text-chocolate-900 truncate"
              />
            </div>
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
            {isEditing ? 'Save Changes' : 'Add Garment to Catalog'}
          </button>
        </div>

      </div>
    </div>
  );
};

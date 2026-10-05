import React, { useState } from 'react';
import {
  Sliders,
  Layers,
  Palette,
  Maximize2,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSizeStyle } from '../common/Badge';

export const MasterSettingsView = () => {
  const {
    categories,
    addCategory,
    deleteCategory,
    sizes,
    addSize,
    deleteSize,
    colors,
    addColor,
    deleteColor,
    products,
    resetToDemoData,
    exportDatabase,
    importDatabase,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState('categories');

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Size Form
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizeCat, setNewSizeCat] = useState('General');

  // New Color Form
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#CB4E14');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      code: newCatCode.trim() || newCatName.slice(0, 3).toUpperCase(),
      description: newCatDesc.trim() || 'Apparel Category'
    });
    setNewCatName('');
    setNewCatCode('');
    setNewCatDesc('');
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    if (!newSizeName.trim()) return;
    addSize({
      name: newSizeName.trim().toUpperCase(),
      category: newSizeCat
    });
    setNewSizeName('');
  };

  const handleAddColor = (e) => {
    e.preventDefault();
    if (!newColorName.trim()) return;
    addColor({
      name: newColorName.trim(),
      hex: newColorHex
    });
    setNewColorName('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        importDatabase(parsed);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
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
            <h1 className="text-xl font-black text-black">Master Setup & Attributes</h1>
            <span
              className="px-2.5 py-0.5 text-xs font-black rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }}
            >
              Admin Control Panel
            </span>
          </div>
          <p className="text-xs font-bold text-black/90 mt-0.5">
            Manage garment categories, standardized sizing charts, color swatches, and localStorage data backups.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-cream-300 pb-2">
        <button
          onClick={() => setActiveTab('categories')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            activeTab === 'categories'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sizes')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            activeTab === 'sizes'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <Maximize2 className="w-4 h-4" />
          <span>Sizes & Dimensions ({sizes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            activeTab === 'colors'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <Palette className="w-4 h-4" />
          <span>Color Swatches ({colors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
          style={
            activeTab === 'data'
              ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
              : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
          }
        >
          <HardDrive className="w-4 h-4" />
          <span>Data Backup & Storage</span>
        </button>
      </div>

      {/* Tab 1: Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Category Form */}
          <div className="bg-white p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-chocolate-950">Add Garment Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-chocolate-800">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Formal Blazers"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-chocolate-900"
                />
              </div>

              <div>
                <label className="font-bold text-chocolate-800">Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. BLZ"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value.toUpperCase())}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-mono uppercase text-chocolate-900"
                />
              </div>

              <div>
                <label className="font-bold text-chocolate-800">Description</label>
                <textarea
                  rows="2"
                  placeholder="Suit jackets and formal blazers..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none resize-none text-chocolate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-black rounded-xl text-white shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: '#E86526',
                  backgroundImage: 'linear-gradient(135deg, #CB4E14, #E86526)',
                  border: '1px solid #A73B0C',
                  boxShadow: '0 4px 14px rgba(203, 78, 20, 0.4)',
                  color: '#FFFFFF'
                }}
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Save Category</span>
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 bg-cream-50 border-b border-cream-200">
              <h3 className="text-sm font-bold text-chocolate-950">Configured Garment Categories</h3>
            </div>
            <div className="divide-y divide-cream-100 text-xs">
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id || p.category === cat.name).length;
                return (
                  <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-cream-50/70 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-chocolate-950">{cat.name}</span>
                        {cat.code && (
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-cream-100 text-chocolate-700 border border-cream-200">
                            {cat.code}
                          </span>
                        )}
                        <span className="text-xs text-burnt-600 font-bold">
                          ({count} garments)
                        </span>
                      </div>
                      <p className="text-chocolate-500 mt-0.5 text-[11px]">{cat.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 text-chocolate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Sizes */}
      {activeTab === 'sizes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-chocolate-950">Add Standard Size</h3>
            <form onSubmit={handleAddSize} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-chocolate-800">Size Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4XL or 36 (XL)"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-bold font-mono text-chocolate-900"
                />
              </div>

              <div>
                <label className="font-bold text-chocolate-800">Group / Category</label>
                <select
                  value={newSizeCat}
                  onChange={(e) => setNewSizeCat(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 bg-white outline-none text-chocolate-900"
                >
                  <option value="General">General (S, M, L, XL)</option>
                  <option value="Waist / Inseam">Waist / Inseam (28, 30, 32...)</option>
                  <option value="Ethnic/Accessories">Ethnic / Free Size</option>
                  <option value="Kids">Kids Age (2-3Y, 4-5Y...)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-black rounded-xl text-white shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: '#E86526',
                  backgroundImage: 'linear-gradient(135deg, #CB4E14, #E86526)',
                  border: '1px solid #A73B0C',
                  boxShadow: '0 4px 14px rgba(203, 78, 20, 0.4)',
                  color: '#FFFFFF'
                }}
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Save Size</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-200/90 shadow-2xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-chocolate-950">Active Garment Sizes</h3>
            <div className="flex flex-wrap gap-2.5">
              {sizes.map((sz) => {
                const style = getSizeStyle(sz.name, true);
                return (
                  <div
                    key={sz.id}
                    style={style}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black shadow-xs font-mono"
                  >
                    <span>{sz.name}</span>
                    <button
                      onClick={() => deleteSize(sz.id)}
                      className="opacity-70 hover:opacity-100 hover:text-white transition-opacity font-sans ml-1 text-sm font-bold cursor-pointer"
                      title="Delete Size"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Colors */}
      {activeTab === 'colors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-5 rounded-2xl border border-cream-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-chocolate-950">Add Color Swatch</h3>
            <form onSubmit={handleAddColor} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-chocolate-800">Color Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Terracotta Rust"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-chocolate-900"
                />
              </div>

              <div>
                <label className="font-bold text-chocolate-800">Hex Color Code</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-cream-300 p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 font-mono text-xs font-bold text-chocolate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-black rounded-xl text-white shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: '#E86526',
                  backgroundImage: 'linear-gradient(135deg, #CB4E14, #E86526)',
                  border: '1px solid #A73B0C',
                  boxShadow: '0 4px 14px rgba(203, 78, 20, 0.4)',
                  color: '#FFFFFF'
                }}
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Save Color</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-200/90 shadow-2xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-chocolate-950">Garment Palette Swatches</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colors.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-cream-200 bg-white hover:border-cream-300 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full border border-cream-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div>
                      <div className="font-bold text-chocolate-950">{col.name}</div>
                      <div className="font-mono text-[10px] text-chocolate-400 uppercase">{col.hex}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteColor(col.id)}
                    className="text-chocolate-400 hover:text-rose-700 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Data Management & Backup */}
      {activeTab === 'data' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Export Backup Card */}
          <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cream-200 text-chocolate-950 flex items-center justify-center font-bold">
              <Download className="w-5 h-5 text-burnt-600" />
            </div>
            <h3 className="text-sm font-black text-black">Export System Database</h3>
            <p className="text-xs font-medium text-chocolate-800 leading-relaxed">
              Download a complete JSON snapshot containing all garments, categories, suppliers, sales and movement logs.
            </p>
            <button
              onClick={exportDatabase}
              className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1B0E06', border: '1px solid #1B0E06' }}
            >
              <Download className="w-4 h-4 text-white" />
              <span className="text-white">Download JSON Backup</span>
            </button>
          </div>

          {/* Import Backup Card */}
          <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-burnt-100 text-burnt-800 flex items-center justify-center font-bold border border-burnt-300">
              <Upload className="w-5 h-5 text-burnt-700" />
            </div>
            <h3 className="text-sm font-black text-black">Restore / Import Data</h3>
            <p className="text-xs font-medium text-chocolate-800 leading-relaxed">
              Upload a previously exported JSON backup file to restore garment inventory data instantly into localStorage.
            </p>
            <label
              className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              style={{ backgroundColor: '#CB4E14', border: '1px solid #A73B0C' }}
            >
              <Upload className="w-4 h-4 text-white" />
              <span className="text-white">Choose JSON File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Factory Reset Demo Card */}
          <div className="bg-white rounded-2xl p-6 border border-cream-300 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold border border-rose-300">
              <RotateCcw className="w-5 h-5 text-rose-700" />
            </div>
            <h3 className="text-sm font-black text-black">Reset Demo Dataset</h3>
            <p className="text-xs font-medium text-chocolate-800 leading-relaxed">
              Reset all inventory, sales, purchases and suppliers back to the initial sample dataset.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data to default demo state? Any custom entries will be replaced.')) {
                  resetToDemoData();
                }
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2 border hover:bg-white"
              style={{ backgroundColor: '#FAF5EB', borderColor: '#CB4E14', color: '#000000' }}
            >
              <RotateCcw className="w-4 h-4 text-black" />
              <span className="text-black">Reset to Sample Data</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

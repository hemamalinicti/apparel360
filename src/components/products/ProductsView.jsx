import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Eye,
  Edit,
  Trash2,
  PackagePlus,
  ShoppingCart,
  Shirt,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockBadge, CategoryBadge, GarmentImage } from '../common/Badge';

export const ProductsView = ({
  onOpenAddProduct,
  onOpenEditProduct,
  onOpenProductDetails,
  onOpenAdjustStock,
  onOpenPOSWithProduct
}) => {
  const {
    products,
    categories,
    sizes,
    deleteProduct,
    currentUser,
    globalSearch,
    setGlobalSearch
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSize, setSelectedSize] = useState('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const isAdmin = currentUser.role === 'Admin';

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const searchTarget = `${item.name} ${item.sku} ${item.category} ${item.supplierName} ${item.color} ${item.fabric}`.toLowerCase();
        const matchesSearch = !globalSearch || searchTarget.includes(globalSearch.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || item.categoryId === selectedCategory || item.category === selectedCategory;
        const matchesSize = selectedSize === 'ALL' || item.size === selectedSize;

        let matchesStock = true;
        if (stockStatusFilter === 'LOW') {
          matchesStock = item.stock <= (item.minStock || 10) && item.stock > 0;
        } else if (stockStatusFilter === 'OUT') {
          matchesStock = item.stock <= 0;
        } else if (stockStatusFilter === 'IN') {
          matchesStock = item.stock > (item.minStock || 10);
        }

        return matchesSearch && matchesCategory && matchesSize && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'stock-asc') return a.stock - b.stock;
        if (sortBy === 'stock-desc') return b.stock - a.stock;
        if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
        return 0;
      });
  }, [products, globalSearch, selectedCategory, selectedSize, stockStatusFilter, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Page Header */}
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
            <h1 className="text-xl font-black text-black">Garments Catalog</h1>
            <span
              className="px-2.5 py-0.5 text-xs font-black rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }}
            >
              {filteredProducts.length} Items
            </span>
          </div>
          <p className="text-xs font-bold text-black/90 mt-0.5">
            Manage fabrics, variations, SKUs, inventory levels and retail pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-md shadow-black/20 transition-all transform active:scale-95"
              style={{ backgroundColor: '#2A170C', border: '1px solid #1B0E06' }}
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Add Garment</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments, SKU, fabric, color..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-cream-50 rounded-xl border border-cream-200 focus:border-burnt-500 focus:bg-white outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-cream-50 rounded-xl border border-cream-200 focus:border-burnt-500 outline-none font-medium text-chocolate-800"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size Dropdown */}
          <div>
            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-cream-50 rounded-xl border border-cream-200 focus:border-burnt-500 outline-none font-medium text-chocolate-800"
            >
              <option value="ALL">All Sizes</option>
              {sizes.map((s) => (
                <option key={s.id} value={s.name}>
                  Size: {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-cream-50 rounded-xl border border-cream-200 focus:border-burnt-500 outline-none font-medium text-chocolate-800"
            >
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="stock-desc">Stock: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
          </div>

        </div>

        {/* Stock Status Pills & View Switcher */}
        <div className="pt-2 border-t border-cream-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-black font-extrabold mr-1">Status:</span>
            <button
              onClick={() => {
                setStockStatusFilter('ALL');
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
              style={
                stockStatusFilter === 'ALL'
                  ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
                  : { backgroundColor: '#FAF5EB', color: '#1B0E06', borderColor: '#DEC5A6' }
              }
            >
              All Items
            </button>
            <button
              onClick={() => {
                setStockStatusFilter('IN');
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
              style={
                stockStatusFilter === 'IN'
                  ? { backgroundColor: '#15803D', color: '#FFFFFF', borderColor: '#15803D' }
                  : { backgroundColor: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' }
              }
            >
              In Stock
            </button>
            <button
              onClick={() => {
                setStockStatusFilter('LOW');
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
              style={
                stockStatusFilter === 'LOW'
                  ? { backgroundColor: '#CB4E14', color: '#FFFFFF', borderColor: '#A73B0C' }
                  : { backgroundColor: '#FFF7ED', color: '#9A3412', borderColor: '#FED7AA' }
              }
            >
              Low Stock
            </button>
            <button
              onClick={() => {
                setStockStatusFilter('OUT');
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border"
              style={
                stockStatusFilter === 'OUT'
                  ? { backgroundColor: '#BE123C', color: '#FFFFFF', borderColor: '#BE123C' }
                  : { backgroundColor: '#FFF1F2', color: '#9F1239', borderColor: '#FECDD3' }
              }
            >
              Out of Stock
            </button>
          </div>

          <div className="flex items-center gap-1 bg-cream-100 p-0.5 rounded-lg border border-cream-200">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-burnt-600 font-bold' : 'text-chocolate-500 hover:text-chocolate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid Card View"
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-burnt-600 font-bold' : 'text-chocolate-500 hover:text-chocolate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-cream-200/90 shadow-2xs space-y-3">
          <Shirt className="w-12 h-12 text-cream-300 mx-auto" />
          <h3 className="text-sm font-bold text-chocolate-800">No garment items matched your criteria</h3>
          <p className="text-xs text-chocolate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing size or category filters, or add a new garment.
          </p>
          <button
            onClick={() => {
              setGlobalSearch('');
              setSelectedCategory('ALL');
              setSelectedSize('ALL');
              setStockStatusFilter('ALL');
            }}
            className="px-4 py-1.5 text-xs font-bold text-burnt-600 bg-burnt-50 rounded-xl hover:bg-burnt-100"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Garment & SKU</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3 text-right">Selling Price (₹)</th>
                  <th className="py-3.5 px-3 text-center">Stock Level</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {paginatedProducts.map((prod) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-cream-50/70 transition-colors group cursor-pointer"
                    onClick={() => onOpenProductDetails(prod)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <GarmentImage
                          src={prod.image}
                          alt={prod.name}
                          category={prod.category}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-chocolate-900 group-hover:text-burnt-600 transition-colors">
                            {prod.name}
                          </div>
                          <div className="font-mono text-[11px] text-chocolate-400">
                            {prod.sku}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <CategoryBadge category={prod.category} />
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-burnt-600">
                      ₹{prod.sellingPrice}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <StockBadge stock={prod.stock} minStock={prod.minStock} />
                    </td>

                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenProductDetails(prod)}
                          className="p-1.5 rounded-lg text-chocolate-400 hover:text-chocolate-800 hover:bg-cream-100"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenAdjustStock(prod)}
                          className="p-1.5 rounded-lg text-burnt-600 hover:bg-burnt-50"
                          title="Quick Restock"
                        >
                          <PackagePlus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenPOSWithProduct(prod)}
                          disabled={prod.stock <= 0}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prod.stock <= 0
                              ? 'text-chocolate-300 cursor-not-allowed'
                              : 'text-burnt-600 hover:bg-burnt-50'
                          }`}
                          title="Sell Item"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => onOpenEditProduct(prod)}
                              className="p-1.5 rounded-lg text-chocolate-400 hover:text-chocolate-800 hover:bg-cream-100"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${prod.name}?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-40 bg-cream-100 overflow-hidden">
                  <GarmentImage
                    src={prod.image}
                    alt={prod.name}
                    category={prod.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <StockBadge stock={prod.stock} minStock={prod.minStock} />
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div>
                    <div className="font-mono text-[10px] text-chocolate-400 uppercase">
                      {prod.sku}
                    </div>
                    <h3 className="font-bold text-sm text-chocolate-950 line-clamp-1 group-hover:text-burnt-600 transition-colors">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <CategoryBadge category={prod.category} />
                  </div>

                  <div className="pt-2 border-t border-cream-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-chocolate-400 block">Retail Price</span>
                      <span className="text-base font-extrabold text-burnt-600">₹{prod.sellingPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Card Actions */}
              <div className="p-3 bg-cream-50 border-t border-cream-100 flex items-center justify-between gap-1 text-xs">
                <button
                  onClick={() => onOpenProductDetails(prod)}
                  className="px-2.5 py-1 text-xs font-bold text-chocolate-700 hover:bg-cream-200 rounded-lg transition-colors"
                >
                  Details
                </button>

                <div className="flex gap-1">
                  <button
                    onClick={() => onOpenAdjustStock(prod)}
                    className="p-1.5 rounded-lg text-burnt-600 hover:bg-burnt-100"
                    title="Restock"
                  >
                    <PackagePlus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenPOSWithProduct(prod)}
                    disabled={prod.stock <= 0}
                    className={`p-1.5 rounded-lg ${
                      prod.stock <= 0 ? 'text-chocolate-300' : 'text-burnt-600 hover:bg-burnt-100'
                    }`}
                    title="Sell"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-cream-200/90 text-xs">
          <span className="text-chocolate-500">
            Showing {(page - 1) * itemsPerPage + 1} to{' '}
            {Math.min(page * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} garments
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-cream-200 font-semibold text-chocolate-700 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  page === idx + 1 ? 'bg-chocolate-800 text-cream-50' : 'bg-cream-100 text-chocolate-700 hover:bg-cream-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-cream-200 font-semibold text-chocolate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

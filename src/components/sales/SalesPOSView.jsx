import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Printer,
  History,
  Tag,
  CreditCard,
  QrCode,
  Banknote,
  Receipt,
  User,
  Phone,
  Layers,
  Shirt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StockBadge, SizeBadge, ColorBadge, CategoryBadge, GarmentImage } from '../common/Badge';

export const SalesPOSView = ({ preselectedProduct, onClearPreselected, onOpenReceipt }) => {
  const { products, categories, sales, addSale, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('pos');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // POS Cart State
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');
  const [saleNotes, setSaleNotes] = useState('Store Counter POS');

  React.useEffect(() => {
    if (preselectedProduct) {
      addToCart(preselectedProduct);
      if (onClearPreselected) onClearPreselected();
    }
  }, [preselectedProduct]);

  const availableProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        `${p.name} ${p.sku} ${p.color} ${p.fabric}`.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === 'ALL' || p.categoryId === selectedCategory || p.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, selectedCategory]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert(`Cannot add "${product.name}" - out of stock!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Maximum available stock reached for ${product.name} (${product.stock} pcs).`);
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            size: product.size,
            color: product.color,
            price: Number(product.sellingPrice) || 0,
            quantity: 1,
            maxStock: product.stock,
            total: Number(product.sellingPrice) || 0
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.maxStock) {
              alert(`Only ${item.maxStock} pieces in stock.`);
              return item;
            }
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              total: newQty * item.price
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountPercent('0');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const discountRate = Number(discountPercent) || 0;
  const discountAmount = Math.round((subtotal * discountRate) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.05);
  const grandTotal = taxableAmount + taxAmount;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty. Please add garment items to complete sale.');
      return;
    }

    if (!customerName.trim()) {
      alert('Please enter Customer Name to proceed with checkout.');
      return;
    }

    if (!customerPhone.trim()) {
      alert('Please enter Customer Phone Number to proceed with checkout.');
      return;
    }

    const salePayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: cart,
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
      paymentMethod: paymentMethod || 'UPI / QR',
      notes: saleNotes
    };

    const completedSale = addSale(salePayload);
    clearCart();
    if (onOpenReceipt) {
      onOpenReceipt(completedSale);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Top Header */}
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
            <h1 className="text-xl font-black text-black">Sales & POS Billing Register</h1>
            <span
              className="px-2.5 py-0.5 text-xs font-black rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }}
            >
              Active Counter
            </span>
          </div>
          <p className="text-xs font-bold text-black/90 mt-0.5">
            Fast checkout, instant SKU selection, automated stock decrement, and printable receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pos')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
            style={
              activeTab === 'pos'
                ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
                : { backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }
            }
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>POS Register</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border"
            style={
              activeTab === 'history'
                ? { backgroundColor: '#1B0E06', color: '#FFFFFF', borderColor: '#1B0E06' }
                : { backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }
            }
          >
            <History className="w-3.5 h-3.5" />
            <span>Sales History ({sales.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'pos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Garment Selector (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search & Category Filter */}
            <div className="bg-white p-4 rounded-2xl border border-cream-200/90 shadow-2xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Quick search garments by name, SKU or color..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-cream-50 rounded-xl border border-cream-200 focus:border-burnt-500 outline-none text-chocolate-900"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === 'ALL'
                      ? 'bg-chocolate-800 text-cream-50'
                      : 'bg-cream-100 text-chocolate-700 hover:bg-cream-200'
                  }`}
                >
                  All Items
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === c.id
                        ? 'bg-burnt-500 text-white'
                        : 'bg-cream-100 text-chocolate-700 hover:bg-cream-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Item Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {availableProducts.map((prod) => {
                const isOutOfStock = prod.stock <= 0;

                return (
                  <div
                    key={prod.id}
                    onClick={() => !isOutOfStock && addToCart(prod)}
                    className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                      isOutOfStock
                        ? 'bg-cream-50/70 border-cream-200 opacity-60 cursor-not-allowed'
                        : 'bg-white border-cream-200/90 hover:border-burnt-300 hover:shadow-md cursor-pointer group active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <GarmentImage
                        src={prod.image}
                        alt={prod.name}
                        category={prod.category}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-chocolate-900 truncate group-hover:text-burnt-600 transition-colors">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-chocolate-400 font-mono mt-0.5">
                          {prod.sku}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <SizeBadge size={prod.size} />
                          <ColorBadge color={prod.color} hex={prod.colorHex} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-cream-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-sm font-extrabold text-burnt-600">
                          ₹{prod.sellingPrice}
                        </span>
                      </div>
                      <StockBadge stock={prod.stock} minStock={prod.minStock} />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Checkout Register Cart (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-cream-200/90 shadow-md shadow-chocolate-950/5 p-5 flex flex-col justify-between space-y-4">
            
            {/* Cart Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-cream-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-burnt-100 text-burnt-700 flex items-center justify-center font-bold">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-chocolate-950">Billing Cart</h3>
                    <p className="text-[10px] text-chocolate-400">{cart.length} unique garments</p>
                  </div>
                </div>

                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Line Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-cream-100 my-2">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-chocolate-400 text-xs">
                    <ShoppingCart className="w-10 h-10 text-cream-300 mx-auto mb-2" />
                    Click garment items on the left to add to cart
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.productId} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-chocolate-900 truncate">{item.productName}</div>
                        <div className="text-[10px] text-chocolate-500">
                          {item.sku} • {item.size} • ₹{item.price} each
                        </div>
                      </div>

                      {/* Qty +/- */}
                      <div className="flex items-center gap-1.5 bg-cream-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-5 h-5 rounded bg-white text-chocolate-800 flex items-center justify-center hover:bg-cream-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs text-chocolate-950 px-1.5">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-5 h-5 rounded bg-white text-chocolate-800 flex items-center justify-center hover:bg-cream-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right w-16">
                        <span className="font-extrabold text-chocolate-950">₹{item.total}</span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-chocolate-300 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Customer & Billing Form */}
            <form onSubmit={handleCheckout} className="space-y-3 pt-3 border-t border-cream-100 text-xs">
              
              {/* Customer Name & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-chocolate-500 uppercase">
                    Customer Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 bg-cream-50 rounded-lg border border-cream-200 focus:border-burnt-500 focus:bg-white outline-none text-xs text-chocolate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-chocolate-500 uppercase">
                    Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 bg-cream-50 rounded-lg border border-cream-200 focus:border-burnt-500 focus:bg-white outline-none text-xs text-chocolate-900"
                  />
                </div>
              </div>

              {/* Discount & Payment Method */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-chocolate-500 uppercase">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 bg-cream-50 rounded-lg border border-cream-200 outline-none text-xs font-bold text-chocolate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-chocolate-500 uppercase">
                    Payment Mode <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={paymentMethod}
                    required
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full mt-0.5 px-2.5 py-1.5 bg-cream-50 rounded-lg border border-cream-200 outline-none text-xs font-semibold text-chocolate-900"
                  >
                    <option value="UPI / QR">UPI / QR (Instant)</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Credit Card">Credit / Debit Card</option>
                    <option value="Store Credit">Store Credit / Ledger</option>
                  </select>
                </div>
              </div>

              {/* Price Calculations Breakdown */}
              <div className="bg-cream-50 p-3 rounded-xl border border-cream-200 space-y-1 text-xs">
                <div className="flex justify-between text-chocolate-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-burnt-600 font-medium">
                    <span>Discount ({discountPercent}%):</span>
                    <span>- ₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-chocolate-500 text-[11px]">
                  <span>GST (5%):</span>
                  <span>+ ₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="pt-1.5 border-t border-cream-200 flex justify-between items-center text-sm font-extrabold text-chocolate-950">
                  <span>Total Payable:</span>
                  <span className="text-base text-burnt-600">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              {(() => {
                const isReady = cart.length > 0 && customerName.trim().length > 0 && customerPhone.trim().length > 0;
                let buttonLabel = `Complete Sale (₹${grandTotal.toLocaleString()})`;
                if (cart.length === 0) {
                  buttonLabel = 'Select Garment Items to Checkout';
                } else if (!customerName.trim()) {
                  buttonLabel = 'Enter Customer Name to Checkout';
                } else if (!customerPhone.trim()) {
                  buttonLabel = 'Enter Phone Number to Checkout';
                }

                return (
                  <button
                    type="submit"
                    disabled={!isReady}
                    className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                      !isReady
                        ? 'cursor-not-allowed border opacity-80'
                        : 'shadow-xl transform active:scale-95 cursor-pointer text-white'
                    }`}
                    style={
                      !isReady
                        ? {
                            backgroundColor: '#FAF5EB',
                            borderColor: '#DEC5A6',
                            color: '#643F25',
                            boxShadow: 'none'
                          }
                        : {
                            backgroundColor: '#E86526',
                            backgroundImage: 'linear-gradient(135deg, #CB4E14, #E86526)',
                            border: '1px solid #A73B0C',
                            boxShadow: '0 6px 18px rgba(203, 78, 20, 0.45)',
                            color: '#FFFFFF'
                          }
                    }
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{buttonLabel}</span>
                  </button>
                );
              })()}

            </form>

          </div>

        </div>
      ) : (
        /* History Layout */
        <div className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-cream-50 border-b border-cream-200 text-chocolate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-3">Date & Time</th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Garment Items</th>
                  <th className="py-3.5 px-3">Payment</th>
                  <th className="py-3.5 px-3 text-right">Grand Total</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-burnt-600">
                      {sale.invoiceNumber}
                    </td>

                    <td className="py-3 px-3 text-chocolate-600 whitespace-nowrap">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-3 font-semibold text-chocolate-900">
                      <div>{sale.customerName}</div>
                      {sale.customerPhone && (
                        <div className="text-[10px] text-chocolate-400 font-mono">{sale.customerPhone}</div>
                      )}
                    </td>

                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="text-chocolate-900 font-medium truncate">
                        {sale.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cream-100 text-chocolate-800 border border-cream-200">
                        {sale.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-extrabold text-chocolate-950">
                      ₹{sale.grandTotal.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenReceipt(sale)}
                        className="px-2.5 py-1 text-xs font-bold text-burnt-700 bg-burnt-50 hover:bg-burnt-100 rounded-lg border border-burnt-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        Invoice
                      </button>
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

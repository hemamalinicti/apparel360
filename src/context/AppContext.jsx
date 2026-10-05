import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_SIZES,
  INITIAL_COLORS,
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_PURCHASES,
  INITIAL_SALES,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_USER
} from '../data/mockData';

const AppContext = createContext();

const STORAGE_KEYS = {
  PRODUCTS: 'cti_garments_products_v1',
  CATEGORIES: 'cti_garments_categories_v1',
  SIZES: 'cti_garments_sizes_v1',
  COLORS: 'cti_garments_colors_v1',
  SUPPLIERS: 'cti_garments_suppliers_v1',
  PURCHASES: 'cti_garments_purchases_v1',
  SALES: 'cti_garments_sales_v1',
  MOVEMENTS: 'cti_garments_movements_v1',
  USER: 'cti_garments_user_v1'
};

const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
  }
  return fallback;
};

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(() => getStoredData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
  const [categories, setCategories] = useState(() => getStoredData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES));
  const [sizes, setSizes] = useState(() => getStoredData(STORAGE_KEYS.SIZES, INITIAL_SIZES));
  const [colors, setColors] = useState(() => getStoredData(STORAGE_KEYS.COLORS, INITIAL_COLORS));
  const [suppliers, setSuppliers] = useState(() => getStoredData(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS));
  const [purchases, setPurchases] = useState(() => getStoredData(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES));
  const [sales, setSales] = useState(() => getStoredData(STORAGE_KEYS.SALES, INITIAL_SALES));
  const [stockMovements, setStockMovements] = useState(() => {
    const raw = getStoredData(STORAGE_KEYS.MOVEMENTS, INITIAL_STOCK_MOVEMENTS);
    return raw.map((mov) => ({
      ...mov,
      user: mov.user && mov.user.includes('(')
        ? mov.user.split('(')[1].replace(')', '').trim()
        : (mov.user && mov.user.toLowerCase().includes('admin') ? 'Admin' : (mov.user || 'Admin'))
    }));
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = getStoredData(STORAGE_KEYS.USER, INITIAL_USER);
    return {
      ...raw,
      name: raw.name === 'Administrator' || raw.name === 'Admin' ? 'Admin' : raw.name
    };
  });

  const [activeTab, setActiveTabState] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState([]);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setIsMobileMenuOpen(false);
  };

  // Toast notifications
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIZES, JSON.stringify(sizes));
  }, [sizes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLORS, JSON.stringify(colors));
  }, [colors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  // Product Operations
  const addProduct = (newProd) => {
    const status = newProd.stock <= 0 ? 'Out of Stock' : (newProd.stock <= (newProd.minStock || 10) ? 'Low Stock' : 'In Stock');
    const product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      status,
      costPrice: Number(newProd.costPrice) || 0,
      sellingPrice: Number(newProd.sellingPrice) || 0,
      stock: Number(newProd.stock) || 0,
      minStock: Number(newProd.minStock) || 10,
    };
    setProducts((prev) => [product, ...prev]);

    // Add initial movement if initial stock > 0
    if (product.stock > 0) {
      const movement = {
        id: `MOV-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        type: 'STOCK_IN',
        quantity: product.stock,
        previousStock: 0,
        newStock: product.stock,
        reason: 'Initial Opening Stock Setup',
        reference: product.sku,
        date: new Date().toISOString(),
        user: currentUser.role || 'Admin'
      };
      setStockMovements((prev) => [movement, ...prev]);
    }
    showToast(`Product "${product.name}" added successfully!`);
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedStock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock;
          const minStock = updatedFields.minStock !== undefined ? Number(updatedFields.minStock) : p.minStock;
          const status = updatedStock <= 0 ? 'Out of Stock' : (updatedStock <= minStock ? 'Low Stock' : 'In Stock');
          return {
            ...p,
            ...updatedFields,
            costPrice: updatedFields.costPrice !== undefined ? Number(updatedFields.costPrice) : p.costPrice,
            sellingPrice: updatedFields.sellingPrice !== undefined ? Number(updatedFields.sellingPrice) : p.sellingPrice,
            stock: updatedStock,
            minStock: minStock,
            status
          };
        }
        return p;
      })
    );
    showToast('Product details updated successfully!');
  };

  const deleteProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product "${prod ? prod.name : id}" deleted`, 'info');
  };

  // Stock Adjustment
  const adjustStock = (productId, deltaQty, type, reason, reference = '') => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return false;

    const previousStock = prod.stock;
    const newStock = Math.max(0, previousStock + deltaQty);
    const status = newStock <= 0 ? 'Out of Stock' : (newStock <= prod.minStock ? 'Low Stock' : 'In Stock');

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock, status } : p))
    );

    const movement = {
      id: `MOV-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      type: type || (deltaQty >= 0 ? 'STOCK_IN' : 'STOCK_OUT'),
      quantity: Math.abs(deltaQty),
      previousStock,
      newStock,
      reason: reason || 'Manual Stock Adjustment',
      reference: reference || 'N/A',
      date: new Date().toISOString(),
      user: currentUser.role || 'Admin'
    };

    setStockMovements((prev) => [movement, ...prev]);
    showToast(`Stock updated for ${prod.name}: ${previousStock} -> ${newStock}`);
    return true;
  };

  // Purchase Entry (Stock In)
  const addPurchase = (purchaseData) => {
    const purchaseId = `PO-${Date.now().toString().slice(-6)}`;
    const newPurchase = {
      ...purchaseData,
      id: purchaseId,
      date: purchaseData.date || new Date().toISOString().split('T')[0],
      status: 'Completed',
      paymentStatus: purchaseData.paymentStatus || 'Paid'
    };

    // Update Stock for each purchased item & log movements
    const movementsToAdd = [];
    setProducts((prev) => {
      const updated = [...prev];
      newPurchase.items.forEach((item) => {
        const index = updated.findIndex((p) => p.id === item.productId);
        if (index !== -1) {
          const prevStock = updated[index].stock;
          const addedQty = Number(item.quantity);
          const newStock = prevStock + addedQty;
          const status = newStock <= updated[index].minStock ? 'Low Stock' : 'In Stock';
          
          updated[index] = {
            ...updated[index],
            stock: newStock,
            costPrice: item.unitCost ? Number(item.unitCost) : updated[index].costPrice,
            status
          };

          movementsToAdd.push({
            id: `MOV-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
            productId: item.productId,
            productName: updated[index].name,
            type: 'STOCK_IN',
            quantity: addedQty,
            previousStock: prevStock,
            newStock: newStock,
            reason: `Purchase ${newPurchase.invoiceNumber || purchaseId}`,
            reference: newPurchase.invoiceNumber || purchaseId,
            date: new Date().toISOString(),
            user: currentUser.role || 'Admin'
          });
        }
      });
      return updated;
    });

    if (movementsToAdd.length > 0) {
      setStockMovements((prev) => [...movementsToAdd, ...prev]);
    }

    // Update supplier total purchases
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === newPurchase.supplierId
          ? { ...s, totalPurchases: (s.totalPurchases || 0) + Number(newPurchase.totalAmount) }
          : s
      )
    );

    setPurchases((prev) => [newPurchase, ...prev]);
    showToast(`Purchase order ${newPurchase.invoiceNumber || purchaseId} recorded successfully!`);
    return newPurchase;
  };

  // Sales Entry (Stock Out & POS Billing)
  const addSale = (saleData) => {
    const saleId = `SALE-${Date.now().toString().slice(-6)}`;
    const invoiceNumber = `CTI-POS-${Date.now().toString().slice(-6)}`;
    const newSale = {
      ...saleData,
      id: saleId,
      invoiceNumber: saleData.invoiceNumber || invoiceNumber,
      date: new Date().toISOString(),
      cashier: `${currentUser.name}`
    };

    // Deduct stock and create stock movement
    const movementsToAdd = [];
    setProducts((prev) => {
      const updated = [...prev];
      newSale.items.forEach((item) => {
        const index = updated.findIndex((p) => p.id === item.productId);
        if (index !== -1) {
          const prevStock = updated[index].stock;
          const soldQty = Number(item.quantity);
          const newStock = Math.max(0, prevStock - soldQty);
          const status = newStock <= 0 ? 'Out of Stock' : (newStock <= updated[index].minStock ? 'Low Stock' : 'In Stock');

          updated[index] = {
            ...updated[index],
            stock: newStock,
            status
          };

          movementsToAdd.push({
            id: `MOV-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
            productId: item.productId,
            productName: updated[index].name,
            type: 'STOCK_OUT',
            quantity: soldQty,
            previousStock: prevStock,
            newStock: newStock,
            reason: `POS Sale ${newSale.invoiceNumber}`,
            reference: newSale.invoiceNumber,
            date: new Date().toISOString(),
            user: `${currentUser.name} (${currentUser.role})`
          });
        }
      });
      return updated;
    });

    if (movementsToAdd.length > 0) {
      setStockMovements((prev) => [...movementsToAdd, ...prev]);
    }

    setSales((prev) => [newSale, ...prev]);
    showToast(`Sale Invoice #${newSale.invoiceNumber} completed! Total: ₹${newSale.grandTotal.toLocaleString()}`);
    return newSale;
  };

  // Master Categories, Sizes, Colors, Suppliers
  const addCategory = (category) => {
    const newCat = { ...category, id: `cat-${Date.now()}` };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added`);
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted', 'info');
  };

  const addSize = (size) => {
    const newSize = { ...size, id: `sz-${Date.now()}` };
    setSizes((prev) => [...prev, newSize]);
    showToast(`Size "${newSize.name}" added`);
  };

  const deleteSize = (id) => {
    setSizes((prev) => prev.filter((s) => s.id !== id));
    showToast('Size deleted', 'info');
  };

  const addColor = (color) => {
    const newColor = { ...color, id: `col-${Date.now()}` };
    setColors((prev) => [...prev, newColor]);
    showToast(`Color "${newColor.name}" added`);
  };

  const deleteColor = (id) => {
    setColors((prev) => prev.filter((c) => c.id !== id));
    showToast('Color deleted', 'info');
  };

  const addSupplier = (supplier) => {
    const newSup = { ...supplier, id: `sup-${Date.now()}`, totalPurchases: 0 };
    setSuppliers((prev) => [...prev, newSup]);
    showToast(`Supplier "${newSup.name}" added`);
  };

  const updateSupplier = (id, supplierData) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...supplierData } : s)));
    showToast('Supplier details updated');
  };

  const deleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    showToast('Supplier deleted', 'info');
  };

  // User & Auth Management
  const switchRole = (role) => {
    setCurrentUser((prev) => ({ ...prev, role }));
    showToast(`Switched active role to ${role}`);
  };

  const login = (userData) => {
    const updatedUser = {
      ...userData,
      isLoggedIn: true
    };
    setCurrentUser(updatedUser);
    showToast(`Welcome back, ${userData.name}! Logged in as ${userData.role}`);
  };

  const logout = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isLoggedIn: false
    }));
    showToast('Logged out. Please sign in to continue.', 'info');
  };

  // Reset to initial demo data
  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setSizes(INITIAL_SIZES);
    setColors(INITIAL_COLORS);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchases(INITIAL_PURCHASES);
    setSales(INITIAL_SALES);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setCurrentUser(INITIAL_USER);
    showToast('Database reset to default demo dataset!', 'success');
  };

  // Export & Import Database JSON
  const exportDatabase = () => {
    const db = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      products,
      categories,
      sizes,
      colors,
      suppliers,
      purchases,
      sales,
      stockMovements
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Garments_Stock_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Database exported successfully as JSON!');
  };

  const importDatabase = (jsonData) => {
    try {
      if (jsonData.products) setProducts(jsonData.products);
      if (jsonData.categories) setCategories(jsonData.categories);
      if (jsonData.sizes) setSizes(jsonData.sizes);
      if (jsonData.colors) setColors(jsonData.colors);
      if (jsonData.suppliers) setSuppliers(jsonData.suppliers);
      if (jsonData.purchases) setPurchases(jsonData.purchases);
      if (jsonData.sales) setSales(jsonData.sales);
      if (jsonData.stockMovements) setStockMovements(jsonData.stockMovements);
      showToast('Database imported successfully!', 'success');
      return true;
    } catch (err) {
      showToast('Failed to import database file: ' + err.message, 'error');
      return false;
    }
  };

  // Computed Dashboard Metrics
  const totalProductsCount = products.length;
  const totalStockQuantity = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalInventoryValuation = products.reduce((acc, p) => acc + ((Number(p.stock) || 0) * (Number(p.costPrice) || 0)), 0);
  const totalSalesRevenue = sales.reduce((acc, s) => acc + (Number(s.grandTotal) || 0), 0);
  const totalPurchasesCost = purchases.reduce((acc, p) => acc + (Number(p.totalAmount) || 0), 0);
  const lowStockProducts = products.filter((p) => p.stock <= (p.minStock || 10));
  const outOfStockProducts = products.filter((p) => p.stock <= 0);

  return (
    <AppContext.Provider
      value={{
        // State
        products,
        categories,
        sizes,
        colors,
        suppliers,
        purchases,
        sales,
        stockMovements,
        currentUser,
        isAuthenticated: Boolean(currentUser && currentUser.isLoggedIn !== false),
        activeTab,
        isMobileMenuOpen,
        globalSearch,
        toasts,
        // Computed
        metrics: {
          totalProductsCount,
          totalStockQuantity,
          totalInventoryValuation,
          totalSalesRevenue,
          totalPurchasesCost,
          lowStockCount: lowStockProducts.length,
          outOfStockCount: outOfStockProducts.length,
          lowStockProducts,
          outOfStockProducts
        },
        // Actions
        setActiveTab,
        setIsMobileMenuOpen,
        setGlobalSearch,
        showToast,
        removeToast,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addPurchase,
        addSale,
        addCategory,
        deleteCategory,
        addSize,
        deleteSize,
        addColor,
        deleteColor,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        switchRole,
        login,
        logout,
        resetToDemoData,
        exportDatabase,
        importDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsView } from './components/products/ProductsView';
import { StockManagementView } from './components/stock/StockManagementView';
import { SalesPOSView } from './components/sales/SalesPOSView';
import { PurchasesView } from './components/purchases/PurchasesView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { MasterSettingsView } from './components/master/MasterSettingsView';
import { ReportsView } from './components/reports/ReportsView';
import { LoginPage } from './components/auth/LoginPage';

// Modals
import { ProductModal } from './components/products/ProductModal';
import { ProductDetailsModal } from './components/products/ProductDetailsModal';
import { StockAdjustmentModal } from './components/stock/StockAdjustmentModal';
import { PurchaseModal } from './components/purchases/PurchaseModal';
import { SupplierModal } from './components/suppliers/SupplierModal';
import { ReceiptModal } from './components/sales/ReceiptModal';
import { LoginModal } from './components/auth/LoginModal';

export function App() {
  const { activeTab, setActiveTab, currentUser, isAuthenticated } = useApp();

  // If user is not authenticated, show the dedicated light-themed Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [productToView, setProductToView] = useState(null);

  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState(null);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseInitialProdId, setPurchaseInitialProdId] = useState(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptSale, setReceiptSale] = useState(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // POS Selected item bridge
  const [posPreselectedProduct, setPosPreselectedProduct] = useState(null);

  // Handlers
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleOpenProductDetails = (product) => {
    setProductToView(product);
    setIsDetailsModalOpen(true);
  };

  const handleOpenAdjustStock = (product) => {
    setProductToAdjust(product);
    setIsAdjustStockOpen(true);
  };

  const handleOpenStockIn = (initialProdId = null) => {
    setPurchaseInitialProdId(initialProdId);
    setIsPurchaseModalOpen(true);
  };

  const handleOpenAddSupplier = () => {
    setSupplierToEdit(null);
    setIsSupplierModalOpen(true);
  };

  const handleOpenEditSupplier = (supplier) => {
    setSupplierToEdit(supplier);
    setIsSupplierModalOpen(true);
  };

  const handleOpenPOSWithProduct = (product) => {
    setPosPreselectedProduct(product);
    setActiveTab('sales');
  };

  const handleOpenReceipt = (sale) => {
    setReceiptSale(sale);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenAddProduct={handleOpenAddProduct}
        onOpenStockIn={() => handleOpenStockIn()}
        onOpenPOS={() => setActiveTab('sales')}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row items-start">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddProduct={handleOpenAddProduct}
              onOpenStockIn={() => handleOpenStockIn()}
              onOpenPOS={() => setActiveTab('sales')}
              onOpenAdjustStock={handleOpenAdjustStock}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              onOpenAddProduct={handleOpenAddProduct}
              onOpenEditProduct={handleOpenEditProduct}
              onOpenProductDetails={handleOpenProductDetails}
              onOpenAdjustStock={handleOpenAdjustStock}
              onOpenPOSWithProduct={handleOpenPOSWithProduct}
            />
          )}

          {activeTab === 'stock' && (
            <StockManagementView
              onOpenAdjustStock={handleOpenAdjustStock}
              onOpenPurchaseOrder={() => handleOpenStockIn()}
            />
          )}

          {activeTab === 'sales' && (
            <SalesPOSView
              preselectedProduct={posPreselectedProduct}
              onClearPreselected={() => setPosPreselectedProduct(null)}
              onOpenReceipt={handleOpenReceipt}
            />
          )}

          {activeTab === 'purchases' && (
            <PurchasesView
              onOpenNewPurchase={(initialProdId) => handleOpenStockIn(initialProdId)}
            />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersView
              onOpenAddSupplier={handleOpenAddSupplier}
              onOpenEditSupplier={handleOpenEditSupplier}
              onOpenNewPurchaseForSupplier={(supId) => handleOpenStockIn()}
            />
          )}

          {activeTab === 'master' && (
            <MasterSettingsView />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}
        </main>

      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        product={productToView}
        onEdit={handleOpenEditProduct}
        onAdjustStock={handleOpenAdjustStock}
        onSellItem={handleOpenPOSWithProduct}
      />

      <StockAdjustmentModal
        isOpen={isAdjustStockOpen}
        onClose={() => setIsAdjustStockOpen(false)}
        product={productToAdjust}
      />

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        initialProductId={purchaseInitialProdId}
      />

      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        supplierToEdit={supplierToEdit}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={receiptSale}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Global Toast Notifications */}
      <ToastContainer />

    </div>
  );
}
export default App;

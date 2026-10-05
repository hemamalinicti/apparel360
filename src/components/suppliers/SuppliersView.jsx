import React, { useState } from 'react';
import { Plus, Users, Search, Phone, Mail, MapPin, Building2, Edit, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SuppliersView = ({ onOpenAddSupplier, onOpenEditSupplier, onOpenNewPurchaseForSupplier }) => {
  const { suppliers, deleteSupplier, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const isAdmin = currentUser.role === 'Admin';

  const filteredSuppliers = suppliers.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(search.toLowerCase())) ||
      (s.gstin && s.gstin.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

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
            <h1 className="text-xl font-black text-black">Suppliers & Fabric Mills Directory</h1>
            <span
              className="px-2.5 py-0.5 text-xs font-black rounded-full border shadow-2xs"
              style={{ backgroundColor: '#FAF5EB', color: '#000000', borderColor: '#CB4E14' }}
            >
              {suppliers.length} Registered
            </span>
          </div>
          <p className="text-xs font-bold text-black/90 mt-0.5">
            Manage relationships with textile manufacturers, knitwear mills, and wholesale distributors.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenAddSupplier}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-md shadow-black/20 transition-all transform active:scale-95"
            style={{ backgroundColor: '#2A170C', border: '1px solid #1B0E06' }}
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Supplier</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200/90 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search supplier, contact, city or GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-cream-50 rounded-xl border border-cream-200 focus:border-burnt-500 outline-none text-chocolate-900"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-white rounded-2xl border border-cream-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-cream-100 text-chocolate-800 flex items-center justify-center font-bold border border-cream-200">
                  <Building2 className="w-5 h-5 text-burnt-600" />
                </div>
                {sup.gstin && (
                  <span className="text-[10px] font-mono font-semibold bg-cream-100 text-chocolate-700 px-2 py-0.5 rounded border border-cream-200">
                    GST: {sup.gstin}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-chocolate-950 group-hover:text-burnt-600 transition-colors">
                  {sup.name}
                </h3>
                {sup.contactPerson && (
                  <p className="text-xs text-chocolate-500 font-medium mt-0.5">
                    Contact: {sup.contactPerson}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-chocolate-700 pt-2 border-t border-cream-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-chocolate-400 shrink-0" />
                  <span>{sup.phone}</span>
                </div>
                {sup.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-chocolate-400 shrink-0" />
                    <span className="truncate">{sup.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-chocolate-400 shrink-0" />
                  <span className="truncate">{sup.city}</span>
                </div>
              </div>
            </div>

            {/* Bottom Procurement info & actions */}
            <div className="pt-3 border-t border-cream-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-chocolate-400 block">Total Supplied</span>
                <span className="font-extrabold text-burnt-600">₹{(sup.totalPurchases || 0).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenNewPurchaseForSupplier(sup.id)}
                  className="px-2.5 py-1 text-xs font-bold text-burnt-700 bg-burnt-50 hover:bg-burnt-100 rounded-lg border border-burnt-200 transition-colors flex items-center gap-1"
                  title="Create Purchase Order"
                >
                  <ShoppingBag className="w-3 h-3" />
                  PO
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => onOpenEditSupplier(sup)}
                      className="p-1.5 text-chocolate-400 hover:text-chocolate-800 hover:bg-cream-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete supplier ${sup.name}?`)) {
                          deleteSupplier(sup.id);
                        }
                      }}
                      className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Users, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupplierModal = ({ isOpen, onClose, supplierToEdit }) => {
  const { addSupplier, updateSupplier } = useApp();
  const isEditing = !!supplierToEdit;

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    gstin: ''
  });

  useEffect(() => {
    if (supplierToEdit) {
      setFormData({
        name: supplierToEdit.name || '',
        contactPerson: supplierToEdit.contactPerson || '',
        phone: supplierToEdit.phone || '',
        email: supplierToEdit.email || '',
        city: supplierToEdit.city || '',
        address: supplierToEdit.address || '',
        gstin: supplierToEdit.gstin || ''
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        gstin: ''
      });
    }
  }, [supplierToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter supplier/mill name.');
      return;
    }

    if (isEditing) {
      updateSupplier(supplierToEdit.id, formData);
    } else {
      addSupplier(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-chocolate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-cream-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-cream-50 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-chocolate-800 text-cream-100 flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-burnt-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-chocolate-950">
                {isEditing ? 'Edit Supplier Details' : 'Add New Textile Supplier'}
              </h2>
              <p className="text-[11px] sm:text-xs text-chocolate-500">
                Manage garment fabric manufacturers & distributors
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          
          <div className="space-y-1.5">
            <label className="font-bold text-chocolate-800">Company / Mill Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Vogue Tex Fab Mills"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-medium text-chocolate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-chocolate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98450 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-chocolate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">Email Address</label>
              <input
                type="email"
                placeholder="orders@voguetex.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-chocolate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-chocolate-800">City / State *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tirupur, Tamil Nadu"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-chocolate-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-chocolate-800">GSTIN / Tax ID</label>
            <input
              type="text"
              placeholder="33AABCT1234F1Z5"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none font-mono uppercase text-chocolate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-chocolate-800">Address Details</label>
            <textarea
              rows="2"
              placeholder="Street, Industrial Area, PIN..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 focus:border-burnt-500 outline-none text-xs resize-none text-chocolate-900"
            />
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
            {isEditing ? 'Save Changes' : 'Add Supplier'}
          </button>
        </div>

      </div>
    </div>
  );
};

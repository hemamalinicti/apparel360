import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        let borderStyle = '2px solid #10B981';
        let iconBg = '#ECFDF5';

        if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
          borderStyle = '2px solid #F43F5E';
          iconBg = '#FFF1F2';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-burnt-600 shrink-0" />;
          borderStyle = '2px solid #E86526';
          iconBg = '#FFF7F2';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-burnt-600 shrink-0" />;
          borderStyle = '2px solid #E86526';
          iconBg = '#FFF7F2';
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-2xl transition-all duration-300 transform animate-in slide-in-from-bottom-3"
            style={{
              backgroundColor: '#FFFFFF',
              border: borderStyle,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl shrink-0" style={{ backgroundColor: iconBg }}>
                {icon}
              </div>
              <p className="text-sm font-extrabold text-black">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1.5 text-black hover:bg-cream-100 rounded-xl transition-colors ml-3 cursor-pointer"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`relative w-full ${maxWidth} bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-sky-50 border-b border-sky-100">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-gray-500 hover:text-black hover:bg-sky-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

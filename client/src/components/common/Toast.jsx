import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ type = 'info', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md bg-white ${
      isError ? 'border-red-300 text-black' : 'border-sky-300 text-black'
    }`}>
      {isError ? (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

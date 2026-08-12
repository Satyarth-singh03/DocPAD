import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-600">
      <Loader2 className={`${sizeClasses[size] || 'w-6 h-6'} animate-spin text-black mb-2`} />
      {label && <p className="text-xs font-medium text-gray-600">{label}</p>}
    </div>
  );
};

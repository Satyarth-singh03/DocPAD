import React from 'react';

export const Badge = ({ role, variant, children }) => {
  const roleStyles = {
    admin: 'bg-black text-white border-black',
    doctor: 'bg-sky-100 text-sky-900 border-sky-300',
    nurse: 'bg-gray-100 text-gray-800 border-gray-300',
    patient: 'bg-sky-50 text-black border-sky-200',
    active: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    inactive: 'bg-red-50 text-red-700 border-red-200',
    low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    high: 'bg-rose-50 text-rose-800 border-rose-200'
  };

  const style = roleStyles[role || variant] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${style}`}>
      {children || role || variant}
    </span>
  );
};

import React from 'react';

const Badge = ({ children, variant = 'gray', className = '' }) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors';
  
  const variants = {
    // Status colors
    pending: 'bg-amber-50 text-amber-700 border border-amber-200/50',
    in_progress: 'bg-blue-50 text-blue-700 border border-blue-200/50',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    
    // Priority colors
    low: 'bg-slate-100 text-slate-700 border border-slate-200/50',
    medium: 'bg-indigo-50 text-indigo-700 border border-indigo-200/50',
    high: 'bg-red-50 text-red-700 border border-red-200/50',
    
    // General styles
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    error: 'bg-red-50 text-red-700 border border-red-100',
  };

  const selectedVariant = variants[variant.toLowerCase()] || variants.gray;

  return (
    <span className={`${baseStyles} ${selectedVariant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

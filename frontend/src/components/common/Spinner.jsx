import React from 'react';

const Spinner = ({ className = '' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-slate-100 border-t-brand-500 h-5 w-5 ${className}`}
    />
  );
};

export default Spinner;

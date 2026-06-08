import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-slate-200';
  
  const variants = {
    text: 'h-4 w-full rounded-sm',
    circle: 'rounded-full',
    card: 'h-24 w-full rounded-xl',
    rect: 'w-full rounded-lg',
  };

  const selectedClass = variants[variant] || variants.text;

  return <div className={`${baseClasses} ${selectedClass} ${className}`} />;
};

export default Skeleton;
export { Skeleton };

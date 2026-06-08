import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  loading = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold tracking-tight transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none';
  
  const variants = {
    primary: 'bg-brand-500 text-white shadow-md hover:bg-brand-600 focus:ring-brand-500',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500',
    danger: 'bg-red-600 text-white shadow-md hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-brand-500 text-brand-600 hover:bg-brand-50 focus:ring-brand-500',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={`block w-full rounded-lg border py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 ${
            Icon ? 'pl-10 pr-3' : 'px-3'
          } ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-300 focus:border-brand-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="mt-1 block text-xs font-medium text-red-500">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

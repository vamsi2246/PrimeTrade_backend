import React from 'react';

const Textarea = React.forwardRef(({
  label,
  error,
  className = '',
  rows = 3,
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
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        className={`block w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-brand-500'
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs font-medium text-red-500">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;

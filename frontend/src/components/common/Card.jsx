import React from 'react';

const Card = ({ children, className = '', title, subtitle, headerAction }) => {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-xs ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            {title && <h3 className="text-base font-bold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;

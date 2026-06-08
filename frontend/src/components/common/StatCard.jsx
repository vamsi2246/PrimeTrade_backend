import React from 'react';

const StatCard = ({ title, value, icon: Icon, colorClass = 'text-brand-500 bg-brand-50', description }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-1">
        <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">{title}</span>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        {description && (
          <p className="text-xs text-slate-400 font-medium">{description}</p>
        )}
      </div>
      {Icon && (
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;

import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
};

export default SearchBar;

import React from 'react';

const FilterDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 bg-white focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
export { FilterDropdown };

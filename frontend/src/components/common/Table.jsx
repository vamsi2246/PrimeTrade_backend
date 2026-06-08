import React from 'react';
import Loader from './Loader';

const Table = ({
  headers = [],
  items = [],
  renderRow,
  loading = false,
  emptyMessage = 'No data available',
}) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="medium" />
        </div>
      ) : items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`p-4 ${index === 0 ? 'pl-6' : ''} ${
                      index === headers.length - 1 ? 'pr-6 text-right' : ''
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => renderRow(item, index))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
          <p className="text-sm font-semibold">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Table;

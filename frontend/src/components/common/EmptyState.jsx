import React from 'react';
import { ClipboardCopy } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  title = 'No records found',
  description = 'There are no items matching this view or list at the moment.',
  icon: Icon = ClipboardCopy,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 rounded-2xl border border-dashed border-slate-300 bg-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4 border border-slate-100">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-400 max-w-sm leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-5">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
export { EmptyState };

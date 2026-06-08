import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 shadow-xs">
            <AlertOctagon className="h-8 w-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">404 - Not Found</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            The page you are looking for does not exist or has been relocated to another directory.
          </p>
        </div>

        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-600 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

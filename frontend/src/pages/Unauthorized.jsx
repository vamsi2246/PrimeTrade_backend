import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-xs border border-red-100">
            <ShieldAlert className="h-8 w-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Access Restricted</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your user credentials do not have clearance to view this administrative terminal.
          </p>
        </div>

        <div>
          <Link to="/dashboard">
            <Button variant="secondary" className="flex items-center gap-2 mx-auto">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
export { Unauthorized };

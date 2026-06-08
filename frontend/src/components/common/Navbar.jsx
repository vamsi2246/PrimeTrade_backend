import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, ShieldCheck, CheckSquare, Bell } from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Toggle Sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        
        <Link to="/dashboard" className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-brand-500" />
          <span className="text-xl font-bold tracking-tight text-slate-800">
            SecureTask <span className="text-brand-500">Pro</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'admin' && (
          <div className="hidden items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 md:flex">
            <ShieldCheck className="h-4 w-4" />
            Admin Mode
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <span className="hidden text-sm font-medium text-slate-700 md:inline">
              {user?.name}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

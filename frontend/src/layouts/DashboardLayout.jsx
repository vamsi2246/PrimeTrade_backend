import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ListTodo,
  User,
  ShieldAlert,
  LogOut,
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Tasks', icon: ListTodo },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  const activeLinkClass = 'flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition-colors shadow-xs';
  const inactiveLinkClass = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* MOBILE SIDEBAR DRAWERS */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-xs md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white pt-4 transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <CheckSquare className="h-6 w-6 text-brand-500" />
            <span className="text-lg font-bold tracking-tight text-slate-800">
              SecureTask <span className="text-brand-500">Pro</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        {user && (
          <div className="border-t border-slate-100 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="block text-sm font-semibold text-slate-800 truncate">{user.name}</span>
                <span className="block text-xs text-slate-400 truncate">{user.email}</span>
              </div>
            </div>
            <Button variant="secondary" onClick={handleLogout} className="w-full justify-start gap-2 py-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        )}
      </aside>

      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`hidden border-r border-slate-200 bg-white transition-all duration-300 md:flex md:flex-col ${
          desktopCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          {!desktopCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-brand-500" />
              <span className="text-lg font-bold tracking-tight text-slate-800">
                SecureTask <span className="text-brand-500">Pro</span>
              </span>
            </Link>
          )}
          {desktopCollapsed && (
            <div className="mx-auto">
              <CheckSquare className="h-6 w-6 text-brand-500" />
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
                title={desktopCollapsed ? link.label : ''}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!desktopCollapsed && <span>{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="flex w-full items-center justify-center rounded-lg border border-slate-200 py-2 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            {desktopCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:block">
            {/* Page Header Actions / Breadcrumbs placeholder */}
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500" />
            </button>

            {user?.role === 'admin' && (
              <span className="hidden items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 md:inline-flex border border-indigo-100 uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin
              </span>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg p-1 text-slate-600 hover:bg-slate-50 transition-colors focus:outline-hidden"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-extrabold text-xs shadow-inner">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-sm font-semibold text-slate-700 md:inline">
                  {user?.name}
                </span>
              </button>

              {userDropdownOpen && (
                <>
                  <div onClick={() => setUserDropdownOpen(false)} className="fixed inset-0 z-40 bg-transparent" />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Signed in as</span>
                      <span className="block truncate text-sm font-bold text-slate-800">{user?.name}</span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

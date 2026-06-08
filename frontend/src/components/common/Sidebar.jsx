import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ListTodo, User, ShieldAlert, List } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Tasks', icon: ListTodo },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  const activeClass = 'flex items-center gap-3 rounded-lg bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-600 transition-colors shadow-sm';
  const inactiveClass = 'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white pt-16 md:pt-0 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {user && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Logged in as
              </span>
              <span className="mt-1 block truncate text-sm font-semibold text-slate-800">
                {user.name}
              </span>
              <span className="block truncate text-xs text-slate-500">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState, useEffect } from 'react';
import { getUsers, changeUserRole, deleteUser, getAuditLogs } from '../api/adminApi';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Terminal,
  UserMinus,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';

const AdminPanel = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logTotalPages, setLogTotalPages] = useState(1);
  const [logTotalItems, setLogTotalItems] = useState(0);

  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.users);
    } catch (error) {
      toast.error('Failed to retrieve user list');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const params = {
        page: logPage,
        limit: 15,
      };
      if (actionFilter) params.action = actionFilter;
      if (entityFilter) params.entity = entityFilter;

      const res = await getAuditLogs(params);
      const { items, total, totalPages } = res.data;
      setLogs(items);
      setLogTotalItems(total);
      setLogTotalPages(totalPages);
    } catch (error) {
      toast.error('Failed to retrieve audit log entries');
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchLogs();
    }
  }, [activeTab, logPage, actionFilter, entityFilter]);

  const handleChangeRole = async (targetUserId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;

    try {
      await changeUserRole(targetUserId, nextRole);
      toast.success(`User role changed to ${nextRole}`);
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update user role';
      toast.error(msg);
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;

    try {
      await deleteUser(targetUserId);
      toast.success('User account deleted');
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete user account';
      toast.error(msg);
    }
  };

  const userHeaders = ['Name', 'Email', 'Role', 'Last Login', 'Actions'];

  const renderUserRow = (u) => (
    <tr key={u._id} className="hover:bg-slate-50/20 transition-colors">
      <td className="p-4 pl-6 font-semibold text-slate-800">{u.name}</td>
      <td className="p-4 text-slate-500">{u.email}</td>
      <td className="p-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
            u.role === 'admin'
              ? 'bg-indigo-50 text-indigo-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {u.role}
        </span>
      </td>
      <td className="p-4 text-slate-500">
        {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : <span className="text-slate-300 italic text-xs">Never</span>}
      </td>
      <td className="p-4 pr-6 text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => handleChangeRole(u._id, u.role)}
            disabled={u._id === currentUser.id}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
            title="Toggle Role"
          >
            <Shield className="h-3.5 w-3.5" /> Toggle Role
          </Button>
          <button
            onClick={() => handleDeleteUser(u._id)}
            disabled={u._id === currentUser.id}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 transition-colors"
            title="Delete Account"
          >
            <UserMinus className="h-4.5 w-4.5" />
          </button>
        </div>
      </td>
    </tr>
  );

  const logHeaders = ['Timestamp', 'Action', 'Entity', 'Triggered By', 'IP Address'];

  const renderLogRow = (log) => (
    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
      <td className="p-4 pl-6 text-slate-500 whitespace-nowrap font-mono text-xs">
        {new Date(log.timestamp).toLocaleString()}
      </td>
      <td className="p-4 font-mono text-xs">
        <span
          className={`inline-block rounded px-2 py-0.5 font-bold ${
            log.action.includes('DELETE')
              ? 'bg-red-50 text-red-700'
              : log.action.includes('CREATE') || log.action.includes('REGISTER')
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          {log.action}
        </span>
      </td>
      <td className="p-4 font-semibold text-slate-700 font-mono text-xs">{log.entity}</td>
      <td className="p-4 text-slate-500 whitespace-nowrap font-mono text-xs">
        {log.user ? `${log.user.name} (${log.user.email})` : <span className="text-slate-300 italic">SYSTEM/GUEST</span>}
      </td>
      <td className="p-4 pr-6 text-slate-400 font-mono text-xs">{log.ipAddress || 'unknown'}</td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">Admin Control Panel</h1>
        <p className="text-sm text-slate-500">Manage user authorization and monitor system events.</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all focus:outline-hidden ${
            activeTab === 'users'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <Users className="h-4.5 w-4.5" /> User Accounts
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition-all focus:outline-hidden ${
            activeTab === 'logs'
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <Terminal className="h-4.5 w-4.5" /> Audit Logging
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 px-6 py-4 border border-slate-200 rounded-xl">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-500" /> Users List
            </h2>
            <button
              onClick={fetchUsers}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <Table
            headers={userHeaders}
            items={users}
            renderRow={renderUserRow}
            loading={usersLoading}
            emptyMessage="No registered users found."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Action
              </label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setLogPage(1);
                }}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              >
                <option value="">All Actions</option>
                <option value="USER_LOGIN">USER_LOGIN</option>
                <option value="USER_REGISTER">USER_REGISTER</option>
                <option value="TASK_CREATE">TASK_CREATE</option>
                <option value="TASK_UPDATE">TASK_UPDATE</option>
                <option value="TASK_DELETE">TASK_DELETE</option>
                <option value="ADMIN_DELETE_USER">ADMIN_DELETE_USER</option>
                <option value="ADMIN_CHANGE_ROLE_ADMIN">ADMIN_CHANGE_ROLE_ADMIN</option>
                <option value="ADMIN_CHANGE_ROLE_USER">ADMIN_CHANGE_ROLE_USER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Filter by Entity
              </label>
              <select
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value);
                  setLogPage(1);
                }}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              >
                <option value="">All Entities</option>
                <option value="User">User</option>
                <option value="Task">Task</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={fetchLogs}
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Refresh Logs
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Table
              headers={logHeaders}
              items={logs}
              renderRow={renderLogRow}
              loading={logsLoading}
              emptyMessage="No audit logs matching query criteria."
            />

            <Pagination
              page={logPage}
              totalPages={logTotalPages}
              totalItems={logTotalItems}
              setPage={setLogPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

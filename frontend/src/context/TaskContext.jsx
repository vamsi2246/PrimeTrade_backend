import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import apiClient from '../api/axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortField, setSortField] = useState('-createdAt');

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiClient.get('/tasks/stats');
      setStats(res.data.data.stats);
    } catch (error) {
      console.error('Error fetching task statistics:', error);
    }
  }, [user]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sort: sortField,
      };

      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await apiClient.get('/tasks', { params });
      const { items, total, totalPages: pages } = res.data.data;
      
      setTasks(items);
      setTotalItems(total);
      setTotalPages(pages);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [user, page, limit, search, statusFilter, priorityFilter, sortField]);

  // Trigger tasks load when queries change
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const createTask = async (taskData) => {
    try {
      const res = await apiClient.post('/tasks', taskData);
      const newTask = res.data.data.task;
      
      // Refresh list & statistics
      fetchTasks();
      fetchStats();
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, updatedFields) => {
    try {
      const res = await apiClient.put(`/tasks/${taskId}`, updatedFields);
      const updatedTask = res.data.data.task;
      
      // Update local state directly to prevent heavy re-renders, but trigger stats refresh
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
      fetchStats();
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      
      // Update local state
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        page,
        setPage,
        limit,
        setLimit,
        totalPages,
        totalItems,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        sortField,
        setSortField,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  getTasks,
  getTaskStats,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from '../api/taskApi';
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
      const res = await getTaskStats();
      setStats(res.data.stats);
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

      const res = await getTasks(params);
      const { items, total, totalPages: pages } = res.data;
      
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
      const res = await createTaskApi(taskData);
      const newTask = res.data.task;
      
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
      const res = await updateTaskApi(taskId, updatedFields);
      const updatedTask = res.data.task;
      
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
      await deleteTaskApi(taskId);
      
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

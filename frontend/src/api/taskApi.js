import apiClient from './axios';

export const getTasks = async (params = {}) => {
  const response = await apiClient.get('/tasks', { params });
  return response.data;
};

export const getTaskStats = async () => {
  const response = await apiClient.get('/tasks/stats');
  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}`);
  return response.data;
};

export const createTask = async (taskPayload) => {
  const response = await apiClient.post('/tasks', taskPayload);
  return response.data;
};

export const updateTask = async (taskId, taskPayload) => {
  const response = await apiClient.put(`/tasks/${taskId}`, taskPayload);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};

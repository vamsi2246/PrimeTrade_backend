import apiClient from './axios';

export const getUsers = async (params = {}) => {
  const response = await apiClient.get('/users', { params });
  return response.data;
};

export const changeUserRole = async (userId, role) => {
  const response = await apiClient.patch(`/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};

export const getAuditLogs = async (params = {}) => {
  const response = await apiClient.get('/audit', { params });
  return response.data;
};
export const getUserProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (profilePayload) => {
  const response = await apiClient.put('/users/profile', profilePayload);
  return response.data;
};

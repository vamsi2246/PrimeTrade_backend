import apiClient from './axios';

export const loginUser = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
};

export const loginWithGoogle = async (idToken) => {
  const response = await apiClient.post('/auth/google', { idToken });
  return response.data;
};

export const refreshSession = async () => {
  const response = await apiClient.post('/auth/refresh');
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

import { apiClient, setAuthToken } from './api.js';

export const registerApi = async ({ name, email, password }) => {
  const data = await apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (data?.data?.token) {
    setAuthToken(data.data.token);
  }
  return data;
};

export const loginApi = async ({ email, password }) => {
  const data = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.data?.token) {
    setAuthToken(data.data.token);
  }
  return data;
};

export const logoutApi = async () => {
  try {
    await apiClient('/auth/logout', {
      method: 'POST',
    });
  } finally {
    setAuthToken(null);
  }
};

export const getMeApi = async () => {
  return apiClient('/auth/me', {
    method: 'GET',
  });
};

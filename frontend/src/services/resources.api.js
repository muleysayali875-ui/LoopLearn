import { apiClient } from './api.js';

export const getResourcesApi = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '' && val !== 'All') {
      query.append(key, val);
    }
  });

  const queryString = query.toString();
  const endpoint = queryString ? `/resources?${queryString}` : '/resources';
  return apiClient(endpoint, { method: 'GET' });
};

export const getResourceByIdApi = async (id) => {
  return apiClient(`/resources/${id}`, { method: 'GET' });
};

export const createResourceApi = async (resourceData) => {
  return apiClient('/resources', {
    method: 'POST',
    body: JSON.stringify(resourceData),
  });
};

export const getMyResourcesApi = async () => {
  return apiClient('/resources/mine', { method: 'GET' });
};

export const updateResourceApi = async (id, updates) => {
  return apiClient(`/resources/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const deleteResourceApi = async (id) => {
  return apiClient(`/resources/${id}`, {
    method: 'DELETE',
  });
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

// In-memory token storage (never localStorage for security)
let inMemoryToken = null;

export const setAuthToken = (token) => {
  inMemoryToken = token;
};

export const getAuthToken = () => inMemoryToken;

/**
 * Centralized fetch API wrapper with consistent base URL, credentials, and error parsing
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // If in-memory token exists, attach Bearer header
  if (inMemoryToken) {
    headers['Authorization'] = `Bearer ${inMemoryToken}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Ensures HttpOnly cookies are passed in cross-site requests
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (_networkError) {
    throw new Error('Unable to connect to the server. Please check your internet connection.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) ||
      `Request failed with status ${response.status}: ${response.statusText}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.errors = data && data.errors ? data.errors : [];
    throw error;
  }

  return data;
};

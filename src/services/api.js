import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Unwrap the backend's { success, message, data, meta } envelope and
// normalize errors so callers only ever deal with plain objects/messages.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Unexpected network error';
    return Promise.reject({
      message,
      status: error.response?.status,
      details: error.response?.data,
    });
  }
);

export default api;

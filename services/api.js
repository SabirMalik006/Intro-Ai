import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject({
        message: 'No internet connection. Please check your network.',
        code: 'NETWORK_ERROR'
      });
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/auth/refresh-token') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error.response.data);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.data?.accessToken;
        processQueue(null, newToken);
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError.response?.data || { message: 'Session expired. Please login again.' });
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response.status >= 500) {
      return Promise.reject({
        ...error.response.data,
        message: 'Something went wrong on our end. Please try again later.'
      });
    }

    return Promise.reject(error.response.data || { message: 'An unknown error occurred' });
  }
);

export default api;

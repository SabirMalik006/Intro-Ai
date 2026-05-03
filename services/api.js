import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // In a real app with Clerk/JWT, we'd attach the token here
    // const token = await window.Clerk?.session?.getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // For now, assume cookies are used or token is in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle Network Errors
    if (!error.response) {
      // Toast or notify user about no internet
      console.error('Network Error: No internet connection');
      return Promise.reject({
        message: 'No internet connection. Please check your network.',
        code: 'NETWORK_ERROR'
      });
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Redirect to login or refresh token
      if (typeof window !== 'undefined') {
        // window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }

    // Handle 500 Server Errors
    if (error.response.status >= 500) {
      return Promise.reject({
        ...error.response.data,
        message: 'Something went wrong on our end. Please try again later.'
      });
    }

    // Return structured error
    return Promise.reject(error.response.data || { message: 'An unknown error occurred' });
  }
);

export default api;

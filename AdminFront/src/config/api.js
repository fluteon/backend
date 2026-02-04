import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("API_BASE_URL =", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor to include JWT token dynamically with every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Only set Content-Type to JSON if it's not already set (for FormData)
    // When data is FormData, browser/axios will auto-set multipart/form-data with boundary
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle JWT expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle JWT expiration
    if (error.response?.status === 401 || error.response?.data?.message?.includes('jwt expired')) {
      console.error('JWT token expired or invalid');
      
      // Clear expired token
      localStorage.removeItem('jwt');
      
      // Redirect to login page
      window.location.href = '/';
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    return Promise.reject(error);
  }
);

export default api;

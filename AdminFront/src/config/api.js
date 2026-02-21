import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("API_BASE_URL =", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor to include JWT token dynamically with every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt') || localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Only set Content-Type to JSON if it's not already set and data is not FormData
    // When data is FormData, browser/axios will auto-set multipart/form-data with boundary
    if (config.data instanceof FormData) {
      // Let browser set Content-Type with boundary for FormData
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
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
    // Handle JWT expiration - catch both 401 and 500 (old backend returns 500)
    const isJWTExpired = 
      error.response?.status === 401 || 
      (error.response?.status === 500 &&
        (error.response?.data?.message?.includes('jwt expired') || 
         error.response?.data?.error?.includes('jwt expired') ||
         error.message?.includes('jwt expired')));
    
    if (isJWTExpired) {
      console.error('⚠️ JWT token expired or invalid - clearing storage and redirecting');
      
      // Clear expired token from both storages
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.href = '/';
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    return Promise.reject(error);
  }
);

export default api;

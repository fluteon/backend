import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("API_BASE_URL =", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor to include JWT token dynamically with every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

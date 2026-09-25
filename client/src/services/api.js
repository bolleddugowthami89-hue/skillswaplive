import axios from 'axios';

// Dynamically determine the backend API base URL
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    const trimmed = envUrl.trim().replace(/\/$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // Fallback based on runtime hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Local development: use relative /api proxy or localhost:5000
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '/api';
    }
    // Production Vercel or other cloud hosts
    return 'https://skillswaplive.onrender.com/api';
  }

  return 'https://skillswaplive.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillswap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
          console.warn('[API Auth] Session expired or unauthorized, clearing local token');
          localStorage.removeItem('skillswap_token');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

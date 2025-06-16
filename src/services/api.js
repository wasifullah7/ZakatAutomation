import axios from 'axios';
import { toast } from 'react-toastify';

// Get API URL from environment or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout to 30 seconds
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the full error for debugging
    console.error('API Error:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });

    // Handle network errors
    if (!error.response) {
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check if the server is running.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error('Network error. Please check your connection.');
      }
      return Promise.reject(error);
    }

    // Handle specific status codes
    switch (error.response.status) {
      case 401:
        if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
          if (error.response.data?.message?.includes('auth')) {
            localStorage.removeItem('token');
            window.location.href = '/signin';
          }
        }
        break;
      case 403:
        toast.error('Access denied. Please check your permissions.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        if (error.response.data?.errors) {
          const errorMessages = error.response.data.errors.map(err => err.message).join('\n');
          toast.error(errorMessages);
        } else {
          toast.error(error.response.data?.message || 'An error occurred');
        }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  updateProfile: async (data) => {
    try {
      let sendData;
      let headers = {};

      if (data instanceof FormData) {
        sendData = data;
        headers = {
          'Content-Type': 'multipart/form-data',
        };
      } else {
        sendData = new FormData();
        Object.keys(data).forEach(key => {
          if (data[key] !== undefined && data[key] !== null) {
            sendData.append(key, data[key]);
          }
        });
        // If not FormData, assume JSON or other default content type (axios default is application/json for plain objects)
        // No specific headers needed here unless it's a specific non-form-data type
      }

      const response = await api.patch('/auth/me', sendData, {
        headers: {
          ...headers // Apply content type header if FormData
        },
      });
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// User API calls
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  approveAcceptor: (id, status) => api.patch(`/users/admin/approve/${id}`, { status }),
};

// Admin API calls
export const adminAPI = {
  getAcceptors: () => api.get('/admin/acceptors'),
  approveAcceptor: (id, data) => api.put(`/admin/approve/${id}`, data),
  getAcceptorStats: () => api.get('/admin/stats/acceptors'),
};

export default api; 
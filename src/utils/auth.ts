import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with credentials
const authApi = axios.create({
  baseURL: API_BASE_URL + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include access token
authApi.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
authApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data.accessToken) {
          // Store new access token
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth functions
export const login = async (email: string, password: string) => {
  const response = await authApi.post('/auth/login', { email, password });

  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await authApi.post('/auth/register', { username, email, password });

  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

export const logout = async () => {
  try {
    await authApi.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const refreshToken = async () => {
  const response = await authApi.post('/auth/refresh');

  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }

  return response.data;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export default authApi;

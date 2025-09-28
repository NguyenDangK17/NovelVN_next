import axios from 'axios';
import useSWR from 'swr';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Custom fetcher for SWR
const fetcher = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error('An error occurred while fetching the data.');
  }
};

// Custom hook for data fetching with SWR
export function useApi<T>(path: string, options = {}) {
  return useSWR<T>(path, fetcher, {
    revalidateOnFocus: false,
    ...options,
  });
}

// Central error utility
export function getApiErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) return axiosError.response.data.message;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string };
    return errorWithMessage.message;
  }
  return 'An unexpected error occurred. Please try again later.';
}

// API methods
export const apiClient = {
  get: <T>(url: string) => api.get<T>(url).then(res => res.data),
  post: <T>(url: string, data: unknown) => api.post<T>(url, data).then(res => res.data),
  put: <T>(url: string, data: unknown) => api.put<T>(url, data).then(res => res.data),
  delete: <T>(url: string) => api.delete<T>(url).then(res => res.data),
};

export default api;

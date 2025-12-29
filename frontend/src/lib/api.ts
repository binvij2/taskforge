import axios from 'axios';

// In browser context, use relative paths (empty baseURL)
// This allows the browser to make requests to the same origin
const API_BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
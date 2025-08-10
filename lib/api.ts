import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }
  
  // Fallback for development
  return 'http://localhost:8000';
};

const API_BASE_URL = getBaseUrl();
console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR' || !error.response) {
      console.log('Network error - backend may not be running, falling back to mock');
      error.isNetworkError = true;
    } else {
      console.error('API Response Error:', error.response?.data || error.message);
    }
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized - could trigger logout
      console.log('Unauthorized request - user may need to login');
    }
    
    return Promise.reject(error);
  }
);

// Health check function
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/api/');
    console.log('Health check successful:', response.data);
    return true;
  } catch (error: any) {
    console.log('Health check failed:', error.message);
    return false;
  }
};

export default api;
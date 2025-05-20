
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// Create API base configuration
const createApiClient = (token?: string): AxiosInstance => {
  // In a real app, this would come from environment variables
  const API_URL = 'https://api.sellmaster.example.com';

  const config: AxiosRequestConfig = {
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add authorization token if provided
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const client = axios.create(config);

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // You could do some logging or add timestamps here
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        // In a real app, dispatch a logout action
        localStorage.removeItem('auth');
        // Redirect to login page
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const client = createApiClient();
    const response = await client.post('/auth/login', { email, password });
    return response.data;
  },
  refreshToken: async (refreshToken: string) => {
    const client = createApiClient();
    const response = await client.post('/auth/token', { refreshToken });
    return response.data;
  },
};

// Payments API
export const paymentsApi = {
  getPaymentsByMonth: async (token: string, workspaceId: string, year: number, month: number) => {
    const client = createApiClient(token);
    const response = await client.get(`/payments`, {
      params: { workspaceId, year, month }
    });
    return response.data;
  },
  createPayment: async (token: string, payment: any) => {
    const client = createApiClient(token);
    const response = await client.post('/payments', payment);
    return response.data;
  },
  updatePayment: async (token: string, id: string, payment: any) => {
    const client = createApiClient(token);
    const response = await client.put(`/payments/${id}`, payment);
    return response.data;
  },
  deletePayment: async (token: string, id: string) => {
    const client = createApiClient(token);
    const response = await client.delete(`/payments/${id}`);
    return response.data;
  },
};

// Workspace API
export const workspaceApi = {
  getUserWorkspaces: async (token: string) => {
    const client = createApiClient(token);
    const response = await client.get('/workspaces');
    return response.data;
  },
};

// Currency API
export const currencyApi = {
  getAllCurrencies: async (token: string) => {
    const client = createApiClient(token);
    const response = await client.get('/currencies');
    return response.data;
  },
};

// Language API
export const languageApi = {
  getAllLanguages: async (token: string) => {
    const client = createApiClient(token);
    const response = await client.get('/languages');
    return response.data;
  },
};

export default {
  authApi,
  paymentsApi,
  workspaceApi,
  currencyApi,
  languageApi,
};

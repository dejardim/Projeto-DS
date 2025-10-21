/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { name: string; username: string; password: string; email?: string }) =>
    api.post('/spreadsheets/auth/signup', data),
  
  login: (data: { username: string; password: string }) =>
    api.post('/spreadsheets/auth/login', data),
};

// Spreadsheets API
export const spreadsheetsAPI = {
  createAbstract: (data: {
    name: string;
    mount: number;
    year: number;
    budgets: {
      revenue: { planned: number };
      expenses: Array<{ category: string; planned: number }>;
    };
  }) => api.post('/spreadsheets/abstracts', data),
  
  getAbstract: (mount: number, year: number) =>
    api.get(`/spreadsheets/abstracts/${mount}/${year}`),
  
  updateNotes: (abstractUid: string, notes: any) =>
    api.put(`/spreadsheets/abstracts/${abstractUid}/notes`, { notes }),
  
  getTransactions: (page = 1, limit = 25) =>
    api.get(`/spreadsheets/transactions?page=${page}&limit=${limit}`),
};

// Revenues API
export const revenuesAPI = {
  create: (data: {
    paymentOption?: string;
    month: number;
    year: number;
    date: number;
    amount: number;
    description: string;
  }) => api.post('/revenues', data),
  
  getAll: (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    return api.get(`/revenues?${params.toString()}`);
  },
  
  getById: (id: string) => api.get(`/revenues/${id}`),
  update: (id: string, data: any) => api.put(`/revenues/${id}`, data),
  delete: (id: string) => api.delete(`/revenues/${id}`),
};

// Expenses API
export const expensesAPI = {
  create: (data: {
    category?: string;
    paymentOption?: string;
    month: number;
    year: number;
    date: number;
    fixed: boolean;
    amount: number;
    description: string;
    metadata?: Record<string, any>;
  }) => api.post('/expenses', data),
  
  getAll: (month?: number, year?: number, category?: string) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    if (category) params.append('category', category);
    return api.get(`/expenses?${params.toString()}`);
  },
  
  getById: (id: string) => api.get(`/expenses/${id}`),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Categories API
export const categoriesAPI = {
  create: (data: { name: string }) => api.post('/categories', data),
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  update: (id: string, data: { name: string }) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Payment Options API
export const paymentOptionsAPI = {
  create: (data: { name: string }) => api.post('/payment-options', data),
  getAll: () => api.get('/payment-options'),
  getById: (id: string) => api.get(`/payment-options/${id}`),
  update: (id: string, data: { name: string }) => api.put(`/payment-options/${id}`, data),
  delete: (id: string) => api.delete(`/payment-options/${id}`),
};

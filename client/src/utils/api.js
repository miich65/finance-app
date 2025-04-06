import axios from 'axios';
import { getToken } from './localStorage';

// Crea un'istanza di Axios con base URL e headers predefiniti
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Aggiungi un interceptor per includere il token JWT in ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Funzioni API per autenticazione
export const authAPI = {
  login: (credentials) => api.post('/auth', credentials),
  register: (userData) => api.post('/users', userData),
  getCurrentUser: () => api.get('/auth')
};

// Funzioni API per transazioni
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  create: (transactionData) => api.post('/transactions', transactionData),
  delete: (id) => api.delete(`/transactions/${id}`)
};

// Funzioni API per categorie
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (categoryData) => api.post('/categories', categoryData)
};

// Funzioni API per account
export const accountsAPI = {
  getAll: () => api.get('/accounts'),
  create: (accountData) => api.post('/accounts', accountData)
};

// Funzioni API per report
export const reportsAPI = {
  getCashflow: (period) => api.get(`/reports/cashflow?period=${period}`),
  getCategories: () => api.get('/reports/categories'),
  getSummary: () => api.get('/reports/summary')
};

export default api;
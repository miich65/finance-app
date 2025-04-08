/**
 * Costanti utilizzate nell'applicazione
 */

// API URLs
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tipi di transazione
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Tipi di categoria
export const CATEGORY_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  BOTH: 'both'
};

// Periodi di tempo per i report
export const TIME_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  CUSTOM: 'custom'
};

// Nomi delle rotte principali
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  ACCOUNTS: '/accounts',
  CATEGORIES: '/categories',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  NOT_FOUND: '*'
};

// Formato data predefinito
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';

// Colori per i grafici
export const CHART_COLORS = {
  INCOME: '#4caf50', // Verde
  EXPENSE: '#f44336', // Rosso
  BALANCE: '#2196f3', // Blu
  NEUTRAL: '#9e9e9e', // Grigio
  PALETTE: [
    '#4caf50', // Verde primario
    '#f44336', // Rosso primario
    '#2196f3', // Blu primario
    '#ff9800', // Arancione
    '#9c27b0', // Viola
    '#00bcd4', // Ciano
    '#ffc107', // Giallo
    '#795548', // Marrone
    '#607d8b', // Grigio blu
    '#e91e63'  // Rosa
  ]
};

// Messaggi di errore comuni
export const ERROR_MESSAGES = {
  GENERIC: 'Si è verificato un errore. Riprova più tardi.',
  NETWORK: 'Errore di connessione. Verifica la tua connessione internet.',
  UNAUTHORIZED: 'Non sei autorizzato. Effettua il login.',
  NOT_FOUND: 'Risorsa non trovata.',
  VALIDATION: 'I dati inseriti non sono validi.',
  SERVER: 'Si è verificato un errore sul server. Riprova più tardi.'
};

// Messaggi di successo comuni
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login effettuato con successo!',
  REGISTER: 'Registrazione completata con successo!',
  LOGOUT: 'Logout effettuato con successo!',
  TRANSACTION_ADDED: 'Transazione aggiunta con successo!',
  TRANSACTION_UPDATED: 'Transazione aggiornata con successo!',
  TRANSACTION_DELETED: 'Transazione eliminata con successo!',
  CATEGORY_ADDED: 'Categoria aggiunta con successo!',
  CATEGORY_UPDATED: 'Categoria aggiornata con successo!',
  CATEGORY_DELETED: 'Categoria eliminata con successo!',
  ACCOUNT_ADDED: 'Conto aggiunto con successo!',
  ACCOUNT_UPDATED: 'Conto aggiornato con successo!',
  ACCOUNT_DELETED: 'Conto eliminato con successo!'
};

// Costanti per localStorage
export const STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'finance_app_theme',
  USER_SETTINGS: 'finance_app_user_settings',
  LAST_VISITED: 'finance_app_last_visited'
};

// Lingue supportate
export const SUPPORTED_LANGUAGES = [
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' }
];

// Tema
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export default {
  API_BASE_URL,
  TRANSACTION_TYPES,
  CATEGORY_TYPES,
  TIME_PERIODS,
  ROUTES,
  DEFAULT_DATE_FORMAT,
  CHART_COLORS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  SUPPORTED_LANGUAGES,
  THEMES
};
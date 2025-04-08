import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

// Creazione del Context
const AuthContext = createContext();

// Stato iniziale
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

// Reducer per gestire le azioni relative all'autenticazione
const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: payload
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

// Provider component
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Carica l'utente al mount del componente se esiste un token
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      loadUser();
    } else {
      // Se non c'è un token, imposta immediatamente il caricamento a false
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Carica i dati dell'utente
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: 'LOGOUT' });
      return;
    }
  
    try {
      // Imposta il token prima di fare la chiamata
      setAuthToken(token);
      
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.get('/api/auth');
      
      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      // Se c'è un errore (es. token scaduto), effettua il logout
      dispatch({ 
        type: 'AUTH_ERROR',
        payload: err.response?.data?.msg || 'Error loading user' 
      });
    }
  };

  // Registra un nuovo utente
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.post('/api/users', formData, config);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Registration failed'
      });
    }
  };

  // Login utente
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.post('/api/auth', formData, config);
  
      // Imposta il token prima di salvarlo
      setAuthToken(res.data.token);
  
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
  
      loadUser();
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Invalid credentials'
      });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Pulisci gli errori
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
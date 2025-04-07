import React, { createContext, useReducer } from 'react';
import axios from 'axios';

// Creazione del Context
const AccountContext = createContext();

// Stato iniziale
const initialState = {
  accounts: [],
  currentAccount: null,
  loading: true,
  error: null
};

// Tipi di azioni
const ACCOUNTS_LOADED = 'ACCOUNTS_LOADED';
const ACCOUNT_ADDED = 'ACCOUNT_ADDED';
const SET_CURRENT_ACCOUNT = 'SET_CURRENT_ACCOUNT';
const ACCOUNT_ERROR = 'ACCOUNT_ERROR';
const SET_LOADING = 'SET_LOADING';
const CLEAR_ERRORS = 'CLEAR_ERRORS';

// Reducer
const accountReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACCOUNTS_LOADED:
      return {
        ...state,
        accounts: payload,
        loading: false
      };
    case ACCOUNT_ADDED:
      return {
        ...state,
        accounts: [...state.accounts, payload],
        loading: false
      };
    case SET_CURRENT_ACCOUNT:
      return {
        ...state,
        currentAccount: payload
      };
    case ACCOUNT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider
const AccountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  // Ottieni tutti gli account
  const getAccounts = async () => {
    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.get('/api/accounts');
      
      dispatch({
        type: ACCOUNTS_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: ACCOUNT_ERROR,
        payload: err.response?.data?.msg || 'Errore nel recupero degli account'
      });
    }
  };

  // Aggiungi un nuovo account
  const addAccount = async (account) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.post('/api/accounts', account, config);
      
      dispatch({
        type: ACCOUNT_ADDED,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: ACCOUNT_ERROR,
        payload: err.response?.data?.msg || 'Errore durante l\'aggiunta dell\'account'
      });
      throw err;
    }
  };

  // Imposta l'account corrente
  const setCurrentAccount = (account) => {
    dispatch({
      type: SET_CURRENT_ACCOUNT,
      payload: account
    });
  };

  // Calcola il saldo totale di tutti gli account
  const getTotalBalance = () => {
    return state.accounts.reduce((total, account) => total + account.currentBalance, 0);
  };

  // Pulisci errori
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AccountContext.Provider
      value={{
        accounts: state.accounts,
        currentAccount: state.currentAccount,
        loading: state.loading,
        error: state.error,
        getAccounts,
        addAccount,
        setCurrentAccount,
        getTotalBalance,
        clearErrors
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountProvider };
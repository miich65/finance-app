import React, { createContext, useReducer, useContext } from 'react';
import { transactionsAPI } from '../utils/api';

// Creazione del context
const TransactionContext = createContext();

// Tipi di azioni per il reducer
const types = {
  GET_TRANSACTIONS: 'GET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  CLEAR_TRANSACTIONS: 'CLEAR_TRANSACTIONS',
  SET_LOADING: 'SET_LOADING'
};

// Reducer per gestire lo stato
const transactionReducer = (state, action) => {
  switch (action.type) {
    case types.GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        loading: false
      };
    case types.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        loading: false
      };
    case types.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction._id !== action.payload
        ),
        loading: false
      };
    case types.TRANSACTION_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case types.CLEAR_TRANSACTIONS:
      return {
        ...state,
        transactions: [],
        loading: false
      };
    case types.SET_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

// Provider component
export const TransactionProvider = ({ children }) => {
  const initialState = {
    transactions: [],
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Azioni
  const getTransactions = async () => {
    try {
      dispatch({ type: types.SET_LOADING });
      const res = await transactionsAPI.getAll();
      
      dispatch({
        type: types.GET_TRANSACTIONS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: types.TRANSACTION_ERROR,
        payload: err.response?.data.msg || 'Errore nel caricamento delle transazioni'
      });
    }
  };

  const addTransaction = async (transaction) => {
    try {
      dispatch({ type: types.SET_LOADING });
      const res = await transactionsAPI.create(transaction);
      
      dispatch({
        type: types.ADD_TRANSACTION,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: types.TRANSACTION_ERROR,
        payload: err.response?.data.msg || 'Errore nell\'aggiunta della transazione'
      });
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      dispatch({ type: types.SET_LOADING });
      await transactionsAPI.delete(id);
      
      dispatch({
        type: types.DELETE_TRANSACTION,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: types.TRANSACTION_ERROR,
        payload: err.response?.data.msg || 'Errore nell\'eliminazione della transazione'
      });
    }
  };

  const clearTransactions = () => {
    dispatch({ type: types.CLEAR_TRANSACTIONS });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        loading: state.loading,
        error: state.error,
        getTransactions,
        addTransaction,
        deleteTransaction,
        clearTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Hook personalizzato per usare questo context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions deve essere usato all\'interno di TransactionProvider');
  }
  return context;
};

export default TransactionContext;
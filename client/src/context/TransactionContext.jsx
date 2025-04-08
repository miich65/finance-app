import React, { createContext, useReducer, useContext, useCallback, useMemo} from 'react';
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
  SET_LOADING: 'SET_LOADING',
  GET_TRANSACTIONS_PAGE: 'GET_TRANSACTIONS_PAGE'
};

// Reducer per gestire lo stato
const transactionReducer = (state, action) => {
  switch (action.type) {
    case types.GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        loading: false,
        page: 1
      };
    case types.GET_TRANSACTIONS_PAGE:
      return {
        ...state,
        transactions: [...state.transactions, ...action.payload],
        hasMore: action.payload.length > 0,
        page: state.page + 1,
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
    error: null,
    page: 1,
    limit: 20,
    hasMore: true
  };

  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Azioni
  const getTransactions = useCallback(async () => {
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
  }, []);

  const getTransactionsPage = useCallback(async () => {

    if (!state.hasMore || state.loading) return;
    
    try {
      dispatch({ type: types.SET_LOADING });
      const res = await transactionsAPI.getPaginated(state.page, state.limit);
      
      dispatch({
        type: types.GET_TRANSACTIONS_PAGE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: types.TRANSACTION_ERROR,
        payload: err.response?.data.msg || 'Errore nel caricamento delle transazioni'
      });
    }
  }, [state.hasMore, state.loading, state.page, state.limit]);
  

  const addTransaction = useCallback(async (transaction) => {
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
  }, []);

  const deleteTransaction = useCallback(async (id) => {
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
  }, []);

  const clearTransactions = useCallback(() => {
    dispatch({ type: types.CLEAR_TRANSACTIONS });
  }, []);

  // Usa useMemo per il valore del contesto
  const contextValue = useMemo(() => ({
    transactions: state.transactions,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    page: state.page,
    limit: state.limit,
    getTransactions,
    getTransactionsPage,
    addTransaction,
    deleteTransaction,
    clearTransactions
  }), [
    state.transactions, 
    state.loading, 
    state.error, 
    state.hasMore,
    state.page,
    state.limit,
  ]);

  return (
    <TransactionContext.Provider value={contextValue} >
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

export {TransactionContext};
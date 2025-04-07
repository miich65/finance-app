import React, { createContext, useReducer } from 'react';
import axios from 'axios';

// Creazione del Context
const CategoryContext = createContext();

// Stato iniziale
const initialState = {
  categories: [],
  loading: true,
  error: null
};

// Tipi di azioni
const CATEGORIES_LOADED = 'CATEGORIES_LOADED';
const CATEGORY_ADDED = 'CATEGORY_ADDED';
const CATEGORY_ERROR = 'CATEGORY_ERROR';
const SET_LOADING = 'SET_LOADING';
const CLEAR_ERRORS = 'CLEAR_ERRORS';

// Reducer
const categoryReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case CATEGORIES_LOADED:
      return {
        ...state,
        categories: payload,
        loading: false
      };
    case CATEGORY_ADDED:
      return {
        ...state,
        categories: [...state.categories, payload],
        loading: false
      };
    case CATEGORY_ERROR:
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
const CategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  // Ottieni tutte le categorie
  const getCategories = async () => {
    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.get('/api/categories');
      
      dispatch({
        type: CATEGORIES_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CATEGORY_ERROR,
        payload: err.response?.data?.msg || 'Errore nel recupero delle categorie'
      });
    }
  };

  // Aggiungi una nuova categoria
  const addCategory = async (category) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: SET_LOADING });
      
      const res = await axios.post('/api/categories', category, config);
      
      dispatch({
        type: CATEGORY_ADDED,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: CATEGORY_ERROR,
        payload: err.response?.data?.msg || 'Errore durante l\'aggiunta della categoria'
      });
      throw err;
    }
  };

  // Filtra le categorie per tipo
  const filterCategoriesByType = (type) => {
    if (!type || type === 'all') {
      return state.categories;
    }
    
    return state.categories.filter(
      category => category.type === type || category.type === 'both'
    );
  };

  // Pulisci errori
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <CategoryContext.Provider
      value={{
        categories: state.categories,
        loading: state.loading,
        error: state.error,
        getCategories,
        addCategory,
        filterCategoriesByType,
        clearErrors
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryContext, CategoryProvider };
/**
 * Funzioni di utilità per interagire con il localStorage
 */

/**
 * Ottiene il token JWT dal localStorage
 * @returns {string|null} Il token JWT o null se non presente
 */
export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  /**
   * Salva il token JWT nel localStorage
   * @param {string} token - Il token JWT da salvare
   */
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  /**
   * Rimuove il token JWT dal localStorage
   */
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  /**
   * Salva un'impostazione utente nel localStorage
   * @param {string} key - La chiave dell'impostazione
   * @param {*} value - Il valore dell'impostazione
   */
  export const setUserSetting = (key, value) => {
    try {
      // Se il valore è un oggetto, lo converte in stringa JSON
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
      localStorage.setItem(`finance_app_${key}`, valueToStore);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  };
  
  /**
   * Ottiene un'impostazione utente dal localStorage
   * @param {string} key - La chiave dell'impostazione
   * @param {*} defaultValue - Il valore predefinito se non esiste
   * @returns {*} Il valore dell'impostazione
   */
  export const getUserSetting = (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(`finance_app_${key}`);
      if (value === null) {
        return defaultValue;
      }
      
      // Tenta di analizzare il valore come JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        // Se non è JSON valido, restituisce il valore così com'è
        return value;
      }
    } catch (error) {
      console.error('Error getting from localStorage', error);
      return defaultValue;
    }
  };
  
  /**
   * Rimuove un'impostazione utente dal localStorage
   * @param {string} key - La chiave dell'impostazione
   */
  export const removeUserSetting = (key) => {
    try {
      localStorage.removeItem(`finance_app_${key}`);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  };
  
  /**
   * Pulisce tutte le impostazioni utente dal localStorage
   */
  export const clearUserSettings = () => {
    try {
      // Rimuove solo le chiavi dell'applicazione, mantenendo altre impostazioni
      Object.keys(localStorage)
        .filter(key => key.startsWith('finance_app_'))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing user settings from localStorage', error);
    }
  };
  
  export default {
    getToken,
    setToken,
    removeToken,
    setUserSetting,
    getUserSetting,
    removeUserSetting,
    clearUserSettings
  };
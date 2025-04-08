/**
 * Formatta un valore come valuta in EUR
 * @param {number} value - Il valore numerico da formattare
 * @param {boolean} includeSymbol - Se includere il simbolo dell'euro
 * @returns {string} Il valore formattato come valuta
 */
export const formatCurrency = (value, includeSymbol = true) => {
    const formatter = new Intl.NumberFormat('it-IT', {
      style: includeSymbol ? 'currency' : 'decimal',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(value);
  };
  
  /**
   * Formatta una data in formato italiano
   * @param {string|Date} date - La data da formattare
   * @param {object} options - Opzioni di formattazione (vedi Intl.DateTimeFormat)
   * @returns {string} La data formattata
   */
  export const formatDate = (date, options = {}) => {
    const defaultOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('it-IT', mergedOptions).format(dateObj);
  };
  
  /**
   * Formatta un numero in percentuale
   * @param {number} value - Il valore percentuale (es. 0.75 per 75%)
   * @param {number} decimals - Il numero di decimali
   * @returns {string} Il valore formattato come percentuale
   */
  export const formatPercentage = (value, decimals = 2) => {
    const formatter = new Intl.NumberFormat('it-IT', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    
    return formatter.format(value);
  };
  
  /**
   * Abbrevia un numero grande (migliaia, milioni, ecc.)
   * @param {number} num - Il numero da abbreviare
   * @returns {string} Il numero abbreviato
   */
  export const abbreviateNumber = (num) => {
    if (num === null) return null;
    if (num === 0) return '0';
    
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    
    const abbreviations = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'B' },
      { value: 1e12, symbol: 'T' }
    ];
    
    const result = abbreviations
      .slice()
      .reverse()
      .find(abbr => absNum >= abbr.value);
    
    // Se non trova un risultato adatto, restituisce il numero com'è
    if (!result) {
      return `${isNegative ? '-' : ''}${absNum}`;
    }
    
    const formattedNum = (absNum / result.value).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
    return `${isNegative ? '-' : ''}${formattedNum}${result.symbol}`;
  };
  
  /**
   * Capitolizza la prima lettera di una stringa
   * @param {string} string - La stringa da capitalizzare
   * @returns {string} La stringa con la prima lettera maiuscola
   */
  export const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  export default {
    formatCurrency,
    formatDate,
    formatPercentage,
    abbreviateNumber,
    capitalizeFirstLetter
  };
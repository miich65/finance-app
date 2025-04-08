/**
 * Verifica se una stringa è un indirizzo email valido
 * @param {string} email - L'email da validare
 * @returns {boolean} true se l'email è valida, false altrimenti
 */
export const isEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  /**
   * Verifica se una stringa è vuota
   * @param {string} value - Il valore da controllare
   * @returns {boolean} true se la stringa è vuota o contiene solo spazi, false altrimenti
   */
  export const isEmpty = (value) => {
    return value === undefined || value === null || 
           (typeof value === 'string' && value.trim() === '') ||
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0);
  };
  
  /**
   * Verifica se una stringa ha una lunghezza minima
   * @param {string} value - Il valore da controllare
   * @param {number} minLength - La lunghezza minima richiesta
   * @returns {boolean} true se la stringa ha almeno minLength caratteri, false altrimenti
   */
  export const hasMinLength = (value, minLength) => {
    if (typeof value !== 'string') return false;
    return value.length >= minLength;
  };
  
  /**
   * Verifica se una stringa ha una lunghezza massima
   * @param {string} value - Il valore da controllare
   * @param {number} maxLength - La lunghezza massima consentita
   * @returns {boolean} true se la stringa ha non più di maxLength caratteri, false altrimenti
   */
  export const hasMaxLength = (value, maxLength) => {
    if (typeof value !== 'string') return false;
    return value.length <= maxLength;
  };
  
  /**
   * Verifica se un valore è un numero
   * @param {any} value - Il valore da controllare
   * @returns {boolean} true se il valore è un numero, false altrimenti
   */
  export const isNumber = (value) => {
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value !== 'string') return false;
    return !isNaN(Number(value));
  };
  
  /**
   * Verifica se un valore è un numero positivo
   * @param {any} value - Il valore da controllare
   * @returns {boolean} true se il valore è un numero positivo, false altrimenti
   */
  export const isPositiveNumber = (value) => {
    if (!isNumber(value)) return false;
    return Number(value) > 0;
  };
  
  /**
   * Verifica se una data è valida
   * @param {string|Date} date - La data da validare
   * @returns {boolean} true se la data è valida, false altrimenti
   */
  export const isValidDate = (date) => {
    // Se non è una stringa o una data, è invalida
    if (typeof date !== 'string' && !(date instanceof Date)) return false;
    
    // Se è una stringa, prova a convertirla in data
    if (typeof date === 'string') {
      const d = new Date(date);
      return !isNaN(d.getTime());
    }
    
    // Se è già un oggetto Date, controlla se è valida
    return !isNaN(date.getTime());
  };
  
  /**
   * Verifica se una password è sufficientemente forte
   * @param {string} password - La password da verificare
   * @returns {object} Un oggetto con il risultato della validazione
   */
  export const validatePassword = (password) => {
    const result = {
      isValid: false,
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
      message: ''
    };
    
    // Controlla lunghezza minima (8 caratteri)
    result.hasMinLength = password.length >= 8;
    
    // Controlla presenza di maiuscole
    result.hasUpperCase = /[A-Z]/.test(password);
    
    // Controlla presenza di minuscole
    result.hasLowerCase = /[a-z]/.test(password);
    
    // Controlla presenza di numeri
    result.hasNumber = /[0-9]/.test(password);
    
    // Controlla presenza di caratteri speciali
    result.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // La password è valida se soddisfa almeno 3 dei 4 criteri oltre alla lunghezza minima
    const criteriaCount = [
      result.hasUpperCase,
      result.hasLowerCase,
      result.hasNumber,
      result.hasSpecialChar
    ].filter(Boolean).length;
    
    result.isValid = result.hasMinLength && criteriaCount >= 3;
    
    // Costruisci il messaggio di errore
    if (!result.isValid) {
      const missing = [];
      if (!result.hasMinLength) missing.push('almeno 8 caratteri');
      if (!result.hasUpperCase) missing.push('almeno una lettera maiuscola');
      if (!result.hasLowerCase) missing.push('almeno una lettera minuscola');
      if (!result.hasNumber) missing.push('almeno un numero');
      if (!result.hasSpecialChar) missing.push('almeno un carattere speciale');
      
      result.message = `La password deve contenere ${missing.join(', ')}`;
    }
    
    return result;
  };
  
  export default {
    isEmail,
    isEmpty,
    hasMinLength,
    hasMaxLength,
    isNumber,
    isPositiveNumber,
    isValidDate,
    validatePassword
  };
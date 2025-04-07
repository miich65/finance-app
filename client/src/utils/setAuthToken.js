import axios from 'axios';

/**
 * Imposta il token di autenticazione nell'header delle richieste axios
 * @param {string} token - Il JWT token
 */
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
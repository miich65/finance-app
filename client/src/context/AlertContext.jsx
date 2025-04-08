import React, { createContext, useReducer, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Alert, Snackbar } from '@mui/material';

// Creazione del Context
const AlertContext = createContext();

// Stato iniziale
const initialState = {
  alerts: []
};

// Tipi di azioni
const SET_ALERT = 'SET_ALERT';
const REMOVE_ALERT = 'REMOVE_ALERT';

// Reducer
const alertReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, payload]
      };
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== payload)
      };
    default:
      return state;
  }
};

// Provider
const AlertProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Imposta un alert
  const setAlert = (msg, type = 'info', timeout = 5000) => {
    const id = uuidv4();
    
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
    
    return id;
  };

  // Rimuovi un alert manualmente
  const removeAlert = (id) => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  };

  // Helper per messaggi specifici
  const setSuccessAlert = (msg, timeout) => setAlert(msg, 'success', timeout);
  const setErrorAlert = (msg, timeout) => setAlert(msg, 'error', timeout);
  const setWarningAlert = (msg, timeout) => setAlert(msg, 'warning', timeout);
  const setInfoAlert = (msg, timeout) => setAlert(msg, 'info', timeout);

  return (
    <AlertContext.Provider
      value={{
        alerts: state.alerts,
        setAlert,
        removeAlert,
        setSuccessAlert,
        setErrorAlert,
        setWarningAlert,
        setInfoAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// Componente Alert per visualizzare gli alert
const AlertComponent = () => {
  // Usa useContext qui per accedere al contesto
  const { alerts, removeAlert } = useContext(AlertContext);

  return (
    <div className="alert-container" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1500 }}>
      {alerts.map(alert => (
        <Snackbar
          key={alert.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={6000}
          onClose={() => removeAlert(alert.id)}
        >
          <Alert 
            severity={alert.type}
            sx={{ mb: 2, minWidth: '250px' }}
            onClose={() => removeAlert(alert.id)}
          >
            {alert.msg}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

export { AlertContext, AlertProvider, AlertComponent };
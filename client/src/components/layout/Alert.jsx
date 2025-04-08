import React, { useContext } from 'react';
import { Alert, Snackbar, Slide } from '@mui/material';
import { AlertContext } from '../../context/AlertContext';

// Transizione per l'entrata dell'alert
const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const AlertComponent = () => {
  const { alerts, removeAlert } = useContext(AlertContext);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="alert-container" style={{ position: 'fixed', top: 80, right: 16, zIndex: 1500 }}>
      {alerts.map(alert => (
        <Snackbar 
          key={alert.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          sx={{ mb: 2 }}
          autoHideDuration={6000}
          onClose={() => removeAlert(alert.id)}
        >
          <Alert
            severity={alert.type}
            variant="filled"
            onClose={() => removeAlert(alert.id)}
            sx={{ minWidth: 250, boxShadow: 3 }}
          >
            {alert.msg}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

export default AlertComponent;
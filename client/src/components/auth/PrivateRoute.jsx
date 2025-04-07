import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Mostra il loader mentre verifichiamo lo stato di autenticazione
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Reindirizza alla pagina di login se non autenticato
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  // Renderizza il componente children se autenticato
  return children;
};

export default PrivateRoute;
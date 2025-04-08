import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Error, Home } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 10 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Error color="error" sx={{ fontSize: 80, mb: 2 }} />
        
        <Typography variant="h2" component="h1" gutterBottom align="center">
          404
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
          Pagina non trovata
        </Typography>
        
        <Typography variant="body1" align="center" sx={{ mb: 4, maxWidth: 500 }}>
          La pagina che stai cercando non esiste o è stata spostata.
          Verifica l'URL o torna alla dashboard.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          component={RouterLink} 
          to="/dashboard" 
          startIcon={<Home />}
          size="large"
          sx={{ mt: 2 }}
        >
          Torna alla Dashboard
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;
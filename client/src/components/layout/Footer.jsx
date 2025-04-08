import React from 'react';
import { Box, Typography, Divider, Link, Container } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto', 
        py: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" align="center">
              © {currentYear} Finance App - Gestione Finanziaria Personale & Professionale
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              mt: { xs: 2, sm: 0 }
            }}
          >
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Privacy
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Termini di Servizio
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Supporto
            </Link>
          </Box>
        </Box>
        
        <Typography 
          variant="caption" 
          color="text.secondary" 
          align="center" 
          sx={{ display: 'block', mt: 2 }}
        >
          Versione 1.0.0 - Sviluppato con ❤️
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
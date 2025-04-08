import React, { useState } from 'react';
import { 
  Box, 
  CssBaseline, 
  useMediaQuery,
  useTheme,
  Toolbar
} from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AlertComponent from './Alert';

// Larghezza della sidebar
const DRAWER_WIDTH = 240;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Stato per controllare l'apertura della sidebar su dispositivi mobili
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Handler per aprire/chiudere la sidebar su dispositivi mobili
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <Navbar 
        drawerWidth={DRAWER_WIDTH}
        onDrawerToggle={handleDrawerToggle}
      />
      
      {/* Sidebar */}
      <Sidebar 
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: 'background.default'
        }}
      >
        <Toolbar /> {/* Questo spazio serve per compensare la navbar fissa */}
        <AlertComponent />
        
        {/* Contenuto della pagina */}
        <Box sx={{ mb: 4 }}>
          {children}
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
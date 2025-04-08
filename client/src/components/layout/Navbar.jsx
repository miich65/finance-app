import React, { useState, useContext } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Avatar, 
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Badge
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  AccountCircle, 
  Logout, 
  Settings, 
  Notifications,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ drawerWidth, onDrawerToggle }) => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Apertura/chiusura menu utente
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Gestione logout
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };
  
  // Ottieni le iniziali dell'utente per l'avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return nameParts[0][0].toUpperCase();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'primary.main',
        boxShadow: 2,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        {/* Hamburger menu per mobile */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Logo app */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/dashboard"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            flexGrow: 1,
            display: { xs: 'none', sm: 'block' } 
          }}
        >
          Finance App
        </Typography>
        
        {/* Mostra solo testo FM su mobile */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/dashboard"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            flexGrow: 1,
            display: { xs: 'block', sm: 'none' }
          }}
        >
          FM
        </Typography>
        
        {/* Icone di azione */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Notifiche */}
          <Tooltip title="Notifiche">
            <IconButton color="inherit" size="large">
              <Badge badgeContent={0} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Toggle tema (per versione futura) */}
          <Tooltip title="Cambia tema">
            <IconButton color="inherit" size="large">
              {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
          
          {/* Avatar utente e menu */}
          <Tooltip title={user?.name || 'Utente'}>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'secondary.main',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Menu utente */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 200,
              '& .MuiList-root': {
                py: 1
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {user?.name || 'Utente'}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email || 'utente@example.com'}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            Profilo
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose} component={RouterLink} to="/settings">
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Impostazioni
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
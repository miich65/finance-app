import React, { useContext } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Divider, 
  Typography,
  useTheme,
  ListItemButton
} from '@mui/material';
import { 
  Dashboard, 
  AccountBalance, 
  Category, 
  Receipt, 
  Assessment, 
  Settings,
  Payment,
  BarChart
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { AccountContext } from '../../context/AccountContext';

const Sidebar = ({ drawerWidth, mobileOpen, onDrawerToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const { accounts, getTotalBalance } = useContext(AccountContext);
  
  // Menu della sidebar
  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/dashboard' 
    },
    { 
      text: 'Transazioni', 
      icon: <Receipt />, 
      path: '/transactions' 
    },
    { 
      text: 'Conti', 
      icon: <AccountBalance />, 
      path: '/accounts' 
    },
    { 
      text: 'Categorie', 
      icon: <Category />, 
      path: '/categories' 
    },
    { 
      text: 'Report', 
      icon: <Assessment />, 
      path: '/reports' 
    }
  ];
  
  // Menu secondario della sidebar
  const secondaryMenuItems = [
    { 
      text: 'Budget', 
      icon: <Payment />, 
      path: '/budget',
      disabled: true
    },
    { 
      text: 'Analisi', 
      icon: <BarChart />, 
      path: '/analysis',
      disabled: true
    },
    { 
      text: 'Impostazioni', 
      icon: <Settings />, 
      path: '/settings',
      disabled: true
    }
  ];
  
  // Formatter per valuta
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };
  
  // Contenuto della sidebar
  const drawerContent = (
    <>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: [1] }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Finance App
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* Menu principale */}
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            component={NavLink}
            to={item.path}
            sx={{
              color: 'text.primary',
              textDecoration: 'none',
              '&.active': {
                color: 'primary.main',
                bgcolor: 'action.selected',
              }
            }}
          >
            <ListItemButton
              selected={location.pathname === item.path}
              sx={{
                py: 1.5,
                minHeight: 48,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(46, 125, 50, 0.08)',
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 50, 0.12)',
                  }
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40, 
                  color: location.pathname === item.path ? 'primary.main' : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: location.pathname === item.path ? 'bold' : 'medium'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Riepilogo saldo */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary">
          Saldo Totale
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: getTotalBalance() >= 0 ? 'success.main' : 'error.main'
          }}
        >
          {formatCurrency(getTotalBalance())}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 1 }} />
      
      {/* Menu funzionalità future */}
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            component={NavLink}
            to={item.path}
            disabled={item.disabled}
            sx={{
              color: item.disabled ? 'text.disabled' : 'text.primary',
              textDecoration: 'none',
              pointerEvents: item.disabled ? 'none' : 'auto',
              opacity: item.disabled ? 0.6 : 1,
              '&.active': {
                color: 'primary.main',
              }
            }}
          >
            <ListItemButton
              disabled={item.disabled}
              sx={{
                py: 1.5,
                minHeight: 48
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: 14
                }}
                secondary={item.disabled ? 'Prossimamente' : null}
                secondaryTypographyProps={{
                  fontSize: 10,
                  variant: 'caption'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="menu di navigazione"
    >
      {/* Versione mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true // Migliora le prestazioni su mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            boxShadow: 3
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Versione desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            boxShadow: 1,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
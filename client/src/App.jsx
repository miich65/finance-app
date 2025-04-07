import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { CategoryProvider } from './context/CategoryContext';
import { AccountProvider } from './context/AccountContext';
import { TransactionProvider } from './context/TransactionContext';

// Layout
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import NotFound from './pages/NotFound';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// NotFound page
const NotFoundPage = () => (
  <div style={{ textAlign: 'center', marginTop: '100px' }}>
    <h1>404 - Pagina non trovata</h1>
    <p>La pagina che stai cercando non esiste.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <AuthProvider>
          <CategoryProvider>
            <AccountProvider>
              <TransactionProvider>
                <Router>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Private Routes */}
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </PrivateRoute>
                    } />
                    
                    <Route path="/transactions" element={
                      <PrivateRoute>
                        <Layout>
                          <Transactions />
                        </Layout>
                      </PrivateRoute>
                    } />
                    
                    <Route path="/categories" element={
                      <PrivateRoute>
                        <Layout>
                          <Categories />
                        </Layout>
                      </PrivateRoute>
                    } />
                    
                    <Route path="/accounts" element={
                      <PrivateRoute>
                        <Layout>
                          <Accounts />
                        </Layout>
                      </PrivateRoute>
                    } />
                    
                    <Route path="/reports" element={
                      <PrivateRoute>
                        <Layout>
                          <Reports />
                        </Layout>
                      </PrivateRoute>
                    } />
                    
                    {/* Redirect root to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Router>
              </TransactionProvider>
            </AccountProvider>
          </CategoryProvider>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
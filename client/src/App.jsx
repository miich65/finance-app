import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { blue, teal } from '@material-ui/core/colors';

// Componenti di layout
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/auth/PrivateRoute';

// Pagine
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { TransactionProvider } from './context/TransactionContext';
import { CategoryProvider } from './context/CategoryContext';
import { AccountProvider } from './context/AccountContext';

// Tema personalizzato
const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: teal,
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <AuthProvider>
          <TransactionProvider>
            <CategoryProvider>
              <AccountProvider>
                <Router>
                  <Navbar />
                  <Alert />
                  <Switch>
                    <PrivateRoute exact path="/" component={Dashboard} />
                    <PrivateRoute exact path="/transactions" component={Transactions} />
                    <PrivateRoute exact path="/categories" component={Categories} />
                    <PrivateRoute exact path="/accounts" component={Accounts} />
                    <PrivateRoute exact path="/reports" component={Reports} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route component={NotFound} />
                  </Switch>
                </Router>
              </AccountProvider>
            </CategoryProvider>
          </TransactionProvider>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};

export default App;
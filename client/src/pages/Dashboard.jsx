import React, { useContext, useEffect } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Button,
  Paper
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import CashflowChart from '../components/dashboard/CashflowChart';
import CategoryDistribution from '../components/dashboard/CategoryDistribution';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { TransactionContext } from '../context/TransactionContext';
import { CategoryContext } from '../context/CategoryContext';
import { AccountContext } from '../context/AccountContext';

const Dashboard = () => {
  const { getTransactions } = useContext(TransactionContext);
  const { getCategories } = useContext(CategoryContext);
  const { getAccounts } = useContext(AccountContext);

  // Carica i dati necessari all'avvio del componente
  useEffect(() => {
    getTransactions();
    getCategories();
    getAccounts();
  }, [getTransactions, getCategories, getAccounts]);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          component={RouterLink}
          to="/transactions/add"
        >
          Nuova Transazione
        </Button>
      </Box>

      {/* Riepilogo finanziario */}
      <DashboardSummary />

      {/* Grafici principali */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <CashflowChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <CategoryDistribution />
        </Grid>
      </Grid>

      {/* Transazioni recenti */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RecentTransactions />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
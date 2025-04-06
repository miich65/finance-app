import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, CircularProgress, Container, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTransactions } from '../context/TransactionContext';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import CashflowChart from '../components/dashboard/CashflowChart';
import CategoryDistribution from '../components/dashboard/CategoryDistribution';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { reportsAPI } from '../utils/api';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(2),
    height: '100%'
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh'
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const { transactions, loading, getTransactions } = useTransactions();
  
  const [summaryData, setSummaryData] = useState(null);
  const [cashflowData, setCashflowData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica transazioni
        await getTransactions();
        
        // Carica i dati dei report
        const [summaryRes, cashflowRes, categoryRes] = await Promise.all([
          reportsAPI.getSummary(),
          reportsAPI.getCashflow('month'),
          reportsAPI.getCategories()
        ]);
        
        setSummaryData(summaryRes.data);
        setCashflowData(cashflowRes.data);
        setCategoryData(categoryRes.data);
      } catch (error) {
        console.error('Errore nel caricamento dei dati della dashboard', error);
      } finally {
        setLoadingReports(false);
      }
    };
    
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (loading || loadingReports) {
    return (
      <div className={classes.loaderContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <DashboardSummary data={summaryData} />
        </Grid>
        
        {/* Cashflow Chart */}
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Flusso di Cassa
            </Typography>
            <CashflowChart data={cashflowData} />
          </Paper>
        </Grid>
        
        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Distribuzione Spese
            </Typography>
            <CategoryDistribution data={categoryData} />
          </Paper>
        </Grid>
        
        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Transazioni Recenti
            </Typography>
            <RecentTransactions 
              transactions={transactions.slice(0, 5)} 
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
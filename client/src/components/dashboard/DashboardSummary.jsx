import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Skeleton,
  Chip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AccountBalance,
  Receipt,
  Payments
} from '@mui/icons-material';
import axios from 'axios';

const DashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/reports/summary');
        setSummary(res.data);
        setLoading(false);
      } catch (err) {
        setError('Errore nel caricamento del riepilogo');
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Configura le card di riepilogo
  const summaryCards = [
    {
      title: 'Entrate Totali',
      value: summary?.income || 0,
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.light',
      prefix: '€'
    },
    {
      title: 'Uscite Totali',
      value: summary?.expense || 0,
      icon: <TrendingDown sx={{ fontSize: 40, color: 'error.main' }} />,
      color: 'error.light',
      prefix: '€'
    },
    {
      title: 'Saldo Attuale',
      value: summary?.balance || 0,
      icon: <AccountBalance sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.light',
      prefix: '€'
    },
    {
      title: 'Entrate Fiscali',
      value: summary?.taxRelevantIncome || 0,
      icon: <Receipt sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.light',
      prefix: '€'
    },
    {
      title: 'Spese Fiscali',
      value: summary?.taxRelevantExpense || 0,
      icon: <Payments sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: 'secondary.light',
      prefix: '€'
    }
  ];

  // Funzione per formattare i valori monetari
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  if (error) {
    return (
      <Box sx={{ mt: 3, mb: 3 }}>
        <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 1, mb: 3 }}>
      {summaryCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: card.color,
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              {card.icon}
            </Box>
            <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
              {card.title}
            </Typography>
            {loading ? (
              <Skeleton width="80%" height={40} />
            ) : (
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold', 
                  mt: 1,
                  textAlign: 'center' 
                }}
              >
                {formatCurrency(card.value)}
              </Typography>
            )}
            {card.title.includes('Fiscali') && (
              <Chip 
                label="Rilevante fiscalmente" 
                size="small" 
                sx={{ mt: 1 }} 
                color="primary"
              />
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardSummary;
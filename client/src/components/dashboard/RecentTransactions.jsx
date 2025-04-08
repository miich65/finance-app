import React, { useEffect, useState, useContext } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Chip,
  Skeleton,
  Button
} from '@mui/material';
import { 
  ArrowUpward, 
  ArrowDownward, 
  Receipt,
  MoreHoriz
} from '@mui/icons-material';
import { TransactionContext } from '../../context/TransactionContext';
import { Link as RouterLink } from 'react-router-dom';

const RecentTransactions = () => {
  const { transactions, getTransactions, loading } = useContext(TransactionContext);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Carica le transazioni se non sono già state caricate
    if (transactions.length === 0 && !loading) {
      getTransactions();
    }
    
    // Filtra e imposta le transazioni recenti (ultime 5)
    if (transactions.length > 0) {
      const sorted = [...transactions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setRecentTransactions(sorted.slice(0, 5));
    }
  }, [transactions, getTransactions, loading]);

  // Funzione per formattare i valori monetari
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  // Funzione per formattare le date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Renderizza gli skeleton durante il caricamento
  const renderSkeletons = () => {
    return Array(5).fill().map((_, index) => (
      <React.Fragment key={index}>
        <ListItem>
          <ListItemIcon>
            <Skeleton variant="circular" width={24} height={24} />
          </ListItemIcon>
          <ListItemText 
            primary={<Skeleton width="60%" />} 
            secondary={<Skeleton width="40%" />} 
          />
          <Skeleton width={80} />
        </ListItem>
        {index < 4 && <Divider variant="inset" component="li" />}
      </React.Fragment>
    ));
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Transazioni Recenti
        </Typography>
        <Button 
          component={RouterLink} 
          to="/transactions" 
          color="primary" 
          endIcon={<MoreHoriz />}
          size="small"
        >
          Vedi Tutte
        </Button>
      </Box>

      <List sx={{ width: '100%' }}>
        {loading ? (
          renderSkeletons()
        ) : recentTransactions.length > 0 ? (
          recentTransactions.map((transaction, index) => (
            <React.Fragment key={transaction._id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  {transaction.transactionType === 'income' ? (
                    <ArrowUpward color="success" />
                  ) : (
                    <ArrowDownward color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      variant="body1"
                      color="text.primary"
                      sx={{ display: 'block' }}
                    >
                      {transaction.description}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {formatDate(transaction.date)} • {transaction.categoryId?.name || 'N/D'} • {transaction.accountId?.name || 'N/D'}
                      </Typography>
                      {transaction.taxRelevant && (
                        <Chip 
                          label="Fiscale" 
                          size="small" 
                          icon={<Receipt fontSize="small" />}
                          sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                        />
                      )}
                    </>
                  }
                />
                <Typography
                  variant="body2"
                  color={transaction.transactionType === 'income' ? 'success.main' : 'error.main'}
                  component="span"
                  sx={{ fontWeight: 'bold' }}
                >
                  {transaction.transactionType === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </Typography>
              </ListItem>
              {index < recentTransactions.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
            Nessuna transazione disponibile
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default RecentTransactions;
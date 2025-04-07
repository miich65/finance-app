import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card,
  CardContent,
  CardActions,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  Skeleton,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Add, 
  Edit,
  AccountBalance,
  Close,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { AccountContext } from '../context/AccountContext';
import { TransactionContext } from '../context/TransactionContext';
import { AlertContext } from '../context/AlertContext';

const AccountForm = ({ onSave, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    initialBalance: initialData?.initialBalance || 0
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'initialBalance' ? parseFloat(value) || 0 : value 
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Nome Conto"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="initialBalance"
            label="Saldo Iniziale"
            value={formData.initialBalance}
            onChange={handleChange}
            fullWidth
            required
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          {onCancel && (
            <Button onClick={onCancel} color="inherit">
              Annulla
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Aggiorna' : 'Aggiungi'} Conto
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const AccountCard = ({ account, onEdit }) => {
  const { transactions } = useContext(TransactionContext);
  const [accountStats, setAccountStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    recentActivity: []
  });
  
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
      month: '2-digit'
    }).format(date);
  };
  
  useEffect(() => {
    if (transactions.length > 0 && account) {
      // Filtra le transazioni relative a questo account
      const accountTransactions = transactions.filter(
        t => t.accountId?._id === account._id || t.accountId === account._id
      );
      
      // Calcola totali
      const totalIncome = accountTransactions
        .filter(t => t.transactionType === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const totalExpense = accountTransactions
        .filter(t => t.transactionType === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Ordina per data e prendi le ultime 3
      const recentActivity = [...accountTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
      
      setAccountStats({
        totalIncome,
        totalExpense,
        recentActivity
      });
    }
  }, [transactions, account]);
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountBalance color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {account.name}
          </Typography>
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Saldo Iniziale
            </Typography>
            <Typography variant="body1">
              {formatCurrency(account.initialBalance)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Saldo Attuale
            </Typography>
            <Typography variant="h6" sx={{ 
              color: account.currentBalance >= 0 ? 'success.main' : 'error.main',
              fontWeight: 'bold'
            }}>
              {formatCurrency(account.currentBalance)}
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Riepilogo Movimenti
        </Typography>
        
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Chip 
              icon={<ArrowUpward fontSize="small" />}
              label={`Entrate: ${formatCurrency(accountStats.totalIncome)}`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <Chip 
              icon={<ArrowDownward fontSize="small" />}
              label={`Uscite: ${formatCurrency(accountStats.totalExpense)}`}
              size="small"
              color="error"
              variant="outlined"
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>
        
        {accountStats.recentActivity.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Attività Recenti
            </Typography>
            
            <Box sx={{ mt: 1 }}>
              {accountStats.recentActivity.map((activity, index) => (
                <Box 
                  key={activity._id}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 0.5,
                    borderBottom: index < accountStats.recentActivity.length - 1 ? '1px solid #eee' : 'none'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {activity.transactionType === 'income' ? (
                      <ArrowUpward fontSize="small" color="success" sx={{ mr: 1 }} />
                    ) : (
                      <ArrowDownward fontSize="small" color="error" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {activity.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: activity.transactionType === 'income' ? 'success.main' : 'error.main'
                      }}
                    >
                      {activity.transactionType === 'income' ? '+' : '-'} {formatCurrency(activity.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(activity.date)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
      <CardActions>
        <Button 
          startIcon={<Edit />} 
          size="small" 
          color="primary"
          onClick={() => onEdit(account)}
        >
          Modifica
        </Button>
      </CardActions>
    </Card>
  );
};

const Accounts = () => {
  const { accounts, getAccounts, addAccount, loading } = useContext(AccountContext);
  const { transactions, getTransactions } = useContext(TransactionContext);
  const { setSuccessAlert, setErrorAlert } = useContext(AlertContext);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  
  useEffect(() => {
    getAccounts();
    
    // Carica le transazioni se necessario per il calcolo delle statistiche
    if (transactions.length === 0) {
      getTransactions();
    }
  }, [getAccounts, getTransactions, transactions.length]);
  
  const handleOpenDialog = () => {
    setEditAccount(null);
    setOpenDialog(true);
  };
  
  const handleOpenEditDialog = (account) => {
    setEditAccount(account);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditAccount(null);
  };
  
  const handleSaveAccount = async (formData) => {
    try {
      await addAccount(formData);
      setSuccessAlert(editAccount ? 'Conto aggiornato con successo' : 'Conto aggiunto con successo');
      handleCloseDialog();
    } catch (err) {
      setErrorAlert(editAccount ? 'Errore durante l\'aggiornamento del conto' : 'Errore durante l\'aggiunta del conto');
    }
  };
  
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Conti
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Nuovo Conto
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {loading ? (
          // Skeleton per il caricamento
          Array(3).fill().map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={40} />
                  <Skeleton variant="text" width="40%" height={30} sx={{ mt: 2 }} />
                  <Skeleton variant="text" width="80%" height={30} sx={{ mt: 1 }} />
                  <Divider sx={{ my: 2 }} />
                  <Skeleton variant="text" width="50%" height={24} />
                  <Skeleton variant="rectangular" height={50} sx={{ mt: 1, borderRadius: 1 }} />
                  <Skeleton variant="text" width="50%" height={24} sx={{ mt: 2 }} />
                  <Skeleton variant="rectangular" height={100} sx={{ mt: 1, borderRadius: 1 }} />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" width={100} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : accounts.length > 0 ? (
          // Visualizzazione dei conti
          accounts.map((account) => (
            <Grid item xs={12} sm={6} md={4} key={account._id}>
              <AccountCard 
                account={account} 
                onEdit={handleOpenEditDialog} 
              />
            </Grid>
          ))
        ) : (
          // Nessun conto trovato
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nessun conto trovato
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Inizia aggiungendo il tuo primo conto finanziario
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={handleOpenDialog}
              >
                Aggiungi Conto
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
      
      {/* Dialog per aggiungere o modificare un conto */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="account-dialog-title"
      >
        <DialogTitle id="account-dialog-title">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {editAccount ? 'Modifica Conto' : 'Aggiungi Conto'}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <AccountForm 
            onSave={handleSaveAccount} 
            initialData={editAccount} 
            onCancel={handleCloseDialog} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accounts;
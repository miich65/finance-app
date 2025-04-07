import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
  Paper,
  Tabs,
  Tab,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import { TransactionContext } from '../context/TransactionContext';
import { CategoryContext } from '../context/CategoryContext';
import { AccountContext } from '../context/AccountContext';
import { AlertContext } from '../context/AlertContext';

const Transactions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const { getTransactions } = useContext(TransactionContext);
  const { getCategories } = useContext(CategoryContext);
  const { getAccounts } = useContext(AccountContext);
  const { setSuccessAlert } = useContext(AlertContext);

  // Carica i dati necessari all'avvio del componente
  useEffect(() => {
    getTransactions();
    getCategories();
    getAccounts();
  }, [getTransactions, getCategories, getAccounts]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTransactionAdded = () => {
    setOpenDialog(false);
    setSuccessAlert('Transazione aggiunta con successo');
    getTransactions(); // Ricarica le transazioni
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transazioni
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Nuova Transazione
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Tutte" />
          <Tab label="Entrate" />
          <Tab label="Uscite" />
          <Tab label="Rilevanti Fiscalmente" />
        </Tabs>
      </Paper>

      {/* Lista delle transazioni */}
      <TransactionList 
        filter={
          tabValue === 1 ? { transactionType: 'income' } : 
          tabValue === 2 ? { transactionType: 'expense' } :
          tabValue === 3 ? { taxRelevant: true } : {}
        }
      />

      {/* FAB per mobile */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Fab color="primary" aria-label="add" onClick={handleOpenDialog}>
          <Add />
        </Fab>
      </Box>

      {/* Dialog per aggiungere una nuova transazione */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Aggiungi Transazione</Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
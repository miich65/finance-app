import React, { useState, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Grid,
  Tab,
  Tabs,
  FormControlLabel,
  Checkbox,
  Divider
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  EventNote,
  Receipt
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import itLocale from 'date-fns/locale/it';
import { TransactionContext } from '../../context/TransactionContext';
import { AlertContext } from '../../context/AlertContext';
import CategorySelect from '../transactions/CategorySelect';
import AccountSelect from '../transactions/AccountSelect';

const QuickAddTransaction = ({ onTransactionAdded }) => {
  const { addTransaction } = useContext(TransactionContext);
  const { setSuccessAlert, setErrorAlert } = useContext(AlertContext);
  
  // Stato per tenere traccia del tipo di transazione attivo (entrata/uscita)
  const [activeTab, setActiveTab] = useState(0); // 0 = uscita, 1 = entrata
  
  // Inizializza stato del form
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date(),
    categoryId: '',
    accountId: '',
    taxRelevant: false
  });
  
  // Destructuring per maggiore leggibilità
  const { amount, description, date, categoryId, accountId, taxRelevant } = formData;
  
  // Handler per il cambio di tab
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Aggiorna il form in base all'input dell'utente
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Gestisce il cambio di data
  const handleDateChange = (newDate) => {
    setFormData(prevData => ({
      ...prevData,
      date: newDate
    }));
  };
  
  // Gestisce il submit del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validazione base
    if (!amount || !description || !categoryId || !accountId) {
      setErrorAlert('Completa tutti i campi richiesti');
      return;
    }
    
    try {
      // Prepara i dati per l'API
      const transactionData = {
        ...formData,
        amount: Math.abs(parseFloat(amount)),
        transactionType: activeTab === 1 ? 'income' : 'expense'
      };
      
      // Invia la transazione
      await addTransaction(transactionData);
      
      // Reset del form
      setFormData({
        amount: '',
        description: '',
        date: new Date(),
        categoryId: '',
        accountId: '',
        taxRelevant: false
      });
      
      // Notifica di successo
      setSuccessAlert('Transazione aggiunta con successo');
      
      // Callback opzionale (es. per aggiornare dati dashboard)
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err) {
      setErrorAlert('Errore durante l\'aggiunta della transazione');
    }
  };
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Aggiungi transazione rapida
      </Typography>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        aria-label="tipo di transazione"
        sx={{ mb: 3 }}
      >
        <Tab 
          icon={<ArrowDownward />} 
          label="Uscita" 
          sx={{ 
            color: 'error.main',
            '&.Mui-selected': { color: 'error.main', fontWeight: 'bold' }
          }}
        />
        <Tab 
          icon={<ArrowUpward />} 
          label="Entrata" 
          sx={{ 
            color: 'success.main',
            '&.Mui-selected': { color: 'success.main', fontWeight: 'bold' }
          }}
        />
      </Tabs>
      
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Importo */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Importo"
              name="amount"
              type="number"
              value={amount}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
            />
          </Grid>
          
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={itLocale}>
              <DatePicker
                label="Data"
                value={date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Descrizione */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrizione"
              name="description"
              value={description}
              onChange={handleInputChange}
              required
              placeholder={activeTab === 1 ? "Es: Pagamento cliente" : "Es: Spesa supermercato"}
            />
          </Grid>
          
          {/* Categoria */}
          <Grid item xs={12} sm={6}>
            <CategorySelect
              value={categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              filterType={activeTab === 1 ? 'income' : 'expense'}
              required
            />
          </Grid>
          
          {/* Conto */}
          <Grid item xs={12} sm={6}>
            <AccountSelect
              value={accountId}
              onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
              required
            />
          </Grid>
          
          {/* Rilevanza fiscale */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={taxRelevant}
                  onChange={handleInputChange}
                  name="taxRelevant"
                  color="primary"
                />
              }
              label="Rilevante ai fini fiscali"
            />
          </Grid>
          
          {/* Pulsante submit */}
          <Grid item xs={12}>
            <Button 
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              color={activeTab === 1 ? "success" : "error"}
              endIcon={activeTab === 1 ? <ArrowUpward /> : <ArrowDownward />}
            >
              {activeTab === 1 ? 'Aggiungi Entrata' : 'Aggiungi Uscita'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default QuickAddTransaction;
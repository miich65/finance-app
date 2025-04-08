import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox, 
  Grid, 
  Paper, 
  Typography 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { CategoryContext } from '../../context/CategoryContext';
import { AccountContext } from '../../context/AccountContext';
import { AlertContext } from '../../context/AlertContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3)
}));

const StyledSubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2)
}));

const TransactionForm = ({ onTransactionAdded }) => {
  const { addTransaction } = useContext(TransactionContext);
  const { categories, getCategories } = useContext(CategoryContext);
  const { accounts, getAccounts } = useContext(AccountContext);
  const { setAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date(),
    categoryId: '',
    accountId: '',
    transactionType: 'expense',
    taxRelevant: false
  });

  const { amount, description, date, categoryId, accountId, transactionType, taxRelevant } = formData;

  useEffect(() => {
    getCategories();
    getAccounts();
    // eslint-disable-next-line
  }, []);

  const filteredCategories = categories.filter(
    category => category.type === transactionType || category.type === 'both'
  );

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleCheckboxChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleTypeChange = e => {
    const newType = e.target.value;
    setFormData({ 
      ...formData, 
      transactionType: newType,
      // Reset category if switching types to avoid invalid selection
      categoryId: ''
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!amount || !description || !categoryId || !accountId) {
      setAlert('Compila tutti i campi richiesti', 'error');
      return;
    }

    try {
      // Format data for API
      const transactionData = {
        ...formData,
        amount: transactionType === 'expense' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount))
      };

      await addTransaction(transactionData);
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        date: new Date(),
        categoryId: '',
        accountId: '',
        transactionType: 'expense',
        taxRelevant: false
      });
      
      setAlert('Transazione aggiunta con successo', 'success');
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err) {
      setAlert('Errore durante l\'aggiunta della transazione', 'error');
    }
  };

  return (
    <StyledPaper>
      <StyledTitle variant="h6">
        Aggiungi Transazione
      </StyledTitle>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Transaction Type */}
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tipo di Transazione</InputLabel>
              <Select
                name="transactionType"
                value={transactionType}
                onChange={handleTypeChange}
                label="Tipo di Transazione"
              >
                <MenuItem value="income">Entrata</MenuItem>
                <MenuItem value="expense">Uscita</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Amount */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Importo"
              name="amount"
              type="number"
              value={amount}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>
          
          {/* Date */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Data"
                value={date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrizione"
              name="description"
              value={description}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Grid>
          
          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Categoria</InputLabel>
              <Select
                name="categoryId"
                value={categoryId}
                onChange={handleChange}
                label="Categoria"
                required
              >
                {filteredCategories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Account */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Conto</InputLabel>
              <Select
                name="accountId"
                value={accountId}
                onChange={handleChange}
                label="Conto"
                required
              >
                {accounts.map(account => (
                  <MenuItem key={account._id} value={account._id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Tax Relevant Checkbox */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={taxRelevant}
                  onChange={handleCheckboxChange}
                  name="taxRelevant"
                  color="primary"
                />
              }
              label="Rilevante ai fini fiscali"
            />
          </Grid>
          
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
            >
              {transactionType === 'income' ? 'Aggiungi Entrata' : 'Aggiungi Uscita'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </StyledPaper>
  );
};

export default TransactionForm;
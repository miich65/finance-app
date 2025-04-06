import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, 
         FormControlLabel, Checkbox, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { useTransactions } from '../../context/TransactionContext';
import { useCategories } from '../../context/CategoryContext';
import { useAccounts } from '../../context/AccountContext';
import { useAlerts } from '../../context/AlertContext';

const useStyles = makeStyles((theme) => ({
  form: {
    padding: theme.spacing(3)
  },
  submitButton: {
    marginTop: theme.spacing(2)
  },
  title: {
    marginBottom: theme.spacing(2)
  }
}));

const TransactionForm = () => {
  const classes = useStyles();
  const { addTransaction } = useTransactions();
  const { categories, getCategories } = useCategories();
  const { accounts, getAccounts } = useAccounts();
  const { setAlert } = useAlerts();

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

  const handleDateChange = date => {
    setFormData({ ...formData, date });
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
    } catch (err) {
      setAlert('Errore durante l\'aggiunta della transazione', 'error');
    }
  };

  return (
    <Paper className={classes.form}>
      <Typography variant="h6" className={classes.title}>
        Aggiungi Transazione
      </Typography>
      
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                fullWidth
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                label="Data"
                value={date}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'cambia data',
                }}
              />
            </MuiPickersUtilsProvider>
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
              className={classes.submitButton}
              fullWidth
            >
              {transactionType === 'income' ? 'Aggiungi Entrata' : 'Aggiungi Uscita'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TransactionForm;
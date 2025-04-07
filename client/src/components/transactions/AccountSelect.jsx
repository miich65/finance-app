import React, { useEffect, useContext, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Typography
} from '@mui/material';
import {
  AccountBalance,
  Add
} from '@mui/icons-material';
import { AccountContext } from '../../context/AccountContext';
import { AlertContext } from '../../context/AlertContext';

const AccountSelect = ({
  value,
  onChange,
  error,
  helperText,
  label = 'Conto',
  required = false,
  fullWidth = true,
  size = 'medium',
  enableAddNew = true,
  disabled = false,
  showBalance = true
}) => {
  const { accounts, getAccounts, addAccount, loading } = useContext(AccountContext);
  const { setSuccessAlert, setErrorAlert } = useContext(AlertContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    initialBalance: 0
  });

  // Carica i conti se non sono già caricati
  useEffect(() => {
    if (accounts.length === 0 && !loading) {
      getAccounts();
    }
  }, [accounts.length, getAccounts, loading]);

  // Funzione per formattare i valori monetari
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewAccount({
      name: '',
      initialBalance: 0
    });
  };

  const handleNewAccountChange = (e) => {
    const { name, value } = e.target;
    setNewAccount(prev => ({ 
      ...prev, 
      [name]: name === 'initialBalance' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleAddAccount = async () => {
    try {
      if (!newAccount.name.trim()) {
        setErrorAlert('Il nome del conto è richiesto');
        return;
      }

      await addAccount(newAccount);
      setSuccessAlert('Conto aggiunto con successo');
      handleCloseDialog();
    } catch (err) {
      setErrorAlert('Errore durante l\'aggiunta del conto');
    }
  };

  return (
    <>
      <FormControl 
        fullWidth={fullWidth} 
        error={!!error} 
        required={required}
        size={size}
        disabled={disabled || loading}
      >
        <InputLabel id="account-select-label">{label}</InputLabel>
        <Select
          labelId="account-select-label"
          value={value || ''}
          onChange={onChange}
          label={label}
          renderValue={(selected) => {
            const account = accounts.find(a => a._id === selected);
            if (!account) return '';
            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                <span>{account.name}</span>
                {showBalance && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1, 
                      color: account.currentBalance >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}
                  >
                    ({formatCurrency(account.currentBalance)})
                  </Typography>
                )}
              </Box>
            );
          }}
          endAdornment={
            loading ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null
          }
        >
          {/* Opzione per "Nessun conto" */}
          <MenuItem value="">
            <em>Nessun conto</em>
          </MenuItem>

          {/* Conti esistenti */}
          {accounts.map(account => (
            <MenuItem key={account._id} value={account._id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                  <span>{account.name}</span>
                </Box>
                {showBalance && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: account.currentBalance >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}
                  >
                    {formatCurrency(account.currentBalance)}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}

          {/* Opzione per aggiungere un nuovo conto */}
          {enableAddNew && (
            <MenuItem 
              onClick={handleOpenDialog}
              sx={{ 
                color: 'primary.main', 
                fontWeight: 'bold',
                borderTop: '1px solid #eee',
                mt: 1
              }}
            >
              <Add fontSize="small" sx={{ mr: 1 }} />
              Aggiungi nuovo conto
            </MenuItem>
          )}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>

      {/* Dialog per aggiungere un nuovo conto */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Aggiungi Nuovo Conto</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome Conto"
            type="text"
            fullWidth
            value={newAccount.name}
            onChange={handleNewAccountChange}
          />
          <TextField
            margin="dense"
            name="initialBalance"
            label="Saldo Iniziale"
            type="number"
            fullWidth
            value={newAccount.initialBalance}
            onChange={handleNewAccountChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleAddAccount} variant="contained" color="primary">
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccountSelect;
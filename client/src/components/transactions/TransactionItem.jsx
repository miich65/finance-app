import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  Delete,
  Edit,
  Receipt,
  AccountBalance,
  Category as CategoryIcon
} from '@mui/icons-material';

const TransactionItem = ({ 
  transaction, 
  onDelete, 
  onEdit, 
  compact = false,
  showActions = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
  
  // Aggiungi supporto per le versioni di transazioni popolate e non popolate
  const getCategory = () => {
    if (transaction.categoryId && typeof transaction.categoryId === 'object') {
      return transaction.categoryId;
    }
    return { name: 'N/D', type: transaction.transactionType };
  };
  
  const getAccount = () => {
    if (transaction.accountId && typeof transaction.accountId === 'object') {
      return transaction.accountId;
    }
    return { name: 'N/D' };
  };
  
  // Versione compatta (per liste, widget, ecc.)
  const CompactVersion = () => (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1.5,
        borderLeft: '4px solid',
        borderLeftColor: transaction.transactionType === 'income' ? 'success.main' : 'error.main'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {transaction.transactionType === 'income' ? (
          <ArrowUpward color="success" fontSize="small" sx={{ mr: 1 }} />
        ) : (
          <ArrowDownward color="error" fontSize="small" sx={{ mr: 1 }} />
        )}
        <Box>
          <Typography variant="body2" noWrap sx={{ maxWidth: 150, fontWeight: 'medium' }}>
            {transaction.description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {formatDate(transaction.date)} • {getCategory().name}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold', 
            color: transaction.transactionType === 'income' ? 'success.main' : 'error.main'
          }}
        >
          {transaction.transactionType === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {getAccount().name}
        </Typography>
      </Box>
    </Box>
  );
  
  // Versione completa
  const FullVersion = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Prima riga: data, descrizione, importo */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {transaction.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(transaction.date)}
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: transaction.transactionType === 'income' ? 'success.main' : 'error.main'
              }}
            >
              {transaction.transactionType === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Divider />
        </Grid>
        
        {/* Seconda riga: categoria, conto, tipo e rilevanza fiscale */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Categoria: <strong>{getCategory().name}</strong>
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalance color="primary" fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Conto: <strong>{getAccount().name}</strong>
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip 
              size="small"
              icon={transaction.transactionType === 'income' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
              label={transaction.transactionType === 'income' ? 'Entrata' : 'Uscita'}
              color={transaction.transactionType === 'income' ? 'success' : 'error'}
            />
            
            {transaction.taxRelevant && (
              <Chip 
                size="small"
                icon={<Receipt fontSize="small" />}
                label="Rilevante fiscalmente"
                color="primary"
              />
            )}
          </Box>
        </Grid>
        
        {/* Terza riga: azioni */}
        {showActions && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              {onEdit && (
                <Tooltip title="Modifica">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => onEdit(transaction)}
                    sx={{ mr: 1 }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              {onDelete && (
                <Tooltip title="Elimina">
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => onDelete(transaction._id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mb: 2,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      {compact || isMobile ? <CompactVersion /> : <FullVersion />}
    </Paper>
  );
};

export default TransactionItem;
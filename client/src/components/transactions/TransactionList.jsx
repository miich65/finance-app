import React, { useState, useEffect, useContext } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
} from '@mui/material';
import {
  Delete,
  Receipt,
  Search,
  FilterList,
  ArrowUpward,
  ArrowDownward,
  ClearAll
} from '@mui/icons-material';
import { TransactionContext } from '../../context/TransactionContext';
import { CategoryContext } from '../../context/CategoryContext';
import { AccountContext } from '../../context/AccountContext';
import { AlertContext } from '../../context/AlertContext';

const TransactionList = () => {
  const { transactions, getTransactions, deleteTransaction, loading } = useContext(TransactionContext);
  const { categories, getCategories } = useContext(CategoryContext);
  const { accounts, getAccounts } = useContext(AccountContext);
  const { setSuccessAlert, setErrorAlert } = useContext(AlertContext);
  
  // State per paginazione, ordinamento e filtri
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [filters, setFilters] = useState({
    search: '',
    transactionType: 'all',
    categoryId: 'all',
    accountId: 'all',
    taxRelevant: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Carica i dati necessari
  useEffect(() => {
    if (transactions.length === 0 && !loading) {
      getTransactions();
    }
    
    if (categories.length === 0) {
      getCategories();
    }
    
    if (accounts.length === 0) {
      getAccounts();
    }
  }, [getTransactions, getCategories, getAccounts, transactions.length, categories.length, accounts.length, loading]);

  // Filtra le transazioni in base ai filtri applicati
  useEffect(() => {
    if (transactions.length > 0) {
      let results = [...transactions];
      
      // Filtro per testo di ricerca
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        results = results.filter(
          transaction => 
            transaction.description.toLowerCase().includes(searchTerm) ||
            (transaction.categoryId?.name && 
             transaction.categoryId.name.toLowerCase().includes(searchTerm)) ||
            (transaction.accountId?.name && 
             transaction.accountId.name.toLowerCase().includes(searchTerm))
        );
      }
      
      // Filtro per tipo di transazione
      if (filters.transactionType !== 'all') {
        results = results.filter(
          transaction => transaction.transactionType === filters.transactionType
        );
      }
      
      // Filtro per categoria
      if (filters.categoryId !== 'all') {
        results = results.filter(
          transaction => transaction.categoryId?._id === filters.categoryId
        );
      }
      
      // Filtro per account
      if (filters.accountId !== 'all') {
        results = results.filter(
          transaction => transaction.accountId?._id === filters.accountId
        );
      }
      
      // Filtro per rilevanza fiscale
      if (filters.taxRelevant !== 'all') {
        const isTaxRelevant = filters.taxRelevant === 'yes';
        results = results.filter(
          transaction => transaction.taxRelevant === isTaxRelevant
        );
      }
      
      // Filtro per data iniziale
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        results = results.filter(
          transaction => new Date(transaction.date) >= fromDate
        );
      }
      
      // Filtro per data finale
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        results = results.filter(
          transaction => new Date(transaction.date) <= toDate
        );
      }
      
      // Ordina le transazioni
      results.sort((a, b) => {
        let cmp = 0;
        
        if (orderBy === 'date') {
          cmp = new Date(a.date) - new Date(b.date);
        } else if (orderBy === 'amount') {
          cmp = a.amount - b.amount;
        } else if (orderBy === 'description') {
          cmp = a.description.localeCompare(b.description);
        } else if (orderBy === 'category') {
          cmp = (a.categoryId?.name || '').localeCompare(b.categoryId?.name || '');
        } else if (orderBy === 'account') {
          cmp = (a.accountId?.name || '').localeCompare(b.accountId?.name || '');
        }
        
        return order === 'asc' ? cmp : -cmp;
      });
      
      setFilteredTransactions(results);
    }
  }, [transactions, filters, order, orderBy]);

  // Handler per cambiare pagina
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handler per cambiare il numero di righe per pagina
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handler per cambiare l'ordinamento
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handler per gestire i cambiamenti nei filtri
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handler per resettare i filtri
  const resetFilters = () => {
    setFilters({
      search: '',
      transactionType: 'all',
      categoryId: 'all',
      accountId: 'all',
      taxRelevant: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Handler per eliminare una transazione
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa transazione?')) {
      try {
        await deleteTransaction(id);
        setSuccessAlert('Transazione eliminata con successo');
      } catch (error) {
        setErrorAlert('Errore durante l\'eliminazione della transazione');
      }
    }
  };

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

  // Crea l'intestazione della tabella con ordinamento
  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };

  // Renderizza gli skeleton durante il caricamento
  const renderSkeletons = () => {
    return Array(rowsPerPage).fill().map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton width={40} /></TableCell>
      </TableRow>
    ));
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {/* Barra di ricerca e filtri */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Cerca transazioni..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ minWidth: 120 }}
          >
            Filtri
          </Button>
        </Box>

        {/* Filtri aggiuntivi */}
        {showFilters && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {/* Filtro tipo transazione */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="transaction-type-label">Tipo</InputLabel>
              <Select
                labelId="transaction-type-label"
                id="transaction-type"
                name="transactionType"
                value={filters.transactionType}
                onChange={handleFilterChange}
                label="Tipo"
              >
                <MenuItem value="all">Tutti</MenuItem>
                <MenuItem value="income">Entrate</MenuItem>
                <MenuItem value="expense">Uscite</MenuItem>
              </Select>
            </FormControl>

            {/* Filtro categoria */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="category-label">Categoria</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
                label="Categoria"
              >
                <MenuItem value="all">Tutte</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro account */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="account-label">Conto</InputLabel>
              <Select
                labelId="account-label"
                id="account"
                name="accountId"
                value={filters.accountId}
                onChange={handleFilterChange}
                label="Conto"
              >
                <MenuItem value="all">Tutti</MenuItem>
                {accounts.map(account => (
                  <MenuItem key={account._id} value={account._id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro rilevanza fiscale */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="tax-relevant-label">Fiscale</InputLabel>
              <Select
                labelId="tax-relevant-label"
                id="tax-relevant"
                name="taxRelevant"
                value={filters.taxRelevant}
                onChange={handleFilterChange}
                label="Fiscale"
              >
                <MenuItem value="all">Tutti</MenuItem>
                <MenuItem value="yes">Rilevante</MenuItem>
                <MenuItem value="no">Non rilevante</MenuItem>
              </Select>
            </FormControl>

            {/* Filtro data iniziale */}
            <TextField
              label="Da data"
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            {/* Filtro data finale */}
            <TextField
              label="A data"
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            {/* Pulsante per resettare i filtri */}
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ClearAll />}
              onClick={resetFilters}
              size="small"
            >
              Reset
            </Button>
          </Box>
        )}
      </Box>

      {/* Tabella delle transazioni */}
      <TableContainer>
        <Table aria-label="tabella transazioni">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderBy === 'date' ? order : 'asc'}
                  onClick={createSortHandler('date')}
                >
                  Data
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'description'}
                  direction={orderBy === 'description' ? order : 'asc'}
                  onClick={createSortHandler('description')}
                >
                  Descrizione
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={createSortHandler('category')}
                >
                  Categoria
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'account'}
                  direction={orderBy === 'account' ? order : 'asc'}
                  onClick={createSortHandler('account')}
                >
                  Conto
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Tipo</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderBy === 'amount' ? order : 'asc'}
                  onClick={createSortHandler('amount')}
                >
                  Importo
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Fiscale</TableCell>
              <TableCell align="center">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeletons()
            ) : filteredTransactions.length > 0 ? (
              // Paginazione delle transazioni filtrate
              filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(transaction => (
                  <TableRow key={transaction._id} hover>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {transaction.categoryId?.name || 'N/D'}
                    </TableCell>
                    <TableCell>
                      {transaction.accountId?.name || 'N/D'}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.transactionType === 'income' ? (
                        <Chip 
                          icon={<ArrowUpward fontSize="small" />} 
                          label="Entrata" 
                          size="small" 
                          color="success" 
                        />
                      ) : (
                        <Chip 
                          icon={<ArrowDownward fontSize="small" />} 
                          label="Uscita" 
                          size="small" 
                          color="error" 
                        />
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      color: transaction.transactionType === 'income' ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}>
                      {transaction.transactionType === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.taxRelevant && (
                        <Tooltip title="Rilevante ai fini fiscali">
                          <Receipt color="primary" />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Elimina">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteTransaction(transaction._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Nessuna transazione trovata
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginazione */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Righe per pagina:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} di ${count}`}
      />
    </Paper>
  );
};

export default TransactionList;
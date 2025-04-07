import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Typography,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  ArrowUpward,
  ArrowDownward,
  Receipt,
  ClearAll,
  Close,
  ExpandMore,
  ExpandLess,
  CalendarMonth
} from '@mui/icons-material';
import { CategoryContext } from '../../context/CategoryContext';
import { AccountContext } from '../../context/AccountContext';
import CategorySelect from './CategorySelect';
import AccountSelect from './AccountSelect';

const TransactionFilter = ({ 
  filters = {}, 
  onFilterChange, 
  onResetFilters,
  showFullFilters = true,
  compact = false
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const { categories, getCategories } = useContext(CategoryContext);
  const { accounts, getAccounts } = useContext(AccountContext);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  // Carica i dati necessari
  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
    
    if (accounts.length === 0) {
      getAccounts();
    }
  }, [categories.length, accounts.length, getCategories, getAccounts]);
  
  // Conta i filtri attivi
  useEffect(() => {
    let count = 0;
    
    if (filters.search && filters.search.trim() !== '') count++;
    if (filters.transactionType && filters.transactionType !== 'all') count++;
    if (filters.categoryId && filters.categoryId !== 'all') count++;
    if (filters.accountId && filters.accountId !== 'all') count++;
    if (filters.taxRelevant && filters.taxRelevant !== 'all') count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.amountMin) count++;
    if (filters.amountMax) count++;
    
    setActiveFilterCount(count);
  }, [filters]);
  
  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const handleCategoryChange = (e) => {
    onFilterChange('categoryId', e.target.value);
  };

  const handleAccountChange = (e) => {
    onFilterChange('accountId', e.target.value);
  };
  
  // Formattazione date in modo leggibile
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Genera le chip per i filtri attivi
  const renderActiveFilters = () => {
    if (activeFilterCount === 0) return null;
    
    const filterChips = [];
    
    if (filters.search && filters.search.trim() !== '') {
      filterChips.push(
        <Chip
          key="search"
          label={`Ricerca: ${filters.search}`}
          size="small"
          onDelete={() => onFilterChange('search', '')}
          color="primary"
          variant="outlined"
        />
      );
    }
    
    if (filters.transactionType && filters.transactionType !== 'all') {
      filterChips.push(
        <Chip
          key="type"
          label={`Tipo: ${filters.transactionType === 'income' ? 'Entrata' : 'Uscita'}`}
          size="small"
          onDelete={() => onFilterChange('transactionType', 'all')}
          color="primary"
          variant="outlined"
          icon={filters.transactionType === 'income' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
        />
      );
    }
    
    if (filters.categoryId && filters.categoryId !== 'all') {
      const category = categories.find(c => c._id === filters.categoryId);
      filterChips.push(
        <Chip
          key="category"
          label={`Categoria: ${category ? category.name : 'ID: ' + filters.categoryId}`}
          size="small"
          onDelete={() => onFilterChange('categoryId', 'all')}
          color="primary"
          variant="outlined"
        />
      );
    }
    
    if (filters.accountId && filters.accountId !== 'all') {
      const account = accounts.find(a => a._id === filters.accountId);
      filterChips.push(
        <Chip
          key="account"
          label={`Conto: ${account ? account.name : 'ID: ' + filters.accountId}`}
          size="small"
          onDelete={() => onFilterChange('accountId', 'all')}
          color="primary"
          variant="outlined"
        />
      );
    }
    
    if (filters.taxRelevant && filters.taxRelevant !== 'all') {
      filterChips.push(
        <Chip
          key="taxRelevant"
          label={`Fiscale: ${filters.taxRelevant === 'yes' ? 'Sì' : 'No'}`}
          size="small"
          onDelete={() => onFilterChange('taxRelevant', 'all')}
          color="primary"
          variant="outlined"
          icon={filters.taxRelevant === 'yes' ? <Receipt fontSize="small" /> : null}
        />
      );
    }
    
    if (filters.dateFrom) {
      filterChips.push(
        <Chip
          key="dateFrom"
          label={`Da: ${formatDate(filters.dateFrom)}`}
          size="small"
          onDelete={() => onFilterChange('dateFrom', '')}
          color="primary"
          variant="outlined"
          icon={<CalendarMonth fontSize="small" />}
        />
      );
    }
    
    if (filters.dateTo) {
      filterChips.push(
        <Chip
          key="dateTo"
          label={`A: ${formatDate(filters.dateTo)}`}
          size="small"
          onDelete={() => onFilterChange('dateTo', '')}
          color="primary"
          variant="outlined"
          icon={<CalendarMonth fontSize="small" />}
        />
      );
    }
    
    if (filters.amountMin) {
      filterChips.push(
        <Chip
          key="amountMin"
          label={`Min: ${filters.amountMin}€`}
          size="small"
          onDelete={() => onFilterChange('amountMin', '')}
          color="primary"
          variant="outlined"
        />
      );
    }
    
    if (filters.amountMax) {
      filterChips.push(
        <Chip
          key="amountMax"
          label={`Max: ${filters.amountMax}€`}
          size="small"
          onDelete={() => onFilterChange('amountMax', '')}
          color="primary"
          variant="outlined"
        />
      );
    }
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1, 
          mt: compact ? 1 : 2, 
          mb: compact ? 1 : 2
        }}
      >
        {filterChips}
        
        <Chip
          icon={<ClearAll />}
          label="Pulisci filtri"
          size="small"
          onClick={onResetFilters}
          color="secondary"
        />
      </Box>
    );
  };
  
  return (
    <Paper sx={{ width: '100%', p: compact ? 1 : 2, mb: compact ? 1 : 2 }}>
      {/* Barra di ricerca principale e pulsante filtri */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: compact ? 1 : 2 }}>
        <TextField
          name="search"
          value={filters.search || ''}
          onChange={handleInputChange}
          placeholder="Cerca transazioni..."
          variant="outlined"
          size={compact ? "small" : "medium"}
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
          startIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
          onClick={handleShowFilters}
          size={compact ? "small" : "medium"}
          sx={{ minWidth: compact ? 100 : 120 }}
        >
          Filtri {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </Box>
      
      {/* Mostra le chip dei filtri attivi */}
      {activeFilterCount > 0 && renderActiveFilters()}
      
      {/* Filtri aggiuntivi */}
      {showFullFilters && (
        <Collapse in={showFilters}>
          {activeFilterCount > 0 && <Divider sx={{ my: 2 }} />}
          
          <Grid container spacing={2}>
            {/* Prima riga di filtri */}
            <Grid item xs={12} sm={4} md={3}>
              <FormControl 
                fullWidth 
                size={compact ? "small" : "medium"}
              >
                <InputLabel id="transaction-type-label">Tipo</InputLabel>
                <Select
                  labelId="transaction-type-label"
                  id="transaction-type"
                  name="transactionType"
                  value={filters.transactionType || 'all'}
                  onChange={handleInputChange}
                  label="Tipo"
                >
                  <MenuItem value="all">Tutti</MenuItem>
                  <MenuItem value="income">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowUpward color="success" fontSize="small" sx={{ mr: 1 }} />
                      Entrate
                    </Box>
                  </MenuItem>
                  <MenuItem value="expense">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ArrowDownward color="error" fontSize="small" sx={{ mr: 1 }} />
                      Uscite
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4} md={3}>
              <CategorySelect
                value={filters.categoryId || 'all'}
                onChange={handleCategoryChange}
                label="Categoria"
                size={compact ? "small" : "medium"}
                enableAddNew={false}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <AccountSelect
                value={filters.accountId || 'all'}
                onChange={handleAccountChange}
                label="Conto"
                size={compact ? "small" : "medium"}
                enableAddNew={false}
                showBalance={false}
              />
            </Grid>
            
            <Grid item xs={12} sm={4} md={3}>
              <FormControl 
                fullWidth 
                size={compact ? "small" : "medium"}
              >
                <InputLabel id="tax-relevant-label">Fiscale</InputLabel>
                <Select
                  labelId="tax-relevant-label"
                  id="tax-relevant"
                  name="taxRelevant"
                  value={filters.taxRelevant || 'all'}
                  onChange={handleInputChange}
                  label="Fiscale"
                >
                  <MenuItem value="all">Tutti</MenuItem>
                  <MenuItem value="yes">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Receipt color="primary" fontSize="small" sx={{ mr: 1 }} />
                      Rilevante
                    </Box>
                  </MenuItem>
                  <MenuItem value="no">Non rilevante</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Seconda riga di filtri */}
            <Grid item xs={12} sm={3} md={3}>
              <TextField
                label="Da data"
                type="date"
                name="dateFrom"
                value={filters.dateFrom || ''}
                onChange={handleInputChange}
                fullWidth
                size={compact ? "small" : "medium"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3} md={3}>
              <TextField
                label="A data"
                type="date"
                name="dateTo"
                value={filters.dateTo || ''}
                onChange={handleInputChange}
                fullWidth
                size={compact ? "small" : "medium"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3} md={3}>
              <TextField
                label="Importo minimo"
                type="number"
                name="amountMin"
                value={filters.amountMin || ''}
                onChange={handleInputChange}
                fullWidth
                size={compact ? "small" : "medium"}
                InputProps={{
                  endAdornment: <InputAdornment position="end">€</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3} md={3}>
              <TextField
                label="Importo massimo"
                type="number"
                name="amountMax"
                value={filters.amountMax || ''}
                onChange={handleInputChange}
                fullWidth
                size={compact ? "small" : "medium"}
                InputProps={{
                  endAdornment: <InputAdornment position="end">€</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ClearAll />}
              onClick={onResetFilters}
              size={compact ? "small" : "medium"}
            >
              Pulisci Filtri
            </Button>
          </Box>
        </Collapse>
      )}
    </Paper>
  );
};

export default TransactionFilter;
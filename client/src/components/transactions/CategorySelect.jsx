import React, { useEffect, useContext, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Chip,
  CircularProgress,
  ListSubheader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  CompareArrows,
  Add
} from '@mui/icons-material';
import { CategoryContext } from '../../context/CategoryContext';
import { AlertContext } from '../../context/AlertContext';

const CategorySelect = ({
  value,
  onChange,
  error,
  helperText,
  label = 'Categoria',
  required = false,
  filterType = null,
  fullWidth = true,
  size = 'medium',
  enableAddNew = true,
  disabled = false
}) => {
  const { categories, getCategories, addCategory, loading } = useContext(CategoryContext);
  const { setSuccessAlert, setErrorAlert } = useContext(AlertContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: filterType || 'expense'
  });

  // Carica le categorie se non sono già caricate
  useEffect(() => {
    if (categories.length === 0 && !loading) {
      getCategories();
    }
  }, [categories.length, getCategories, loading]);

  // Filtra le categorie per tipo se specificato
  const filteredCategories = filterType
    ? categories.filter(cat => cat.type === filterType || cat.type === 'both')
    : categories;

  // Raggruppa le categorie per tipo
  const incomeCategories = categories.filter(cat => cat.type === 'income' || cat.type === 'both');
  const expenseCategories = categories.filter(cat => cat.type === 'expense' || cat.type === 'both');
  const bothCategories = categories.filter(cat => cat.type === 'both');

  // Restituisce icona e colore in base al tipo
  const getCategoryIcon = (type) => {
    switch (type) {
      case 'income':
        return <ArrowUpward fontSize="small" color="success" />;
      case 'expense':
        return <ArrowDownward fontSize="small" color="error" />;
      case 'both':
        return <CompareArrows fontSize="small" color="info" />;
      default:
        return null;
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCategory({
      name: '',
      type: filterType || 'expense'
    });
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        setErrorAlert('Il nome della categoria è richiesto');
        return;
      }

      await addCategory(newCategory);
      setSuccessAlert('Categoria aggiunta con successo');
      handleCloseDialog();
    } catch (err) {
      setErrorAlert('Errore durante l\'aggiunta della categoria');
    }
  };

  const renderMenuItems = () => {
    if (filterType) {
      // Se è specificato un filtro, mostra solo le categorie di quel tipo
      return filteredCategories.map(category => (
        <MenuItem key={category._id} value={category._id}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getCategoryIcon(category.type)}
            <span style={{ marginLeft: 8 }}>{category.name}</span>
          </Box>
        </MenuItem>
      ));
    } else {
      // Altrimenti, raggruppa le categorie per tipo
      return (
        <>
          {/* Categorie di entrata */}
          {incomeCategories.length > 0 && (
            <>
              <ListSubheader>Entrate</ListSubheader>
              {incomeCategories.map(category => (
                <MenuItem key={category._id} value={category._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getCategoryIcon(category.type)}
                    <span style={{ marginLeft: 8 }}>{category.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </>
          )}

          {/* Categorie di uscita */}
          {expenseCategories.length > 0 && (
            <>
              <ListSubheader>Uscite</ListSubheader>
              {expenseCategories.map(category => (
                <MenuItem key={category._id} value={category._id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getCategoryIcon(category.type)}
                    <span style={{ marginLeft: 8 }}>{category.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </>
          )}

          {/* Categorie di entrambi (se non sono già incluse sopra) */}
          {bothCategories.length > 0 && bothCategories.some(cat => 
            !incomeCategories.includes(cat) && !expenseCategories.includes(cat)
          ) && (
            <>
              <ListSubheader>Entrambi</ListSubheader>
              {bothCategories
                .filter(cat => !incomeCategories.includes(cat) && !expenseCategories.includes(cat))
                .map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getCategoryIcon(category.type)}
                      <span style={{ marginLeft: 8 }}>{category.name}</span>
                    </Box>
                  </MenuItem>
                ))
              }
            </>
          )}
        </>
      );
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
        <InputLabel id="category-select-label">{label}</InputLabel>
        <Select
          labelId="category-select-label"
          value={value || ''}
          onChange={onChange}
          label={label}
          renderValue={(selected) => {
            const category = categories.find(c => c._id === selected);
            if (!category) return '';
            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getCategoryIcon(category.type)}
                <span style={{ marginLeft: 8 }}>{category.name}</span>
              </Box>
            );
          }}
          endAdornment={
            loading ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null
          }
        >
          {/* Opzione per "Nessuna categoria" */}
          <MenuItem value="">
            <em>Nessuna categoria</em>
          </MenuItem>

          {/* Categorie esistenti */}
          {renderMenuItems()}

          {/* Opzione per aggiungere una nuova categoria */}
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
              Aggiungi nuova categoria
            </MenuItem>
          )}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>

      {/* Dialog per aggiungere una nuova categoria */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Aggiungi Nuova Categoria</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome Categoria"
            type="text"
            fullWidth
            value={newCategory.name}
            onChange={handleNewCategoryChange}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="new-category-type-label">Tipo</InputLabel>
            <Select
              labelId="new-category-type-label"
              name="type"
              value={newCategory.type}
              onChange={handleNewCategoryChange}
              label="Tipo"
              disabled={!!filterType}
            >
              <MenuItem value="income">Entrata</MenuItem>
              <MenuItem value="expense">Uscita</MenuItem>
              <MenuItem value="both">Entrambi</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleAddCategory} variant="contained" color="primary">
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategorySelect;
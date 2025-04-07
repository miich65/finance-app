import React, { useState, useContext, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton
} from '@mui/material';
import { 
  Add, 
  Delete,
  ArrowUpward,
  ArrowDownward,
  CompareArrows,
  Edit
} from '@mui/icons-material';
import { CategoryContext } from '../context/CategoryContext';
import { AlertContext } from '../context/AlertContext';

const CategoryForm = ({ onSave, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'expense'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
            label="Nome Categoria"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel id="type-label">Tipo</InputLabel>
            <Select
              labelId="type-label"
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Tipo"
            >
              <MenuItem value="income">Entrata</MenuItem>
              <MenuItem value="expense">Uscita</MenuItem>
              <MenuItem value="both">Entrambi</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          {onCancel && (
            <Button onClick={onCancel} color="inherit">
              Annulla
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Aggiorna' : 'Aggiungi'} Categoria
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const Categories = () => {
  const { categories, getCategories, addCategory, loading, error } = useContext(CategoryContext);
  const { setSuccessAlert, setErrorAlert } = useContext(AlertContext);
  const [openDialog, setOpenDialog] = useState(false);
  
  useEffect(() => {
    getCategories();
  }, [getCategories]);
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSaveCategory = async (formData) => {
    try {
      await addCategory(formData);
      setSuccessAlert('Categoria aggiunta con successo');
      handleCloseDialog();
    } catch (err) {
      setErrorAlert('Errore durante l\'aggiunta della categoria');
    }
  };
  
  const getCategoryTypeInfo = (type) => {
    switch(type) {
      case 'income':
        return { 
          label: 'Entrata', 
          icon: <ArrowUpward fontSize="small" />, 
          color: 'success' 
        };
      case 'expense':
        return { 
          label: 'Uscita', 
          icon: <ArrowDownward fontSize="small" />, 
          color: 'error' 
        };
      case 'both':
        return { 
          label: 'Entrambi', 
          icon: <CompareArrows fontSize="small" />, 
          color: 'info' 
        };
      default:
        return { 
          label: 'Sconosciuto', 
          icon: null, 
          color: 'default' 
        };
    }
  };
  
  const renderSkeletons = () => {
    return Array(5).fill().map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton /></TableCell>
        <TableCell align="center"><Skeleton /></TableCell>
        <TableCell align="right"><Skeleton width={100} /></TableCell>
      </TableRow>
    ));
  };
  
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Categorie
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Nuova Categoria
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="tabella categorie">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="center">Tipo</TableCell>
                <TableCell align="right">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                renderSkeletons()
              ) : categories.length > 0 ? (
                categories.map((category) => {
                  const typeInfo = getCategoryTypeInfo(category.type);
                  return (
                    <TableRow key={category._id} hover>
                      <TableCell component="th" scope="row">
                        {category.name}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={typeInfo.icon}
                          label={typeInfo.label}
                          color={typeInfo.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      Nessuna categoria trovata
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Dialog per aggiungere una nuova categoria */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Aggiungi Categoria</DialogTitle>
        <DialogContent>
          <CategoryForm onSave={handleSaveCategory} onCancel={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
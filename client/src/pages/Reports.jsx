import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import { 
  PictureAsPdf, 
  TableChart,
  Download,
  DateRange
} from '@mui/icons-material';
import axios from 'axios';
import CashflowChart from '../components/dashboard/CashflowChart';
import CategoryDistribution from '../components/dashboard/CategoryDistribution';

// Componente TabPanel per gestire il contenuto delle tab
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    cashflow: [],
    categories: [],
    summary: null,
    transactions: []
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchReportData();
  }, [period, dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch cashflow data
      const cashflowRes = await axios.get(`/api/reports/cashflow?period=${period}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      
      // Fetch categories data
      const categoriesRes = await axios.get(`/api/reports/categories?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      
      // Fetch summary data
      const summaryRes = await axios.get(`/api/reports/summary?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      
      // Fetch transactions data for the period
      const transactionsRes = await axios.get(`/api/transactions?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      
      setReportData({
        cashflow: cashflowRes.data,
        categories: categoriesRes.data,
        summary: summaryRes.data,
        transactions: transactionsRes.data
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
    
    // Aggiorna il range di date in base al periodo selezionato
    const now = new Date();
    let startDate;
    
    switch(event.target.value) {
      case 'week':
        // Inizio della settimana corrente (lunedì)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        break;
      case 'month':
        // Inizio del mese corrente
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        // Inizio del trimestre corrente
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        // Inizio dell'anno corrente
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    });
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  // Genera un report PDF (da implementare in versioni future)
  const generatePdf = () => {
    alert('Funzionalità di esportazione PDF sarà disponibile in una versione futura');
  };

  // Esporta i dati in formato CSV (da implementare in versioni future)
  const exportCsv = () => {
    alert('Funzionalità di esportazione CSV sarà disponibile in una versione futura');
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Report
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={generatePdf}
          >
            Esporta PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<TableChart />}
            onClick={exportCsv}
          >
            Esporta CSV
          </Button>
        </Box>
      </Box>

      {/* Filtri periodo */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="period-label">Periodo</InputLabel>
              <Select
                labelId="period-label"
                id="period-select"
                value={period}
                onChange={handlePeriodChange}
                label="Periodo"
              >
                <MenuItem value="week">Questa Settimana</MenuItem>
                <MenuItem value="month">Questo Mese</MenuItem>
                <MenuItem value="quarter">Questo Trimestre</MenuItem>
                <MenuItem value="year">Quest'Anno</MenuItem>
                <MenuItem value="custom">Personalizzato</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {period === 'custom' && (
            <>
              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  label="Da Data"
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  label="A Data"
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
          
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateRange color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs per i diversi tipi di report */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Riepilogo" />
          <Tab label="Flusso di Cassa" />
          <Tab label="Categorie" />
          <Tab label="Transazioni" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Tab Riepilogo */}
            <TabPanel value={tabValue} index={0}>
              {reportData.summary && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Riepilogo Finanziario
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Entrate Totali
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {formatCurrency(reportData.summary.income)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Uscite Totali
                          </Typography>
                          <Typography variant="h6" color="error.main">
                            {formatCurrency(reportData.summary.expense)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Saldo Periodo
                          </Typography>
                          <Typography variant="h6" color={reportData.summary.balance >= 0 ? 'success.main' : 'error.main'}>
                            {formatCurrency(reportData.summary.balance)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Tasso Risparmio
                          </Typography>
                          <Typography variant="h6">
                            {reportData.summary.income > 0 
                              ? Math.round((reportData.summary.balance / reportData.summary.income) * 100) 
                              : 0}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Riepilogo Fiscale
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Entrate Rilevanti
                          </Typography>
                          <Typography variant="h6" color="primary.main">
                            {formatCurrency(reportData.summary.taxRelevantIncome)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Uscite Rilevanti
                          </Typography>
                          <Typography variant="h6" color="primary.main">
                            {formatCurrency(reportData.summary.taxRelevantExpense)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Margine Fiscale
                          </Typography>
                          <Typography variant="h6">
                            {formatCurrency(reportData.summary.taxRelevantIncome - reportData.summary.taxRelevantExpense)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            % Spese Deducibili
                          </Typography>
                          <Typography variant="h6">
                            {reportData.summary.taxRelevantIncome > 0 
                              ? Math.round((reportData.summary.taxRelevantExpense / reportData.summary.taxRelevantIncome) * 100) 
                              : 0}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </TabPanel>

            {/* Tab Flusso di Cassa */}
            <TabPanel value={tabValue} index={1}>
              <CashflowChart />
            </TabPanel>

            {/* Tab Categorie */}
            <TabPanel value={tabValue} index={2}>
              <CategoryDistribution />
            </TabPanel>

            {/* Tab Transazioni */}
            <TabPanel value={tabValue} index={3}>
              <TableContainer>
                <Table aria-label="tabella transazioni report">
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Descrizione</TableCell>
                      <TableCell>Categoria</TableCell>
                      <TableCell>Conto</TableCell>
                      <TableCell align="center">Tipo</TableCell>
                      <TableCell align="right">Importo</TableCell>
                      <TableCell align="center">Fiscale</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.transactions.length > 0 ? (
                      reportData.transactions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((transaction) => (
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
                              <Chip
                                label={transaction.transactionType === 'income' ? 'Entrata' : 'Uscita'}
                                color={transaction.transactionType === 'income' ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ 
                              color: transaction.transactionType === 'income' ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}>
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell align="center">
                              {transaction.taxRelevant && (
                                <Chip label="Sì" size="small" color="primary" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body1" sx={{ py: 2 }}>
                            Nessuna transazione trovata per il periodo selezionato
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={reportData.transactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Righe per pagina:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} di ${count}`}
              />
            </TabPanel>
          </>
        )}
      </Paper>
    </div>
  );
};

export default Reports;
import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel,
  Skeleton,
  useTheme
} from '@mui/material';
import { 
  Line,
  Bar,
  Chart 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import axios from 'axios';

// Registra i componenti di ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CashflowChart = () => {
  const [cashflowData, setCashflowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');
  const [chartType, setChartType] = useState('line');
  const theme = useTheme();

  useEffect(() => {
    const fetchCashflowData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/reports/cashflow?period=${period}`);
        setCashflowData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Errore nel caricamento dei dati di flusso di cassa');
        setLoading(false);
      }
    };

    fetchCashflowData();
  }, [period]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  // Prepara i dati per il grafico
  const prepareChartData = () => {
    if (!cashflowData || cashflowData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Ordina i dati per data
    const sortedData = [...cashflowData].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    // Estrai date per le etichette
    const labels = sortedData.map(item => {
      const date = new Date(item.date);
      if (period === 'year') {
        return date.getFullYear().toString();
      } else if (period === 'month') {
        return new Intl.DateTimeFormat('it-IT', { month: 'short', year: 'numeric' }).format(date);
      } else {
        return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short' }).format(date);
      }
    });

    // Prepara i set di dati
    return {
      labels,
      datasets: [
        {
          label: 'Entrate',
          data: sortedData.map(item => item.income),
          borderColor: theme.palette.success.main,
          backgroundColor: chartType === 'line' 
            ? theme.palette.success.main 
            : theme.palette.success.light,
          fill: chartType === 'line' ? false : true,
          tension: 0.1
        },
        {
          label: 'Uscite',
          data: sortedData.map(item => item.expense),
          borderColor: theme.palette.error.main,
          backgroundColor: chartType === 'line' 
            ? theme.palette.error.main 
            : theme.palette.error.light,
          fill: chartType === 'line' ? false : true,
          tension: 0.1
        },
        {
          label: 'Saldo',
          data: sortedData.map(item => item.balance),
          borderColor: theme.palette.info.main,
          backgroundColor: chartType === 'line' 
            ? theme.palette.info.main 
            : theme.palette.info.light,
          fill: chartType === 'line' ? false : true,
          tension: 0.1,
          // Mostra solo nel grafico a linee
          hidden: chartType === 'bar'
        }
      ]
    };
  };

  // Opzioni del grafico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Flusso di Cassa',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };

  const renderChart = () => {
    const data = prepareChartData();
    
    if (loading) {
      return <Skeleton variant="rectangular" height={300} />;
    }
    
    if (chartType === 'line') {
      return <Line data={data} options={chartOptions} height={300} />;
    } else {
      return <Bar data={data} options={chartOptions} height={300} />;
    }
  };

  if (error) {
    return (
      <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Flusso di Cassa
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="chart-type-label">Tipo Grafico</InputLabel>
            <Select
              labelId="chart-type-label"
              id="chart-type-select"
              value={chartType}
              onChange={handleChartTypeChange}
              label="Tipo Grafico"
            >
              <MenuItem value="line">Linee</MenuItem>
              <MenuItem value="bar">Barre</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="period-label">Periodo</InputLabel>
            <Select
              labelId="period-label"
              id="period-select"
              value={period}
              onChange={handlePeriodChange}
              label="Periodo"
            >
              <MenuItem value="week">Settimanale</MenuItem>
              <MenuItem value="month">Mensile</MenuItem>
              <MenuItem value="year">Annuale</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ height: 300 }}>
        {renderChart()}
      </Box>
    </Paper>
  );
};

export default CashflowChart;
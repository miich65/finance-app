import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  FormControl, 
  RadioGroup,
  FormControlLabel,
  Radio,
  Skeleton,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import { 
  Pie, 
  Doughnut 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

// Registra i componenti di ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CategoryDistribution = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('doughnut');
  const [viewType, setViewType] = useState('expense');
  const theme = useTheme();

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/reports/categories');
        setCategoryData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Errore nel caricamento dei dati per categorie');
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleViewTypeChange = (event, newValue) => {
    setViewType(newValue);
  };

  // Prepara i dati per il grafico
  const prepareChartData = () => {
    if (!categoryData || categoryData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Filtra i dati per tipo (entrate o uscite)
    const filteredData = categoryData.filter(item => {
      if (viewType === 'expense') {
        return item.categoryId.type === 'expense' || item.categoryId.type === 'both';
      } else {
        return item.categoryId.type === 'income' || item.categoryId.type === 'both';
      }
    });

    // Ordina i dati per totale decrescente
    const sortedData = [...filteredData].sort((a, b) => b.total - a.total);

    // Limita a massimo 8 categorie per leggibilità
    const limitedData = sortedData.slice(0, 8);

    // Estrai nomi categorie e totali
    const labels = limitedData.map(item => item.categoryName);
    const values = limitedData.map(item => item.total);

    // Genera colori per le categorie
    const generateColors = (count) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 137.5) % 360; // Distribuzione equidistante dei colori
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
      return colors;
    };

    const backgroundColors = generateColors(limitedData.length);
    const borderColors = backgroundColors.map(color => color.replace('60%', '50%'));

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
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
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 10
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR'
              }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  const renderChart = () => {
    const data = prepareChartData();
    
    if (loading) {
      return <Skeleton variant="circular" width={250} height={250} sx={{ margin: '0 auto' }} />;
    }
    
    if (chartType === 'pie') {
      return <Pie data={data} options={chartOptions} />;
    } else {
      return <Doughnut data={data} options={chartOptions} />;
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
          Distribuzione per Categorie
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl>
            <RadioGroup
              row
              name="chart-type-radio"
              value={chartType}
              onChange={handleChartTypeChange}
            >
              <FormControlLabel value="doughnut" control={<Radio size="small" />} label="Ciambella" />
              <FormControlLabel value="pie" control={<Radio size="small" />} label="Torta" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      
      <Tabs 
        value={viewType} 
        onChange={handleViewTypeChange}
        sx={{ mb: 2 }}
        centered
      >
        <Tab value="expense" label="Spese" />
        <Tab value="income" label="Entrate" />
      </Tabs>
      
      <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {renderChart()}
      </Box>
      
      {!loading && categoryData.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          Nessun dato disponibile per questo periodo
        </Typography>
      )}
    </Paper>
  );
};

export default CategoryDistribution;
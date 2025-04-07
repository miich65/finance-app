import React, { useState, useEffect } from 'react';
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
  Bar,
  Chart 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

// Registra i componenti di ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IncomeExpenseChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');
  const [compareMode, setCompareMode] = useState('sideBySide');
  const theme = useTheme();

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/reports/cashflow?period=${period}`);
      setChartData(res.data);
      setLoading(false);
    } catch (err) {
      setError('Errore nel caricamento dei dati');
      setLoading(false);
    }
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleCompareModeChange = (event) => {
    setCompareMode(event.target.value);
  };

  // Prepara i dati per il grafico
  const prepareChartData = () => {
    if (!chartData || chartData.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Ordina i dati per data
    const sortedData = [...chartData].sort((a, b) => {
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
        return new Intl.
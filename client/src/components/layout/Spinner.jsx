import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Spinner = ({ text = 'Caricamento in corso...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: 200,
        width: '100%',
      }}
    >
      <CircularProgress color="primary" size={60} thickness={4} />
      {text && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Spinner;
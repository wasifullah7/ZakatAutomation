import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5', // Light gray background
        color: '#333',
      }}
    >
      <CircularProgress size={60} sx={{ color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Loading...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we prepare your experience.
      </Typography>
    </Box>
  );
};

export default LoadingSpinner; 
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import ZakatCalculator from '../components/ZakatCalculator';

const ZakatCalculatorPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3 }}>
            Zakat Calculator
          </Typography>
          <ZakatCalculator />
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default ZakatCalculatorPage; 
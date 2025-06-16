import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DonorApplicationsTable from '../../components/admin/DonorApplicationsTable';

const DonorApplicationsPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3 }}>
            Donor Applications
          </Typography>
          <DonorApplicationsTable />
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default DonorApplicationsPage; 
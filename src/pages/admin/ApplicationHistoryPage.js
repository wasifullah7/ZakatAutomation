import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ApplicationHistory from '../../components/admin/ApplicationHistory';

const ApplicationHistoryPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
          Application History
        </Typography>
        <Paper sx={{ p: 3 }}>
          <ApplicationHistory />
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default ApplicationHistoryPage; 
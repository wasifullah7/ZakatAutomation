import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import ApprovedAcceptorsTable from '../../components/admin/ApprovedAcceptorsTable';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const ApprovedAcceptorsPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
            Approved Acceptors List
          </Typography>
          <ApprovedAcceptorsTable />
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default ApprovedAcceptorsPage; 
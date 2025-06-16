import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AcceptorApplicationsTable from '../../components/admin/AcceptorApplicationsTable';

const AcceptorApplicationsPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3 }}>
            Acceptor Applications
          </Typography>
          <AcceptorApplicationsTable />
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default AcceptorApplicationsPage; 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { adminAPI } from '../../services/api';

const ApplicationHistory = () => {
  const [tabValue, setTabValue] = useState(0);
  const [donors, setDonors] = useState([]);
  const [acceptors, setAcceptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [donorsResponse, acceptorsResponse] = await Promise.all([
        adminAPI.getDonors(),
        adminAPI.getAcceptors()
      ]);
      setDonors(donorsResponse.data);
      setAcceptors(acceptorsResponse.data);
    } catch (err) {
      console.error('Failed to fetch application history:', err);
      setError('Failed to load application history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Pending' },
      in_review: { color: 'info', label: 'In Review' },
      approved: { color: 'success', label: 'Approved' },
      rejected: { color: 'error', label: 'Rejected' }
    };

    const config = statusConfig[status] || { color: 'default', label: status };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 'medium' }}
      />
    );
  };

  const renderTable = (data, type) => (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
      <Table size="medium">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              {type === 'donor' ? 'Organization' : 'Family Size'}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Last Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id} hover>
              <TableCell>{item.firstName} {item.lastName}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.profile?.phone || 'N/A'}</TableCell>
              <TableCell>
                {type === 'donor' 
                  ? item.profile?.organizationName || 'N/A'
                  : item.profile?.familySize || 'N/A'
                }
              </TableCell>
              <TableCell>{getStatusChip(item.verificationStatus)}</TableCell>
              <TableCell>
                {new Date(item.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
        Application History
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={`Donors (${donors.length})`} />
          <Tab label={`Acceptors (${acceptors.length})`} />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {tabValue === 0 ? (
          donors.length === 0 ? (
            <Alert severity="info">No donor applications found.</Alert>
          ) : (
            renderTable(donors, 'donor')
          )
        ) : (
          acceptors.length === 0 ? (
            <Alert severity="info">No acceptor applications found.</Alert>
          ) : (
            renderTable(acceptors, 'acceptor')
          )
        )}
      </Box>
    </Box>
  );
};

export default ApplicationHistory; 
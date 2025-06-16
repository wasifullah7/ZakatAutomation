import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import ApplicationDetailModal from './ApplicationDetailModal';

const DonorApplicationsTable = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDonors();
      setDonors(response.data.filter(donor => donor.verificationStatus === 'pending'));
    } catch (err) {
      console.error('Failed to fetch donors:', err);
      setError(err.response?.data?.message || 'Failed to load donor applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetailsModal = (user) => {
    setSelectedUserForDetails(user);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUserForDetails(null);
  };

  const handleAction = (donor, type) => {
    setSelectedDonor(donor);
    setActionType(type);
    setRejectionReason('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDonor(null);
    setRejectionReason('');
    setActionType('');
  };

  const handleSubmitAction = async () => {
    if (!selectedDonor) return;

    try {
      setLoading(true);
      let status = actionType === 'accept' ? 'approved' : 'rejected';
      const payload = { status };
      if (actionType === 'reject') {
        payload.reason = rejectionReason || 'No reason provided';
      }

      await adminAPI.approveDonor(selectedDonor._id, payload);
      toast.success(`Donor application ${status} successfully!`);
      fetchDonors();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to update donor status:', err);
      toast.error(err.response?.data?.message || `Failed to ${actionType} donor application.`);
    } finally {
      setLoading(false);
    }
  };

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
        Pending Donor Applications
      </Typography>
      {donors.length === 0 ? (
        <Alert severity="info">No pending donor applications found.</Alert>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <TableContainer>
            <Table size="medium" sx={{ minWidth: 650 }}>
              <TableHead sx={{
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
                '& th': {
                  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
                }
              }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Organization</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{donor.firstName} {donor.lastName}</TableCell>
                    <TableCell>{donor.email}</TableCell>
                    <TableCell>{donor.profile?.phone || 'N/A'}</TableCell>
                    <TableCell>{donor.profile?.organizationName || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="warning.main">
                        {donor.verificationStatus}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenDetailsModal(donor)}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'primary.light',
                                color: 'white'
                              }
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Accept Application">
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleAction(donor, 'accept')}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'success.light',
                                color: 'white'
                              }
                            }}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Application">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleAction(donor, 'reject')}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: 'error.light',
                                color: 'white'
                              }
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedUserForDetails && (
        <ApplicationDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailsModal}
          userData={selectedUserForDetails}
          onStatusUpdate={handleSubmitAction}
        />
      )}
    </Box>
  );
};

export default DonorApplicationsTable; 
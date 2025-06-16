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

const AcceptorApplicationsTable = () => {
  const [acceptors, setAcceptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAcceptor, setSelectedAcceptor] = useState(null);

  useEffect(() => {
    fetchAcceptors();
  }, []);

  const fetchAcceptors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAcceptors();
      setAcceptors(response.data.filter(acceptor => acceptor.verificationStatus === 'pending'));
    } catch (err) {
      console.error('Failed to fetch acceptors:', err);
      setError(err.response?.data?.message || 'Failed to load acceptor applications. Please try again later.');
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

  const handleAction = (acceptor, type) => {
    setSelectedAcceptor(acceptor);
    setActionType(type);
    setRejectionReason('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAcceptor(null);
    setRejectionReason('');
    setActionType('');
  };

  const handleSubmitAction = async () => {
    if (!selectedAcceptor) return;

    try {
      setLoading(true);
      let status = actionType === 'accept' ? 'approved' : 'rejected';
      const payload = { status };
      if (actionType === 'reject') {
        payload.reason = rejectionReason || 'No reason provided';
      }

      await adminAPI.approveAcceptor(selectedAcceptor._id, payload);
      toast.success(`Acceptor application ${status} successfully!`);
      fetchAcceptors();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to update acceptor status:', err);
      toast.error(err.response?.data?.message || `Failed to ${actionType} acceptor application.`);
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
        Pending Acceptor Applications
      </Typography>
      {acceptors.length === 0 ? (
        <Alert severity="info">No pending acceptor applications found.</Alert>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <TableContainer>
            <Table size="medium" sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Family Size</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {acceptors.map((acceptor) => (
                  <TableRow key={acceptor._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{acceptor.firstName} {acceptor.lastName}</TableCell>
                    <TableCell>{acceptor.email}</TableCell>
                    <TableCell>{acceptor.profile?.phone || 'N/A'}</TableCell>
                    <TableCell>{acceptor.profile?.familySize || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="warning.main">
                        {acceptor.verificationStatus}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenDetailsModal(acceptor)}
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
                            onClick={() => handleAction(acceptor, 'accept')}
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
                            onClick={() => handleAction(acceptor, 'reject')}
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

export default AcceptorApplicationsTable; 
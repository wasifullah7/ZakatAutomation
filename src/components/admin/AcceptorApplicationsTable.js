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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AcceptorApplicationsTable = () => {
  const [acceptors, setAcceptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAcceptor, setSelectedAcceptor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchAcceptors();
  }, []);

  const fetchAcceptors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAcceptors(); // You might want a specific 'getPendingAcceptors' endpoint
      setAcceptors(response.data.filter(acceptor => acceptor.verificationStatus === 'pending'));
    } catch (err) {
      console.error('Failed to fetch acceptors:', err);
      setError(err.response?.data?.message || 'Failed to load acceptor applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (acceptor, type) => {
    setSelectedAcceptor(acceptor);
    setActionType(type);
    setRejectionReason(''); // Clear previous rejection reason
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

      await adminAPI.approveUser(selectedAcceptor._id, payload);
      toast.success(`Acceptor application ${status} successfully!`);
      fetchAcceptors(); // Refresh the list
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
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<Check />}
                          onClick={() => handleAction(acceptor, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Close />}
                          onClick={() => handleAction(acceptor, 'reject')}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: actionType === 'accept' ? 'success.main' : 'error.main', color: 'white' }}>
          {actionType === 'accept' ? 'Confirm Acceptance' : 'Reject Acceptor Application'}
        </DialogTitle>
        <DialogContent dividers>
          {actionType === 'accept' ? (
            <Typography variant="body1">Are you sure you want to accept {selectedAcceptor?.firstName} {selectedAcceptor?.lastName}'s application?</Typography>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Rejection (Optional)"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              variant="outlined"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button
            onClick={handleSubmitAction}
            color={actionType === 'accept' ? 'success' : 'error'}
            variant="contained"
          >
            {actionType === 'accept' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AcceptorApplicationsTable; 
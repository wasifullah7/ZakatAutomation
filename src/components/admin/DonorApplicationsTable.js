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

const DonorApplicationsTable = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionType, setActionType] = useState('');

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

      await adminAPI.approveUser(selectedDonor._id, payload);
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
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
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
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<Check />}
                          onClick={() => handleAction(donor, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Close />}
                          onClick={() => handleAction(donor, 'reject')}
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
          {actionType === 'accept' ? 'Confirm Acceptance' : 'Reject Donor Application'}
        </DialogTitle>
        <DialogContent dividers>
          {actionType === 'accept' ? (
            <Typography variant="body1">Are you sure you want to accept {selectedDonor?.firstName} {selectedDonor?.lastName}'s application?</Typography>
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

export default DonorApplicationsTable; 
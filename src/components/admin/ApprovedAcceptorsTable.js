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
  TextField,
  InputAdornment,
  TablePagination,
  useTheme,
  Button,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx'; // Import xlsx library
import { adminAPI } from '../../services/api';

const ApprovedAcceptorsTable = () => {
  const [acceptors, setAcceptors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();

  useEffect(() => {
    fetchApprovedAcceptors();
  }, []);

  const fetchApprovedAcceptors = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAcceptors();
      setAcceptors(response.data.filter(acceptor => acceptor.verificationStatus === 'approved'));
    } catch (err) {
      console.error('Failed to fetch approved acceptors:', err);
      setError(err.response?.data?.message || 'Failed to load approved acceptor list. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAcceptors = acceptors.filter(acceptor =>
    (acceptor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acceptor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acceptor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acceptor.profile?.easyPaisaNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acceptor.profile?.address?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDownloadExcel = () => {
    const dataToExport = filteredAcceptors.map(acceptor => ({
      'First Name': acceptor.firstName,
      'Last Name': acceptor.lastName,
      Email: acceptor.email,
      Role: acceptor.role,
      'Is Active': acceptor.isActive ? 'Yes' : 'No',
      Phone: acceptor.profile?.phone || 'N/A',
      Address: acceptor.profile?.address || 'N/A',
      City: acceptor.profile?.city || 'N/A',
      Country: acceptor.profile?.country || 'N/A',
      'Postal Code': acceptor.profile?.postalCode || 'N/A',
      'National ID': acceptor.profile?.nationalId || 'N/A',
      'National ID Expiry': acceptor.profile?.nationalIdExpiry ? new Date(acceptor.profile.nationalIdExpiry).toLocaleDateString() : 'N/A',
      'Family Size': acceptor.profile?.familySize || 'N/A',
      'Monthly Income': acceptor.profile?.monthlyIncome || 'N/A',
      'Monthly Expenses': acceptor.profile?.monthlyExpenses || 'N/A',
      'Bank Name': acceptor.profile?.bankName || 'N/A',
      'Bank Branch': acceptor.profile?.bankBranch || 'N/A',
      'Bank Account Number': acceptor.profile?.bankAccountNumber || 'N/A',
      Assets: acceptor.profile?.assets?.join(', ') || 'N/A',
      Liabilities: acceptor.profile?.liabilities?.join(', ') || 'N/A',
      'Zakat Reason': acceptor.profile?.zakatReason || 'N/A',
      Documents: acceptor.profile?.documents?.map(doc => `${doc.type} (${doc.filename || 'N/A'})`).join('; ') || 'N/A',
      'Organization Name': acceptor.profile?.organizationName || 'N/A',
      'Organization Type': acceptor.profile?.organizationType || 'N/A',
      'Registration Number': acceptor.profile?.registrationNumber || 'N/A',
      'Registration Date': acceptor.profile?.registrationDate ? new Date(acceptor.profile.registrationDate).toLocaleDateString() : 'N/A',
      'Registration Expiry': acceptor.profile?.registrationExpiry ? new Date(acceptor.profile.registrationExpiry).toLocaleDateString() : 'N/A',
      Needs: acceptor.profile?.needs?.join(', ') || 'N/A',
      'Emergency Contact Name': acceptor.profile?.emergencyContact?.name || 'N/A',
      'Emergency Contact Relationship': acceptor.profile?.emergencyContact?.relationship || 'N/A',
      'Emergency Contact Phone': acceptor.profile?.emergencyContact?.phone || 'N/A',
      'Verification Status': acceptor.verificationStatus,
      'Verification Notes': acceptor.profile?.verificationNotes?.map(note => `${note.note} (by ${note.addedBy || 'N/A'} at ${new Date(note.addedAt).toLocaleDateString()})`).join('; ') || 'N/A',
      'Created At': new Date(acceptor.createdAt).toLocaleDateString(),
      'Updated At': new Date(acceptor.updatedAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Approved Acceptors");
    XLSX.writeFile(wb, "ApprovedAcceptors.xlsx");
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
        Approved Acceptors
      </Typography>

      <TextField
        fullWidth
        label="Search Acceptors"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {filteredAcceptors.length === 0 ? (
        <Alert severity="info">No approved acceptors found matching your criteria.</Alert>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <TableContainer>
            <Table size="medium" sx={{ minWidth: 650 }}>
              <TableHead sx={{
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
                // Ensure text color is readable on the chosen background
                '& th': {
                  color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
                }
              }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Occupation</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>EasyPaisa Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Family Size</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAcceptors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((acceptor) => (
                    <TableRow key={acceptor._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{acceptor.firstName} {acceptor.lastName}</TableCell>
                      <TableCell>{acceptor.profile?.occupation || 'N/A'}</TableCell>
                      <TableCell>{acceptor.profile?.easyPaisaNumber || acceptor.profile?.phone || 'N/A'}</TableCell>
                      <TableCell>{acceptor.profile?.familySize || 'N/A'}</TableCell>
                      <TableCell>{acceptor.profile?.address || 'N/A'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="success.main">
                          {acceptor.verificationStatus}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAcceptors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadExcel}
          sx={{ borderRadius: '8px', px: 3, py: 1.5 }}
        >
          Download Excel Sheet
        </Button>
      </Box>
    </Box>
  );
};

export default ApprovedAcceptorsTable; 
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
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material';
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
    </Box>
  );
};

export default ApprovedAcceptorsTable; 
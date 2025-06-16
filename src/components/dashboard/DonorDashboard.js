import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  People,
  AttachMoney,
  Campaign,
  MoreVert,
  Calculate,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.tsx';
import DashboardLayout from './DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ApprovedAcceptorsTable from './ApprovedAcceptorsTable';

// Sample data for charts
const monthlyDonations = [
  { month: 'Jan', amount: 4000 },
  { month: 'Feb', amount: 3000 },
  { month: 'Mar', amount: 2000 },
  { month: 'Apr', amount: 2780 },
  { month: 'May', amount: 1890 },
  { month: 'Jun', amount: 2390 },
];

const impactData = [
  { name: 'Education', value: 400 },
  { name: 'Healthcare', value: 300 },
  { name: 'Food Aid', value: 300 },
  { name: 'Shelter', value: 200 },
];

const recentDonations = [
  { id: 1, campaign: 'Education Fund', amount: 1000, date: '2024-03-15', status: 'Completed' },
  { id: 2, campaign: 'Healthcare', amount: 500, date: '2024-03-10', status: 'Completed' },
  { id: 3, campaign: 'Food Aid', amount: 750, date: '2024-03-05', status: 'Pending' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DonorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.firstName}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's an overview of your donations and impact
            </Typography>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AttachMoney sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Total Donations</Typography>
                </Box>
                <Typography variant="h4">$12,570</Typography>
                <Typography variant="body2" color="text.secondary">
                  +12% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Campaign sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h6">Active Campaigns</Typography>
                </Box>
                <Typography variant="h4">4</Typography>
                <Typography variant="body2" color="text.secondary">
                  2 new this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <People sx={{ color: 'info.main', mr: 1 }} />
                  <Typography variant="h6">Beneficiaries</Typography>
                </Box>
                <Typography variant="h4">120</Typography>
                <Typography variant="body2" color="text.secondary">
                  +15% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6">Success Rate</Typography>
                </Box>
                <Typography variant="h4">98%</Typography>
                <Typography variant="body2" color="text.secondary">
                  +2% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Acceptors List */}
          <Grid item xs={12} md={8}>
            <Card sx={{
              borderRadius: '12px',
              boxShadow: theme.shadows[4],
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Acceptors List
                </Typography>
                <ApprovedAcceptorsTable />
              </CardContent>
            </Card>
          </Grid>

          {/* Impact Distribution */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Impact Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={impactData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {impactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Donations Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Recent Donations</Typography>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Campaign</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentDonations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>{donation.campaign}</TableCell>
                          <TableCell align="right">${donation.amount}</TableCell>
                          <TableCell align="right">{donation.date}</TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={donation.status === 'Completed' ? 'success.main' : 'warning.main'}
                            >
                              {donation.status}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default DonorDashboard; 
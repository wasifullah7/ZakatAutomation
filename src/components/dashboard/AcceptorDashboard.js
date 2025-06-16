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
  Add,
  Calculate,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.tsx';
import DashboardLayout from './DashboardLayout';
import { useNavigate } from 'react-router-dom';

// Sample data for charts
const monthlyRequests = [
  { month: 'Jan', amount: 2000 },
  { month: 'Feb', amount: 3000 },
  { month: 'Mar', amount: 4000 },
  { month: 'Apr', amount: 2780 },
  { month: 'May', amount: 1890 },
  { month: 'Jun', amount: 2390 },
];

const requestCategories = [
  { name: 'Education', value: 400 },
  { name: 'Healthcare', value: 300 },
  { name: 'Food Aid', value: 300 },
  { name: 'Shelter', value: 200 },
];

const recentRequests = [
  { id: 1, category: 'Education', amount: 1000, date: '2024-03-15', status: 'Approved' },
  { id: 2, category: 'Healthcare', amount: 500, date: '2024-03-10', status: 'Pending' },
  { id: 3, category: 'Food Aid', amount: 750, date: '2024-03-05', status: 'Rejected' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AcceptorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <div>
                <Typography variant="h4" gutterBottom>
                  Welcome back, {user?.firstName}!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Here's an overview of your requests and assistance
                </Typography>
              </div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => {/* Handle new request */}}
              >
                New Request
              </Button>
            </Box>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AttachMoney sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6">Total Assistance</Typography>
                </Box>
                <Typography variant="h4">$8,570</Typography>
                <Typography variant="body2" color="text.secondary">
                  +8% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Campaign sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h6">Active Requests</Typography>
                </Box>
                <Typography variant="h4">3</Typography>
                <Typography variant="body2" color="text.secondary">
                  1 new this week
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <People sx={{ color: 'info.main', mr: 1 }} />
                  <Typography variant="h6">Family Members</Typography>
                </Box>
                <Typography variant="h4">5</Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated 2 days ago
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
                <Typography variant="h4">85%</Typography>
                <Typography variant="body2" color="text.secondary">
                  +5% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Requests Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Assistance
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRequests}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#8884d8"
                        name="Assistance Amount"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Request Categories */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Request Categories
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={requestCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {requestCategories.map((entry, index) => (
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

          {/* Recent Requests Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Recent Requests</Typography>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.category}</TableCell>
                          <TableCell align="right">${request.amount}</TableCell>
                          <TableCell align="right">{request.date}</TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={
                                request.status === 'Approved'
                                  ? 'success.main'
                                  : request.status === 'Pending'
                                  ? 'warning.main'
                                  : 'error.main'
                              }
                            >
                              {request.status}
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

export default AcceptorDashboard; 
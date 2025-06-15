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
  Chip,
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
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.tsx';

// Sample data for charts
const monthlyStats = [
  { month: 'Jan', donations: 4000, requests: 3000 },
  { month: 'Feb', donations: 3000, requests: 2000 },
  { month: 'Mar', donations: 2000, requests: 4000 },
  { month: 'Apr', donations: 2780, requests: 2780 },
  { month: 'May', donations: 1890, requests: 1890 },
  { month: 'Jun', donations: 2390, requests: 2390 },
];

const userDistribution = [
  { name: 'Donors', value: 400 },
  { name: 'Acceptors', value: 300 },
  { name: 'Admins', value: 100 },
];

const recentActivities = [
  { id: 1, type: 'Donation', amount: 1000, user: 'John Doe', date: '2024-03-15', status: 'Completed' },
  { id: 2, type: 'Request', amount: 500, user: 'Jane Smith', date: '2024-03-10', status: 'Pending' },
  { id: 3, type: 'Donation', amount: 750, user: 'Mike Johnson', date: '2024-03-05', status: 'Rejected' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminDashboard = () => {
  const { user } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle fontSize="small" />;
      case 'Pending':
        return <Warning fontSize="small" />;
      case 'Rejected':
        return <Error fontSize="small" />;
      default:
        return null;
    }
  };

  return (
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
                Here's an overview of the system's performance
              </Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => {/* Handle new action */}}
            >
              New Action
            </Button>
          </Box>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AttachMoney sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Total Donations</Typography>
              </Box>
              <Typography variant="h4">$45,570</Typography>
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
                <Campaign sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h6">Active Requests</Typography>
              </Box>
              <Typography variant="h4">12</Typography>
              <Typography variant="body2" color="text.secondary">
                3 new this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <People sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h4">800</Typography>
              <Typography variant="body2" color="text.secondary">
                +50 this month
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
              <Typography variant="h4">92%</Typography>
              <Typography variant="body2" color="text.secondary">
                +3% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Stats Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Statistics
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="donations" fill="#8884d8" name="Donations" />
                    <Bar dataKey="requests" fill="#82ca9d" name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userDistribution.map((entry, index) => (
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

        {/* Recent Activities Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Activities</Typography>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.type}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                        <TableCell align="right">${activity.amount}</TableCell>
                        <TableCell align="right">{activity.date}</TableCell>
                        <TableCell align="right">
                          <Chip
                            icon={getStatusIcon(activity.status)}
                            label={activity.status}
                            color={getStatusColor(activity.status)}
                            size="small"
                          />
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
  );
};

export default AdminDashboard; 
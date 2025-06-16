import React, { useState, useEffect } from 'react';
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
  useTheme,
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
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import ApprovedAcceptorsTable from '../admin/ApprovedAcceptorsTable';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();

  const [monthlyStats, setMonthlyStats] = useState([
    { month: 'Jan', donations: 4000, requests: 3000 },
    { month: 'Feb', donations: 3000, requests: 2000 },
    { month: 'Mar', donations: 2000, requests: 4000 },
    { month: 'Apr', donations: 2780, requests: 2780 },
    { month: 'May', donations: 1890, requests: 1890 },
    { month: 'Jun', donations: 2390, requests: 2390 },
  ]);

  const [userDistribution, setUserDistribution] = useState([
    { name: 'Donors', value: 400 },
    { name: 'Acceptors', value: 300 },
    { name: 'Admins', value: 100 },
  ]);

  // Static values for active requests and total users
  const activeRequests = 10;
  const totalUsers = 40;

  const COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main];

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
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: '12px',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
                  : 'linear-gradient(135deg, #f0f2f5 0%, #e0e4e8 100%)',
                boxShadow: theme.shadows[4],
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
                height: '100%', // Ensure it matches height of adjacent cards
              }}
            >
              <div>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                  Welcome back, {user?.firstName}!<br/>
                </Typography>
                <Typography variant="subtitle1" color="inherit">
                  Here's an overview of the system's performance
                </Typography>
              </div>
            </Box>
          </Grid>

          {/* Active Requests Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '12px', boxShadow: theme.shadows[4] }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Campaign sx={{ color: 'success.main', mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Active Requests</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.dark }}>{activeRequests}</Typography>
                <Typography variant="body2" color="text.secondary">
                  This is the current number of active requests.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Users Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: '12px', boxShadow: theme.shadows[4] }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <People sx={{ color: 'info.main', mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Users</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.dark }}>{totalUsers}</Typography>
                <Typography variant="body2" color="text.secondary">
                  This is the total number of users.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Approved Acceptors Table */}
          <Grid item xs={12}>
            <ApprovedAcceptorsTable />
          </Grid>

          {/* Monthly Stats Chart */}
          <Grid item xs={12} md={12}>
            <Card sx={{ borderRadius: '12px', boxShadow: theme.shadows[4] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Monthly Statistics
                </Typography>
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          boxShadow: theme.shadows[2],
                        }}
                        labelStyle={{ color: theme.palette.text.primary }}
                        itemStyle={{ color: theme.palette.text.secondary }}
                      />
                      <Legend />
                      <Bar dataKey="donations" fill={theme.palette.primary.main} name="Donations" />
                      <Bar dataKey="requests" fill={theme.palette.success.main} name="Requests" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* User Distribution Chart */}
          <Grid item xs={12} md={12}>
            <Card sx={{ borderRadius: '12px', boxShadow: theme.shadows[4] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  User Distribution
                </Typography>
                <Box sx={{ height: 350 }}>
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
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          boxShadow: theme.shadows[2],
                        }}
                        labelStyle={{ color: theme.palette.text.primary }}
                        itemStyle={{ color: theme.palette.text.secondary }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default AdminDashboard;
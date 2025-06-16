import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  LocalAtm as LocalAtmIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AcceptorDashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();

  // Chart data for monthly assistance
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Assistance',
        data: [5000, 4500, 6000, 5500, 5000, 5000],
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart data for assistance categories
  const categoryData = {
    labels: ['Basic Needs', 'Education', 'Healthcare', 'Housing'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
      },
    ],
  };

  // Chart data for request status
  const requestData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Requests',
        data: [5, 2, 1],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Box
          sx={{
            p: 3,
            mb: 4,
            borderRadius: '12px',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
              : 'linear-gradient(135deg, #f0f2f5 0%, #e0e4e8 100%)',
            boxShadow: theme.shadows[4],
            color: theme.palette.mode === 'dark' ? 'white' : theme.palette.text.primary,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography variant="subtitle1" color="inherit">
            Here's your Zakat assistance overview
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Charts Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: '12px', boxShadow: theme.shadows[4], height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Monthly Assistance Trend
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line data={monthlyData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '12px', boxShadow: theme.shadows[4], height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Assistance Categories
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Doughnut data={categoryData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Request Status Chart */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '12px', boxShadow: theme.shadows[4] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Request Status Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar data={requestData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default AcceptorDashboard; 
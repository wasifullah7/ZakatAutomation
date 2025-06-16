import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const ApplicationStatusPage = () => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card sx={{
              borderRadius: '12px',
              boxShadow: theme.shadows[4],
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  Your Application Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 3 }}>
                  {user?.verificationStatus === 'approved' ? (
                    <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 80 }} />
                  ) : user?.verificationStatus === 'pending' ? (
                    <PendingIcon sx={{ color: theme.palette.warning.main, fontSize: 80 }} />
                  ) : (
                    <CancelIcon sx={{ color: theme.palette.error.main, fontSize: 80 }} />
                  )}
                  <Typography variant="h4" sx={{ fontWeight: 600, mt: 2 }}>
                    {user?.verificationStatus?.toUpperCase().replace(/_/g, ' ') || 'N/A'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {user?.verificationStatus === 'pending' && (
                      'Your application is currently pending review. Please check back later for updates.'
                    )}
                    {user?.verificationStatus === 'in_review' && (
                      'Your application is currently being reviewed by an administrator.'
                    )}
                    {user?.verificationStatus === 'approved' && (
                      'Congratulations! Your application has been approved.'
                    )}
                    {user?.verificationStatus === 'rejected' && (
                      'Unfortunately, your application has been rejected. Please contact support.'
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
                    Last updated: {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default ApplicationStatusPage; 
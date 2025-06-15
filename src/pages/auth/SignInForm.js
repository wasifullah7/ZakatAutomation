import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Card, CardContent, Typography, Grid, TextField, Button, Box, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  role: Yup.string().required('Role is required')
});

const SignInForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError('');

      const result = await login(values.email, values.password, values.role);
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Check if profile is complete
        const isProfileComplete = checkProfileComplete(result.user);
        
        if (!isProfileComplete) {
          navigate('/profile');
        } else {
          // Redirect based on role
          switch (result.user.role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'donor':
              navigate('/donor/dashboard');
              break;
            case 'acceptor':
              navigate('/acceptor/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        }
      } else {
        setError(result.error || 'Login failed');
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      toast.error(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const checkProfileComplete = (user) => {
    if (!user) return false;

    if (user.role === 'acceptor') {
      return (
        user.profile?.phone &&
        user.profile?.address &&
        user.profile?.city &&
        user.profile?.country &&
        user.profile?.postalCode &&
        user.profile?.nationalId &&
        user.profile?.nationalIdExpiry &&
        user.profile?.familySize &&
        user.profile?.monthlyIncome &&
        user.profile?.monthlyExpenses &&
        user.profile?.bankName &&
        user.profile?.bankBranch &&
        user.profile?.bankAccountNumber &&
        user.profile?.zakatReason &&
        user.profile?.documents?.length > 0 &&
        user.profile?.emergencyContact?.name &&
        user.profile?.emergencyContact?.relationship &&
        user.profile?.emergencyContact?.phone
      );
    }

    if (user.role === 'donor') {
      return (
        user.profile?.phone &&
        user.profile?.address &&
        user.profile?.city &&
        user.profile?.country &&
        user.profile?.postalCode &&
        user.profile?.nationalId &&
        user.profile?.nationalIdExpiry &&
        user.profile?.bankName &&
        user.profile?.bankBranch &&
        user.profile?.bankAccountNumber &&
        user.profile?.organizationName &&
        user.profile?.organizationType &&
        user.profile?.registrationNumber &&
        user.profile?.registrationDate &&
        user.profile?.registrationExpiry &&
        user.profile?.documents?.length > 0
      );
    }

    return true;
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              email: '',
              password: '',
              role: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={touched.role && Boolean(errors.role)}>
                      <InputLabel>Role</InputLabel>
                      <Field
                        as={Select}
                        name="role"
                        label="Role"
                      >
                        <MenuItem value="donor">Donor</MenuItem>
                        <MenuItem value="acceptor">Acceptor</MenuItem>
                      </Field>
                      {touched.role && errors.role && (
                        <Typography color="error" variant="caption">
                          {errors.role}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignInForm; 
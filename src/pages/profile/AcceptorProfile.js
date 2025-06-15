import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { KTIcon } from '../../helpers/icons';
import { authAPI } from '../../services/api';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const AcceptorProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    profile: Yup.object().shape({
      nationalId: Yup.string().required('National ID is required'),
      nationalIdExpiry: Yup.date().required('National ID expiry date is required'),
      familySize: Yup.number().required('Family size is required').min(1, 'Family size must be at least 1'),
      monthlyIncome: Yup.number().required('Monthly income is required').min(0, 'Monthly income cannot be negative'),
      monthlyExpenses: Yup.number().required('Monthly expenses is required').min(0, 'Monthly expenses cannot be negative'),
      phone: Yup.string().required('Phone number is required'),
      city: Yup.string().required('City is required'),
      country: Yup.string().required('Country is required'),
      postalCode: Yup.string().required('Postal code is required'),
      address: Yup.string().required('Address is required'),
      bankAccountNumber: Yup.string().required('Bank account number is required'),
      bankName: Yup.string().required('Bank name is required'),
      bankBranch: Yup.string().required('Bank branch is required'),
      zakatReason: Yup.string().required('Zakat reason is required'),
      emergencyContact: Yup.object().shape({
        name: Yup.string().required('Emergency contact name is required'),
        relationship: Yup.string().required('Relationship is required'),
        phone: Yup.string().required('Emergency contact phone is required')
      })
    })
  });

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profile: {
      nationalId: user?.profile?.nationalId || '',
      nationalIdExpiry: formatDate(user?.profile?.nationalIdExpiry),
      familySize: user?.profile?.familySize || '',
      monthlyIncome: user?.profile?.monthlyIncome || '',
      monthlyExpenses: user?.profile?.monthlyExpenses || '',
      phone: user?.profile?.phone || '',
      city: user?.profile?.city || '',
      country: user?.profile?.country || '',
      postalCode: user?.profile?.postalCode || '',
      address: user?.profile?.address || '',
      bankAccountNumber: user?.profile?.bankAccountNumber || '',
      bankName: user?.profile?.bankName || '',
      bankBranch: user?.profile?.bankBranch || '',
      zakatReason: user?.profile?.zakatReason || '',
      emergencyContact: {
        name: user?.profile?.emergencyContact?.name || '',
        relationship: user?.profile?.emergencyContact?.relationship || '',
        phone: user?.profile?.emergencyContact?.phone || ''
      }
    }
  };

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    setDocuments(files);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('profile', JSON.stringify(values.profile));

      // Add documents
      documents.forEach((doc) => {
        formData.append('documents', doc);
      });

      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        
        // Wait for the state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if profile is complete
        const isProfileComplete = (userData) => {
          if (!userData || !userData.role) return false;
          
          if (userData.role === 'acceptor') {
            const profile = userData.profile || {};
            return (
              profile.nationalId &&
              profile.nationalIdExpiry &&
              profile.familySize &&
              profile.monthlyIncome &&
              profile.monthlyExpenses &&
              profile.phone &&
              profile.city &&
              profile.country &&
              profile.postalCode &&
              profile.address &&
              profile.bankAccountNumber &&
              profile.bankName &&
              profile.bankBranch &&
              profile.zakatReason &&
              profile.emergencyContact?.name &&
              profile.emergencyContact?.relationship &&
              profile.emergencyContact?.phone &&
              profile.documents?.length > 0
            );
          }
          return true;
        };

        if (isProfileComplete(result.user)) {
          // If profile is complete, redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          // If profile is still incomplete, show error
          setError('Please fill in all required fields and upload at least one document');
        }
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complete Your Profile
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="firstName"
                    label="First Name"
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>

                {/* Contact Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={3}
                    name="profile.address"
                    label="Full Address"
                    error={touched.profile?.address && Boolean(errors.profile?.address)}
                    helperText={touched.profile?.address && errors.profile?.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.phone"
                    label="Phone Number"
                    error={touched.profile?.phone && Boolean(errors.profile?.phone)}
                    helperText={touched.profile?.phone && errors.profile?.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.city"
                    label="City"
                    error={touched.profile?.city && Boolean(errors.profile?.city)}
                    helperText={touched.profile?.city && errors.profile?.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.country"
                    label="Country"
                    error={touched.profile?.country && Boolean(errors.profile?.country)}
                    helperText={touched.profile?.country && errors.profile?.country}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.postalCode"
                    label="Postal Code"
                    error={touched.profile?.postalCode && Boolean(errors.profile?.postalCode)}
                    helperText={touched.profile?.postalCode && errors.profile?.postalCode}
                  />
                </Grid>

                {/* National ID Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    National ID Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.nationalId"
                    label="National ID Number"
                    error={touched.profile?.nationalId && Boolean(errors.profile?.nationalId)}
                    helperText={touched.profile?.nationalId && errors.profile?.nationalId}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    type="date"
                    name="profile.nationalIdExpiry"
                    label="National ID Expiry Date"
                    InputLabelProps={{ shrink: true }}
                    error={touched.profile?.nationalIdExpiry && Boolean(errors.profile?.nationalIdExpiry)}
                    helperText={touched.profile?.nationalIdExpiry && errors.profile?.nationalIdExpiry}
                  />
                </Grid>

                {/* Family Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Family Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    type="number"
                    name="profile.familySize"
                    label="Family Size"
                    error={touched.profile?.familySize && Boolean(errors.profile?.familySize)}
                    helperText={touched.profile?.familySize && errors.profile?.familySize}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    type="number"
                    name="profile.monthlyIncome"
                    label="Monthly Income"
                    error={touched.profile?.monthlyIncome && Boolean(errors.profile?.monthlyIncome)}
                    helperText={touched.profile?.monthlyIncome && errors.profile?.monthlyIncome}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    type="number"
                    name="profile.monthlyExpenses"
                    label="Monthly Expenses"
                    error={touched.profile?.monthlyExpenses && Boolean(errors.profile?.monthlyExpenses)}
                    helperText={touched.profile?.monthlyExpenses && errors.profile?.monthlyExpenses}
                  />
                </Grid>

                {/* Bank Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Bank Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.bankAccountNumber"
                    label="Account Number"
                    error={touched.profile?.bankAccountNumber && Boolean(errors.profile?.bankAccountNumber)}
                    helperText={touched.profile?.bankAccountNumber && errors.profile?.bankAccountNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.bankName"
                    label="Bank Name"
                    error={touched.profile?.bankName && Boolean(errors.profile?.bankName)}
                    helperText={touched.profile?.bankName && errors.profile?.bankName}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.bankBranch"
                    label="Branch Name"
                    error={touched.profile?.bankBranch && Boolean(errors.profile?.bankBranch)}
                    helperText={touched.profile?.bankBranch && errors.profile?.bankBranch}
                  />
                </Grid>

                {/* Emergency Contact */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Emergency Contact
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.emergencyContact.name"
                    label="Contact Name"
                    error={touched.profile?.emergencyContact?.name && Boolean(errors.profile?.emergencyContact?.name)}
                    helperText={touched.profile?.emergencyContact?.name && errors.profile?.emergencyContact?.name}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.emergencyContact.relationship"
                    label="Relationship"
                    error={touched.profile?.emergencyContact?.relationship && Boolean(errors.profile?.emergencyContact?.relationship)}
                    helperText={touched.profile?.emergencyContact?.relationship && errors.profile?.emergencyContact?.relationship}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    name="profile.emergencyContact.phone"
                    label="Contact Phone"
                    error={touched.profile?.emergencyContact?.phone && Boolean(errors.profile?.emergencyContact?.phone)}
                    helperText={touched.profile?.emergencyContact?.phone && errors.profile?.emergencyContact?.phone}
                  />
                </Grid>

                {/* Zakat Reason */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Zakat Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={4}
                    name="profile.zakatReason"
                    label="Reason for Zakat"
                    error={touched.profile?.zakatReason && Boolean(errors.profile?.zakatReason)}
                    helperText={touched.profile?.zakatReason && errors.profile?.zakatReason}
                  />
                </Grid>

                {/* Documents Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Required Documents
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    multiple
                    onChange={handleDocumentChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    id="document-upload"
                  />
                  <label htmlFor="document-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<KTIcon iconName="upload" />}
                    >
                      Upload Documents
                    </Button>
                  </label>
                  {documents.length > 0 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {documents.length} file(s) selected
                    </Typography>
                  )}
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                    Please upload your National ID, proof of address, and any other relevant documents.
                  </Typography>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || loading || documents.length === 0}
                      sx={{ minWidth: 200 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Submit Application'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default AcceptorProfile; 
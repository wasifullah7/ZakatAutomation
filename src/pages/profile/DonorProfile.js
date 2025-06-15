import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Card, CardContent, Typography, Grid, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from '../../utils/dayjs';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  postalCode: Yup.string().required('Postal code is required'),
  nationalId: Yup.string().required('National ID is required'),
  nationalIdExpiry: Yup.date().required('National ID expiry date is required'),
  bankName: Yup.string().required('Bank name is required'),
  bankBranch: Yup.string().required('Bank branch is required'),
  bankAccountNumber: Yup.string().required('Bank account number is required'),
  organizationName: Yup.string().required('Organization name is required'),
  organizationType: Yup.string().required('Organization type is required'),
  registrationNumber: Yup.string().required('Registration number is required'),
  registrationDate: Yup.date().required('Registration date is required'),
  registrationExpiry: Yup.date().required('Registration expiry date is required')
});

const DonorProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    country: user?.profile?.country || '',
    postalCode: user?.profile?.postalCode || '',
    nationalId: user?.profile?.nationalId || '',
    nationalIdExpiry: user?.profile?.nationalIdExpiry ? new Date(user.profile.nationalIdExpiry).toISOString().split('T')[0] : '',
    bankName: user?.profile?.bankName || '',
    bankBranch: user?.profile?.bankBranch || '',
    bankAccountNumber: user?.profile?.bankAccountNumber || '',
    organizationName: user?.profile?.organizationName || '',
    organizationType: user?.profile?.organizationType || '',
    registrationNumber: user?.profile?.registrationNumber || '',
    registrationDate: user?.profile?.registrationDate ? new Date(user.profile.registrationDate).toISOString().split('T')[0] : '',
    registrationExpiry: user?.profile?.registrationExpiry ? new Date(user.profile.registrationExpiry).toISOString().split('T')[0] : ''
  };

  const handleDocumentChange = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      
      // Append basic profile information
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      // Append documents
      documents.forEach((file, index) => {
        formData.append('documents', file);
      });

      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        toast.success('Profile updated successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update profile');
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating profile');
      toast.error(err.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Complete Your Donor Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please provide the following information to complete your donor profile.
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
            {({ errors, touched }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="First Name"
                      name="firstName"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Address"
                      name="address"
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="City"
                      name="city"
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Country"
                      name="country"
                      error={touched.country && Boolean(errors.country)}
                      helperText={touched.country && errors.country}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Postal Code"
                      name="postalCode"
                      error={touched.postalCode && Boolean(errors.postalCode)}
                      helperText={touched.postalCode && errors.postalCode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="National ID"
                      name="nationalId"
                      error={touched.nationalId && Boolean(errors.nationalId)}
                      helperText={touched.nationalId && errors.nationalId}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      type="date"
                      label="National ID Expiry"
                      name="nationalIdExpiry"
                      error={touched.nationalIdExpiry && Boolean(errors.nationalIdExpiry)}
                      helperText={touched.nationalIdExpiry && errors.nationalIdExpiry}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Bank Name"
                      name="bankName"
                      error={touched.bankName && Boolean(errors.bankName)}
                      helperText={touched.bankName && errors.bankName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Bank Branch"
                      name="bankBranch"
                      error={touched.bankBranch && Boolean(errors.bankBranch)}
                      helperText={touched.bankBranch && errors.bankBranch}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Bank Account Number"
                      name="bankAccountNumber"
                      error={touched.bankAccountNumber && Boolean(errors.bankAccountNumber)}
                      helperText={touched.bankAccountNumber && errors.bankAccountNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Organization Name"
                      name="organizationName"
                      error={touched.organizationName && Boolean(errors.organizationName)}
                      helperText={touched.organizationName && errors.organizationName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      select
                      label="Organization Type"
                      name="organizationType"
                      error={touched.organizationType && Boolean(errors.organizationType)}
                      helperText={touched.organizationType && errors.organizationType}
                      SelectProps={{
                        native: true
                      }}
                    >
                      <option value="">Select Type</option>
                      <option value="Non-Profit Organization">Non-Profit Organization</option>
                      <option value="Charity">Charity</option>
                      <option value="Religious Institution">Religious Institution</option>
                      <option value="Community Center">Community Center</option>
                      <option value="Educational Institution">Educational Institution</option>
                      <option value="Healthcare Facility">Healthcare Facility</option>
                      <option value="Other">Other</option>
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Registration Number"
                      name="registrationNumber"
                      error={touched.registrationNumber && Boolean(errors.registrationNumber)}
                      helperText={touched.registrationNumber && errors.registrationNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      type="date"
                      label="Registration Date"
                      name="registrationDate"
                      error={touched.registrationDate && Boolean(errors.registrationDate)}
                      helperText={touched.registrationDate && errors.registrationDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      type="date"
                      label="Registration Expiry"
                      name="registrationExpiry"
                      error={touched.registrationExpiry && Boolean(errors.registrationExpiry)}
                      helperText={touched.registrationExpiry && errors.registrationExpiry}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <input
                        accept="image/*,.pdf"
                        style={{ display: 'none' }}
                        id="document-upload"
                        type="file"
                        multiple
                        onChange={handleDocumentChange}
                      />
                      <label htmlFor="document-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<i className="fas fa-upload" />}
                        >
                          Upload Documents
                        </Button>
                      </label>
                      {documents.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {documents.length} file(s) selected
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Update Profile'}
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

export default DonorProfile; 
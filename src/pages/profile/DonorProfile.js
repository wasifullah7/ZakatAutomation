import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Avatar,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Home as HomeIcon,
  AccountBalance as BankIcon,
  Business as BusinessIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const steps = ['Personal Information', 'Organization Details', 'Bank Information', 'Documents'];

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('YYYY-MM-DD');
};

const DonorProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    profile: Yup.object().shape({
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
    })
  });

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profile: {
      phone: user?.profile?.phone || '',
      address: user?.profile?.address || '',
      city: user?.profile?.city || '',
      country: user?.profile?.country || '',
      postalCode: user?.profile?.postalCode || '',
      nationalId: user?.profile?.nationalId || '',
      nationalIdExpiry: formatDate(user?.profile?.nationalIdExpiry),
      bankName: user?.profile?.bankName || '',
      bankBranch: user?.profile?.bankBranch || '',
      bankAccountNumber: user?.profile?.bankAccountNumber || '',
      organizationName: user?.profile?.organizationName || '',
      organizationType: user?.profile?.organizationType || '',
      registrationNumber: user?.profile?.registrationNumber || '',
      registrationDate: formatDate(user?.profile?.registrationDate),
      registrationExpiry: formatDate(user?.profile?.registrationExpiry)
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
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

      // Validate documents
      if (documents.length === 0) {
        setError('Please upload at least one document to proceed');
        setLoading(false);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      
      // Add basic user information (firstName, lastName)
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);

      // Add all profile data as a single JSON string under 'profile'
      formData.append('profile', JSON.stringify(values.profile));

      // Add documents separately
      documents.forEach((file) => {
        formData.append('documents', file);
      });

      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card elevation={0} sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="First Name"
                    name="firstName"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Phone Number"
                    name="profile.phone"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Address"
                    name="profile.address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="City"
                    name="profile.city"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Country"
                    name="profile.country"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Postal Code"
                    name="profile.postalCode"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="National ID"
                    name="profile.nationalId"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="National ID Expiry"
                      value={dayjs(initialValues.profile.nationalIdExpiry)}
                      onChange={(newValue) => {
                        // Handle date change
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card elevation={0} sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Organization Name"
                    name="profile.organizationName"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Organization Type"
                    name="profile.organizationType"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Registration Number"
                    name="profile.registrationNumber"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Registration Date"
                      value={dayjs(initialValues.profile.registrationDate)}
                      onChange={(newValue) => {
                        // Handle date change
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Registration Expiry"
                      value={dayjs(initialValues.profile.registrationExpiry)}
                      onChange={(newValue) => {
                        // Handle date change
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card elevation={0} sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Bank Name"
                    name="profile.bankName"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BankIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Bank Branch"
                    name="profile.bankBranch"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BankIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Bank Account Number"
                    name="profile.bankAccountNumber"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BankIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card elevation={0} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Upload Required Documents
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please upload at least one of the following documents:
                </Typography>
                <Box sx={{ mb: 3, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
                  <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                    • Organization Registration Certificate
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                    • Tax Exemption Certificate
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                    • Latest Annual Report (if applicable)
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                    • Any other supporting documents
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{ mt: 2 }}
                >
                  Upload Documents
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentChange}
                  />
                </Button>
                {documents.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                      {documents.length} file(s) selected
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {documents.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc.name}
                          onDelete={() => {
                            const newDocs = [...documents];
                            newDocs.splice(index, 1);
                            setDocuments(newDocs);
                          }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    Please upload at least one document to proceed
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              margin: '0 auto 16px'
            }}
          >
            {user?.firstName?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            Complete Your Donor Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please provide the following information to complete your donor profile
          </Typography>
        </Box>

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

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched, isSubmitting, isValid, dirty }) => (
            <Form>
              {renderStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || isSubmitting}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Saving...' : 'Complete Profile'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default DonorProfile; 
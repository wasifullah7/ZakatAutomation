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
  ContactEmergency as EmergencyIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const steps = ['Personal Information', 'Financial Details', 'Bank Information', 'Emergency Contact', 'Documents'];

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('YYYY-MM-DD');
};

const AcceptorProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
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
      
      // Add basic profile information
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      
      // Add profile data as JSON string
      const profileData = {
        ...values.profile,
        documents: [] // Don't send existing documents in the profile data
      };
      formData.append('profile', JSON.stringify(profileData));

      // Add documents
      documents.forEach((doc) => {
        formData.append('documents', doc);
      });

      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Failed to update profile');
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
                    label="Family Size"
                    name="profile.familySize"
                    type="number"
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
                    label="Monthly Income"
                    name="profile.monthlyIncome"
                    type="number"
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
                    label="Monthly Expenses"
                    name="profile.monthlyExpenses"
                    type="number"
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
                    multiline
                    rows={4}
                    label="Reason for Zakat"
                    name="profile.zakatReason"
                  />
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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Emergency Contact Name"
                    name="profile.emergencyContact.name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmergencyIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Relationship"
                    name="profile.emergencyContact.relationship"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmergencyIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Emergency Contact Phone"
                    name="profile.emergencyContact.phone"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmergencyIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      case 4:
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
                    • National ID or Passport
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                    • Proof of Income
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                    • Proof of Address
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
            Complete Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please provide the following information to complete your profile
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
        >
          {({ errors, touched, isSubmitting }) => (
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

export default AcceptorProfile; 
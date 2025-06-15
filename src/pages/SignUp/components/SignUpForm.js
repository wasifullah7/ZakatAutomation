import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.tsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { TextField, Button, CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';
import './SignUpForm.css';

const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Wrong email format').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 symbols').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
  role: Yup.string().oneOf(['donor', 'acceptor']).required('Role is required'),
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
};

export default function SignUpForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        // Ensure all required fields are present and properly formatted
        const userData = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          role: values.role || 'donor' // Default to donor if not specified
        };

        // Validate data before sending
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
          throw new Error('All fields are required');
        }

        if (!['donor', 'acceptor'].includes(userData.role)) {
          throw new Error('Invalid role selected');
        }

        const result = await register(userData);
        
        if (result.success) {
          toast.success('Registration successful!');
          if (result.redirectTo) {
            sessionStorage.setItem('redirectPath', result.redirectTo);
            window.location.href = result.redirectTo;
          }
        } else {
          const errorMessage = result.error || 'Registration failed. Please try again.';
          setStatus(errorMessage);
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
        setStatus(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="form-wrapper">
      <form className="sign-up-form" onSubmit={formik.handleSubmit} noValidate>
        <h1 className="form-title">Sign Up</h1>
        <h2 className="form-subtitle">Create your Zakat Automation System account</h2>
        <p className="form-description">
          Join our platform to manage Zakat calculations, payments, and distributions efficiently.
        </p>

        <div className="fv-row mb-8">
          <TextField
            label="First Name"
            name="firstName"
            autoComplete="off"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </div>

        <div className="fv-row mb-8">
          <TextField
            label="Last Name"
            name="lastName"
            autoComplete="off"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </div>

        <div className="fv-row mb-8">
          <TextField
            label="Email"
            type="email"
            name="email"
            autoComplete="off"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </div>

        <div className="fv-row mb-8">
          <TextField
            label="Password"
            type="password"
            name="password"
            autoComplete="off"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </div>

        <div className="fv-row mb-8">
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            autoComplete="off"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
        </div>

        <div className="fv-row mb-8">
          <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
            <InputLabel id="role-select-label">Select Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={formik.values.role}
              label="Select Role"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="donor">Donor</MenuItem>
              <MenuItem value="acceptor">Acceptor</MenuItem>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
                {formik.errors.role}
              </p>
            )}
          </FormControl>
        </div>

        <div className="d-flex justify-content-between mb-10">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || formik.isSubmitting}
            className="ms-auto"
          >
            {loading ? (
              <>
                Please wait...
                <CircularProgress size={20} color="inherit" className="ms-2" />
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-muted">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

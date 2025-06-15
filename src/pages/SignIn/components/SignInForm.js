import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.tsx';
import './SignInForm.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['donor', 'acceptor', 'admin'], 'Invalid Role')
    .required('Role is required'),
});

const initialValues = {
  email: '',
  password: '',
  role: '',
};

const SignInForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const result = await login(values.email, values.password);
        
        if (result.success) {
          toast.success('Login successful!');
          if (result.redirectTo) {
            sessionStorage.setItem('redirectPath', result.redirectTo);
            window.location.href = result.redirectTo;
          }
        } else {
          setStatus(result.error || 'Login failed. Please try again.');
          toast.error(result.error || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
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
      <form className="sign-in-form" onSubmit={formik.handleSubmit} noValidate id="kt_login_signin_form">
        <h1 className="form-title">Sign in</h1>
        <h2 className="form-subtitle">Welcome to Zakat Automation System</h2>
        <p className="form-description">
          A comprehensive platform for managing Zakat calculations, payments, and distributions.
          Join us in making a difference through transparent and efficient Zakat management.
        </p>

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
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
                {formik.errors.role}
              </p>
            )}
          </FormControl>
        </div>

        <div className="d-grid mb-10">
          <Button
            type="submit"
            id="kt_sign_in_submit"
            className="btn btn-primary"
            size="large"
            disabled={formik.isSubmitting || !formik.isValid || loading}
          >
            {!loading && <span className="indicator-label">Continue</span>}
            {loading && (
              <span className="indicator-progress">
                Please wait...
                <CircularProgress size={20} color="inherit" className="ms-2" />
              </span>
            )}
          </Button>
        </div>

        <div className="form-footer">
          <span className="no-account">Don't have an account?</span>
          <Link to="/signup" className="create-account">Create an Account</Link>

          <div className="copyright-bottom-wrapper" style={{marginTop: '20px'}}>
            <span className="copyright">
              © 2024 Zakat Automation System. All rights reserved.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;

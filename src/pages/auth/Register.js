import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Form as BootstrapForm } from 'react-bootstrap';

const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['donor', 'acceptor'], 'Please select a valid role')
    .required('Role is required'),
});

const Register = () => {
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...userData } = values;
      const result = await register(userData);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Create Account</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: 'donor',
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <Field
                      type="text"
                      name="firstName"
                      className={`form-control ${errors.firstName && touched.firstName ? 'is-invalid' : ''}`}
                    />
                    {errors.firstName && touched.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <Field
                      type="text"
                      name="lastName"
                      className={`form-control ${errors.lastName && touched.lastName ? 'is-invalid' : ''}`}
                    />
                    {errors.lastName && touched.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && touched.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <Field
                    as="select"
                    name="role"
                    className={`form-select ${errors.role && touched.role ? 'is-invalid' : ''}`}
                  >
                    <option value="donor">Donor</option>
                    <option value="acceptor">Acceptor</option>
                  </Field>
                  {errors.role && touched.role && (
                    <div className="invalid-feedback">{errors.role}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  />
                  {errors.password && touched.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Register'}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="text-center mt-3">
            <p>
              Already have an account?{' '}
              <Button variant="link" onClick={() => navigate('/login')}>
                Login here
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register; 
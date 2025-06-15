import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { KTIcon } from '../../helpers/icons';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    profile: Yup.object().shape({
      phone: Yup.string(),
      address: Yup.string(),
      city: Yup.string(),
      country: Yup.string(),
      postalCode: Yup.string(),
    }),
  });

  const initialValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    profile: {
      phone: user?.profile?.phone || '',
      address: user?.profile?.address || '',
      city: user?.profile?.city || '',
      country: user?.profile?.country || '',
      postalCode: user?.profile?.postalCode || '',
    },
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const result = await updateProfile(values);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Profile Information</h3>
      </div>
      <div className="card-body">
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-5`}>
            {message.text}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="row mb-5">
                <div className="col-md-6">
                  <label className="form-label required">First Name</label>
                  <Field
                    type="text"
                    name="firstName"
                    className={`form-control ${errors.firstName && touched.firstName ? 'is-invalid' : ''}`}
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label required">Last Name</label>
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

              <div className="mb-5">
                <label className="form-label required">Email</label>
                <Field
                  type="email"
                  name="email"
                  className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                />
                {errors.email && touched.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="separator separator-dashed my-5"></div>

              <h4 className="mb-5">Contact Information</h4>

              <div className="row mb-5">
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <Field
                    type="tel"
                    name="profile.phone"
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Address</label>
                  <Field
                    type="text"
                    name="profile.address"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row mb-5">
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <Field
                    type="text"
                    name="profile.city"
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Country</label>
                  <Field
                    type="text"
                    name="profile.country"
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Postal Code</label>
                  <Field
                    type="text"
                    name="profile.postalCode"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <KTIcon iconName="check" className="fs-2 me-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Profile; 
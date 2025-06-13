import React from 'react';
import SignInSlider from './components/SignInSlider';
import SignInForm from './components/SignInForm';
import './SignIn.css';

const SignIn = () => {
  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-lg-row flex-column-fluid min-vh-100">
        {/* Slider Side */}
        <SignInSlider />
        
        {/* Form Side */}
        <div className="form-section-container">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn; 
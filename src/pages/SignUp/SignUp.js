import React from 'react';
import SignInSlider from '../SignIn/components/SignInSlider';
import SignUpForm from './components/SignUpForm';
import './SignUp.css';

const SignUp = () => {
  return (
    <div id="kt_app_root" className="d-flex flex-column flex-lg-row flex-column-fluid">
      <SignInSlider />
      <div className="form-section-container">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;

import React from 'react';
import { Link } from 'react-router-dom';
import './SignUpForm.css';

const SignUpForm = () => {
  return (
    <div className="signup-form-wrapper">
      <div className="signup-form-container">
        <h1 className="signup-heading">Sign Up</h1>
        <h2 className="signup-welcome">Welcome to SamurAI Dojo</h2>
        <p className="signup-description">
          The ultimate cybersecurity training platform where you can test security tools in realistic environments, explore
          product capabilities through interactive mind maps, and receive AI-guided assistance tailored to your needs.
          Master the way of the digital defender with SamurAI Dojo.
        </p>

        <form className="signup-form">
          <div className="form-row">
            <input type="text" placeholder="First Name *" className="signup-input" />
            <input type="text" placeholder="Last Name *" className="signup-input" />
          </div>
          <input type="email" placeholder="Email address *" className="signup-input" />
          <div className="form-row">
            <input type="text" placeholder="Company *" className="signup-input" />
            <input type="number" placeholder="Phone Number *" className="signup-input" />
          </div>
          <input type="text" placeholder="Address *" className="signup-input" />
          <div className="form-row">
            <input type="password" placeholder="Password *" className="signup-input" />
            <input type="password" placeholder="Repeat Password *" className="signup-input" />
          </div>

          <div className="checkbox-container">
            <input type="checkbox" id="terms-conditions" className="signup-checkbox" />
            <label htmlFor="terms-conditions" className="checkbox-label">
              I Accept the <Link to="/terms-and-conditions" className="terms-link">Terms & Conditions</Link>
            </label>
          </div>

          <button type="submit" className="signup-button">Sign up</button>
        </form>

        <div className="signin-redirect">
          Already have an Account? <Link to="/signin" className="signin-link">Sign in</Link>
        </div>
        <div className="copyright-bottom-wrapper" style={{marginTop: '20px'}} >
        <span className="copyright">
          © 2023 SamurAI Dojo, Inc. All rights reserved.
        </span>
      </div>
      </div>
    </div>
  );
};

export default SignUpForm;

import React, { useState } from 'react';
import './SignInForm.css';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  return (
    <div className="form-wrapper">
      <form className="sign-in-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Sign in</h1>
        <h2 className="form-subtitle">Welcome to SamurAI Dojo</h2>
        <p className="form-description">
          The ultimate cybersecurity training platform where you can test security tools in realistic environments,
          explore product capabilities through interactive mind maps, and receive AI-guided assistance tailored to your needs.
          Master the way of the digital defender with SamurAI Dojo.
        </p>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="sign-in-button">
          Sign in
        </button>

        <div className="form-footer">
          <span className="no-account">Don't have an account?</span>
          <a href="/signup" className="create-account">Create an Account</a>

          <div className="copyright-bottom-wrapper" style={{marginTop: '20px'}} >
        <span className="copyright">
          © 2023 SamurAI Dojo, Inc. All rights reserved.
        </span>
      </div>
        </div>
      </form>

     
    </div>
  );
};

export default SignInForm;

import React from 'react';
import './TermsAndConditions.css';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="terms-conditions-container">
      <h1>Terms and Conditions</h1>
      <p>
        This is a placeholder for the Terms and Conditions content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
        ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
        deserunt mollit anim id est laborum.
      </p>
      <p>
        <Link to="/signup" className="back-to-signup">Back to Sign Up</Link>
      </p>
    </div>
  );
};

export default TermsAndConditions;

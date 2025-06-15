import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-white border-top py-3">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="text-muted">
              © {new Date().getFullYear()} Zakat Automation System. All rights reserved.
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-md-end">
              <Link to="/terms" className="text-muted me-3">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-muted me-3">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-muted">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 